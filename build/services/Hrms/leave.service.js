import pool from "../../database/postgress.js";
export var leaveService;
(function (leaveService) {
    async function getLeaves() {
        try {
            console.log('Get Leaves');
            const result = await pool.query('SELECT * FROM leaves');
            console.log(result.rows, "query results");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    }
    leaveService.getLeaves = getLeaves;
    async function getSingleLeaves(recId) {
        console.log(recId, "getSingleLeave callback request");
        try {
            console.log(recId, "getSingleLeave params id");
            const result = await pool.query('SELECT * FROM leaves WHERE id = $1', [recId]);
            console.log(result.rows, "result getSingleLeave");
            return (result.rows);
        }
        catch (error) {
            return (error.message);
        }
    }
    leaveService.getSingleLeaves = getSingleLeaves;
    async function upsertLeaves(values) {
        try {
            const { id, ...upsertFields } = values;
            console.log(values, "upsertLeaves Request body");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertLeaves fieldNames");
            console.log(fieldValues, "upsertLeaves fieldValues");
            let query;
            let params = [];
            if (id) {
                // If id is provided, update the existing user
                query = `UPDATE leaves SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new user
                query = `INSERT INTO leaves (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }
            console.log(query, "upsertLeaves query");
            console.log(params, "upsertLeaves params");
            let result = await pool.query(query, params);
            console.log(result, "upsert result");
            return ({ message: 'leave upserted successfully' });
        }
        catch (error) {
            return (error.message);
        }
    }
    leaveService.upsertLeaves = upsertLeaves;
    async function getLeavesByUsers(userId) {
        try {
            console.log('getLeavesByUsers');
            //   const result: QueryResult = await pool.query(`SELECT * FROM leaves WHERE (recordOwner->>\'userId\') = ${userId}`);
            const result = await pool.query('SELECT * FROM leaves WHERE (recordOwner->>\'userId\') = $1', [userId]);
            console.log(result.rows, "query results");
            return (result.rows);
        }
        catch (error) {
            return (error.message);
        }
    }
    leaveService.getLeavesByUsers = getLeavesByUsers;
    async function getLeavesByApprover(approverId) {
        try {
            console.log('getLeavesByApprover');
            const result = await pool.query('SELECT * FROM leaves WHERE (applyingTo->>\'userId\') = $1', [approverId]);
            console.log(result.rows, "query results");
            return (result.rows);
        }
        catch (error) {
            return (error.message);
        }
    }
    leaveService.getLeavesByApprover = getLeavesByApprover;
})(leaveService || (leaveService = {}));
//# sourceMappingURL=leave.service.js.map