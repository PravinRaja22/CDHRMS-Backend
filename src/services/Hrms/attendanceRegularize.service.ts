import {query} from "../../database/postgress.js";
import {QueryResult } from 'pg';
import { approvalService } from "./approval.service.js";

export module attendanceRegularizeService{

    export async function getAllAttendanceRegularize() {
        try{
            let result :QueryResult =  await query(`SELECT * FROM attendanceRegularizations`,[])
            console.log(result,"QueryResult");
            return result.rows
        }
        catch(error){
            return error.message
        }
    }

    
    export async function getAttendanceRegularizebyId(recId) {
        try{
            let result :QueryResult =  await query(`SELECT * FROM attendanceRegularizations WHERE id =${recId}`,[])
            console.log(result,"QueryResult");
            return result.rows
        }
        catch(error){
            return error.message
        }
    }


    export async function insertAttendanceRegularize(requestBody){
        try{
            let fieldNames = Object.keys(requestBody); 
            let fieldValues = Object.values(requestBody); 

            let  querydata = `INSERT INTO attendanceRegularizations (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
            let  params = fieldValues;

            let result = await query(querydata, params);
            console.log(result, "attendanceRegularizations insert result");
           if(result.rowCount>0){

            //call Insert Approvals
            let approval = await approvalService.insertApprovals(result.rows[0],{"value":"attendanceRegularizations","label":"Attendance Regularizations"})
            console.log(approval,"approval call");
            return ({ message: 'Attendance Regularize Insert successfully' });
           }else{
            return ({message:"Attendance Regularize Insert Failure"})
           }
            
        }catch(error){
            return error.message
        }
    }

    export async function getAttendanceRegularizebyUser(requestParams){
        try{
            const result: QueryResult = await query(
                'SELECT * FROM attendanceRegularizations WHERE (userDetails->>\'id\') = $1',
                [requestParams]
            );
           // let result :QueryResult = await pool.query(`SELECT * FROM attendanceRegularizations WHERE userDetails->>'id' =${requestParams}`)
            console.log(result,"QueryResult");
            return result.rows
        }catch(error){
            return error.message
        }
    }

    export async function updateAttendanceRegularize(requestParams,requestBody){
        const fieldNames = Object.keys(requestBody);
        const fieldValues = Object.values(requestBody);
        console.log(fieldNames, "update Attendance fieldNames");
        console.log(fieldValues, "update Attendance  fieldValues");

        let querydata;
        let params: any[] = [];
        let id =requestParams || requestBody?.id

        try {
            querydata = `UPDATE attendanceRegularizations SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
            params = [...fieldValues,id];
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            if (result.command === 'UPDATE' && result.rowCount > 0) {
                return ({ message: 'Attendance Regularize updated successfully' });
            } else {
                return { message: 'Attendance Regularize Update Failure' }
            }
        }
        catch (error) {
            return { error: error.message}
        }
    }
}