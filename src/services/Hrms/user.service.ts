
import pool from "../../database/postgress.js";
import { QueryResult } from 'pg';



export module userService {
    export const getAllUsers = async () => {
        try {
            console.log("Get All Users");
            let joinQuery = `SELECT
                users.* ,pfdetails.* , bankdetails.* 
                FROM
                users AS users
                INNER JOIN pfdetails AS pfDetails ON pfdetails.userid = users.id
                INNER JOIN bankdetails AS bankDetails ON bankdetails.userid = users.id`;

            const result: QueryResult = await pool.query(joinQuery);
            console.log(result, "query results");
            return result.rows

        } catch (error) {
            return error.message
        }

    }

    export const getAuthorizedUserdata = async (username) => {
        try {
            console.log(username, 'data in userName')
            let data : any = await pool.query('SELECT * FROM users WHERE username = $1', [username])
            console.log(data.rows.length ,'data')
            if (data.rows.length > 0) {
                return {status:'sucess',result:data.rows}
            }
            else {
                console.log('else section ')
                let upsertResult = upsertUser({ userName: username })
                console.log(upsertResult)
                return {staus:'sucess',result:upsertResult};
            }
            //  const resultdatasetrehg  = await pool.query('SELECT * FROM users WHERE username = $1', [username])
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

    export const getSingleUser = async (recId: string) => {
        try {
            console.log("Get single Users");
            console.log(recId, "getSingleUser params id");
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [recId]);
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
            console.log("Update Users");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertUser fieldNames");
            console.log(fieldValues, "upsertUser fieldValues");

            let query;
            let params: any[] = [];

            if (id) {
                // If id is provided, update the existing user
                query = `UPDATE users SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];

            } else {
                // If id is not provided, insert a new user
                query = `INSERT INTO users (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }

            console.log(query, "upsertUser query");
            console.log(params, "upsertUser params");
            let result = await pool.query(query, params);
            let message = result.command === 'UPDATE' ?
                `${result.rowCount} User Updated successfully` :
                `${result.rowCount} User Inserted successfully`;

            return ({ message });
        } catch (error) {
            return error.message
        }

    }

    export async function deleteUser(id: string) {
        try {
            console.log('delete user')
            const userId = id;
            console.log(userId, "deleteUser params id");
            // Check user exists
            const findUser = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
            console.log(findUser.rows, "deleteUser findUser");
            if (findUser.rows.length === 0) {
                return ({ status: 400, message: 'User not found' });
            }
            // Delete the user
            await pool.query('DELETE FROM users WHERE id = $1', [userId]);
            return ({ status: 200, message: 'User deleted successfully' });
        } catch (error: any) {
            return (error.message);
        }
    }
}
