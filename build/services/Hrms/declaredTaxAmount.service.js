import { query } from "../../database/postgress.js";
export var declaredTaxAmountService;
(function (declaredTaxAmountService) {
    async function getAllDeclaredTaxAmountData() {
        try {
            console.log(`Fetching all Declared Tax Amount data for all employees`);
            const querydata = `SELECT * FROM declaredTaxAmount`;
            console.log(querydata, "getAllDeclaredTaxAmountData query");
            const result = await query(query, []);
            console.log(`Fetched all Declared Tax Amount Data Result:`, result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error in getAllDeclaredTaxAmountData:", error.message);
            throw error;
        }
    }
    declaredTaxAmountService.getAllDeclaredTaxAmountData = getAllDeclaredTaxAmountData;
    async function getDeclaredTaxAmountDataById(id) {
        try {
            console.log(`Fetching Declared Tax Amount data for userId: ${id}`);
            const result = await query("SELECT * FROM declaredTaxAmount WHERE id = $1", [id]);
            console.log("Fetched Declared Tax Amount Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching Declared Tax Amount data:", error.message);
            throw error;
        }
    }
    declaredTaxAmountService.getDeclaredTaxAmountDataById = getDeclaredTaxAmountDataById;
    async function getDeclaredTaxAmountDataByUserId(userId) {
        try {
            console.log(`Fetching Declared Tax Amount data for userId: ${userId}`);
            const result = await query("SELECT * FROM declaredTaxAmount WHERE userDetails->>'id' = $1", [userId]);
            console.log("Fetched Declared Tax Amount Data:", result.rows);
            return result.rows;
        }
        catch (error) {
            console.error("Error fetching Declared Tax Amount data:", error.message);
            throw error;
        }
    }
    declaredTaxAmountService.getDeclaredTaxAmountDataByUserId = getDeclaredTaxAmountDataByUserId;
    declaredTaxAmountService.upsertDeclaredTaxAmountData = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsertDeclaredTaxAmountData Request body");
            console.log("Update or Insert Declared Tax Amount Data");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertDeclaredTaxAmountData fieldNames");
            console.log(fieldValues, "upsertDeclaredTaxAmountData fieldValues");
            let querydata;
            let params = [];
            if (id) {
                // If id is provided, update the existing Declared Tax Amount data
                querydata = `UPDATE declaredTaxAmount SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new Declared Tax Amount data
                querydata = `INSERT INTO declaredTaxAmount (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")})`;
                params = fieldValues;
            }
            console.log(query, "upsertDeclaredTaxAmountData query");
            console.log(params, "upsertDeclaredTaxAmountData params");
            let result = await query(query, params);
            let message = result.command === "UPDATE"
                ? `${result.rowCount} Declared Tax Amount Data Updated successfully`
                : `${result.rowCount} Declared Tax Amount Data Inserted successfully`;
            console.log(message);
            return { message };
        }
        catch (error) {
            console.error("Error in upsertDeclaredTaxAmountData:", error.message);
            return { error: error.message };
        }
    };
    async function deleteDeclaredTaxAmountData(id) {
        try {
            console.log(`Deleting Declared Tax Amount data for userId: ${id}`);
            const result = await query("DELETE FROM declaredTaxAmount WHERE id = $1 RETURNING *", [id]);
            console.log("Deleted Declared Tax Amount Data Result:", result.rows);
            return {
                message: `${result.rowCount} Declared Tax Amount data deleted successfully`,
            };
        }
        catch (error) {
            console.error("Error deleting Declared Tax Amount data:", error.message);
            throw error;
        }
    }
    declaredTaxAmountService.deleteDeclaredTaxAmountData = deleteDeclaredTaxAmountData;
})(declaredTaxAmountService || (declaredTaxAmountService = {}));
//# sourceMappingURL=declaredTaxAmount.service.js.map