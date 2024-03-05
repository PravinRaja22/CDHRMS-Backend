import { query } from "../../database/postgress.js";
export var loanService;
(function (loanService) {
    async function getAllLoans() {
        try {
            console.log("getAllLoans call");
            const result = await query("SELECT * FROM loans", []);
            console.log(result.rows, "Query results for getAllLoans");
            return result.rows;
        }
        catch (error) {
            console.error("Error in getAllLoans:", error.message);
            return error.message;
        }
    }
    loanService.getAllLoans = getAllLoans;
    async function getLoanById(loanId) {
        try {
            console.log("getLoanById call");
            const result = await query("SELECT * FROM loans WHERE id = $1", [loanId]);
            if (result.rows.length === 0) {
                console.log(`No loan found for id ${loanId}`);
                return { success: false, message: "Loan not found." };
            }
            console.log(result.rows[0], "Loan details for getLoanById");
            return result.rows[0];
        }
        catch (error) {
            console.error("Error in getLoanById:", error.message);
            return error.message;
        }
    }
    loanService.getLoanById = getLoanById;
    loanService.upsertLoan = async (request) => {
        try {
            const { id, ...upsertFields } = request;
            console.log(request, "upsertLoan Request body");
            console.log("Upsert Loan");
            const fieldNames = Object.keys(upsertFields);
            const fieldValues = Object.values(upsertFields);
            console.log(fieldNames, "upsertLoan fieldNames");
            console.log(fieldValues, "upsertLoan fieldValues");
            let querydata;
            let params = [];
            //   if (id) {
            //     // If id is provided, update the existing loan
            //     querydata = `UPDATE loans SET ${fieldNames
            //       .map((field, index) => `${field} = $${index + 1}`)
            //       .join(", ")} WHERE id = $${fieldNames.length + 1}`;
            //     params = [...fieldValues, id];
            //   } else {
            //     // If id is not provided, insert a new loan
            //     querydata = `INSERT INTO loans (${fieldNames.join(
            //       ", "
            //     )}) VALUES (${fieldNames
            //       .map((_, index) => `$${index + 1}`)
            //       .join(", ")}) RETURNING *`;
            //     params = fieldValues;
            //   }
            if (id) {
                // If id is provided, update the existing user
                querydata = `UPDATE loans SET ${fieldNames
                    .map((field, index) => `${field} = $${index + 1}`)
                    .join(", ")} WHERE id = $${fieldNames.length + 1}`;
                params = [...fieldValues, id];
            }
            else {
                // If id is not provided, insert a new user
                querydata = `INSERT INTO loans (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")})`;
                params = fieldValues;
            }
            console.log(querydata, "upsertLoan query");
            console.log(params, "upsertLoan params");
            const result = await query(querydata, params);
            const message = result.command === "UPDATE"
                ? `${result.rowCount} Loan Updated successfully`
                : `${result.rowCount} Loan Inserted successfully`;
            // if(result.rowCount > 0 ){
            //     return
            // }
            console.log(result, "upsertLoan result");
            return { message, loan: result.rows[0] };
        }
        catch (error) {
            console.error("Error in upsertLoan:", error.message);
            return error.message;
        }
    };
    async function deleteLoan(loanId) {
        try {
            console.log("deleteLoan call");
            const result = await query("DELETE FROM loans WHERE id = $1 RETURNING *", [loanId]);
            if (result.rows.length === 0) {
                console.log(`No loan found for id ${loanId}`);
                return { success: false, message: "Loan not found." };
            }
            console.log(result.rows[0], "Deleted loan details for deleteLoan");
            return { success: true, message: "Loan deleted successfully." };
        }
        catch (error) {
            console.error("Error in deleteLoan:", error.message);
            return error.message;
        }
    }
    loanService.deleteLoan = deleteLoan;
})(loanService || (loanService = {}));
//# sourceMappingURL=loan.service.js.map