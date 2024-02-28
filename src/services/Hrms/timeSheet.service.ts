import { QueryResult } from "pg";
import { query } from "../../database/postgress.js";
import { getStartandEndTIme } from "../../utils/HRMS/getStarttimeandEndTIme.js";

export module timeSheetServices {
    export async function gettimeSheetServices(userId) {
        try {
            console.log("gettimeSheetServices call");
            const result: QueryResult = await query(
                `SELECT * FROM timesheets WHERE userId = $1 ORDER BY date ASC`,
                [userId.userId]
            );
            console.log(result, "query results");
            return result.rows;
        } catch (error) {
            console.error("Error in gettimeSheetServices:", error);
            throw {
                success: false,
                message: `Error retrieving time Sheet Services: ${error.message}`,
            };
        }
    }
    export async function getTimeSheetbydateanduser(userId, date) {
        try {
            console.log("gettimeSheetServices call");
            console.log(userId, date);
            const result: QueryResult = await query(
                `SELECT * FROM timesheets where userId = ${userId} And date = ${date} `, []
            );
            console.log(result, "query results");
            return result.rows;
        } catch (error) {
            console.error("Error in gettimeSheetServices:", error);
            throw {
                success: false,
                message: `Error retrieving time Sheet Services: ${error.message}`,
            };
        }
    }

    export async function getTimeSheetForMonthandYear(userId, Month, Year) {
        try {
            console.log(userId, Month, Year)
            console.log("getTimeSheetForMonthandYear call");
            let data: any = await getStartandEndTIme(Month, Year)
            console.log(data.startTime)
            const result: QueryResult = await query(`SELECT * FROM timesheets where date >= ${data.startTime} And date <=${data.endTime} And userId = ${Number(userId)}  ORDER BY date ASC`, []);
            console.log(result.rows, "query results getTimeSheetForMonthandYear");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    // export async function upserttimeSheetServices(data) {
    //     try {
    //         console.log(data.timeSheetdata.data);
    //         let existingData = await getTimeSheetbydateanduser(data.userId, data.date)
    //         console.log(existingData, 'FindMatchin Data');
    //         let fieldNames
    //         let fieldValues
    //         if (existingData && existingData.length > 1) {
    //             console.log('forEach');
    //             console.log(data);
    //             const mergedData = existingData.map(item => ({
    //                 ...item,
    //                 timesheetdata: {
    //                     data: [
    //                         ...item.timesheetdata.data,
    //                         data.timesheetdata.data
    //                     ]
    //                 }
    //             }));
    //             console.log(mergedData, 'Merger Data is ');
    //             const { id, ...upsertFields } = mergedData[0]
    //              fieldNames = Object.keys(upsertFields);
    //              fieldValues = Object.values(upsertFields);
    //         }
    //         else {
    //              const { id, ...upsertFields } = data;
    //              fieldNames = Object.keys(upsertFields);
    //              fieldValues = Object.values(upsertFields);
    //         }


    //             let querydata;
    //             let params = [];
    //             console.log(fieldNames);
    //             console.log(fieldValues);

    //             if (id) {
    //                 // If id is provided, update the existing scheduled interview
    //                 querydata = `UPDATE timesheets SET ${fieldNames
    //                     .map((field, index) => `${field} = $${index + 1}`)
    //                     .join(", ")} WHERE id = $${fieldNames.length + 1}`;
    //                 params = [...fieldValues, id];
    //             } else {
    //                 // If id is not provided, insert a new scheduled interview
    //                 querydata = `INSERT INTO timesheets (${fieldNames.join(
    //                     ", "
    //                 )}) VALUES (${fieldValues
    //                     .map((_, index) => `$${index + 1}`)
    //                     .join(", ")}) RETURNING *`;
    //                 params = fieldValues;
    //             }

    //             const result = await query(querydata, params);

    //             return {
    //                 message: `${result.rowCount} Time Sheet${id ? "updated" : "inserted"
    //                     } successfully.`,
    //             };



    //     } catch (error) {
    //         console.error(error);
    //         return { error: error.message };
    //     }
    // }

    export async function upserttimeSheetServices(data) {
        try {
            console.log(data);
            let existingData = await getTimeSheetbydateanduser(data.userId, data.date);
            console.log(existingData, 'existing Data');
            let fieldNames, fieldValues, querydata, params;

            if (existingData && existingData.length > 0) {
                console.log('if Conditions');
                const mergedData = existingData.map(item => ({
                    ...item,
                    timesheetdata: {
                        data: [
                            ...item.timesheetdata.data,
                            ...data.timeSheetdata.data
                        ]
                    }
                }));

                const { id, uuid, ...upsertFields } = mergedData[0];
                let totalHours = 0;
                mergedData.forEach((s) => {
                    s.timesheetdata.data.forEach((e) => {
                        totalHours = Number(e.hours) + totalHours
                    })
                })
                if (totalHours <= 9) {
                    console.log(totalHours, 'Total Hours ');
                    fieldNames = Object.keys(upsertFields);
                    fieldValues = Object.values(upsertFields);
                    querydata = `UPDATE timesheets SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(", ")} WHERE id = $${fieldNames.length + 1}`;
                    params = [...fieldValues, id];
                    const result = await query(querydata, params);
                    return {
                        message: `${result.rowCount} Time Sheet ${result.rowCount === 1 ? "updated" : "inserted"} successfully.`,
                    };
                }
                else if (totalHours > 9) {
                    console.log('else if condition');
                    return { status: 'failure', message: 'you are applying time sheet for more than allowed 9 hours.' }
                }

            } else {
                // Insert new data if no match found
                let totalHours = 0;
                console.log(  data.timeSheetdata.data ,'data value is ');
                data.timeSheetdata.data.forEach((s) => {
                        totalHours = Number(s.hours) + totalHours
                })
                console.log(totalHours ,'Total Hpurs new insert');
                if (totalHours <= 9) {
                    console.log('inside else');
                    const { id, ...upsertFields } = data;
                    fieldNames = Object.keys(upsertFields);
                    fieldValues = Object.values(upsertFields);
                    querydata = `INSERT INTO timesheets (${fieldNames.join(", ")}) VALUES (${fieldValues.map((_, index) => `$${index + 1}`).join(", ")}) RETURNING *`;
                    params = fieldValues;
                    const result = await query(querydata, params);
                    return {
                        status: 'sucess', message: `${result.rowCount} Time Sheet ${result.rowCount === 1 ? "updated" : "inserted"} successfully.`,
                    };

                }
                else if (totalHours > 9) {
                    console.log('else if condition');
                    return { status: 'failure', message: 'you are applying time sheet for more than allowed 9 hours.' }
                }


            }


           

        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

}
