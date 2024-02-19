import { query } from "../../database/postgress.js";
import { QueryResult } from 'pg';
import { approvalService } from "./approval.service.js";

export module attendanceRegularizeService {

    export async function getAllAttendanceRegularize() {
        try {
            let result: QueryResult = await query(`SELECT * FROM attendanceRegularizations`, [])
            console.log(result, "QueryResult");
            return result.rows
        }
        catch (error) {
            return error.message
        }
    }


    export async function getAttendanceRegularizebyId(recId) {
        try {
            let result: QueryResult = await query(`SELECT * FROM attendanceRegularizations WHERE id =${recId}`, [])
            console.log(result, "QueryResult");
            return result.rows
        }
        catch (error) {
            return error.message
        }
    }


    export async function insertAttendanceRegularize(requestBody) {



        try {
            requestBody.forEach(async (e) => {
                let requestConvert = { ...e }
                console.log(requestConvert)
                requestConvert.status = "pending",
                    requestConvert.approvalId = null,
                    console.log(requestConvert, "****** requestConvert");
                let fieldNames = Object.keys(requestConvert);
                let fieldValues = Object.values(requestConvert);

                let querydata = `INSERT INTO attendanceRegularizations (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                let params = fieldValues;
                let result = await query(querydata, params);
                console.log(result, "attendanceRegularizations insert result");
                let attendanceReguRecord;
                if (result.rowCount > 0) {
                    attendanceReguRecord = result.rows[0]
                    //call Insert Approvals
                    let approvalInsert = await approvalService.insertApprovals(attendanceReguRecord, "attendanceRegularizations")
                    console.log(approvalInsert, "approval call");

                    // update the Attendance Regularize with approval Id
                    if (approvalInsert.status = 200) {
                        console.log("approvalInsert inside if");
                        let { uuid, id, ...attendanceRegu } = attendanceReguRecord
                        console.log(attendanceRegu);
                        console.log(attendanceRegu.approvalid);
                        attendanceRegu.approvalid = approvalInsert.approvalId;

                        console.log("******");
                        console.log(attendanceRegu, "attendanceRegu after change");
                        const fieldNames = Object.keys(attendanceRegu);
                        const fieldValues = Object.values(attendanceRegu);
                        console.log(fieldNames);
                        console.log(fieldValues);
                        querydata = `UPDATE attendanceRegularizations SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                        params = [...fieldValues, id];
                        try {
                            let result = await query(querydata, params);
                            console.log(result, "upsert result with approval");
                        } catch (error) {
                            console.log(error, "update leaves error");
                        }
                    }


                    return ({ message: 'Attendance Regularize Insert successfully' });
                } else {
                    return ({ message: "Attendance Regularize Insert Failure" })
                }
             })


        } catch (error) {
            return error.message
        }
    }

    export async function getAttendanceRegularizebyUser(requestParams) {
        try {
            const result: QueryResult = await query(
                'SELECT * FROM attendanceRegularizations WHERE userId= $1',
                [requestParams]
            );
            // let result :QueryResult = await pool.query(`SELECT * FROM attendanceRegularizations WHERE userDetails->>'id' =${requestParams}`)
            console.log(result, "QueryResult");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export async function updateAttendanceRegularize(requestParams, requestBody) {
        const fieldNames = Object.keys(requestBody);
        const fieldValues = Object.values(requestBody);
        console.log(fieldNames, "update Attendance fieldNames");
        console.log(fieldValues, "update Attendance  fieldValues");

        let querydata;
        let params: any[] = [];
        let id = requestParams || requestBody?.id

        try {
            querydata = `UPDATE attendanceRegularizations SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
            params = [...fieldValues, id];
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            if (result.command === 'UPDATE' && result.rowCount > 0) {
                return ({ status: 200, message: 'Attendance Regularize updated successfully' });
            } else {
                return { message: 'Attendance Regularize Update Failure' }
            }
        }
        catch (error) {
            return { error: error.message }
        }
    }
}