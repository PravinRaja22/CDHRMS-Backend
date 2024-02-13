
import { query } from "../../database/postgress.js";
import { QueryResult } from 'pg';
import pool from "../../database/postgress.js";


export module userService {
    export const getAllUsers = async () => {
        try {
            console.log("Get All Users");
            // let joinQuery = `SELECT
            //     users.* ,pfdetails.* , bankdetails.* 
            //     FROM
            //     users AS users
            //     INNER JOIN pfdetails AS pfDetails ON pfdetails.userid = users.id
            //     INNER JOIN bankdetails AS bankDetails ON bankdetails.userid = users.id`;

            let joinQuery = `SELECT  users.*,
            jsonb_build_object(
                'id', pfdetails.id,
                'uan', pfdetails.uan,
                'pfnumber', pfdetails.pfnumber,
                'pfcontribution', pfdetails.pfcontribution,
                'pfemployercontribution', pfdetails.pfemployercontribution,
                'pfemployeecontribution', pfdetails.pfemployeecontribution,
                'userid', pfdetails.userId
            ) AS "pfDetails",
            jsonb_build_object(
                'id', bankdetails.id,
                'accountnumber', bankdetails.accountnumber,
                'bankname', bankdetails.bankname,
                'branch', bankdetails.branch,
                'ifsccode', bankdetails.ifsccode,
                'accountholdername', bankdetails.accountholdername,
                'attachment', bankdetails.attachment,
                'userid', bankdetails.userId
            ) AS "bankDetails" 
            FROM
            users
            FULL JOIN pfdetails ON pfdetails.userid = users.id
            FULL JOIN bankdetails ON bankdetails.userid = users.id
            `
            let usersQuery = `SELECT * FROM users`
            const result: QueryResult = await query(joinQuery, []);
            console.log(result, "query results");

            return result.rows

        } catch (error) {
            return error.message
        }

    }

    export const getAuthorizedUserdata = async (username) => {
        try {
            console.log(username, 'data in userName')

            let userNameLowercase = username

            let joinQuery = `SELECT  users.*,
            jsonb_build_object(
                'id', pfdetails.id,
                'uan', pfdetails.uan,
                'pfnumber', pfdetails.pfnumber,
                'pfcontribution', pfdetails.pfcontribution,
                'pfemployercontribution', pfdetails.pfemployercontribution,
                'pfemployeecontribution', pfdetails.pfemployeecontribution,
                'userid',pfdetails.userId
            ) AS "pfDetails",
            jsonb_build_object(
                'id', bankdetails.id,
                'accountnumber', bankdetails.accountnumber,
                'bankname', bankdetails.bankname,
                'branch', bankdetails.branch,
                'ifsccode', bankdetails.ifsccode,
                'accountholdername', bankdetails.accountholdername,
                'attachment', bankdetails.attachment,
                'userid',bankdetails.userId
            ) AS "bankDetails" 
            FROM
            users
            FULL JOIN pfdetails ON pfdetails.userid = users.id
            FULL JOIN bankdetails ON bankdetails.userid = users.id
            WHERE LOWER(users.username) = LOWER($1)
            `
            let params = [userNameLowercase]


            let data: any = await query(joinQuery, params)
            console.log(data, "data joinquery result");
            console.log('999', data.rows.length, 'data')
            if (data.rows.length > 0) {
                return { status: 'sucess', result: data.rows }
            }
            else {
                console.log('else section ')
                let upsertResult = upsertUser({ userName: username })
                console.log(upsertResult)
                return { status: 'sucess', result: upsertResult };
            }
            //  const resultdatasetrehg  = await query('SELECT * FROM users WHERE username = $1', [username])
            //  console.log('test')
            // console.log(result.rows.length, "result get Authorized User");
            // if(result.rows.length > 0){
            //     return result.rows
            // }
            // else{
            //     console.log('testing data set')
            // //   let upsertResult =   upsertUser({userName:username})
            // //   return upsertResult;
            // }
        } catch (error) {
            return error.message
        }
    }

