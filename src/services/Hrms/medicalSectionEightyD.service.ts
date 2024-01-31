import pool from "../../database/postgress.js";

export module medicalSectionEightyDService {
  export async function getAllMedicalSectionEightyDData() {
    try {
      console.log(`Fetching all Medical Section 80D data for all employees`);

      const query = `SELECT * FROM medicalSectionEightyD`;

      console.log(query, "getAllMedicalSectionEightyDData query");

      const result = await pool.query(query);

      console.log(`Fetched all Medical Section 80D Data Result:`, result.rows);

      return result.rows;
    } catch (error) {
      console.error("Error in getAllMedicalSectionEightyDData:", error.message);
      throw error;
    }
  }

  export async function getMedicalSectionEightyDDataById(id) {
    try {
      console.log(`Fetching Medical Section 80D data for id: ${id}`);
      const result = await pool.query(
        "SELECT * FROM medicalSectionEightyD WHERE id = $1",
        [id]
      );
      console.log("Fetched Medical Section 80D Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Medical Section 80D data:", error.message);
      throw error;
    }
  }

  export async function getMedicalSectionEightyDDataByUserId(userId) {
    try {
      console.log(`Fetching Medical Section 80D data for userId: ${userId}`);
      const result = await pool.query(
        "SELECT * FROM medicalSectionEightyD WHERE userDetails->>'id' = $1",
        [userId]
      );
      console.log("Fetched Medical Section 80D Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Medical Section 80D data:", error.message);
      throw error;
    }
  }

  export const upsertMedicalSectionEightyDData = async (request: any) => {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertMedicalSectionEightyDData Request body");
      console.log("Update or Insert Medical Section 80D Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertMedicalSectionEightyDData fieldNames");
      console.log(fieldValues, "upsertMedicalSectionEightyDData fieldValues");

      let query;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing Medical Section 80D data
        query = `UPDATE medicalSectionEightyD SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new Medical Section 80D data
        query = `INSERT INTO medicalSectionEightyD (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(query, "upsertMedicalSectionEightyDData query");
      console.log(params, "upsertMedicalSectionEightyDData params");

      let result = await pool.query(query, params);
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} Medical Section 80D Data Updated successfully`
          : `${result.rowCount} Medical Section 80D Data Inserted successfully`;

      console.log(message);
      return { message };
    } catch (error) {
      console.error("Error in upsertMedicalSectionEightyDData:", error.message);
      return { error: error.message };
    }
  };

  export async function deleteMedicalSectionEightyDData(id) {
    try {
      console.log(`Deleting Medical Section 80D data for id: ${id}`);
      const result = await pool.query(
        "DELETE FROM medicalSectionEightyD WHERE id = $1 RETURNING *",
        [id]
      );
      console.log("Deleted Medical Section 80D Data Result:", result.rows);
      return {
        message: `${result.rowCount} Medical Section 80D data deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting Medical Section 80D data:", error.message);
      throw error;
    }
  }
}
