
import {query} from "../../database/postgress.js";
import { QueryResult } from 'pg';
export module PFDetailsService {


    export async function getPFDetails() {
        try {
            console.log('Get PFDetails')
            const result: QueryResult = await query('SELECT * FROM pfDetails',[]);
            console.log(result.rows, "query results");
            return result.rows
        } catch (error: any) {
            return error.message
        }
    }
    export async function getIndividualPFDetails(recID :string) {
        try {
            console.log("PFDetails - getSinglePFDetails call");
            const result = await query(
              "SELECT * FROM pfDetails WHERE id = $1",
              [recID]
            );
            console.log(result.rows, "single PFDetails record");
            return result.rows[0];
          } catch (error) {
            console.error(
              `Error in getSPFDetails for id ${recID}:`,
              error.message
            );
            return { error: error.message };
          }
    }


    export const upsertPFDetails = async (values: any) => {
        console.log("PF Details Data ", values)
        try {
            const { id, ...upsertFields } = values;
            console.log(values, "upsertLeaves Request body");

            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertLeaves fieldNames");
            console.log(fieldValues, "upsertLeaves fieldValues");

            let querydata;
            let params: any[] = [];

            if (id) {
                // If id is provided, update the existing user
                querydata = `UPDATE pfDetails SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];

            } else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO pfDetails (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }

            console.log(querydata, "upsert PF Details query");
            console.log(params, "upsert PF Details params");
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            return ({ message: 'Back Details upserted successfully' });


        } catch (error: any) {
            return (error.message);
        }
    }

    export const deletePFDetails = async (recId : string)=>{
        try {
            console.log("pfDetails - deletepfDetails call");
            const result = await query(
              "DELETE FROM PFDetails WHERE id = $1 RETURNING *",
              [recId]
            );
            if (result.rowCount > 0) {
              console.log(`PFDetails Data with id ${recId} deleted successfully`);
              return {
                message: `PFDetails Data with id ${recId} deleted successfully`,
              };
            } else {
              console.log(`PFDetails Data with id ${recId} not found`);
              return { message: `PFDetails Data with id ${recId} not found` };
            }
          } catch (error) {
            console.error(
              `Error in deletePFDetails for id ${recId}:`,
              error.message
            );
            return { error: error.message };
          }
    }
}