import { query } from "../../database/postgress.js";

export module otherChaptersService {
  export async function getAllOtherChaptersData() {
    try {
      console.log(`Fetching all Other Chapters data for all employees`);

      const querydata = `SELECT * FROM otherChapters`;

      console.log(querydata, "getAllOtherChaptersData query");

      const result = await query(querydata, []);

      console.log(`Fetched all Other Chapters Data Result:`, result.rows);

      return result.rows;
    } catch (error) {
      console.error("Error in getAllOtherChaptersData:", error.message);
      throw error;
    }
  }

  export async function getOtherChaptersDataById(id) {
    try {
      console.log(`Fetching Other Chapters data for userId: ${id}`);
      const result = await query("SELECT * FROM otherChapters WHERE id = $1", [
        id,
      ]);
      console.log("Fetched Other Chapters Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Other Chapters data:", error.message);
      throw error;
    }
  }

  export async function getOtherChaptersDataByUserId(userId) {
    try {
      console.log(`Fetching Other Chapters data for userId: ${userId}`);
      const result = await query(
        "SELECT * FROM otherChapters WHERE userId = $1",
        [userId]
      );
      console.log("Fetched Other Chapters Data:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("Error fetching Other Chapters data:", error.message);
      throw error;
    }
  }

  export async function upsertOtherChaptersData(request: any) {
    try {
      console.log(request, "Requesitng Data set");
      const { id, ...upsertFields } = request;
      console.log(request, "upsertOtherChaptersData Request body");
      console.log("Update or Insert Other Chapters Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertOtherChaptersData fieldNames");
      console.log(fieldValues, "upsertOtherChaptersData fieldValues");

      let querydata;
      let params: any[] = [];
      console.log(id, "ID IS ");
      if (id) {
        // If id is provided, update the existing Other Chapters data
        console.log("inside if ,id - updata");
        querydata = `UPDATE otherChapters SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new Other Chapters data
        console.log("inside else ,NO -id - INSERT");
        querydata = `INSERT INTO otherChapters (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")}) RETURNING *`;
        params = fieldValues;
      }

      console.log(querydata, "upsertOtherChaptersData query");
      console.log(params, "upsertOtherChaptersData params");

      let result = await query(querydata, params);
      console.log(result, " Resulting Data ");
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} Other Chapters Data Updated successfully`
          : `${result.rowCount} Other Chapters Data Inserted successfully`;
      console.log(result.rows, "result rows from upsert otherchapters data");
      console.log(message);
      return { message };
    } catch (error) {
      console.error("Error in upsertOtherChaptersData:", error.message);
      return { error: error.message };
    }
  }

  export async function deleteOtherChaptersData(id) {
    try {
      console.log(`Deleting Other Chapters data for userId: ${id}`);
      const result = await query(
        "DELETE FROM otherChapters WHERE id = $1 RETURNING *",
        [id]
      );
      console.log("Deleted Other Chapters Data Result:", result.rows);
      return {
        message: `${result.rowCount} Other Chapters data deleted successfully`,
      };
    } catch (error) {
      console.error("Error deleting Other Chapters data:", error.message);
      throw error;
    }
  }
}
