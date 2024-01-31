import { CloudHSM } from "aws-sdk";
import pool from "../../database/postgress.js";
import { Query, QueryResult } from 'pg';
import { getAttendanceRegularizebyId, getAttendanceRegularizebyUser } from "../../controllers/HRMS/attendanceRegularize.Controller.js";
import { attendanceRegularizeService } from "./attendanceRegularize.service.js";
import { attendanceService } from "./attendance.service.js";
import { log } from "console";
export module approvalService {

    export async function getAllApprovals() {
        try {
            console.log("getAllApprovals call");
            const result: QueryResult = await pool.query('SELECT * FROM approvals');
            console.log(result, "query results");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export async function insertApprovals(values:any,objectName:object) {
        console.log("postApprovals");
        try{

            let obj = {
                "parentId" :values?.id,
                "requesterDetails":values?.userdetails,
                "approverDetails":values?.applyingto,
                "type": objectName,
                "status":{"label":"Pending","value":"pending"},
                "reason":values?.reason,
                "comments":null,  
            }

            let fieldNames = Object.keys(obj); 
            let fieldValues = Object.values(obj);

            let  query = `INSERT INTO approvals (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
            let  params = fieldValues;

            let result = await pool.query(query, params);
            console.log(result, "attendanceRegularizations insert result");

            if(result.rowCount ===1){
                //need email notification to approver
                return {message:"Approval Submitted"}

            }


        }catch(error){
            console.log(error.message,"approval insert error");
        }
    }

    export async function getApprovalbyApprover(approverId:any){
        try {
            console.log("getApprovalbyApprover call");
            let query = `SELECT * FROM approvals WHERE approverDetails->>\'id\' = $1`
            let params = approverId
            const result: QueryResult = await pool.query(query,[params]);

            console.log(result, "getApprovalbyApprover query results");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export async function updateApprovals(requestBody:any,requestParams:any) {

        console.log("inside updateApprovals service");
        console.log(requestParams,"requestParams");
        console.log(requestBody,"requestBody");

        const fieldNames = Object.keys(requestBody);
        const fieldValues = Object.values(requestBody);
        console.log(fieldNames, "update approvals fieldNames");
        console.log(fieldValues, "update approvals  fieldValues");

        let query;
        let params: any[] = [];
        let id =requestParams || requestBody?.id

        try {
            query = `UPDATE approvals SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
            params = [...fieldValues,id];
            let result = await pool.query(query, params);
            console.log(result, "update approval result");
            if (result.command === 'UPDATE' && result.rowCount > 0) {
                //update the parent record
                let updateParent = await updateParentRecord(requestBody,requestParams)

                return ({ message: `${requestBody.type.label} ${requestBody.status.label} Successfully` });
            } else {
                return { message: 'Approval Update Failure' }
            }
        }
        catch (error) {
            return { error: error.message}
        }
    }

    

   async function updateParentRecord(values,approvalRecId){
    console.log(values,"updateParentRecord values");
        if(values.type.value === 'attendanceRegularizations'){
            try{
                let getRegularzeRecord = await attendanceRegularizeService.getAttendanceRegularizebyId(values.parentId || values.parentid)
                console.log(getRegularzeRecord,"getRegularzeRecord");
                let newObj1 = {...getRegularzeRecord[0]}
                console.log(newObj1,"newObj");
                const { uuid, ...newObj } = newObj1;
                newObj.status = values.status
                newObj.approval = {id:approvalRecId}
                let updateRegularize = await attendanceRegularizeService.updateAttendanceRegularize(newObj.id,newObj) 
                console.log(updateRegularize,"updateRegularize");
                //send notification mail

                //update attendance
                    let updateAttendanceResult = await updateAttendance(newObj)

                    console.log(updateAttendanceResult,"updateAttendanceResult");
                    


            }catch(error){
                console.log(error.message,"error updateParentResult");
            }
        }else if(values.type.value === 'leave'){

        }
        else if(values.type.value === 'loan'){

        }


    }
    const  updateAttendance= async(attendanceRegularizeRecord)=>{


        //get attendace record
        let {userdetails,date,...other} =attendanceRegularizeRecord
        let params ={userId:userdetails.id,attendanceDate:date}

        let getAttendanceRecord = await attendanceService.getAttendanceByUserIdDate(params)
        console.log(getAttendanceRecord,"getAttendanceRecord");

        let {uuid,...newAttendance} = getAttendanceRecord;

        console.log(newAttendance,"newAttendance");
        console.log(typeof(newAttendance),"typeof");
        console.log(newAttendance.signin,"signIn");
        console.log(newAttendance.signin.data,"signIn.data");

        console.log("*******");
        newAttendance.signin.data =[
                {"lat":null ,"lng": null,timeStamp:other.shiftstart}
            ]
        
        newAttendance.signout.data = [
                {"lat":null ,"lng": null,timeStamp:other.shiftend}
            ]
        
        newAttendance.isregularized = true

        console.log(newAttendance,"newAttendance ");

        try{
            let result:any = attendanceService.updateAttendance(params,newAttendance)
            console.log(result,"attendance update results");
            if(result.rowCount>0){
                return {status:200}
            }
        }catch(error){
            console.log(error.message,"attendance update failure");
        }

    }
  
  
}