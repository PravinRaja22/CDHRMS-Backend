import { CloudHSM } from "aws-sdk";
import { query } from "../../database/postgress.js";
import { QueryResult } from "pg";
import {
  getAttendanceRegularizebyId,
  getAttendanceRegularizebyUser,
} from "../../controllers/HRMS/attendanceRegularize.Controller.js";
import { attendanceRegularizeService } from "./attendanceRegularize.service.js";
import { attendanceService } from "./attendance.service.js";
import { log } from "console";
import { leaveService } from "./leave.service.js";
import { leaveBalanceService } from "./leaveBalance.service.js";

export module approvalService {
  export async function getAllApprovals() {
    try {
      console.log("getAllApprovals call");
      const result: QueryResult = await query("SELECT * FROM approvals", {});
      console.log(result, "query results");
      return result.rows;
    } catch (error) {
      return error.message;
    }
  }

  export async function insertApprovals(values: any, objectName: any) {
    console.log("postApprovals", values);
    try {
      let obj = {
        parentId: values?.id,
        requesterId: values?.userId || values.userid,
        approverId: values?.applyingtoId || values.applyingtoid,
        type: objectName,
        status: "pending",
        reason: values?.reason,
        comments: null,
      };

      let fieldNames = Object.keys(obj);
      let fieldValues = Object.values(obj);

      let querydata = `INSERT INTO approvals (${fieldNames.join(
        ", "
      )}) VALUES (${fieldNames
        .map((_, index) => `$${index + 1}`)
        .join(", ")}) RETURNING *`;
      let params = fieldValues;

      let result = await query(querydata, params);
      console.log(result, `${objectName} insert result`);
      console.log(result, "attendanceRegularizations insert result");

      if (result.rowCount === 1) {
        //need email notification to approver
        return {
          message: "Approval Submitted",
          status: 200,
          approvalId: result.rows[0].id,
        };
      }
    } catch (error) {
      console.log(error.message, "approval insert error");
    }
  }

  export async function getApprovalsById(recId: any) {
    console.log("getApprovalsById", recId);

    try {
      let querydata = `SELECT * FROM approvals WHERE id = $1`;

      let params = recId;
      const result: QueryResult = await query(querydata, [params]);
      console.log(result.rows, "result rows getApprovalsById ");
      if (result.rowCount > 0) {
        return result.rows;
      }
    } catch (error) {
      console.log(error.message, "error getApprovalsById ");
      return error.message;
    }
  }

  export async function getApprovalbyApprover(approverId: any) {
    try {
      console.log("getApprovalbyApprover call");
      let querydata = `SELECT * FROM approvals WHERE approverId = $1`;
      let joinQuery = `SELECT  approvals.*,
      jsonb_build_object(
          'id', users.id,
          'firstname', users.firstname,
            'lastname', users.lastname,
              'employeeid', users.employeeid
      ) AS "jsonApplyUsers"
      FROM
      approvals 
      INNER JOIN users ON users.id = approvals.requesterid  		
      WHERE  approvals.approverid = $1`;

      let params = approverId;
      const result: QueryResult = await query(joinQuery, [params]);

      console.log(result, "getApprovalbyApprover query results");
      return result.rows;
    } catch (error) {
      return error.message;
    }
  }

