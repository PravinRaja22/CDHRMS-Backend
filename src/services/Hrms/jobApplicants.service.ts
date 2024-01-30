import pool from "../../database/postgress.js";
import { QueryResult } from "pg";

export module jobApplicantService {
  export async function getAllJobApplicants() {
    try {
      console.log("getAllJobApplicants call");
      const result: QueryResult = await pool.query(
        "SELECT * FROM job_applicants"
      );
      console.log(result, "query results");
      return result.rows;
    } catch (error) {
      console.error("Error in getAllJobApplicants:", error);
      throw error;
    }
  }

  export async function getJobApplicantById(applicantId: string) {
    try {
      console.log("getJobApplicantById");
      console.log(applicantId, "applicantId");
      const result: QueryResult = await pool.query(
        "SELECT * FROM job_applicants WHERE id = $1",
        [applicantId]
      );
      console.log(result, "query results");
      return result.rows[0];
    } catch (error) {
      console.error(`Error in getJobApplicantById(${applicantId}):`, error);
      throw {
        success: false,
        message: `Error retrieving job applicant with ID ${applicantId}: ${error.message}`,
      };
    }
  }

  export async function upsertJobApplicant(applicantData: any) {
    try {
      console.log("upsertJobApplicant");
      console.log(applicantData, "upsertJobApplicant Request body");

      const { id, ...upsertFields } = applicantData;
      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing job applicant
        query = `UPDATE job_applicants SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new job applicant
        query = `INSERT INTO job_applicants (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")}) RETURNING *`;
        params = fieldValues;
      }

      console.log(query, "upsertJobApplicant query");
      console.log(params, "upsertJobApplicant params");

      const result = await pool.query(query, params);
      console.log(result, "upsert result");

      return {
        message:
          result.command === "UPDATE"
            ? `${result.rowCount} Job Applicant Updated successfully`
            : `${result.rowCount} Job Applicant Inserted successfully`,
        jobApplicant: result.rows[0],
      };
    } catch (error) {
      console.error("Error in upsertJobApplicant:", error);
      throw error;
    }
  }

  export async function deleteJobApplicant(applicantId: string) {
    try {
      console.log("deleteJobApplicant");
      console.log(applicantId, "applicantId");

      const result = await pool.query(
        "DELETE FROM job_applicants WHERE id = $1 RETURNING *",
        [applicantId]
      );
      console.log(result, "delete result");

      return {
        message: `${result.rowCount} Job Applicant Deleted successfully`,
        jobApplicant: result.rows[0],
      };
    } catch (error) {
      console.error(`Error in deleteJobApplicant(${applicantId}):`, error);
      throw error;
    }
  }
}
