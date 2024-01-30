import pool from "../../database/postgress.js";
import { QueryResult } from "pg";

export module scheduleInterviewService {
  export async function getAllScheduledInterviews() {
    try {
      console.log("getAllScheduledInterviews call");
      const result: QueryResult = await pool.query(
        "SELECT * FROM scheduled_interviews"
      );
      console.log(result, "query results");
      return result.rows;
    } catch (error) {
      console.error("Error in getAllScheduledInterviews:", error);
      throw {
        success: false,
        message: `Error retrieving scheduled interviews: ${error.message}`,
      };
    }
  }

  export async function getScheduledInterviewById(interviewId: string) {
    try {
      console.log("getScheduledInterviewById");
      console.log(interviewId, "interviewId");
      const result: QueryResult = await pool.query(
        "SELECT * FROM scheduled_interviews WHERE id = $1",
        [interviewId]
      );
      console.log(result, "query results");
      return result.rows[0];
    } catch (error) {
      console.error(
        `Error in getScheduledInterviewById(${interviewId}):`,
        error
      );
      throw {
        success: false,
        message: `Error retrieving scheduled interview with ID ${interviewId}: ${error.message}`,
      };
    }
  }

  export async function upsertScheduledInterview(data) {
    try {
      const { id, ...upsertFields } = data;

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);

      let query;
      let params = [];

      if (id) {
        // If id is provided, update the existing scheduled interview
        query = `UPDATE scheduled_interviews SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new scheduled interview
        query = `INSERT INTO scheduled_interviews (${fieldNames.join(
          ", "
        )}) VALUES (${fieldValues
          .map((_, index) => `$${index + 1}`)
          .join(", ")}) RETURNING *`;
        params = fieldValues;
      }

      const result = await pool.query(query, params);

      return {
        message: `${result.rowCount} Scheduled interview ${
          id ? "updated" : "inserted"
        } successfully.`,
      };
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  export async function cancelScheduledInterview(interviewId: string) {
    try {
      console.log("cancelScheduledInterview");
      console.log(interviewId, "interviewId");

      const result = await pool.query(
        "DELETE FROM scheduled_interviews WHERE id = $1 RETURNING *",
        [interviewId]
      );
      console.log(result, "delete result");

      return {
        success: true,
        message: `${result.rowCount} Interview Canceled successfully`,
        canceledInterview: result.rows[0],
      };
    } catch (error) {
      console.error(
        `Error in cancelScheduledInterview(${interviewId}):`,
        error
      );
      throw {
        success: false,
        message: `Error canceling scheduled interview with ID ${interviewId}: ${error.message}`,
      };
    }
  }
}
