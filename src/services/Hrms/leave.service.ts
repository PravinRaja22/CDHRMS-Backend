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

            let query1 = `SELECT * from leaves WHERE id=$1`

            let joinQuery = `SELECT leaves.*,
                            jsonb_build_object(
                                'id', u1.id,
                                'firstname', u1.firstname,
                                'lastname', u1.lastname,
                                'employeeid', u1.employeeid
                            ) AS users,
                            jsonb_build_object(
                                'id', u2.id,
                                'firstname', u2.firstname,
                                'lastname', u2.lastname,
                                'employeeid', u2.employeeid
                            ) AS approverusers
                            FROM
                            leaves
                            INNER JOIN users u1 ON u1.id = leaves.userid
                            INNER JOIN users u2 ON u2.id = leaves.applyingtoid
                            WHERE leaves.id = $1
                            `
               let  params =[recId]
            console.log(recId, "getSingleLeave params id");
            // const result = await query("SELECT * FROM leaves WHERE id = $1", [
            //     recId,
            // ]);
            const result = await query(joinQuery,params)

            console.log(result.rows, "result getSingleLeave");
            return result.rows;
        } catch (error: any) {
            return error.message;
        }
    }
    export async function upsertLeaves(request: any) {

        try {
            let values = request.body || request; //or request is params passed from another(approval) method
            let files = request?.files ||[]
            let url;
            console.log(files?.length,"files");
            if (files?.length>0) {
                url = request.protocol + "://" + request.headers.host + "/" + request.files[0].filename
            }
        
            console.log("upsertLeaves service");
            console.log(files, "upsertLeaves service files");
            console.log(url, "upsertLeaves service url");

            const {file, ...upsertFields } = values;
            console.log(values, "upsertLeaves Request body");
            console.log(upsertFields,"upsertFields");
            for (const field in upsertFields) {
                console.log(field);
                console.log(upsertFields[field]);
                if (field === 'fromDate' || field === 'toDate' || field === "applyingtoid" ||
                    field === "userId" || field === "noofdays") {
                    upsertFields[field] = Number(upsertFields[field])
                }
                // if(field === 'createdby' || field === 'modifiedby'){
                  
                //     console.log(JSON.parse(upsertFields[field]));
                //     // console.log(JSON.parse(upsertFields[field]));
                //     // upsertFields[field] = (upsertFields[field])
                // }
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

            if (values.id) {
                console.log("if upsert leave")
                // If id is provided, update the existing user
                querydata = `UPDATE leaves SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1} RETURNING *`;
                params = [...fieldValues, values.id];
            } else {
                console.log("else insert leave")
                // If id is not provided, insert a new user
                querydata = `INSERT INTO leaves (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                params = fieldValues;
            }

console.log(querydata,"querydata")

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
            }else if(result.rowCount >0 && result.command === 'UPDATE'){
                let upsertLeave: any = result.rows[0]
                if(upsertLeave.status.toLowerCase().includes('withdraw')){
                    console.log("if");
                    //Delete the approval record or change status
                    let approvalId = upsertLeave?.approvalid
                    let approvalRecord;
                    try{
                        let result = await approvalService.getApprovalsById(approvalId)
                        console.log(result,"approval record");
                        if(result.length>0){
                             approvalRecord = result[0]
                        //update approval record status
                            let {uuid,...otherfields} = approvalRecord
                            otherfields.status = upsertLeave.status //change status

                            console.log(otherfields,"otherfields after change");

                            let approvalResult = await approvalService.updateApprovals(otherfields,otherfields.id)
                            console.log(approvalResult,"approvalResult");
                            if(approvalResult.success){
                                return approvalResult.message
                            }
                        }

                    }catch(error){

                    }
                    // return ({ status: 200, message: `Leave upserted successfully with record ID ${leaveRecord?.id}` });
                    

                }else{
                    console.log("else ****");
                    return {status:200,record:upsertLeave}
                    //return update record response
                }

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
            let innerQuery =`SELECT  leaves.*,
            jsonb_build_object(
                'id', users.id,
                'firstname', users.firstname,
                  'lastname', users.lastname,
                    'employeeid', users.employeeid
            ) AS "jsonUsers",
            jsonb_build_object(  
                'id', leavebalances.id,
                'userid', leavebalances.userId,    
                'balance', leavebalances.balance     
                  
            ) AS "jsonLeavebalances"
            FROM
            leaves
            INNER JOIN users ON users.id = leaves.userid 
            INNER JOIN leavebalances ON leavebalances.userId = leaves.userid			
            WHERE  leaves.applyingtoid = $1`
            
            let params = [approverId]
            let query2 = "SELECT * FROM leaves WHERE applyingtoid = $1"
            // [approverId]
            console.log(innerQuery)
            console.log(params)
            const result: QueryResult = await query(
                innerQuery,params
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
            let innerQuery =`SELECT  leaves.*,
            jsonb_build_object(
                'id', users.id,
                'firstname', users.firstname,
                  'lastname', users.lastname,
                    'employeeid', users.employeeid
            ) AS "jsonApplyingtoid",
            jsonb_build_object(  
                'id', leavebalances.id,
                'userid', leavebalances.userId,    
                'balance', leavebalances.balance     
                  
            ) AS "jsonLeavebalances"
            FROM
            leaves
            INNER JOIN users ON users.id = leaves.applyingtoid 
            INNER JOIN leavebalances ON leavebalances.userId = leaves.userid			
            WHERE ${conditions} AND leaves.userId = $${keys.length + 1}`

            let newParams = [...params, userId]
            console.log("$$$$$$$$$$");
            console.log(innerQuery);
            console.log(newParams);
            const result: QueryResult = await query(
                innerQuery, newParams
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
            let innerQuery =`SELECT  leaves.*,
            jsonb_build_object(
                'id', users.id,
                'firstname', users.firstname,
                  'lastname', users.lastname,
                    'employeeid', users.employeeid
            ) AS "jsonApplyingtoid",
            jsonb_build_object(        
                'id', leavebalances.id,
                'userid', leavebalances.userId,     
                'balance', leavebalances.balance  
            ) AS "jsonLeavebalances"
            FROM
            leaves
            INNER JOIN users ON users.id = leaves.applyingtoid 
            INNER JOIN leavebalances ON leavebalances.userId = leaves.userid				
            WHERE leaves.userId = $${1} AND status != $${2}`
            let newParams = [ userId,'pending']
            console.log("$$$$$$$$$$");
            console.log(innerQuery);
            console.log(newParams);
            const result: QueryResult = await query(
                innerQuery, newParams
            );
            console.log(result.rows, "query results");
            return result.rows
        } catch (error) {
            console.log("ERROR leaves APPROVAL");
            return error.message;
        }
    }
}

