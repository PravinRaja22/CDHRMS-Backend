import { CloudHSM } from "aws-sdk";
import {query} from "../../database/postgress.js";
import {QueryResult } from "pg";
import {
    getAttendanceRegularizebyId,
    getAttendanceRegularizebyUser,
} from "../../controllers/HRMS/attendanceRegularize.Controller.js";
import { attendanceRegularizeService } from "./attendanceRegularize.service.js";
import { attendanceService } from "./attendance.service.js";
import { log } from "console";
import { leaveService } from "./leave.service.js";

export module approvalService {
    export async function getAllApprovals() {
        try {
            console.log("getAllApprovals call");
            const result: QueryResult = await query("SELECT * FROM approvals",[]);
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
                "parentId": values?.id,
                "requesterId": values?.userId || values.userid,
                "approverId": values?.applyingtoId || values.applyingtoid,
                "type": objectName,
                "status": "pending",
                "reason": values?.reason,
                "comments": null,
            }

            let fieldNames = Object.keys(obj)
            let fieldValues = Object.values(obj)

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
                return { message: "Approval Submitted", status: 200, approvalId: result.rows[0].id }

            }
        } catch (error) {
            console.log(error.message, "approval insert error");
        }
    }

export async function getApprovalbyApprover(approverId: any) {
    try {
        console.log("getApprovalbyApprover call");
        let querydata = `SELECT * FROM approvals WHERE approverDetails->>\'id\' = $1`;
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
    let id = requestParams || requestBody?.id;

    try {
        querydata = `UPDATE approvals SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}  RETURNING *`;
        params = [...fieldValues, id];
        let result = await query(querydata, params);
        console.log(result, "update approval result");
        if (result.command === 'UPDATE' && result.rowCount > 0) {
            //update the parent record
            let approvalRec = result.rows[0]
            let updateParent = await updateParentRecord(approvalRec, requestParams)
                console.log(updateParent,"updateParent");
            return ({ message: `${requestBody.type} ${requestBody.status} Successfully` });
        } else {
            return { message: 'Approval Update Failure' }
        }
    }
    catch (error) {
        return { error: error.message }
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
    if (approvalRec.type === 'attendanceRegularizations') {
        try {
            let getRegularzeRecord = await attendanceRegularizeService.getAttendanceRegularizebyId(approvalRec.parentId || approvalRec.parentid)
            console.log(getRegularzeRecord, "getRegularzeRecord");
            let newObj1 = { ...getRegularzeRecord[0] }
            console.log(newObj1, "newObj");
            const { uuid, ...newObj } = newObj1;
            newObj.status = approvalRec.status
            newObj.approval = { id: approvalRecId }
            let updateRegularize = await attendanceRegularizeService.updateAttendanceRegularize(newObj.id, newObj)
            console.log(updateRegularize, "updateRegularize");
            //send notification mail

            //update attendance
            let updateAttendanceResult = await updateAttendance(newObj, "attendanceRegularize")
            console.log(updateAttendanceResult, "updateAttendanceResult");
        } catch (error) {
            console.log(error.message, "error updateParentResult");
        }
    } else if (approvalRec.type === 'leave') {
        // try{
        //     let getLeaveRecord = await leaveService.getSingleLeaves(approvalRec.parentId || approvalRec.parentid)
        //     console.log(getLeaveRecord,"getRegularzeRecord");
        //     let newObj1 = {...getLeaveRecord[0]}
        //     console.log(newObj1,"newObj");
        //     const { uuid, ...newObj } = newObj1;
        //     newObj.status = approvalRec.status
        //     // newObj.approval = {id:approvalRecId}
        //     let updateLeave = await leaveService.upsertLeaves(newObj) 
        //     console.log(updateLeave,"updateRegularize");
        //     //send notification mail

        //     //update attendance
        //         let updateAttendanceResult = await updateAttendance(newObj,"leave")

        //         console.log(updateAttendanceResult,"updateAttendanceResult");



        // }catch(error){
        //     console.log(error.message,"error updateParentResult");
        // }
        console.log("inside leave updateParentRecord");
        try {
            let getLeaveRecord = await leaveService.getSingleLeaves(
                approvalRec.parentId || approvalRec.parentid
            );
            let newLeave1 = { ...getLeaveRecord[0] };

            let {uuid,...newLeave} = newLeave1

            console.log(newLeave,"newLeave");
            newLeave.status = approvalRec.status;
            // newLeave.approval = { id: approvalRecId };
            let updateLeave = await leaveService.upsertLeaves(newLeave);
            console.log(updateLeave, "updateLeave");

            let updateAttendanceResult = await updateAttendance(newLeave, "leave");
            console.log(
                updateAttendanceResult,
                "updateAttendance from updateParentRecord"
            );
        } catch (error) {
            console.log(error.message, "error leave updateParentResult");
        }

    }
    else if (approvalRec.type === 'loan') {

    }
}

const updateAttendance = async (attendanceRecord, updateType) => {
    try {
        let { userid, date, fromdate, todate, ...other } = attendanceRecord;
        let params;

        if (updateType === 'attendanceRegularize') {
            params = { userId: userid, attendanceDate: date };
        } else if (updateType === 'leave') {
            if (fromdate === todate) {
                params = { userId: userid, attendanceDate: fromdate };
            } else {

            }
        }

        let existingAttendanceRecord = await attendanceService.getAttendanceByUserIdDate(params);
        console.log(existingAttendanceRecord, "existingAttendanceRecord");

        let { uuid, ...updatedAttendanceRecord } = existingAttendanceRecord

        console.log(updatedAttendanceRecord, "updatedAttendanceRecord");
        // Modify the record based on the update type
        if (updateType === 'attendanceRegularize') {
            updatedAttendanceRecord.signin.data = [{ lat: null, lng: null, timeStamp: other.shiftstart }];
            updatedAttendanceRecord.signout.data = [{ lat: null, lng: null, timeStamp: other.shiftend }];
            updatedAttendanceRecord.isregularized = true;
        } else if (updateType === 'leave') {
            updatedAttendanceRecord.status = { label: other.status, value: other.status }; // status of leave
            updatedAttendanceRecord.isregularized = true;
        }
        console.log("******");
        console.log(params, "params ****");
        console.log(updatedAttendanceRecord, "updatedAttendanceRecord ***");
        try {
            let result = await attendanceService.updateAttendance(params, updatedAttendanceRecord);
            console.log(result, "result");
            if (result.message > 'Attendance upserted successfully' ) {
                return { status: 200 };
            }
        }
        catch (error) {
            console.log(error, "error in updateAttendance");
        }

    } catch (error) {
        console.log(error.message, 'Attendance update failure');
    }
};


const updateLeaveBalance = async () => {

}

}



