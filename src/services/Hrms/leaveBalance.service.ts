
import pool from "../../database/postgress.js";
import { QueryResult } from 'pg';
export module leaveBalanceService {
    export async function getLeaveBalanceByUsers(userId:any) {
        try {
            console.log('Get getLeaveBalanceByUsers') ;

            const result: QueryResult = await pool.query(`SELECT * FROM leaveBalances
            WHERE (userId->>'userId')::int = ${userId}`);
            console.log(result.rows, "query results");
            return result.rows
        } catch (error: any) {
            return error.message
        }
    }

    export async function upsertLeaveBalanceByUsers(userId: any, requestBody: any) {
        try {
            console.log('Get upsertLeaveBalanceByUsers');
            console.log(userId, "userId upsertLeaveBalanceByUsers");
            console.log(requestBody, "requestBody upsertLeaveBalanceByUsers");
            console.log(typeof(requestBody.balance),"typeof");

           

            const result: QueryResult = await pool.query(`
                UPDATE leaveBalances
                SET balance = $1
                WHERE (userId->>'userId')::int = $2
            `, [requestBody, userId]);
    
            console.log(result.rowCount, "rows updated");
    
            if (result.rowCount === 0) {
                let resultInsert = await pool.query(`
                    INSERT INTO leaveBalances (userId, balance)
                    VALUES ($1, $2)
                `, [requestBody.userid.userId, requestBody.balance]);
                return resultInsert.rows;
            } else {
                return result.rows;
            }
        } catch (error: any) {
            return error.message;
        }
    }
    
}