  export async function getApprovalsByApproverLeaveQuery(
    userId: any,
    reqQuery: any
  ) {
    console.log("getApprovalsByApproverLeaveQuery");
    let keys = Object.keys(reqQuery);
    let values = Object.values(reqQuery);
    console.log(keys, values, "getApprovalsByApproverLeaveQuery");

    const conditions = keys
      .map((key, index) => `LOWER( approvals.${key}) LIKE LOWER($${index + 1})`)
      .join(" AND ");

    let params = values.map((value) => `%${value}%`);

    try {
      let innerQuery = `SELECT  approvals.*,
      jsonb_build_object(
          'id', leaves.id,
          'leavetype',leaves.leavetype,
          'fromdate', leaves.fromdate,
          'todate', leaves.todate,
          'fromsession', leaves.fromsession,
          'tosession', leaves.tosession,
          'status',leaves.status,
          'noofdays',leaves.noofdays,
          'leavebalanceid',leaves.leavebalanceid,
          'applyingtoid',leaves.applyingtoid,
          'approvalid',leaves.approvalid,
          'userid',leaves.userid,
          'reason',leaves.reason,
          'createdby',leaves.createdby,
         'modifiedby',leaves.modifiedby          
      ) AS "jsonLeave",
      jsonb_build_object(
        'id', users.id,
        'firstname', users.firstname,
          'lastname', users.lastname,
            'employeeid', users.employeeid
    ) AS "jsonApplyUsers"
      FROM
      approvals 
      INNER JOIN users ON users.id = approvals.requesterid  
      INNER JOIN leaves ON leaves.approvalid = approvals.id  				
      WHERE ${conditions} AND approvals.approverid = $${keys.length + 1}`;

      let newParams = [...params, userId];
      console.log("$$$$$$$$$$");
      console.log(innerQuery);
      console.log(newParams);
      const result: QueryResult = await query(innerQuery, newParams);
      console.log(result.rows, "query results");
      return result.rows;
    } catch (error) {
      console.log("ERROR leaves APPROVAL");
      return error.message;
    }
  }

  export async function getApprovalsByApproverAttendanceQuery(
    userId: any,
    reqQuery: any
  ) {
    console.log("getApprovalsByApproverLeaveQuery");
    let keys = Object.keys(reqQuery);
    let values = Object.values(reqQuery);
    console.log(keys, values, "getApprovalsByApproverLeaveQuery");

    const conditions = keys
      .map((key, index) => `LOWER( approvals.${key}) LIKE LOWER($${index + 1})`)
      .join(" AND ");

    let params = values.map((value) => `%${value}%`);

    try {
      let innerQuery = `SELECT  approvals.*,
      jsonb_build_object(
          'id', attendanceregularizations.id,
          'date',attendanceregularizations.date,
          'reason', attendanceregularizations.reason,
          'shiftstart', attendanceregularizations.shiftstart,
          'shiftend', attendanceregularizations.shiftend,
          'status',attendanceregularizations.status,
          'userid',attendanceregularizations.userid,
          'applyingtoid',attendanceregularizations.applyingtoid,
          'approvalid',attendanceregularizations.approvalid       
      ) AS "jsonAttendanceReg",
      jsonb_build_object(
        'id', users.id,
        'firstname', users.firstname,
          'lastname', users.lastname,
            'employeeid', users.employeeid
    ) AS "jsonApplyUsers"
      FROM
      approvals 
      INNER JOIN attendanceregularizations ON attendanceregularizations.approvalid = approvals.id   	
      INNER JOIN users ON users.id = approvals.requesterid  				
      WHERE ${conditions} AND approvals.approverid = $${keys.length + 1}`;

      let newParams = [...params, userId];
      console.log("$$$$$$$$$$");
      console.log(innerQuery);
      console.log(newParams);
      const result: QueryResult = await query(innerQuery, newParams);
      console.log(result.rows, "query results");
      return result.rows;
    } catch (error) {
      console.log("ERROR leaves APPROVAL");
      return error.message;
    }
  }