    export const getSingleUser = async (recId: any) => {
        try {
            console.log("Get single Users");
            console.log(recId, "getSingleUser params id");

            let joinQuery = `SELECT  users.*,
            jsonb_build_object(
                'id', pfdetails.id,
                'uan', pfdetails.uan,
                'pfnumber', pfdetails.pfnumber,
                'pfcontribution', pfdetails.pfcontribution,
                'pfemployercontribution', pfdetails.pfemployercontribution,
                'pfemployeecontribution', pfdetails.pfemployeecontribution,
                'userid',pfdetails.userId
            ) AS "pfDetails",
            jsonb_build_object(
                'id', bankdetails.id,
                'accountnumber', bankdetails.accountnumber,
                'bankname', bankdetails.bankname,
                'branch', bankdetails.branch,
                'ifsccode', bankdetails.ifsccode,
                'accountholdername', bankdetails.accountholdername,
                'attachment', bankdetails.attachment,
                'userid',bankdetails.userId
            ) AS "bankDetails" 
            FROM
            users
            FULL JOIN pfdetails ON pfdetails.userid = users.id
            FULL JOIN bankdetails ON bankdetails.userid = users.id
            WHERE users.id =$1
            `
            let params = [recId]
            const result = await query(joinQuery, params);
            // const result = await query('SELECT * FROM users WHERE id = $1', [recId]);
            console.log(result.rows, "result getSingleUser");
            return result.rows
        } catch (error) {
            return error.message
        }

    }
    export const upsertUser = async (request: any) => {
        try {
            const { id, ...upsertFields } = request;
            // console.log(request, "upsertUser Request body");
            console.log("Update Users ", request);
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertUser fieldNames");
            console.log(fieldValues, "upsertUser fieldValues");

            let querydata;
            let params: any[] = [];

            if (id) {
                // If id is provided, update the existing user
                querydata = `UPDATE users SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];

            } else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO users (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }

            console.log(query, "upsertUser query");
            console.log(params, "upsertUser params");
            let result = await query(querydata, params);
            // let result = await pool.query(querydata,params)
            let message = result.command === 'UPDATE' ?
                `${result.rowCount} User Updated successfully` :
                `${result.rowCount} User Inserted successfully`;

            return ({ message });
        } catch (error) {
            console.log('error in insert data ')
            return error.message
        }

    }

    export async function deleteUser(id: string) {
        try {
            console.log('delete user')
            const userId = id;
            console.log(userId, "deleteUser params id");
            // Check user exists
            const findUser = await query('SELECT * FROM users WHERE id = $1', [userId]);
            console.log(findUser.rows, "deleteUser findUser");
            if (findUser.rows.length === 0) {
                return ({ status: 400, message: 'User not found' });
            }
            // Delete the user
            await query('DELETE FROM users WHERE id = $1', [userId]);
            return ({ status: 200, message: 'User deleted successfully' });
        } catch (error: any) {
            return (error.message);
        }
    }

    export const getUsersBankdetails = async (userId: any) => {
        console.log("getUsersBankdetails call");
        try {
            let querySQL = `SELECT  * FROM bankdetails WHERE userId = ${userId}`
            let result = await query(querySQL, {})
            console.log(result, "result getUsersBankdetails");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export const getUsersPFdetails = async (userId: any) => {
        console.log("getUsersPFdetails call");
        try {
            let querySQL = `SELECT  * FROM pfdetails WHERE userId = ${userId}`
            let result = await query(querySQL, {})
            console.log(result, "result getUsersPFdetails");
            return result.rows
        } catch (error) {
            return error.message
        }
    }
    export const getUsersMedicalInsurence = async (userId: any) => {
        console.log("getUsersMedicalInsurence call");
        try {
            let querySQL = `SELECT  * FROM medicalInsurances WHERE userId = ${userId}`
            let result = await query(querySQL, {})
            console.log(result, "result getUsersMedicalInsurence");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export const getUsersByQueries = async (reqQuery: any) => {
        console.log(reqQuery, "reqQuery getUsersByQueries");
        let keys = Object.keys(reqQuery)
        let values = Object.values(reqQuery)
        console.log(keys, values, "getUsersByQueries");


        try {
            // let querySQL = `SELECT  * FROM users WHERE ${keys.map((i,index)=>`${i} = $${index+1}`)}`
            // SELECT  * FROM users WHERE firstname = $1,designation = $2 querySQL
            // const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
            // SELECT  * FROM users WHERE firstname = $1 AND designation = $2 querySQL
           
            const conditions = keys.map((key, index) => `LOWER(${key}) LIKE LOWER($${index + 1})`).join(' AND ');

            let querySQL = `SELECT  * FROM users WHERE ${conditions}`
            let params = values.map(value => `%${value}%`);
            console.log(querySQL, params, "querySQL");
            let result = await query(querySQL, params)
            console.log(result.rows, "result getUsersByQueries");
            return result.rows
        } catch (error) {
            console.log(error.message, "error getUsersByQueries");
        }



    }

}


