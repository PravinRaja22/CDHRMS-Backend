import { forEach } from "lodash";
import { query } from "../../database/postgress.js";
import { QueryResult } from 'pg';
import { getMonthAndYearFromUTC } from "../../utils/HRMS/getMonthandYearFromutc.js";
export module attendanceService {
    export async function getAttendanceData() {
        try {
            console.log("attendanceService call");
            const result: QueryResult = await query('SELECT * FROM attendances', []);
            console.log(result, "query results");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export async function upsertAttendance(values: any) {
        try {
            console.log("inside upsertAttendance", values);
            let attendanceData = await generateAttendanceData(values)
            console.log("attendanceData");
            console.log(attendanceData, "attendanceData");
            let message = attendanceData.success > 0 && attendanceData.failure > 0 ?
                `${attendanceData.success} Attendace Inserted Succesfully ,
                ${attendanceData.success} Attendace Insert failure`
                : attendanceData.success === 0 && attendanceData.failure > 0 ? ` ${attendanceData.failure} Attendace Insert failure`
                    : `${attendanceData.success} Attendace Inserted Succesfully`

            return message
        } catch (error) {
            return error.message
        }
    }

    export async function getAttendanceByUserIdDate(params: any) {
        console.log("getAttendanceByUserIdDate");
        console.log(params, "params");

        const existingRecord: any = await query(
            'SELECT * FROM attendances WHERE userId = $1 AND date = $2',
            [params.userId, params.attendanceDate]
        )
        console.log(existingRecord.rows, "existingRecord");
        if (existingRecord.rows.length === 0) {
            // No attendance record found for the user and date
            console.log(`No attendance record found for user ${params.userId} on ${params.attendanceDate}`);
            return { success: false, message: 'No attendance record found for the specified user and date.' };
        }
        else {
            return existingRecord.rows[0]
        }

    }

    export async function getAttendanceByUserIdMonth(params: any) {
        try {
            console.log(params)
            const { userId, month, year } = params
            console.log(month)
            console.log(year)
            let result = await getMonthAndYearFromUTC(month, year)
            console.log('test')
            console.log(result)
            const queryData: any = await query(
                `SELECT * FROM attendances WHERE userId = $1 AND date >=${result.startTime} AND date <= ${result.endTime}`,
                [userId]
            )
             console.log(queryData.rows.length)
            return queryData.rows;

        } catch (error) {

        }
    }

    export async function updateAttendance(params: any, body: any) {
        console.log(params, "params updateAttendance service");
        console.log(body, "body updateAttendance service");

        const existingRecord: any = await query(
            'SELECT * FROM attendances WHERE userId = $1 AND date = $2',
            [params.userId, params.attendanceDate]
        )
        console.log(params.userId);
        if (existingRecord.rows.length === 0) {
            // No attendance record found for the user and date
            console.log(`No attendance record found for user ${params.userId} on ${params.attendanceDate}`);
            return { success: false, message: 'No attendance record found for the specified user and date.' };
        } else {
            //upsert request body
            console.log(existingRecord.rows, 'Rows isd ');
            let recId = existingRecord.rows[0].id
            let querydata;
            let params;
            let fieldNames = Object.keys(body);
            let fieldValues = Object.values(body)
            console.log(fieldNames, "fieldNames");
            console.log("********");
            console.log(fieldNames.length + 1);
            console.log("**********");
            try {
                if (fieldNames.length > 0) {
                    querydata = `UPDATE attendances SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
                    params = [...fieldValues, recId];
                }
                console.log(recId, 'ID ID ');
                console.log(params, 'params');
                let result = await query(querydata, params);
                console.log(result, "upsert result");
                let message = result.command === 'UPDATE' && result.rowCount > 0 ? 'Attendance upserted successfully' : 'Attendance upserte failure'
                return ({ status: 200, message });

            } catch (error) {
                console.log(error.message, "upsert error");
                return error.message;
            }


        }



    }

    export async function getsingleAttendance(recId: any) {
        console.log("getsingleAttendance", recId);

        try {
            const result: any = await query(
                `SELECT * FROM attendances WHERE id = ${recId}`, []
            )
            console.log(result, "findRecord");
            if (result.rowCount = 1) {
                return result.rows
            }

        } catch (error) {
            return error.message
        }

    }

    //attendance bulk insert
    export async function upsertBulkAttendance(values: any) {
        try {
            console.log("inside upsertBulkAttendance", values);
          
            const { month, year, userId ,utcsec} = values;
            let startDate;
            let endDate;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = months.indexOf(month);
    
            startDate = new Date(year, monthIndex, 1);
            endDate = new Date(year, monthIndex + 1, 0);
    
            console.log("^^^^^^^^");
            console.log(startDate, "startDate");
            console.log(endDate, "endDate");
            console.log("^^^^^^^^");
            const today = new Date();
            today.getMonth() 

            let ar = [];
            let currentDate = new Date(startDate); // Initialize currentDate with startDate
    
            while (currentDate <= endDate) {
                const dateInMillis = currentDate.getTime();
    
                const record = {
                    userId,
                    date: dateInMillis,
                    signin: {
                        data: [
                            {
                                timeStamp: dateInMillis + 9 * 60 * 60 * 1000, // 9:00 AM UTC
                                lat: 0,
                                lng: 0,
                            },
                        ],
                    },
                    signout: {
                        data: [
                            {
                                timeStamp: dateInMillis + 18 * 60 * 60 * 1000, // 6:00 PM UTC
                                lat: 0,
                                lng: 0,
                            },
                        ],
                    },
                    isweekend: currentDate.getDay() === 0 || currentDate.getDay() === 6, // Sunday or Saturday
                    status: currentDate.getDay() === 0 || currentDate.getDay() === 6 ? "weekoff" : "present",
                    shift: {
                        shiftType: "GS",
                        shiftStart: "09:00",
                        shiftEnd: "18:00"
                    }
                };
    
                await upsertAttendanceRecord(record);    
                // Move to the next day
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return ar;
        } catch (error) {
            return error.message;
        }
    }
    

    async function upsertAttendanceRecord(record: any) {
        // Your upsert or insert logic goes here
        console.log("Upserting record:", record);
        let fieldNames = Object.keys(record)
        let fieldValues = Object.values(record)

        let querydata = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldValues.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
        let params = fieldValues;
        const result = await query(querydata, params);
        console.log(result.command, "record insert result");

    }

    // export async function updateAttendanceStatus(params: any) {
    //     //update all user attendance status,working hours, session timings

    //     console.log(params, "updateAttendanceStatus params");
    //     let attendanceDate = params.attendanceDate;
    //     try {
    //         let updatesqlCount = 0;
    //         let failuresqlCount = 0;
    //         let returnValue = {};
    //         let attendanceRecords;
    //         let result = await query(`SELECT * FROM attendances WHERE date = ${attendanceDate}`);
    //         console.log(result, "attendanceRecords");
    //         console.log('***********');
    //         console.log(result.rows);
    //         console.log('***********');
    //         if (result.rowCount > 0) {
    //             attendanceRecords = result.rows;
    //         } else {
    //             return { message: "No Records Found" }
    //         }
    //         if (attendanceRecords) {
    //             attendanceRecords.map(async (i: any) => {
    //                 console.log(i, "______________");

    //                 let updatedRecord1: any = await calculateAttendance(i)

    //                 console.log(updatedRecord1, "calculateAttendance result");
    //                 //remove uuid in updatedRecord1 for Update record


    //                 if (updatedRecord1) {
    //                     let { uuid, ...updatedRecord } = updatedRecord1;
    //                     returnValue = await sqlUpdate(updatedRecord)
    //                     console.log(returnValue, 'final Data is ');
    //                     return returnValue;
    //                 }
    //                 async function sqlUpdate(updatedRecord: any) {
    //                     let result = await callSQL(updatedRecord)
    //                     console.log(result, "result testAsync");
    //                     if (result.statusCode === 200) {
    //                         updatesqlCount = updatesqlCount + result.count
    //                     } else if (result.statusCode === 204) {
    //                         failuresqlCount = failuresqlCount + result.count
    //                     } else {
    //                         failuresqlCount = failuresqlCount + result.count
    //                     }
    //                     console.log(updatesqlCount);
    //                     return { success: updatesqlCount, failure: failuresqlCount };
    //                 }


    //             })
    //         }
    //         console.log(updatesqlCount, "updatesqlCount", failuresqlCount);
    //         let message = updatesqlCount && failuresqlCount ? `${updatesqlCount} Attendance Update successfully & ${failuresqlCount} Attendance Update Failure` :
    //             updatesqlCount ? `${updatesqlCount} Attendance Update successfully` : updatesqlCount ? `${failuresqlCount} Attendance Update Failure` : null
    //         return  returnValue;

    //     }
    //     catch (error) {
    //         console.log(error.message, "error updateAttendanceStatus");

    //     }

    // }

    export async function updateAttendanceStatus(params: any) {
        console.log(params, "updateAttendanceStatus params");
        let attendanceDate = params.attendanceDate;

        try {
            let updatesqlCount = 0;
            let failuresqlCount = 0;
            let returnValue = {};

            let result = await query(`SELECT * FROM attendances WHERE date = ${attendanceDate}`, {});
            console.log(result, "attendanceRecords");
            console.log('***********');
            console.log(result.rows);
            console.log('***********');

            if (result.rowCount > 0) {
                let attendanceRecords = result.rows;

                // Use Promise.all to wait for all asynchronous operations to complete
                const updatePromises = attendanceRecords.map(async (i: any) => {
                    console.log(i, "______________");
                    let updatedRecord1: any = await calculateAttendance(i)
                    console.log(updatedRecord1, "calculateAttendance result");

                    if (updatedRecord1) {
                        let { uuid, ...updatedRecord } = updatedRecord1;
                        return sqlUpdate(updatedRecord);
                    }


                });

                const updateResults = await Promise.all(updatePromises);

                // Aggregate results
                updateResults.forEach(result => {
                    if (result.statusCode === 200) {
                        updatesqlCount += result.count;
                    } else if (result.statusCode === 204) {
                        failuresqlCount += result.count;
                    } else {
                        failuresqlCount += result.count;
                    }
                });

                console.log(updatesqlCount, "updatesqlCount", failuresqlCount);

                returnValue = {
                    success: updatesqlCount,
                    failure: failuresqlCount,
                    message: updatesqlCount && failuresqlCount ? `${updatesqlCount} Attendance Update successfully & ${failuresqlCount} Attendance Update Failure` :
                        updatesqlCount ? `${updatesqlCount} Attendance Update successfully` :
                            failuresqlCount ? `${failuresqlCount} Attendance Update Failure` :
                                "No Records Found"
                };

            } else {
                return { message: "No Records Found" };
            }

            return returnValue;

        } catch (error) {
            console.log(error.message, "error updateAttendanceStatus");
        }
    }

    async function sqlUpdate(updatedRecord: any) {

        const fieldNames = Object.keys(updatedRecord);
        const fieldValues = Object.values(updatedRecord);
        console.log(fieldNames, "update Attendance fieldNames");
        console.log(fieldValues, "update Attendance  fieldValues");

        let querydata;
        let params: any[] = [];

        try {
            querydata = `UPDATE attendances SET ${fieldNames.map((field, index) => `${field} = $${index + 1}`).join(', ')} WHERE id = $${fieldNames.length + 1}`;
            params = [...fieldValues, updatedRecord.id];
            let result = await query(querydata, params);
            console.log(result, "upsert result");
            if (result.command === 'UPDATE' && result.rowCount > 0) {
                return ({ message: 'Attendance updated successfully', count: result.rowCount, statusCode: 200 });
            } else {
                return { message: 'Attendance Update Failure', count: 1, statusCode: 204 }
            }
        }
        catch (error) {
            return { error: error.message, count: 1 }
        }
    }

    async function calculateAttendance(item: any) {
        console.log(item, "calculateAttendance record");

        //calculate working hours
        let signIns = item.signin.data
        let signOuts = item.signout.data
        console.log(signIns, "signIns aaaaaaaaaaa");
        console.log(signOuts, "signOuts aaaaaaaaaaa");

        let dateA: any = new Date(signIns[0].timeStamp);
        let dateB: any = new Date(signOuts[0].timeStamp);
        let timeDifference = dateB - dateA;

        // Convert the time difference to hours

        let totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
        let totalMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

        console.log(totalHours, totalMinutes, "&&&&&&&&&")
        item.workinghours = {
            firstIn: signIns[0].timeStamp, lastOut: signOuts[0].timeStamp,
            totalWorkHours: {
                hours: totalHours,
                minutes: totalMinutes
            }
        }

        //session calculation

        console.log(typeof (item.date), "type of item.date");
        let sessionDate = new Date(Number(item.date))
        console.log(sessionDate, "sessionDate");
        sessionDate.setHours(13, 1, 0, 0)//set time as 13:01

        const session1EndTime = sessionDate.getTime();
        const signOutTime = dateB.getTime();
        const signInTime = dateA.getTime();

        console.log(session1EndTime, "session1EndTime sessioncalculation");
        console.log(signOutTime, "signOutTime sessioncalculation");
        console.log(signInTime, "signInTime sessioncalculation");

        if (signOutTime <= session1EndTime) {
            console.log("if signOutTime");
            item.session = {
                'session 1': {
                    sessionTimings: '09:00 - 13:00',
                    firstIn: signIns[0].timeStamp,
                    lastOut: signOuts[0].timeStamp
                },
                'session 2': { sessionTimings: '13:01 - 18:00', firstIn: null, lastOut: null }
            };
        }
        else if (signInTime >= session1EndTime) {
            console.log("else if");
            item.session = {
                'session 1': {
                    sessionTimings: '09:00 - 13:00',
                    firstIn: null,
                    lastOut: null
                },
                'session 2': {
                    sessionTimings: '13:01 - 18:00',
                    firstIn: signIns[0].timeStamp,
                    lastOut: signOuts[0].timeStamp
                }
            }
        }
        else {
            console.log("else signOutTime");
            item.session = {
                'session 1': {
                    sessionTimings: '09:00 - 13:00',
                    firstIn: signIns[0].timeStamp,
                    lastOut: null
                },
                'session 2': {
                    sessionTimings: '13:01 - 18:00',
                    firstIn: null,
                    lastOut: signOuts[0].timeStamp
                }
            };
        }

        //status update

        const isHoliday = item.isholiday;
        const isWeekend = item.isweekend;

        if (isHoliday) {
            item.status = { "value": "holiday", "label": "Holiday" };
        } else if (isWeekend) {
            item.status = { "value": "offfDay", "label": "Off Day" }
        } else {
            const hasSignIn = item.signin.data[0].timeStamp || item.signIn.data[0].timeStamp != null;
            if (hasSignIn) {
                item.status = { "value": "present", "label": "Present" }
            } else {
                item.status = { "value": "absent", "label": "Absent" }
            }
        }
        console.log(item, "item calculateAttendance");
        return item;
    }


    async function generateAttendanceData(values: any) {
        console.log(values, "generateAttendanceData");
        const allUsers: QueryResult = await query('SELECT * FROM users', []);
        console.log(allUsers, "allUsers get results");
        try {
            let successInsert = 0;
            let failureInsert = 0;
            let newDate = new Date();
            newDate.setHours(0, 5, 0, 0);
            let newDateUTC = newDate.getTime();
            console.log("*******");
            console.log(newDateUTC);
            console.log(typeof(newDateUTC));
            console.log("*******");
            for (const user of allUsers.rows) {
                try {
                    // Check if attendance record already exists for the user and date
                //    existingRecord
                    const existingRecord = await query(
                        'SELECT * FROM attendances WHERE userId = $1 AND date = $2',
                        [user.id, newDateUTC]
                    );
                    console.log(existingRecord, "existingRecord");

                    if (existingRecord.rows.length > 0) {
                        console.log("inside if");
                        console.log(`Attendance record already exists for user ${user.id} on ${new Date(newDateUTC).toISOString().split('T')[0]}`);
                        failureInsert++;
                    } else {
                        console.log("inside else");
                        let obj: any = {
                            date: Number(newDateUTC),
                            userId:  user.id,
                            signIn: { data: [{ "timeStamp": null, "lat": null, "lng": null }] },
                            signOut: { data: [{ "timeStamp": null, "lat": null, "lng": null }] },
                            shift: { "shiftType": "GS", "shiftStart": "09:00", "shiftEnd": "18:00" },
                            workingHours: { "firstIn": null, "lastOut": null, "totalWorkHours": null },
                            status: null,
                            isWeekend: newDate.getDay() === 0 || newDate.getDay() === 6,
                            isRegularized: false,
                            isHoliday: false,
                            session: '{"session 1":{"sessionTimings":"09:00 - 13:00","firstIn":null,"lastOut":null},"session 2":{"sessionTimings":"13:01 - 18:00","firstIn":null,"lastOut":null}}'
                        };

                        console.log(obj, "obj try");
                        const fieldNames = Object.keys(obj);
                        const fieldValues = Object.values(obj);

                        // Query for insert
                        let querydata = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldValues.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                        let params = fieldValues;
                        const result = await query(querydata, params);

                        console.log("&&&&&&&&&&");
                        console.log(result,"result");
                          console.log("&&&&&&&&&&");
                        console.log(result.rows,"result");
                        if (result.command === 'INSERT' || result.command === 'UPDATE') {
                            console.log(`Attendance record inserted for user ${user.id}`);
                            successInsert++;
                        } else {
                            console.log(`Failed to insert attendance record for user ${user.id}`);
                            failureInsert++;
                        }
                    }
                } catch (error) {
                    console.log(`Error processing user ${user.id}:`, error);
                    failureInsert++;
                }
            }

            console.log(successInsert, "success insert");
            console.log(failureInsert, "failure insert");
            return { success: successInsert, failure: failureInsert };
        } catch (error) {
            console.log(error, "catch error");
            return { success: 0, failure: allUsers.rows.length };
        }

    }


    export async function getAttendaceForMonthandYear(userId,Month,Year) {
        try {
            console.log(userId , Month ,Year)
            console.log("attendanceService call");
            let data : any =await getStartandEndTIme(Month,Year)
            console.log(data.startTime)
            const result: QueryResult = await query(`SELECT * FROM attendances where date >= ${ data.startTime} And date <=${data.endTime} And userId = ${Number(userId)}`,[]);
             console.log(result.rows, "query results");
              return result.rows
        } catch (error) {
            return error.message
        }
    }
}


/*import pool from "../../database/postgress.js";
import { QueryResult } from 'pg';

export module attendanceService {
        export async function getAttendanceDate(){
           try{
                console.log("attendanceService call");
                const result: QueryResult = await query('SELECT * FROM attendances');
                console.log(result, "query results");
                return result.rows
           }catch(error){
            return error.message
           }
        } 

        export async function upsertAttendance(values:any) {
            try{
                let attendanceData = await generateAttendanceData(values)
                console.log("attendanceData");
                console.log(attendanceData,"attendanceData");
                let message = attendanceData.success>0 &&attendanceData.failure>0 ?
                `${attendanceData.success}Attendace Inserted Succesfully ,
                ${attendanceData.success}Attendace Insert failure`
                :attendanceData.success === 0 && attendanceData  `Attendace Updated Succesfully`
                return message
            }catch(error){
                return error.message
            }
        }

        async function generateAttendanceData(values:any){
            console.log(values,"generateAttendanceData");
            const allUsers: QueryResult = await query('SELECT * FROM users');
            console.log(allUsers, "allUsers get results");

           
                try{

                    let result ;
                    let successInsert =[];
                    let failureInsert = [];

                    for (const user of allUsers.rows) {
                        let newDate = new Date();
                        newDate.setHours(0, 5, 0, 0);
                
                        let obj: any = {};
                        obj.date = newDate.getTime();
                        obj.employeeDetails = { "employeeName": user.username, "employeeuuId": user.uuid, "employeeId": user.id };
                        obj.signIn = '[{"timeStamp":null,"lat":null,"lng":null}]';
                        obj.signOut = '[{"timeStamp":null,"lat":null,"lng":null}]';
                        obj.shift = '{ "shiftType": "GS", "shiftStart": "09:00", "shiftEnd": "18:00" }';
                        obj.workingHours = '{ "firstIn": null, "lastOut": null, "totalWorkHours": null }';
                        obj.status = '{}';
                        obj.isWeekend = newDate.getDay() === 0 || newDate.getDay() === 6;
                        obj.isRegularized = false;
                        obj.isHoliday = false;
                        obj.session = '{"session 1":{"sessionTimings":"09:00 - 13:00","firstIn":null,"lastOut":null},"session 2":{"sessionTimings":"13:01 - 18:00","firstIn":null,"lastOut":null}}';

                    // const fieldNames = Object.keys(obj);
                    const fieldValues = Object.values(obj);
                    console.log(obj,"obj try");
                    // console.log(fieldNames,"fieldNames try");
                    console.log(fieldValues,"fieldValues try");

                 
                //     console.log(result, "upsert result");
            //     const result = await query(`
            //     INSERT INTO attendances (date, employeeDetails, signIn, signOut, shift, workingHours, status, isWeekend, isRegularized, isHoliday, session)
            //     VALUES ($1, $2::json, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            //     RETURNING *
            // `, fieldValues);
            const fieldNames = Object.keys(obj);
            const placeholders = fieldNames.map((_, index) => `$${index + 1}`);
            // const query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;

            //  result = await query(query, fieldValues);
            let query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
            let params = fieldValues;
              result = await query(query,params)

             if(result.command ==='INSERT' || result.command ==='UPDATE'){
                successInsert.push(result)
             }else{
                failureInsert.push(result)
             }
            
                    }
                console.log(result, "resultInsert");
                console.log(successInsert.length,"sucess insert");
                console.log(failureInsert.length,"failure insert");
                 return {sucess :successInsert.length,failure :failureInsert.length  }
            }
            
                catch(error){
                    console.log(error,"catch error");
                    return error
                }       
            

            
        }
}

*/