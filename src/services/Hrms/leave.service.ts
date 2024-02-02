import pool from "../../database/postgress.js";
import { QueryResult } from "pg";
import { approvalService } from "./approval.service.js";
export module leaveService {
  export async function getLeaves() {
    try {
      console.log("Get Leaves");
      const result: QueryResult = await pool.query("SELECT * FROM leaves");
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
      const result = await pool.query("SELECT * FROM leaves WHERE id = $1", [
        recId,
      ]);
      console.log(result.rows, "result getSingleLeave");
      return result.rows;
    } catch (error: any) {
      return error.message;
    }
  }
  export async function upsertLeaves(values: any) {
    try {
      const { id, ...upsertFields } = values;
      console.log(values, "upsertLeaves Request body");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertLeaves fieldNames");
      console.log(fieldValues, "upsertLeaves fieldValues");

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing user
        query = `UPDATE leaves SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new user
        query = `INSERT INTO leaves (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(query, "upsertLeaves query");
      console.log(params, "upsertLeaves params");
      let result = await pool.query(query, params);
      if (!id && result.rowCount > 0) {
        let approval = await approvalService.insertApprovals(result.rows[0], {
          label: "Leaves",
          value: "leaves",
        });
        console.log(approval, "leave request approval call");
        return { message: "Leave Request Inserted Successfully!" };
      }
      console.log(result, "upsert result");
      return { message: "leave upserted successfully" };
    } catch (error: any) {
      return error.message;
    }
  }

  export async function getLeavesByUsers(userId: string) {
    try {
      console.log("getLeavesByUsers");
      //   const result: QueryResult = await pool.query(`SELECT * FROM leaves WHERE (recordOwner->>\'userId\') = ${userId}`);
      const result: QueryResult = await pool.query(
        "SELECT * FROM leaves WHERE (recordOwner->>'userId') = $1",
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
      const result: QueryResult = await pool.query(
        "SELECT * FROM leaves WHERE (applyingTo->>'userId') = $1",
        [approverId]
      );
      console.log(result.rows, "query results");
      return result.rows;
    } catch (error: any) {
      return error.message;
    }
  }
}
