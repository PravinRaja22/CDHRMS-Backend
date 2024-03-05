import { query } from "../../database/postgress.js";
export var medicalSectionEightyDService;
(function (medicalSectionEightyDService) {
    async function getAllMedicalSectionEightyDData() {
        try {
            console.log(`Fetching all Medical Section 80D data for all employees`);
            const querydata = `SELECT * FROM medicalSectionEightyD`;
            console.log(querydata, "getAllMedicalSectionEightyDData query");
            const result = await query(querydata, []);
            console.log(`Fetched all Medical Section 80D Data Result:`, result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error in getAllMedicalSectionEightyDData:", error.message);
            throw error;
        }
    }
    medicalSectionEightyDService.getAllMedicalSectionEightyDData = getAllMedicalSectionEightyDData;
    async function getMedicalSectionEightyDDataById(id) {
        try {
            console.log(`Fetching Medical Section 80D data for id: ${id}`);
            const result = await query("SELECT * FROM medicalSectionEightyD WHERE id = $1", [id]);
            console.log("Fetched Medical Section 80D Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching Medical Section 80D data:", error.message);
            throw error;
        }
    }
    medicalSectionEightyDService.getMedicalSectionEightyDDataById = getMedicalSectionEightyDDataById;
    async function getMedicalSectionEightyDDataByUserId(userId) {
        try {
            console.log(`Fetching Medical Section 80D data for userId: ${userId}`);
            const result = await query("SELECT * FROM medicalSectionEightyD WHERE userId = $1", [userId]);
            console.log("Fetched Medical Section 80D Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching Medical Section 80D data:", error.message);
            throw error;
        }
    }
    medicalSectionEightyDService.getMedicalSectionEightyDDataByUserId = getMedicalSectionEightyDDataByUserId;
    medicalSectionEightyDService.upsertMedicalSectionEightyDData = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsertMedicalSectionEightyDData Request body");
            console.log("Update or Insert Medical Section 80D Data");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertMedicalSectionEightyDData fieldNames");
            console.log(fieldValues, "upsertMedicalSectionEightyDData fieldValues");
            let querydata;
            let params = [];
            if (id) {
                // If id is provided, update the existing Medical Section 80D data
                querydata = `UPDATE medicalSectionEightyD SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new Medical Section 80D data
                querydata = `INSERT INTO medicalSectionEightyD (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")})`;
                params = fieldValues;
            }
            console.log(querydata, "upsertMedicalSectionEightyDData query");
            console.log(params, "upsertMedicalSectionEightyDData params");
            let result = await query(querydata, params);
            let message = result.command === "UPDATE"
                ? `${result.rowCount} Medical Section 80D Data Updated successfully`
                : `${result.rowCount} Medical Section 80D Data Inserted successfully`;
            console.log(message);
            return { message };
        }
        catch (error) {
            console.error("Error in upsertMedicalSectionEightyDData:", error.message);
            return { error: error.message };
        }
    };
    async function deleteMedicalSectionEightyDData(id) {
        try {
            console.log(`Deleting Medical Section 80D data for id: ${id}`);
            const result = await query("DELETE FROM medicalSectionEightyD WHERE id = $1 RETURNING *", [id]);
            console.log("Deleted Medical Section 80D Data Result:", result.rows);
            return {
                message: `${result.rowCount} Medical Section 80D data deleted successfully`,
            };
        }
        catch (error) {
            console.error("Error deleting Medical Section 80D data:", error.message);
            throw error;
        }
    }
    medicalSectionEightyDService.deleteMedicalSectionEightyDData = deleteMedicalSectionEightyDData;
})(medicalSectionEightyDService || (medicalSectionEightyDService = {}));
//# sourceMappingURL=medicalSectionEightyD.service.js.map