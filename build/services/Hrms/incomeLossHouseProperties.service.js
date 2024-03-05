import { query } from "../../database/postgress.js";
export var incomeLossHousePropertiesService;
(function (incomeLossHousePropertiesService) {
    async function getAllIncomeLossHousePropertiesData() {
        try {
            console.log(`Fetching all income loss house properties data for all employees`);
            const querydata = `SELECT * FROM incomeLossHouseProperties`;
            console.log(querydata, "getAllIncomeLossHousePropertiesData query");
            const result = await query(querydata, {});
            console.log(`Fetched all Income Loss House Properties Data Result:`, result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error in getAllIncomeLossHousePropertiesData:", error.message);
            throw error;
        }
    }
    incomeLossHousePropertiesService.getAllIncomeLossHousePropertiesData = getAllIncomeLossHousePropertiesData;
    async function getIncomeLossHousePropertiesDataById(id) {
        try {
            console.log(`Fetching income loss house properties data for id: ${id}`);
            const result = await query("SELECT * FROM incomeLossHouseProperties WHERE id = $1", [id]);
            console.log("Fetched Income Loss House Properties Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching income loss house properties data:", error.message);
            throw error;
        }
    }
    incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataById = getIncomeLossHousePropertiesDataById;
    async function getIncomeLossHousePropertiesDataByUserId(userId) {
        try {
            console.log(`Fetching income loss house properties data for userId: ${userId}`);
            const result = await query("SELECT * FROM incomeLossHouseProperties WHERE userId = $1", [userId]);
            console.log("Fetched Income Loss House Properties Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching income loss house properties data:", error.message);
            throw error;
        }
    }
    incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataByUserId = getIncomeLossHousePropertiesDataByUserId;
    incomeLossHousePropertiesService.upsertIncomeLossHousePropertiesData = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsertIncomeLossHousePropertiesData Request body");
            console.log("Update or Insert Income Loss House Properties Data");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertIncomeLossHousePropertiesData fieldNames");
            console.log(fieldValues, "upsertIncomeLossHousePropertiesData fieldValues");
            let querydata;
            let params = [];
            if (id) {
                // If id is provided, update the existing Income Loss House Properties data
                querydata = `UPDATE incomeLossHouseProperties SET ${fieldNames
                    .map((field, index) => `"${field}" = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new Income Loss House Properties data
                querydata = `INSERT INTO incomeLossHouseProperties (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")})`;
                params = fieldValues;
            }
            console.log(querydata, "upsertIncomeLossHousePropertiesData query");
            console.log(params, "upsertIncomeLossHousePropertiesData params");
            let result = await query(querydata, params);
            let message = result.command === "UPDATE"
                ? `${result.rowCount} Income Loss House Properties Data Updated successfully`
                : `${result.rowCount} Income Loss House Properties Data Inserted successfully`;
            console.log(message);
            return { message };
        }
        catch (error) {
            console.error("Error in upsertIncomeLossHousePropertiesData:", error.message);
            return { error: error.message };
        }
    };
    async function deleteIncomeLossHousePropertiesData(id) {
        try {
            console.log(`Deleting income loss house properties data for id: ${id}`);
            const result = await query("DELETE FROM incomeLossHouseProperties WHERE id = $1 RETURNING *", [id]);
            console.log("Deleted Income Loss House Properties Data Result:", result.rows);
            return {
                message: `${result.rowCount} Income Loss House Properties data deleted successfully`,
            };
        }
        catch (error) {
            console.error("Error deleting income loss house properties data:", error.message);
            throw error;
        }
    }
    incomeLossHousePropertiesService.deleteIncomeLossHousePropertiesData = deleteIncomeLossHousePropertiesData;
})(incomeLossHousePropertiesService || (incomeLossHousePropertiesService = {}));
//# sourceMappingURL=incomeLossHouseProperties.service.js.map