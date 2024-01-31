import pool from "../../database/postgress.js";

export module houseRentAllowanceService {
  export async function getAllHouseRentAllowanceData() {
    try {
      console.log(`Fetching all House Rent Allowance data for all employees`);

      const query = `SELECT * FROM houseRentAllowance`;

      console.log(query, "getAllHouseRentAllowanceData query");

      const result = await pool.query(query);

      console.log(`Fetched all House Rent Allowance Data Result:`, result.rows);

      return result.rows;
    } catch (error) {
      console.error("Error in getAllHouseRentAllowanceData:", error.message);
      throw error;
    }
  }

  export async function getHouseRentAllowanceDataById(id) {
    try {
      console.log(`Fetching House Rent Allowance data for userId: ${id}`);
      const result = await pool.query(
        "SELECT * FROM houseRentAllowance WHERE id = $1",
        [id]
      );
      console.log("Fetched House Rent Allowance Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching House Rent Allowance data:", error.message);
      throw error;
    }
  }

  export async function getHouseRentAllowanceDataByUserId(userId) {
    try {
      console.log(`Fetching House Rent Allowance data for userId: ${userId}`);
      const result = await pool.query(
        "SELECT * FROM houseRentAllowance WHERE userDetails->>'id' = $1",
        [userId]
      );
      console.log("Fetched House Rent Allowance Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching House Rent Allowance data:", error.message);
      throw error;
    }
  }

  export const upsertHouseRentAllowanceData = async (request: any) => {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertHouseRentAllowanceData Request body");
      console.log("Update or Insert House Rent Allowance Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertHouseRentAllowanceData fieldNames");
      console.log(fieldValues, "upsertHouseRentAllowanceData fieldValues");

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing House Rent Allowance data
        query = `UPDATE houseRentAllowance SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new House Rent Allowance data
        query = `INSERT INTO houseRentAllowance (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(query, "upsertHouseRentAllowanceData query");
      console.log(params, "upsertHouseRentAllowanceData params");

      let result = await pool.query(query, params);
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} House Rent Allowance Data Updated successfully`
          : `${result.rowCount} House Rent Allowance Data Inserted successfully`;

      console.log(message);
      return { message };
    } catch (error) {
      console.error("Error in upsertHouseRentAllowanceData:", error.message);
      return { error: error.message };
    }
  };

  export async function deleteHouseRentAllowanceData(id) {
    try {
      console.log(`Deleting House Rent Allowance data for userId: ${id}`);
      const result = await pool.query(
        "DELETE FROM houseRentAllowance WHERE id = $1 RETURNING *",
        [id]
      );
      console.log("Deleted House Rent Allowance Data Result:", result.rows);
      return {
        message: `${result.rowCount} House Rent Allowance data deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting House Rent Allowance data:", error.message);
      throw error;
    }
  }
}