  export async function updateApprovals(requestBody: any, requestParams: any) {
    console.log("inside updateApprovals service");
    console.log(requestParams, "requestParams");
    console.log(requestBody, "requestBody");

    const fieldNames = Object.keys(requestBody);
    const fieldValues = Object.values(requestBody);
    console.log(fieldNames, "update approvals fieldNames");
    console.log(fieldValues, "update approvals  fieldValues");

    let querydata;
    let params: any[] = [];
    let id = requestBody?.id || requestParams;

    try {
      querydata = `UPDATE approvals SET ${fieldNames
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ")} WHERE id = $${fieldNames.length + 1}  RETURNING *`;
      params = [...fieldValues, id];
      let result = await query(querydata, params);
      console.log(result, "update approval result");
      if (result.command === "UPDATE" && result.rowCount > 0) {
        //update the parent record
        let approvalRec = result.rows[0];
        let updateParent;
        if (approvalRec.status.toLowerCase().includes("withdraw")) {
          // we already update leave so no need to call parent from here
        } else {
          updateParent = await updateParentRecord(approvalRec, requestParams);
          console.log(updateParent, "updateParent");
        }

        return {
          message: `${requestBody.type} ${requestBody.status} Successfully`,
          success: true,
        };
      } else {
        return { message: "Approval Update Failure", success: false };
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  async function updateParentRecord(approvalRec, approvalRecId) {
    console.log(approvalRec, "updateParentRecord values");
    if (approvalRec.type.toLowerCase().includes("attendance")) {
      try {
        let getRegularzeRecord =
          await attendanceRegularizeService.getAttendanceRegularizebyId(
            approvalRec.parentId || approvalRec.parentid
          );
        console.log(getRegularzeRecord, "getRegularzeRecord");
        let newObj1 = { ...getRegularzeRecord[0] };
        console.log(newObj1, "newObj");
        const { uuid,jsonapproverusers, ...newObj } = newObj1;

        newObj.status = approvalRec.status;
        newObj.modifiedby = {id:jsonapproverusers.id,name:`${jsonapproverusers.firstname} ${jsonapproverusers.lastname}`,
      timeStamp:new Date().getTime()}
        // newObj.approval = { id: approvalRecId };
        let updateRegularize =
          await attendanceRegularizeService.updateAttendanceRegularize(
            newObj.id,
            newObj
          );
        console.log(updateRegularize, "updateRegularize");
        //send notification mail

        let updateAttendanceResult;

        if (updateRegularize?.status === 200) {
          console.log("updateRegularize.status", updateRegularize?.status);
          //update attendance
          updateAttendanceResult = await updateAttendance(
            newObj,
            "attendanceRegularize"
          );
          console.log(updateAttendanceResult, "updateAttendanceResult");
        }

        if (updateAttendanceResult.status === 200) {
          return updateAttendanceResult;
        }
        console.log(updateAttendanceResult,"updateAttendanceResult last")
      } catch (error) {
        console.log(error.message, "error updateParentResult");
      }
    } else if (approvalRec.type === "leave") {
      console.log("inside leave updateParentRecord");
      try {
        let getLeaveRecord = await leaveService.getSingleLeaves(
          approvalRec.parentId || approvalRec.parentid
        );
        console.log(getLeaveRecord, "getLeaveRecord");
        let newLeave1 = { ...getLeaveRecord[0] };

        let { uuid, users, approverusers, ...newLeave } = newLeave1;

        console.log(newLeave, "newLeave");
        newLeave.status = approvalRec.status;
        newLeave.modifiedby = {
          id: approverusers.id,
          name: `${approverusers.firstname} ${approverusers.lastname}`,
          timeStamp: new Date().getTime(),
        };
        console.log("****");
        console.log(newLeave, "newLeave");
        let updateLeave = await leaveService.upsertLeaves(newLeave);
        console.log(updateLeave, "updateLeave");
        //expected updateleave is status=200 and record ,if yes update attendance record
        // need to capture date and attendance record for particular date ,
        //if date is past update attendance else store in somewere
        //and while CRON insert insert this leave data to the particular user
        //** create attendance record for a particular leave Date

        if (
          updateLeave.status === 200 &&
          updateLeave.record.status.toLowerCase().includes("approve")
        ) {
          console.log("if try update leave balance");
        //  let updateLeaveBalanceResult = await updateLeaveBalance(newLeave);
          //console.log(updateLeaveBalanceResult, "updateLeaveBalanceResult");

          const updateAttendanceResult = await updateAttendanceApprovalReq(
            newLeave
          );
          console.log(updateAttendanceResult, "updateAttendanceResult");
          /*  let updateAttendanceResult = await updateAttendance(newLeave, "leave");
            console.log(
              updateAttendanceResult,
              "updateAttendance from updateParentRecord"
            );*/

          return updateLeave;
        } else {
          console.log("updateleave no need update attendance and leavebalance");
          return updateLeave;
        }
      } catch (error) {
        console.log(error.message, "error leave updateParentResult");
      }
    } else if (approvalRec.type === "loan") {
    }
  }

  const updateAttendance = async (attendanceRecord, updateType) => {
    console.log("inside updateAttendance");
    console.log(attendanceRecord);
    console.log("*****");
    console.log(updateType);
    console.log("*****");

    try {
      let { userid, date, fromdate, todate, ...other } = attendanceRecord;
      let params;

      if (updateType === "attendanceRegularize") {
        params = { userId: userid, attendanceDate: date };
      } else if (updateType === "leave") {
        if (fromdate === todate) {
          params = { userId: userid, attendanceDate: fromdate };
        } else {
        }
      }
console.log("dollar")
      let existingAttendanceRecord =
        await attendanceService.getAttendanceByUserIdDate(params);
      console.log(existingAttendanceRecord, "existingAttendanceRecord ");
console.log("dollar")
      let { uuid, ...updatedAttendanceRecord } = existingAttendanceRecord[0];

      console.log(updatedAttendanceRecord, "updatedAttendanceRecord");
      // Modify the record based on the update type

      let calculatedWorkingHours = await calculateAttendance(
        { signIn: other.shiftstart, signOut: other.shiftend },
        updatedAttendanceRecord
      );
      console.log(calculatedWorkingHours, "calculatedWorkingHours result");
      if (updateType === "attendanceRegularize") {
        let status = attendanceRecord?.status.toLowerCase().includes("approve")
          ? true
          : attendanceRecord?.status.toLowerCase().includes("reject")
          ? false
          : false;

        updatedAttendanceRecord.signin.data = status
          ? [{ lat: null, lng: null, timeStamp: other.shiftstart }]
          : updatedAttendanceRecord.signin.data;
        updatedAttendanceRecord.signout.data = status
          ? [{ lat: null, lng: null, timeStamp: other.shiftend }]
          : updatedAttendanceRecord.signout.data;

        updatedAttendanceRecord.isregularized = true;
        updatedAttendanceRecord.status = status ? "present" : "absent";
        updatedAttendanceRecord.workinghours = status
          ? calculatedWorkingHours.workinghours
          : updatedAttendanceRecord.workinghours;
        updatedAttendanceRecord.session = status
          ? calculatedWorkingHours.session
          : updatedAttendanceRecord.session;
      } else if (updateType === "leave") {
        updatedAttendanceRecord.status = {
          label: other.status,
          value: other.status,
        }; // status of leave
        updatedAttendanceRecord.isregularized = true;
      }
      console.log("******");
      console.log(params, "params ****");
      console.log(updatedAttendanceRecord, "updatedAttendanceRecord ***");
      try {
        let result = await attendanceService.updateAttendance(
          params,
          updatedAttendanceRecord
        );
        console.log(result, "updateAttendance result");
        if (result.status === 200) {
          return result;
        }
      } catch (error) {
        console.log(error, "error in updateAttendance");
      }
    } catch (error) {
      console.log(error.message, "Attendance update failure");
    }
  };

  const updateLeaveBalance = async (leaveRec) => {
    console.log(leaveRec, "updateLeaveBalance leaveRec");
    let leaveBalance = await leaveBalanceService.getLeaveBalanceByUsers(
      leaveRec.userid
    );
    console.log(leaveBalance, "leaveBalance");
    let year = new Date(Number(leaveRec.fromdate)).getFullYear();

    console.log(
      new Date(Number(leaveRec.fromdate)).getFullYear(),
      "leaverec fromDate year"
    );
    let balanceRecords = leaveBalance[0].balance[year];
    console.log(balanceRecords, "record year");
    balanceRecords?.map((item, index) => {
      if (item.leaveType.toLowerCase() === leaveRec.leavetype.toLowerCase()) {
        console.log("inside if item leavetype");
        item.consumed += Number(leaveRec.noofdays);
        item.balance = item.balance - Number(leaveRec.noofdays);
      }
      console.log(item);
      return item;
    });
    console.log(balanceRecords, "balance record end of");
    console.log(leaveBalance[0].balance[year], "leave balance end of");

    let upsertLeaveBalance =
      await leaveBalanceService.upsertLeaveBalanceByUsers(
        leaveRec.userid,
        leaveBalance[0]
      );
    console.log(upsertLeaveBalance, "upsertLeaveBalance ***");
    return upsertLeaveBalance;
  };
}

const calculateAttendance = async (signinDates, updatedAttendanceRecord) => {
  console.log("inside calculateAttendance");
  console.log(
    "inside calculateAttendance updatedAttendanceRecord",
    updatedAttendanceRecord
  );
  console.log("inside calculateAttendance signinDates", signinDates);
  let signIns = signinDates.signIn;
  let signOuts = signinDates.signOut;
  console.log("*******");
  console.log(signIns, "signIns");
  console.log(signOuts, "signOuts");
  console.log("*******");
  let dateA: any = new Date(Number(signIns));
  let dateB: any = new Date(Number(signOuts));

  let timeDifference = dateB - dateA;

  // Convert the time difference to hours

  let totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
  let totalMinutes = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
  );

  console.log(totalHours, totalMinutes, "&&&&&&&&&");
  updatedAttendanceRecord.workinghours = {
    firstIn: signIns,
    lastOut: signOuts,
    totalWorkHours: {
      hours: totalHours,
      minutes: totalMinutes,
    },
  };

  //session calculation

  let sessionDate = new Date(Number(updatedAttendanceRecord.date));
  console.log(sessionDate, "sessionDate");
  sessionDate.setHours(13, 1, 0, 0); //set time as 13:01

  const session1EndTime = sessionDate.getTime();
  const signOutTime = dateB.getTime();
  const signInTime = dateA.getTime();

  console.log(session1EndTime, "session1EndTime sessioncalculation");
  console.log(signOutTime, "signOutTime sessioncalculation");
  console.log(signInTime, "signInTime sessioncalculation");

  if (signOutTime <= session1EndTime) {
    console.log("if signOutTime");
    updatedAttendanceRecord.session = {
      "session 1": {
        sessionTimings: "09:00 - 13:00",
        firstIn: signIns,
        lastOut: signOuts,
      },
      "session 2": {
        sessionTimings: "13:01 - 18:00",
        firstIn: null,
        lastOut: null,
      },
    };
  } else if (signInTime >= session1EndTime) {
    console.log("else if");
    updatedAttendanceRecord.session = {
      "session 1": {
        sessionTimings: "09:00 - 13:00",
        firstIn: null,
        lastOut: null,
      },
      "session 2": {
        sessionTimings: "13:01 - 18:00",
        firstIn: signIns,
        lastOut: signOuts,
      },
    };
  } else {
    console.log("else signOutTime");
    updatedAttendanceRecord.session = {
      "session 1": {
        sessionTimings: "09:00 - 13:00",
        firstIn: signIns,
        lastOut: null,
      },
      "session 2": {
        sessionTimings: "13:01 - 18:00",
        firstIn: null,
        lastOut: signOuts,
      },
    };
  }
  console.log(updatedAttendanceRecord, "updatedAttendanceRecord after change");
  return updatedAttendanceRecord;
};

const updateAttendanceApprovalReq = async (values) => {
  console.log(values, "inside updateAttendance");

  let startDate = new Date(Number(values?.fromdate));
  let endDate = new Date(Number(values?.todate));
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let startDay = startDate.getDate();
  let endDay = endDate.getDate();
  console.log("^^^^");
  console.log(startDate, endDate);
  console.log(startDay, endDay);
  console.log("^^^^");

  if (startDay === endDay) {
    let obj = {
      date: startDate,
      leavetype: values.leavetype,
      userid: values.userid,
    };
    let upsertAttendance = await attendanceService.upsertAttendanceforLeaves(
      obj
    );
    console.log(upsertAttendance, "upsertAttendance response");
    return upsertAttendance
  } else {
    console.log("for loop");
    let upsertAttendanceResponse;

    for (let day = startDay; day <= endDay; day++) {
      let currentDate = new Date(startDate);
      console.log(day,"day")
      currentDate.setDate(day);
      currentDate.setHours(0, 0, 0, 0);
       let obj = {
        date: currentDate,
        leavetype: values.leavetype,
        userid: values.userid,
      };
      let upsertAttendance = await attendanceService.upsertAttendanceforLeaves(
        obj
      );
      console.log(upsertAttendance, "upsertAttendance response");
      upsertAttendanceResponse = upsertAttendance
    }
  
    return upsertAttendanceResponse
   
  }
};
