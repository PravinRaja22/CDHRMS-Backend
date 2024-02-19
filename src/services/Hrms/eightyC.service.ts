import { query } from "../../database/postgress.js";

export module eightyCService {
  export async function getAllEightyCData() {
    try {
      console.log(`Fetching all 80C data for all employees`);
      const querydata = `SELECT * FROM eightyC`;
      console.log(querydata, "getAllEightyCData query");
      const result = await query(query, []);
      console.log(`Fetched all 80C Data Result:`, result);
      return result;
    } catch (error) {
      console.error("Error in getAllEightyCData:", error.message);
      throw error;
    }
  }

  export async function getEightyCDataById(id) {
    try {
      console.log(`Fetching 80C data for userId: ${id}`);
      const result = await query("SELECT * FROM eightyC WHERE id = $1", [id]);
      console.log("Fetched 80C Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching 80C data:", error.message);
      throw error;
    }
  }
  export async function getEightyCDataByUserId(userId) {
    try {
      console.log(`Fetching 80C data for userId: ${userId}`);
      const result = await query("SELECT * FROM eightyC WHERE userid = $1", [
        userId,
      ]);
      console.log("Fetched 80C Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching 80C data:", error.message);
      throw error;
    }
  }

  export const upsertEightyCData = async (request: any) => {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertEightyCData Request body");
      console.log("Update or Insert EightyC Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertEightyCData fieldNames");
      console.log(fieldValues, "upsertEightyCData fieldValues");

      let querydata;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing EightyC data
        querydata = `UPDATE EightyC SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new EightyC data
        querydata = `INSERT INTO EightyC (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(querydata, "upsertEightyCData query");
      console.log(params, "upsertEightyCData params");

      let result = await query(querydata, params);
      let message = `EightyC Data Upserted successfully`;

      console.log(result, "result querydata");
      return { message };
    } catch (error) {
      console.error("Error in upsertEightyCData:", error.message);
      return { error: error.message };
    }
  };

  export async function deleteEightyCData(id) {
    try {
      console.log(`Deleting 80C data for userId: ${id}`);
      const result = await query(
        "DELETE FROM eightyC WHERE id = $1 RETURNING *",
        [id]
      );
      console.log("Deleted 80C Data Result:", result.rows);
      return { message: `${result.rowCount} 80C data deleted successfully` };
    } catch (error) {
      console.error("Error deleting 80C data:", error.message);
      throw error;
    }
  }
}
