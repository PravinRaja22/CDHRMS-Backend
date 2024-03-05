import { query } from "../../database/postgress.js";
export var medicalInsuranceService;
(function (medicalInsuranceService) {
    medicalInsuranceService.getMedicalInsurances = async () => {
        try {
            let querySQL = `SELECT * FROM medicalInsurances`;
            const result = await query(querySQL, {});
            console.log(result.rows, "querySQL rows");
            return result.rows;
        }
        catch (error) {
            return error;
        }
    };
    medicalInsuranceService.upsertMedicalInsurances = async (reqBody) => {
        console.log(reqBody, "upsertMedicalInsurances ");
        const { id, ...otherFields } = reqBody;
        let varifyUsers = await varifyInsuranceExists(otherFields.userId);
        console.log("varifyUsers", varifyUsers);
        const fieldNames = Object.keys(otherFields);
        const fieldValues = Object.values(otherFields);
        let querySQL;
        let params;
        if (id) {
            querySQL = `UPDATE medicalInsurances SET ${fieldNames
                .map((field, index) => `${field} = $${index + 1}`)
                .join(", ")} WHERE id = $${fieldNames.length + 1} RETURNING *`;
            params = [...fieldValues, id];
        }
        else {
            if (varifyUsers.status === 200) {
                querySQL = `INSERT INTO medicalInsurances (${fieldNames.join(", ")}) VALUES (${fieldNames
                    .map((_, index) => `$${index + 1}`)
                    .join(", ")}) RETURNING *`;
                params = fieldValues;
            }
        }
        console.log("updated querySQL", querySQL);
        try {
            const result = await query(querySQL, params);
            console.log("upsert medical insurance rows", result);
            return result.rows;
        }
        catch (error) {
            return error;
        }
    };
    medicalInsuranceService.getMedicalInsurancesById = async (recId) => {
        console.log("inside getMedicalInsurancesById ", recId);
        try {
            let querySQL = `SELECT * FROM medicalInsurances WHERE id =${recId}`;
            const result = await query(querySQL, {});
            console.log(result, "getMedicalInsurancesById rows");
            return result.rows;
        }
        catch (error) {
            return error;
        }
    };
    medicalInsuranceService.deleteMedicalInsurancesById = async (recId) => {
        console.log("inside deleteMedicalInsurancesById ", recId);
        try {
            let querySQL = `DELETE FROM medicalInsurances WHERE id =${recId}`;
            const result = await query(querySQL, {});
            console.log(result, "getMedicalInsurancesById rows");
            if (result.command === "DELETE" && result.rowCount > 0) {
                return { message: `${recId} Medical Insurance is deleted Succesfully`, status: 200 };
            }
            else {
                return { message: `${recId} Medical Insurance is Not deleted `, status: 400 };
            }
        }
        catch (error) {
            return error;
        }
    };
})(medicalInsuranceService || (medicalInsuranceService = {}));
const varifyInsuranceExists = async (userId) => {
    console.log("varifyInsuranceExists", userId);
    console.log("*** type", typeof (userId));
    try {
        let result = await query(`SELECT id,userId from medicalInsurances WHERE userId = ${userId}`, {});
        console.log(result, "result varifyInsuranceExists");
        if (result.rowCount > 0) {
            return { message: 'user already has medical Insurence', status: 202 };
        }
        else {
            return { message: 'user  has no medical Insurence', status: 200 };
        }
    }
    catch (error) {
        return { message: error.message, status: 400 };
    }
};
//# sourceMappingURL=medicalInsurance.service.js.map