import {query} from "../../database/postgress.js";

export module onboardingService {
  export async function getAllOnboardingData() {
    try {
      console.log("onboardingService - getAllOnboardingData call");
      const result = await query("SELECT * FROM onboarding",[]);
      console.log(result.rows, "onboarding query results");
      return result.rows;
    } catch (error) {
      console.error("Error in getAllOnboardingData:", error.message);
      return { error: error.message };
    }
  }

  export async function getSingleOnboardingData(id: string) {
    try {
      console.log("onboardingService - getSingleOnboardingData call");
      const result = await query(
        "SELECT * FROM onboarding WHERE id = $1",
        [id]
      );
      console.log(result.rows, "single onboarding record");
      return result.rows[0];
    } catch (error) {
      console.error(
        `Error in getSingleOnboardingData for id ${id}:`,
        error.message
      );
      return { error: error.message };
    }
  }

  export async function upsertOnboardingData(request: any) {
    try {
      const { id, ...upsertFields } = request;
      console.log(request, "upsertOnboardingData Request body");
      console.log("Update or Insert Onboarding Data");

      const fieldNames = Object.keys(upsertFields);
      const fieldValues = Object.values(upsertFields);
      console.log(fieldNames, "upsertOnboardingData fieldNames");
      console.log(fieldValues, "upsertOnboardingData fieldValues");

      let querydata;
      let params: any[] = [];

      if (id) {
        // If id is provided, update the existing onboarding data
        querydata = `UPDATE onboarding SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        params = [...fieldValues, id];
      } else {
        // If id is not provided, insert a new onboarding data
        querydata = `INSERT INTO onboarding (${fieldNames.join(
          ", "
        )}) VALUES (${fieldNames
          .map((_, index) => `$${index + 1}`)
          .join(", ")})`;
        params = fieldValues;
      }

      console.log(querydata, "upsertOnboardingData query");
      console.log(params, "upsertOnboardingData params");

      let result = await query(querydata, params);
      let message =
        result.command === "UPDATE"
          ? `${result.rowCount} Onboarding Data Updated successfully`
          : `${result.rowCount} Onboarding Data Inserted successfully`;

      console.log(message);
      return { message };
    } catch (error) {
      console.error("Error in upsertOnboardingData:", error.message);
      return { error: error.message };
    }
  }

  export async function deleteOnboardingData(id: string) {
    try {
      console.log("onboardingService - deleteOnboardingData call");
      const result = await query(
        "DELETE FROM onboarding WHERE id = $1 RETURNING *",
        [id]
      );
      if (result.rowCount > 0) {
        console.log(`Onboarding Data with id ${id} deleted successfully`);
        return {
          message: `Onboarding Data with id ${id} deleted successfully`,
        };
      } else {
        console.log(`Onboarding Data with id ${id} not found`);
        return { message: `Onboarding Data with id ${id} not found` };
      }
    } catch (error) {
      console.error(
        `Error in deleteOnboardingData for id ${id}:`,
        error.message
      );
      return { error: error.message };
    }
  }
}
