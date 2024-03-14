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
          [requestBody.userid, requestBody.balance]
        );
        console.log(resultInsert, "resultInsert");
        if (resultInsert.command === "INSERT") {
          let message = `${requestBody.userid} leaveBalance inserted successfully`;
          return { success: true, message, command: resultInsert.command };
        } else {
          let message = `${requestBody.userid} leaveBalance inserted Failure`;
          return { success: false, message, command: resultInsert.command };
        }

        //   } else {
        //     return message;
      } else if (result.rowCount === 1 && result.command === "UPDATE") {
        console.log("leave balamce updated ");
        let message = `${requestBody.userid} leaveBalance inserted successfully`;

        return { success: true, message, command: result.command };
      }
    } catch (error: any) {
      return error.message;
    }
  }

  export async function upsertLeaveBalance(requestBody: any) {
    console.log("upsertLeaveBalance call", requestBody)
    const { id, ...upsertFields } = requestBody;
    const fieldNames = Object.keys(upsertFields);
    const fieldValues = Object.values(upsertFields);
    console.log(fieldNames, "upsertLeaveBalance fieldNames");
    console.log(fieldValues, "upsertLeaveBalance fieldValues");

    let querydata;
    let params: any[] = [];
    let checkUsersExistResult
    let returnMessage;

    try {
      if (id) {
        //Upsert LB
        querydata = `UPDATE leavebalances SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        //insert LB - 1 user -1 year - 1 leave type

        //check users
        checkUsersExistResult = await checkUserLBRecordExist(upsertFields)
        console.log(checkUsersExistResult, "checkUsersResult")

        if (checkUsersExistResult.status === 'success' && !checkUsersExistResult.isExists) {
          querydata = `INSERT INTO leavebalances (${fieldNames.join(
            ", "
          )}) VALUES (${fieldNames
            .map((_, index) => `$${index + 1}`)
            .join(", ")})`;
          params = fieldValues;
        }
      }
      console.log(querydata, "querydata")

      if (checkUsersExistResult.status === 'success' && checkUsersExistResult.isExists) {
        returnMessage = `This User alredy has leave balance record in ${requestBody.leavetype}`
      } else if (checkUsersExistResult.status === "failure") {
        returnMessage = `having issue with ${checkUsersExistResult.message}`
      } else {
        let result = await query(querydata, params);
        console.log(result, "upsert result")
        returnMessage =
          result.rowCount != 0 && result.command === "UPDATE"
            ? `${result.rowCount} Leave Balance Updated successfully`
            : result.rowCount != 0 && result.command === "INSERT" ? `${result.rowCount} Leave Balance Inserted successfully`
              : ''
      }
      return { message: returnMessage };
    } catch (error) {
      console.log(error)
      return error.message
    }


  }


  const checkUserLBRecordExist = async (requestFields) => {

    //check one user - 1 leave type and  for 1 year

    try {
      let result = { exist: 0, notexist: 0 }
      const { userid, leavetype, startdate, enddate } = requestFields
      let startDateYear = new Date(startdate).getFullYear()
      let startdateMonth = new Date(startdate).getMonth()
      let endDateYear = new Date(enddate).getFullYear()
      let enddateMonth = new Date(enddate).getMonth()

      let leavebalanceRecords = await getLeaveBalanceByUsers(userid)
      console.log(leavebalanceRecords, "leavebalanceRecords")

      leavebalanceRecords.length > 0 && leavebalanceRecords.map((item: any, index: any) => {

        let singleLBStartYear = new Date(Number(item.startdate)).getFullYear()
        let singleLBStartMonth = new Date(Number(item.startdate)).getMonth()
        let singleLBEndYear = new Date(Number(item.enddate)).getFullYear()
        let singleLBEndMonth = new Date(Number(item.enddate)).getMonth()

        // we can remove month , one user one year one leave type
        //   if (item.leavetype.toLowerCase() === leavetype.toLowerCase() &&
        //   startDateYear === singleLBStartYear && startdateMonth === singleLBStartMonth &&
        //   endDateYear === singleLBEndYear && enddateMonth === singleLBEndMonth
        // )
        if (item.leavetype.toLowerCase() === leavetype.toLowerCase() &&
          startDateYear === singleLBStartYear &&
          endDateYear === singleLBEndYear
        ) {
          console.log("record already exist")
          result.exist++
        } else {
          console.log("record not exist ")
          result.notexist++
        }
      })

      console.log(result, "results exist")
      return result.exist > 0 ? { status: "success", isExists: true } : { status: "success", isExists: false }
    }
    catch (error) {
      console.log("error in checkUserLBRecordExist")
      return { status: "failure", message: error.message }
    }





  }

}
