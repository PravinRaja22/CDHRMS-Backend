import { query } from "../../database/postgress.js";
import { QueryResult } from 'pg';
import { approvalService } from "./approval.service.js";
export module leaveService {
    export async function getLeaves() {
        try {
            console.log("Get Leaves");
            const result: QueryResult = await query("SELECT * FROM leaves", []);
            console.log(result.rows, "query results");
            return result.rows;
        } catch (error: any) {
            return error.message;
        }
    }

    export async function getSingleLeaves(recId: string) {
        console.log(recId, "getSingleLeave callback request");
        try {
            console.log(recId, "getSingleLeave params id");
            const result = await query("SELECT * FROM leaves WHERE id = $1", [
                recId,
            ]);
            console.log(result.rows, "result getSingleLeave");
            return result.rows;
        } catch (error: any) {
            return error.message;
        }
    }
    export async function upsertLeaves(request: any) {

        try {
            let values = request.body;
            let files = request.files
            let url;
            console.log(files.length,"files");
            if (files.length>0) {
                url = request.protocol + "://" + request.headers.host + "/" + request.files[0].filename
            }
        
            console.log("upsertLeaves service");
            console.log(files, "upsertLeaves service files");
            console.log(url, "upsertLeaves service url");

            const { id, file, ...upsertFields } = values;
            console.log(values, "upsertLeaves Request body");
            for (const field in upsertFields) {
                console.log(field);
                console.log(upsertFields[field]);
                if (field === 'fromDate' || field === 'toDate' || field === "applyingtoid" ||
                    field === "userId" || field === "noofdays") {
                    upsertFields[field] = Number(upsertFields[field])
                }
            }
            console.log("*****");
            console.log(upsertFields);
            console.log("*******");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertLeaves fieldNames");
            console.log(fieldValues, "upsertLeaves fieldValues");

            let querydata;
            let params: any[] = [];

            if (id) {
                // If id is provided, update the existing user
                querydata = `UPDATE leaves SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            } else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO leaves (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                params = fieldValues;
            }



            let result = await query(querydata, params);
            console.log(result, "upsert result");
            //even fromDate & endDate change Number insert  as a string  value
            if (result.rowCount > 0 && result.command === 'INSERT') {

                const leaveRecord: any = result.rows[0]
                //call approval to insert approval rec

                let upsertApproval = await approvalService.insertApprovals(leaveRecord, "leave")
                console.log(upsertApproval, "upsertApproval");

                //update the leave with approvalId

                if (upsertApproval.status = 200) {
                    console.log("inside if");
                    let { uuid, id, ...leaveRec } = leaveRecord
                    console.log(leaveRec);
                    console.log(leaveRec.approvalid);
                    leaveRec.approvalid = upsertApproval.approvalId;

                    const fieldNames = Object.keys(leaveRec);
                    const fieldValues = Object.values(leaveRec);
                    console.log(fieldNames);
                    console.log(fieldValues);
                    querydata = `UPDATE leaves SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                    params = [...fieldValues, id];
                    try {
                        let result = await query(querydata, params);
                        console.log(result, "upsert result with approval");
                    } catch (error) {
                        console.log(error, "update leaves error");
                    }
                }
                return ({ status: 200, message: `Leave upserted successfully with record ID ${leaveRecord?.id}` });
            }

        } catch (error: any) {
            return (error.message);
        }
    }


    export async function getLeavesByUsers(userId: any) {
        try {
            console.log("getLeavesByUsers");
            //   const result: QueryResult = await query(`SELECT * FROM leaves WHERE (recordOwner->>\'userId\') = ${userId}`);
            const result: QueryResult = await query(
                "SELECT * FROM leaves WHERE userId = $1",
                [userId]
            );
            console.log(result.rows, "query results");
            return result.rows;
        } catch (error: any) {
            return error.message;
        }
    }

    export async function getLeavesByApprover(approverId: string) {
        try {
            console.log("getLeavesByApprover");
            const result: QueryResult = await query(
                "SELECT * FROM leaves WHERE applyingtoid = $1",
                [approverId]
            );
            console.log(result.rows, "query results");
            return result.rows;
        } catch (error: any) {
            return error.message;
        }
    }

    export async function getLeavesByUsersQuery(userId: any, reqQuery: any) {
        console.log(reqQuery, "reqQuery getLeavesByUsersQuery");
        let keys = Object.keys(reqQuery)
        let values = Object.values(reqQuery)
        console.log(keys, values, "getLeavesByUsersQuery");

        const conditions = keys.map((key, index) => `LOWER(${key}) LIKE LOWER($${index + 1})`).join(' AND ');
        let params = values.map(value => `%${value}%`);
        try {
            let querydata = `SELECT * FROM leaves WHERE ${conditions} AND userId = $${keys.length + 1}`
            let newParams = [...params, userId]
            console.log("$$$$$$$$$$");
            console.log(querydata);
            console.log(newParams);
            const result: QueryResult = await query(
                querydata, newParams
            );
            console.log(result.rows, "query results");
            return result.rows
        } catch (error) {
            console.log("ERROR leaves APPROVAL");
            return error.message;
        }
    }
    export async function getLeavesByUsersExcludePending(userId: any, reqQuery: any) {
        console.log(reqQuery, "reqQuery getLeavesByUsersExcludePending");

        try {
            let querydata = `SELECT * FROM leaves WHERE userId = $${1} AND status != $${2}`
            let newParams = [ userId,'pending']
            console.log("$$$$$$$$$$");
            console.log(querydata);
            console.log(newParams);
            const result: QueryResult = await query(
                querydata, newParams
            );
            console.log(result.rows, "query results");
            return result.rows
        } catch (error) {
            console.log("ERROR leaves APPROVAL");
            return error.message;
        }
    }
}

