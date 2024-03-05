import { query } from "../../database/postgress.js";
import { approvalService } from "./approval.service.js";
export var attendanceRegularizeService;
(function (attendanceRegularizeService) {
    async function getAllAttendanceRegularize() {
        try {
            let result = await query(`SELECT * FROM attendanceRegularizations`, []);
            console.log(result, "QueryResult");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    }
    attendanceRegularizeService.getAllAttendanceRegularize = getAllAttendanceRegularize;
    async function getAttendanceRegularizebyId(recId) {
        try {
            let joinQuery = `SELECT attendanceRegularizations.*, 
            jsonb_build_object(
                'id', u2.id,
                'firstname', u2.firstname,
                'lastname', u2.lastname,
                'employeeid', u2.employeeid
            ) AS jsonapproverusers
            FROM
            attendanceRegularizations
            INNER JOIN users u2 ON u2.id = attendanceRegularizations.applyingtoid
            WHERE attendanceRegularizations.id =${recId}`;
            let query1 = `SELECT * FROM attendanceRegularizations WHERE id =${recId}`;
            let result = await query(joinQuery, []);
            console.log(result, "QueryResult");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    }
    attendanceRegularizeService.getAttendanceRegularizebyId = getAttendanceRegularizebyId;
    async function insertAttendanceRegularize(requestBody) {
        try {
            requestBody.forEach(async (e) => {
                let requestConvert = { ...e };
                console.log(requestConvert);
                requestConvert.status = "pending",
                    requestConvert.approvalId = null,
                    console.log(requestConvert, "****** requestConvert");
                let fieldNames = Object.keys(requestConvert);
                let fieldValues = Object.values(requestConvert);
                let querydata = `INSERT INTO attendanceRegularizations (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                let params = fieldValues;
                let result = await query(querydata, params);
                console.log(result, "attendanceRegularizations insert result");
                let attendanceReguRecord;
                if (result.rowCount > 0) {
                    attendanceReguRecord = result.rows[0];
                    //call Insert Approvals
                    let approvalInsert = await approvalService.insertApprovals(attendanceReguRecord, "attendanceRegularizations");
                    console.log(approvalInsert, "approval call");
                    // update the Attendance Regularize with approval Id
                    if (approvalInsert.status = 200) {
                        console.log("approvalInsert inside if");
                        let { uuid, id, ...attendanceRegu } = attendanceReguRecord;
                        attendanceRegu.approvalid = approvalInsert.approvalId;
                        const fieldNames = Object.keys(attendanceRegu);
                        const fieldValues = Object.values(attendanceRegu);
                        querydata = `UPDATE attendanceRegularizations SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                        params = [...fieldValues, id];
                        try {
                            let result = await query(querydata, params);
                            console.log(result, "upsert result with approval");
                            return ({ message: 'Attendance Regularize Insert successfully' });
                        }
                        catch (error) {
                            console.log(error, "update leaves error");
                        }
                    }
                }
                else {
                    return ({ message: "Attendance Regularize Insert Failure" });
                }
            });
        }
        catch (error) {
            return error.message;
        }
    }
    attendanceRegularizeService.insertAttendanceRegularize = insertAttendanceRegularize;
    async function getAttendanceRegularizebyUser(requestParams) {
        try {
            const result = await query('SELECT * FROM attendanceRegularizations WHERE userId= $1', [requestParams]);
            // let result :QueryResult = await pool.query(`SELECT * FROM attendanceRegularizations WHERE userDetails->>'id' =${requestParams}`)
            console.log(result, "QueryResult");
            return result.rows;
        }
        catch (error) {
            return error.message;
        }
    }
    attendanceRegularizeService.getAttendanceRegularizebyUser = getAttendanceRegularizebyUser;
    /*  export async function getRegularizeByUsers(requestParam) {
          try {
              const result: QueryResult = await query(
                  'SELECT * FROM attendanceRegularizations WHERE userId= $1',
                  [requestParam]
              );
              // let result :QueryResult = await pool.query(`SELECT * FROM attendanceRegularizations WHERE userDetails->>'id' =${requestParams}`)
              console.log(result, "QueryResult");
              return result.rows
          } catch (error) {
              return error.message
          }
      }
  */
    async function updateAttendanceRegularize(requestParams, requestBody) {
        const fieldNames = Object.keys(requestBody);
        const fieldValues = Object.values(requestBody);
        console.log(fieldNames, "update Attendance fieldNames");
        console.log(fieldValues, "update Attendance  fieldValues");
        let querydata;
        let params = [];
        let id = requestParams || requestBody?.id;
        try {
            querydata = `UPDATE attendanceRegularizations SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1} RETURNING *`;
            params = [...fieldValues, id];
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            if (result.command === 'UPDATE' && result.rowCount > 0) {
                let upsertRegularize = result.rows[0];
                if (upsertRegularize.status.toLowerCase().includes('withdraw')) {
                    console.log("if");
                    let approvalId = upsertRegularize?.approvalid;
                    let approvalRecord;
                    try {
                        let result = await approvalService.getApprovalsById(approvalId);
                        console.log(result, "approval record");
                        if (result.length > 0) {
                            approvalRecord = result[0];
                            //update approval record status
                            let { uuid, ...otherfields } = approvalRecord;
                            otherfields.status = upsertRegularize.status; //change status
                            console.log(otherfields, "otherfields after change");
                            let approvalResult = await approvalService.updateApprovals(otherfields, otherfields.id);
                            console.log(approvalResult, "approvalResult");
                            if (approvalResult.success) {
                                return approvalResult.message;
                            }
                        }
                    }
                    catch (error) {
                    }
                }
                return ({ status: 200, message: 'Attendance Regularize updated successfully' });
            }
            else {
                return { message: 'Attendance Regularize Update Failure' };
            }
        }
        catch (error) {
            return { error: error.message };
        }
    }
    attendanceRegularizeService.updateAttendanceRegularize = updateAttendanceRegularize;
})(attendanceRegularizeService || (attendanceRegularizeService = {}));
//# sourceMappingURL=attendanceRegularize.service.js.map