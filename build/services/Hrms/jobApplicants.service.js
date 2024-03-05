import { query } from "../../database/postgress.js";
export var jobApplicantService;
(function (jobApplicantService) {
    async function getAllJobApplicants() {
        try {
            console.log("getAllJobApplicants call");
            const result = await query("SELECT * FROM job_applicants", []);
            console.log(result, "query results");
            return result.rows;
        }
        catch (error) {
            console.error("Error in getAllJobApplicants:", error);
            throw error;
        }
    }
    jobApplicantService.getAllJobApplicants = getAllJobApplicants;
    async function getJobApplicantById(applicantId) {
        try {
            console.log("getJobApplicantById");
            console.log(applicantId, "applicantId");
            const result = await query("SELECT * FROM job_applicants WHERE id = $1", [applicantId]);
            console.log(result, "query results");
            return result.rows[0];
        }
        catch (error) {
            console.error(`Error in getJobApplicantById(${applicantId}):`, error);
            throw {
                success: false,
                message: `Error retrieving job applicant with ID ${applicantId}: ${error.message}`,
            };
        }
    }
    jobApplicantService.getJobApplicantById = getJobApplicantById;
    async function upsertJobApplicant(applicantData) {
        try {
            console.log("upsertJobApplicant");
            console.log(applicantData, "upsertJobApplicant Request body");
            const { id, ...upsertFields } = applicantData;
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            let querydata;
            let params = [];
            if (id) {
                // If id is provided, update the existing job applicant
                querydata = `UPDATE job_applicants SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new job applicant
                querydata = `INSERT INTO job_applicants (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")}) RETURNING *`;
                params = fieldValues;
            }
            console.log(querydata, "upsertJobApplicant query");
            console.log(params, "upsertJobApplicant params");
            const result = await query(querydata, params);
            console.log(result, "upsert result");
            return {
                message: result.command === "UPDATE"
                    ? `${result.rowCount} Job Applicant Updated successfully`
                    : `${result.rowCount} Job Applicant Inserted successfully`,
                jobApplicant: result.rows[0],
            };
        }
        catch (error) {
            console.error("Error in upsertJobApplicant:", error);
            throw error;
        }
    }
    jobApplicantService.upsertJobApplicant = upsertJobApplicant;
    async function deleteJobApplicant(applicantId) {
        try {
            console.log("deleteJobApplicant");
            console.log(applicantId, "applicantId");
            const result = await query("DELETE FROM job_applicants WHERE id = $1 RETURNING *", [applicantId]);
            console.log(result, "delete result");
            return {
                message: `${result.rowCount} Job Applicant Deleted successfully`,
                jobApplicant: result.rows[0],
            };
        }
        catch (error) {
            console.error(`Error in deleteJobApplicant(${applicantId}):`, error);
            throw error;
        }
    }
    jobApplicantService.deleteJobApplicant = deleteJobApplicant;
})(jobApplicantService || (jobApplicantService = {}));
//# sourceMappingURL=jobApplicants.service.js.map