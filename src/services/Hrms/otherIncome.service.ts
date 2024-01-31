import pool from "../../database/postgress.js";

export module otherIncomeService {
  export async function getAllOtherIncomeData() {
    try {
      console.log(`Fetching all Other Income data for all employees`);

      const query = `SELECT * FROM otherIncome`;

      console.log(query, "getAllOtherIncomeData query");

      const result = await pool.query(query);

      console.log(`Fetched all Other Income Data Result:`, result.rows);

      return result.rows;
    } catch (error) {
      console.error("Error in getAllOtherIncomeData:", error.message);
      throw error;
    }
  }

  export async function getOtherIncomeDataById(id) {
    try {
      console.log(`Fetching Other Income data for userId: ${id}`);
      const result = await pool.query(
        "SELECT * FROM otherIncome WHERE id = $1",
        [id]
      );
      console.log("Fetched Other Income Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Other Income data:", error.message);
      throw error;
    }
  }

  export async function getOtherIncomeDataByUserId(userId) {
    try {
      console.log(`Fetching Other Income data for userId: ${userId}`);
      const result = await pool.query(
        "SELECT * FROM otherIncome WHERE userDetails->>'id' = $1",
        [userId]
      );
      console.log("Fetched Other Income Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Other Income data:", error.message);
      throw error;
    }
  }

  export const upsertOtherIncomeData = async (request: any) => {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertOtherIncomeData Request body");
      console.log("Update or Insert Other Income Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertOtherIncomeData fieldNames");
      console.log(fieldValues, "upsertOtherIncomeData fieldValues");

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing Other Income data
        query = `UPDATE otherIncome SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new Other Income data
        query = `INSERT INTO otherIncome (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(query, "upsertOtherIncomeData query");
      console.log(params, "upsertOtherIncomeData params");

      let result = await pool.query(query, params);
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} Other Income Data Updated successfully`
          : `${result.rowCount} Other Income Data Inserted successfully`;

      console.log(message);
      return { message };
    } catch (error) {
      console.error("Error in upsertOtherIncomeData:", error.message);
      return { error: error.message };
    }
  };

  export async function deleteOtherIncomeData(id) {
    try {
      console.log(`Deleting Other Income data for userId: ${id}`);
      const result = await pool.query(
        "DELETE FROM otherIncome WHERE id = $1 RETURNING *",
        [id]
      );
      console.log("Deleted Other Income Data Result:", result.rows);
      return {
        message: `${result.rowCount} Other Income data deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting Other Income data:", error.message);
      throw error;
    }
  }
}
