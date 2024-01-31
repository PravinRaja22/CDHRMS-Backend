import pool from "../../database/postgress.js";

export module incomeLossHousePropertiesService {
  export async function getAllIncomeLossHousePropertiesData() {
    try {
      console.log(
        `Fetching all income loss house properties data for all employees`
      );

      const query = `SELECT * FROM incomeLossHouseProperties`;

      console.log(query, "getAllIncomeLossHousePropertiesData query");

      const result = await pool.query(query);

      console.log(
        `Fetched all Income Loss House Properties Data Result:`,
        result.rows
      );

      return result.rows;
    } catch (error) {
      console.error(
        "Error in getAllIncomeLossHousePropertiesData:",
        error.message
      );
      throw error;
    }
  }

  export async function getIncomeLossHousePropertiesDataById(id) {
    try {
      console.log(`Fetching income loss house properties data for id: ${id}`);
      const result = await pool.query(
        "SELECT * FROM incomeLossHouseProperties WHERE id = $1",
        [id]
      );
      console.log("Fetched Income Loss House Properties Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error(
        "Error fetching income loss house properties data:",
        error.message
      );
      throw error;
    }
  }

  export async function getIncomeLossHousePropertiesDataByUserId(userId) {
    try {
      console.log(
        `Fetching income loss house properties data for userId: ${userId}`
      );
      const result = await pool.query(
        "SELECT * FROM incomeLossHouseProperties WHERE userDetails->>'id' = $1",
        [userId]
      );
      console.log("Fetched Income Loss House Properties Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error(
        "Error fetching income loss house properties data:",
        error.message
      );
      throw error;
    }
  }

  export const upsertIncomeLossHousePropertiesData = async (request: any) => {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertIncomeLossHousePropertiesData Request body");
      console.log("Update or Insert Income Loss House Properties Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertIncomeLossHousePropertiesData fieldNames");
      console.log(
        fieldValues,
        "upsertIncomeLossHousePropertiesData fieldValues"
      );

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing Income Loss House Properties data
        query = `UPDATE incomeLossHouseProperties SET ${fieldNames
          .map((field, index) => `"${field}" = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new Income Loss House Properties data
        query = `INSERT INTO incomeLossHouseProperties (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(query, "upsertIncomeLossHousePropertiesData query");
      console.log(params, "upsertIncomeLossHousePropertiesData params");

      let result = await pool.query(query, params);
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} Income Loss House Properties Data Updated successfully`
          : `${result.rowCount} Income Loss House Properties Data Inserted successfully`;

      console.log(message);
      return { message };
    } catch (error) {
      console.error(
        "Error in upsertIncomeLossHousePropertiesData:",
        error.message
      );
      return { error: error.message };
    }
  };

  export async function deleteIncomeLossHousePropertiesData(id) {
    try {
      console.log(`Deleting income loss house properties data for id: ${id}`);
      const result = await pool.query(
        "DELETE FROM incomeLossHouseProperties WHERE id = $1 RETURNING *",
        [id]
      );
      console.log(
        "Deleted Income Loss House Properties Data Result:",
        result.rows
      );
      return {
        message: `${result.rowCount} Income Loss House Properties data deleted successfully`,
      };
    } catch (error) {
      console.error(
        "Error deleting income loss house properties data:",
        error.message
      );
      throw error;
    }
  }
}
