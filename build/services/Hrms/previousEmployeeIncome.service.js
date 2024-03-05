import { query } from "../../database/postgress.js";
export var previousEmployeeIncomeService;
(function (previousEmployeeIncomeService) {
    previousEmployeeIncomeService.getAllpreviousEmployeeIncome = async () => {
        try {
            console.log("Get All previousEmployeeIncome data");
            const result = await query('SELECT * FROM previousEmployeeIncome', []);
            console.log(result, "query results");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    };
    previousEmployeeIncomeService.getSinglepreviousEmployeeIncome = async (recId) => {
        try {
            console.log("Get single previousEmployeeIncome");
            console.log(recId, "getSinglepreviousEmployeeIncome params id");
            const result = await query('SELECT * FROM previousEmployeeIncome WHERE id = $1', [recId]);
            console.log(result.rows, "result getSingle previousEmployeeIncome");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    };
    previousEmployeeIncomeService.getSinglepreviousEmployeeIncomebyuserId = async (userId) => {
        try {
            console.log("Get single previousEmployeeIncome by user id");
            console.log(userId, "getSinglepreviousEmployeeIncome params userId");
            const result = await query('SELECT * FROM previousEmployeeIncome WHERE userDetails->>\'userId\' = $1', [userId]);
            console.log(result.rows, "result getSingle previousEmployeeIncome");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    };
    previousEmployeeIncomeService.upsertpreviousEmployeeIncome = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsert previousEmployeeIncome Request body");
            console.log("Update previousEmployeeIncome");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsert previousEmployeeIncome fieldNames");
            console.log(fieldValues, "upsert previousEmployeeIncome  fieldValues");
            let querydata;
            let params = [];
            if (id) {
                // If id is provided, update the existing user
                querydata = `UPDATE previousEmployeeIncome SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO previousEmployeeIncome (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')})`;
                params = fieldValues;
            }
            console.log(querydata, "upsert previousEmployeeIncome query");
            console.log(params, "upsert previousEmployeeIncome params");
            let result = await query(querydata, params);
            let message = result.command === 'UPDATE' ?
                `${result.rowCount} previousEmployeeIncome Updated successfully` :
                `${result.rowCount} previousEmployeeIncome Inserted successfully`;
            return ({ message });
        }
        catch (error) {
            return error.message;
        }
    };
    async function deletepreviousEmployeeIncome(id) {
        try {
            console.log('delete previousEmployeeIncome');
            // Check user exists
            const findUser = await query('SELECT * FROM previousEmployeeIncome WHERE id = $1', [id]);
            console.log(findUser.rows, "delete previousEmployeeIncome find previousEmployeeIncome");
            if (findUser.rows.length === 0) {
                return ({ status: 400, message: 'previous Employee Income Record not found' });
            }
            // Delete the user
            await query('DELETE FROM previousEmployeeIncome WHERE id = $1', [id
            ]);
            return ({ status: 200, message: 'previousEmployeeIncome Record deleted successfully' });
        }
        catch (error) {
            return (error.message);
        }
    }
    previousEmployeeIncomeService.deletepreviousEmployeeIncome = deletepreviousEmployeeIncome;
})(previousEmployeeIncomeService || (previousEmployeeIncomeService = {}));
//# sourceMappingURL=previousEmployeeIncome.service.js.map