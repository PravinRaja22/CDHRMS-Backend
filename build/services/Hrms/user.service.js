import pool from "../../database/postgress.js";
export var userService;
(function (userService) {
    userService.getAllUsers = async () => {
        try {
            console.log("Get All Users");
            const result = await pool.query('SELECT * FROM users');
            console.log(result, "query results");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    };
    userService.getSingleUser = async (recId) => {
        try {
            console.log("Get single Users");
            console.log(recId, "getSingleUser params id");
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [recId]);
            console.log(result.rows, "result getSingleUser");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    };
    userService.upsertUser = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsertUser Request body");
            console.log("Update Users");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertUser fieldNames");
            console.log(fieldValues, "upsertUser fieldValues");
            let query;
            let params = [];
            if (id) {
                // If id is provided, update the existing user
                query = `UPDATE users SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new user
                query = `INSERT INTO users (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }
            console.log(query, "upsertUser query");
            console.log(params, "upsertUser params");
            await pool.query(query, params);
            return ({ message: 'User upserted successfully' });
        }
        catch (error) {
            return error.message;
        }
    };
    async function deleteUser(id) {
        try {
            console.log('delete user');
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
        }
        catch (error) {
            return (error.message);
        }
    }
    userService.deleteUser = deleteUser;
})(userService || (userService = {}));
//# sourceMappingURL=user.service.js.map