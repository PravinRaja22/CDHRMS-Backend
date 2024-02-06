
import {query} from "../../database/postgress.js";
import { QueryResult } from 'pg';
export module bankDetailsService {


    export async function getBankDetails() {
        try {
            console.log('Get bankDetails')
            const result: QueryResult = await query('SELECT * FROM bankDetails',{});
            console.log(result.rows, "query results");
            return result.rows
        } catch (error: any) {
            return error.message
        }
    }
    export async function getIndividualBankDetails(recID :string) {
        try {
            console.log("bankDetails - getSinglebankDetails call");
            const result = await query(
              "SELECT * FROM bankDetails WHERE id = $1",
              [recID]
            );
            console.log(result.rows, "single bankDetails record");
            return result.rows[0];
          } catch (error) {
            console.error(
              `Error in getSbankDetails for id ${recID}:`,
              error.message
            );
            return { error: error.message };
          }
    }


    export const upsertBankDetails = async (values: any) => {
        console.log("Bank Details Data ", values)
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
                querydata = `UPDATE bankDetails SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];

            } else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO bankDetails (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }

            console.log(querydata, "upsert Bank Details query");
            console.log(params, "upsert Bank Details params");
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            return ({ message: 'Back Details upserted successfully' });


        } catch (error: any) {
            return (error.message);
        }
    }

    export const deleteBankDetails = async (recId : string)=>{
        try {
            console.log("deleteBankDetails - deleteBankDetails call");
            const result = await query(
              "DELETE FROM bankDetails WHERE id = $1 RETURNING *",
              [recId]
            );
            if (result.rowCount > 0) {
              console.log(`bankDetails Data with id ${recId} deleted successfully`);
              return {
                message: `bankDetails Data with id ${recId} deleted successfully`,
              };
            } else {
              console.log(`bankDetails Data with id ${recId} not found`);
              return { message: `bankDetails Data with id ${recId} not found` };
            }
          } catch (error) {
            console.error(
              `Error in deletebankDetails for id ${recId}:`,
              error.message
            );
            return { error: error.message };
          }
    }
}