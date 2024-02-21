import { query } from "../../database/postgress.js";
import { QueryResult } from "pg";
export module leaveBalanceService {
  export async function getLeaveBalanceByUsers(userId: any) {
    try {
      console.log("Get getLeaveBalanceByUsers");

      const result: QueryResult = await query(
        `SELECT * FROM leaveBalances
            WHERE userId = $1 `,
        [userId]
      );
      console.log(result.rows, "query results");
      return result.rows;
    } catch (error: any) {
      return error.message;
    }
  }

  export async function upsertLeaveBalanceByUsers(
    userId: any,
    requestBody: any
  ) {
    try {
      console.log("Get upsertLeaveBalanceByUsers");
      console.log(userId, "userId upsertLeaveBalanceByUsers");
      console.log(requestBody, "requestBody upsertLeaveBalanceByUsers");
      console.log(requestBody.balance, "typeof");

      //   const result: QueryResult = await pool.query(
      //     `
      //             UPDATE leaveBalances
      //             SET balance = $1
      //             WHERE userId = $2
      //         `,
      //     [requestBody.balance, userId]
      //   );

      const result: QueryResult = await query(
        `
                UPDATE leaveBalances
                SET balance = $1
                WHERE userId = $2
                RETURNING *
            `,
        [requestBody.balance, userId]
      );

      console.log(result.rows, "rows updated");
      console.log(result, "rows updated");
      // let message = `${requestBody.userId.userName} leaveBalance Updated successfully`;
      //check the query result has record or not
      if (result.rowCount === 0) {
        let resultInsert = await query(
          `
                    INSERT INTO leaveBalances (userId, balance)
                    VALUES ($1, $2) RETURNING *
                `,
          [requestBody.userId, requestBody.balance]
        );
        console.log(resultInsert, "resultInsert");
        if(resultInsert.command ==='INSERT'){
          let message = `${requestBody.userId.userName} leaveBalance inserted successfully`;
          return {success:true,message, command:resultInsert.command};
        }else{
          let message = `${requestBody.userId.userName} leaveBalance inserted Failure`;
          return {success:false,message, command:resultInsert.command};
        }
      
        //   } else {
        //     return message;
      }
      else if(result.rowCount ===1 && result.command==='UPDATE'){
        console.log("leave balamce updated ")
        let message = `${requestBody.userid} leaveBalance inserted successfully`;

        return {success:true,message, command:result.command};
      }
    } catch (error: any) {
      return error.message;
    }
  }
}
