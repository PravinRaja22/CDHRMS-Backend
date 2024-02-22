import { QueryResult } from "pg";
import { query } from "../../database/postgress.js";

export module timeSheetServices {
    export async function gettimeSheetServices(userId) {
        try {
            console.log("gettimeSheetServices call");
            const result: QueryResult = await query(
                "SELECT * FROM timesheets", []
            );
            console.log(result, "query results");
            return result.rows;
        } catch (error) {
            console.error("Error in gettimeSheetServices:", error);
            throw {
                success: false,
                message: `Error retrieving time Sheet Services: ${error.message}`,
            };
        }
    }

    export async function upserttimeSheetServices(data) {
        try {
            console.log(data);
            const { id, ...upsertFields } = data;

            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);

            let querydata;
            let params = [];
            console.log(fieldNames);
            console.log(fieldValues);

            if (id) {
                // If id is provided, update the existing scheduled interview
                querydata = `UPDATE timesheets SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            } else {
                // If id is not provided, insert a new scheduled interview
                querydata = `INSERT INTO timesheets (${fieldNames.join(
                    ", "
                )}) VALUES (${fieldValues
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")}) RETURNING *`;
                params = fieldValues;
            }

            const result = await query(querydata, params);

            return {
                message: `${result.rowCount} Time Sheet${id ? "updated" : "inserted"
                    } successfully.`,
            };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }
}
