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

  export async function getApprovalsById(recId:any){
    console.log("getApprovalsById" , recId);

    try{
      let querydata = `SELECT * FROM approvals WHERE id = $1`
      let params = recId
      const result: QueryResult = await query(querydata, [params]);
      console.log(result.rows,"result rows getApprovalsById ");
      if(result.rowCount>0){
        return result.rows
      }
    }catch(error){
        console.log(error.message ,"error getApprovalsById ");
        return error.message
    }
  }

  export async function getApprovalbyApprover(approverId: any) {
    try {
      console.log("getApprovalbyApprover call");
      let querydata = `SELECT * FROM approvals WHERE approverId = $1`;
      let params = approverId;
      const result: QueryResult = await query(querydata, [params]);

      console.log(result, "getApprovalbyApprover query results");
      return result.rows;
    } catch (error) {
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
        let updateParent = await updateParentRecord(approvalRec, requestParams);
        console.log(updateParent, "updateParent");
        return {
          message: `${requestBody.type} ${requestBody.status} Successfully`,
        };
      } else {
        return { message: "Approval Update Failure" };
      }
    } catch (error) {
      return { error: error.message };
    }
  }

  //   async function updateParentRecord(values, approvalRecId) {
  //     console.log(values, "updateParentRecord values");
  //     if (values.type.value === "attendanceRegularizations") {
  //       try {
  //         let getRegularzeRecord =
  //           await attendanceRegularizeService.getAttendanceRegularizebyId(
  //             values.parentId || values.parentid
  //           );
  //         console.log(getRegularzeRecord, "getRegularzeRecord");
  //         let newObj1 = { ...getRegularzeRecord[0] };
  //         console.log(newObj1, "newObj");
  //         const { uuid, ...newObj } = newObj1;
  //         newObj.status = values.status;
  //         newObj.approval = { id: approvalRecId };
  //         let updateRegularize =
  //           await attendanceRegularizeService.updateAttendanceRegularize(
  //             newObj.id,
  //             newObj
  //           );
  //         console.log(updateRegularize, "updateRegularize");
  //         //send notification mail
  //           }
  //     }
  // }
  async function updateParentRecord(approvalRec, approvalRecId) {
    console.log(approvalRec, "updateParentRecord values");
    if (approvalRec.type === "attendanceRegularizations") {
      try {
        let getRegularzeRecord =
          await attendanceRegularizeService.getAttendanceRegularizebyId(
            approvalRec.parentId || approvalRec.parentid
          );
        console.log(getRegularzeRecord, "getRegularzeRecord");
        let newObj1 = { ...getRegularzeRecord[0] };
        console.log(newObj1, "newObj");
        const { uuid, ...newObj } = newObj1;
        newObj.status = approvalRec.status;
        // newObj.approval = { id: approvalRecId };
        let updateRegularize =
          await attendanceRegularizeService.updateAttendanceRegularize(
            newObj.id,
            newObj
          );
        console.log(updateRegularize, "updateRegularize");
        //send notification mail
        
        let updateAttendanceResult;

        if(updateRegularize.status ===200){
          console.log("updateRegularize.status",updateRegularize.status);
           //update attendance
          updateAttendanceResult = await updateAttendance(
            newObj,
            "attendanceRegularize"
          );
          console.log(updateAttendanceResult, "updateAttendanceResult");

        }
        
        if(updateAttendanceResult.status===200){
          //update Leave Balance record
          return updateAttendanceResult

        }
        
      } catch (error) {
        console.log(error.message, "error updateParentResult");
      }
    } else if (approvalRec.type === "leave") {
      
      console.log("inside leave updateParentRecord");
      try {
        let getLeaveRecord = await leaveService.getSingleLeaves(
          approvalRec.parentId || approvalRec.parentid
        );
        let newLeave1 = { ...getLeaveRecord[0] };

        let { uuid, ...newLeave } = newLeave1;

        console.log(newLeave, "newLeave");
        newLeave.status = approvalRec.status;
        // newLeave.approval = { id: approvalRecId };
        let updateLeave = await leaveService.upsertLeaves(newLeave);
        console.log(updateLeave, "updateLeave");

        let updateAttendanceResult = await updateAttendance(newLeave, "leave");
        console.log(
          updateAttendanceResult,
          "updateAttendance from updateParentRecord"
        );

        let updateLeaveBalanceResult = await updateLeaveBalance(newLeave);
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

      let existingAttendanceRecord =
        await attendanceService.getAttendanceByUserIdDate(params);
      console.log(existingAttendanceRecord, "existingAttendanceRecord");

      let { uuid, ...updatedAttendanceRecord } = existingAttendanceRecord;

      console.log(updatedAttendanceRecord, "updatedAttendanceRecord");
      // Modify the record based on the update type

      let calculatedWorkingHours = await calculateAttendance({signIn:other.shiftstart,signOut:other.shiftend},updatedAttendanceRecord)
      console.log(calculatedWorkingHours,"calculatedWorkingHours result");
      if (updateType === "attendanceRegularize") {

        let status =attendanceRecord?.status.toLowerCase().includes('approve')?true :attendanceRecord?.status.toLowerCase().includes('reject') ? false :false


        updatedAttendanceRecord.signin.data = status ?  [
          { lat: null, lng: null, timeStamp: other.shiftstart },
        ] : updatedAttendanceRecord.signin.data ;
        updatedAttendanceRecord.signout.data = status ? [
          { lat: null, lng: null, timeStamp: other.shiftend },
        ] : updatedAttendanceRecord.signout.data;

        updatedAttendanceRecord.isregularized = true;
        updatedAttendanceRecord.status = status ? "present" :"LOP"
        updatedAttendanceRecord.workinghours = status ? calculatedWorkingHours.workinghours :updatedAttendanceRecord.workinghours 
        updatedAttendanceRecord.session = status ? calculatedWorkingHours.session :updatedAttendanceRecord.session 


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
        if (result.status ===200 ) {
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
        item.granted = item.granted - Number(leaveRec.noofdays);
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
    console.log(upsertLeaveBalance);
  };
}


  const calculateAttendance = async (signinDates,updatedAttendanceRecord)=>{
    console.log("inside calculateAttendance");
    console.log("inside calculateAttendance updatedAttendanceRecord",updatedAttendanceRecord);
    console.log("inside calculateAttendance signinDates",signinDates);
    let signIns = signinDates.signIn
    let signOuts = signinDates.signOut
    console.log("*******");
    console.log(signIns,"signIns");
    console.log(signOuts,"signOuts");
    console.log("*******");
    let dateA: any = new Date(Number(signIns));
    let dateB: any = new Date(Number(signOuts));
 
    let timeDifference = dateB - dateA;

    // Convert the time difference to hours

    let totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
    let totalMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    console.log(totalHours, totalMinutes, "&&&&&&&&&")
    updatedAttendanceRecord.workinghours = {
        firstIn: signIns, lastOut: signOuts,
        totalWorkHours: {
            hours: totalHours,
            minutes: totalMinutes
        }
    }

    //session calculation

    let sessionDate = new Date(Number(updatedAttendanceRecord.date))
    console.log(sessionDate, "sessionDate");
    sessionDate.setHours(13, 1, 0, 0)//set time as 13:01

    const session1EndTime = sessionDate.getTime();
    const signOutTime = dateB.getTime();
    const signInTime = dateA.getTime();

    console.log(session1EndTime, "session1EndTime sessioncalculation");
    console.log(signOutTime, "signOutTime sessioncalculation");
    console.log(signInTime, "signInTime sessioncalculation");

    if (signOutTime <= session1EndTime) {
        console.log("if signOutTime");
        updatedAttendanceRecord.session = {
            'session 1': {
                sessionTimings: '09:00 - 13:00',
                firstIn: signIns,
                lastOut: signOuts
            },
            'session 2': { sessionTimings: '13:01 - 18:00', firstIn: null, lastOut: null }
        };
    }
    else if (signInTime >= session1EndTime) {
        console.log("else if");
        updatedAttendanceRecord.session = {
            'session 1': {
                sessionTimings: '09:00 - 13:00',
                firstIn: null,
                lastOut: null
            },
            'session 2': {
                sessionTimings: '13:01 - 18:00',
                firstIn: signIns,
                lastOut: signOuts
            }
        }
    }
    else {
        console.log("else signOutTime");
        updatedAttendanceRecord.session = {
            'session 1': {
                sessionTimings: '09:00 - 13:00',
                firstIn: signIns,
                lastOut: null
            },
            'session 2': {
                sessionTimings: '13:01 - 18:00',
                firstIn: null,
                lastOut: signOuts
            }
        };
    }
    console.log(updatedAttendanceRecord,"updatedAttendanceRecord after change");
      return updatedAttendanceRecord;
  }