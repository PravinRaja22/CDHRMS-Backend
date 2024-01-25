import pool from "../../database/postgress.js";
import { QueryResult } from 'pg';

export module attendanceService {
    export async function getAttendanceDate() {
        try {
            console.log("attendanceService call");
            const result: QueryResult = await pool.query('SELECT * FROM attendances');
            console.log(result, "query results");
            return result.rows
        } catch (error) {
            return error.message
        }
    }

    export async function upsertAttendance(values: any) {
        try {
            let attendanceData = await generateAttendanceData(values)
            console.log("attendanceData");
            console.log(attendanceData, "attendanceData");
            let message = attendanceData.success > 0 && attendanceData.failure > 0 ?
                `${attendanceData.success}Attendace Inserted Succesfully ,
                ${attendanceData.success}Attendace Insert failure`
                : attendanceData.success === 0 && attendanceData.failure>0 ?` ${attendanceData.failure} Attendace Insert failure`
                :`${attendanceData.success}Attendace Inserted Succesfully`

            return message
        } catch (error) {
            return error.message
        }
    }

    export async function updateAttendance(params:any,body:any){
        console.log(params,"params updateAttendance service");
        console.log(body,"body updateAttendance service");

        const existingRecord = await pool.query(
            'SELECT * FROM attendances WHERE employeeDetails->>\'employeeId\' = $1 AND date = $2',
            [params.userId, params.attendanceDate]
        )

        console.log(existingRecord,"existingRecord updateAttendance");
        console.log(existingRecord.rows[0].signin,"first record");
        let isFirst = Object.keys(existingRecord.rows[0].signin).length ===1 ?true:false
        console.log(isFirst,"isFirst");
        

    }

    async function generateAttendanceData(values: any) {
        console.log(values, "generateAttendanceData");
        const allUsers: QueryResult = await pool.query('SELECT * FROM users');
        console.log(allUsers, "allUsers get results");
        try {
            let successInsert = 0;
            let failureInsert = 0;
            let newDate = new Date();
            newDate.setHours(0, 5, 0, 0);
            let newDateUTC = newDate.getTime();
    
            for (const user of allUsers.rows) {
                try {
                    // Check if attendance record already exists for the user and date
                    const existingRecord = await pool.query(
                        'SELECT * FROM attendances WHERE employeeDetails->>\'employeeId\' = $1 AND date = $2',
                        [user.id, newDateUTC]
                    );
                        console.log(existingRecord,"existingRecord");

                    if (existingRecord.rows.length > 0) {
                        console.log("inside if");
                        console.log(`Attendance record already exists for user ${user.id} on ${new Date(newDateUTC).toISOString().split('T')[0]}`);
                        failureInsert++;
                    }else{
                        console.log("inside else");
                    let obj: any = {
                        date: newDateUTC,
                        employeeDetails: { "employeeName": user.username, "employeeuuId": user.uuid, "employeeId": user.id },
                        signIn: '[{"timeStamp":null,"lat":null,"lng":null}]',
                        signOut: '[{"timeStamp":null,"lat":null,"lng":null}]',
                        shift: '{ "shiftType": "GS", "shiftStart": "09:00", "shiftEnd": "18:00" }',
                        workingHours: '{ "firstIn": null, "lastOut": null, "totalWorkHours": null }',
                        status: '{}',
                        isWeekend: newDate.getDay() === 0 || newDate.getDay() === 6,
                        isRegularized: false,
                        isHoliday: false,
                        session: '{"session 1":{"sessionTimings":"09:00 - 13:00","firstIn":null,"lastOut":null},"session 2":{"sessionTimings":"13:01 - 18:00","firstIn":null,"lastOut":null}}'
                    };
    
                    console.log(obj, "obj try");
                    const fieldNames = Object.keys(obj);
                    const fieldValues = Object.values(obj);
    
                    // Query for insert
                    let query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldValues.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
                    let params = fieldValues;
                    const result = await pool.query(query, params);
    
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
        // try {
        //     let result;
        //     let successInsert = [];
        //     let failureInsert = [];
        //     let newDate = new Date();
        //     newDate.setHours(0, 5, 0, 0);
        //     let newDateUTC = newDate.getTime() 
        //     for (const user of allUsers.rows) {             
        //         let obj: any = {};
        //         obj.date = newDateUTC;
        //         obj.employeeDetails = { "employeeName": user.username, "employeeuuId": user.uuid, "employeeId": user.id };
        //         obj.signIn = '[{"timeStamp":null,"lat":null,"lng":null}]';
        //         obj.signOut = '[{"timeStamp":null,"lat":null,"lng":null}]';
        //         obj.shift = '{ "shiftType": "GS", "shiftStart": "09:00", "shiftEnd": "18:00" }';
        //         obj.workingHours = '{ "firstIn": null, "lastOut": null, "totalWorkHours": null }';
        //         obj.status = '{}';
        //         obj.isWeekend = newDate.getDay() === 0 || newDate.getDay() === 6;
        //         obj.isRegularized = false;
        //         obj.isHoliday = false;
        //         obj.session = '{"session 1":{"sessionTimings":"09:00 - 13:00","firstIn":null,"lastOut":null},"session 2":{"sessionTimings":"13:01 - 18:00","firstIn":null,"lastOut":null}}';

        //         console.log(obj, "obj try");
        //         const fieldNames = Object.keys(obj);
        //         const fieldValues = Object.values(obj);

        //         //query for insert 
        //         let query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
        //         let params = fieldValues;
        //         result = await pool.query(query, params)

        //         if (result.command === 'INSERT' || result.command === 'UPDATE') {
        //             successInsert.push(result)
        //         } else {
        //             failureInsert.push(result)
        //         }
        //     }
        //     console.log(result, "resultInsert");
        //     console.log(successInsert.length, "sucess insert");
        //     console.log(failureInsert.length, "failure insert");
        //     return { sucess: successInsert.length, failure: failureInsert.length }
        // }
        // catch (error) {
        //     console.log(error, "catch error");
        //     return error
        // }
    }
}


/*import pool from "../../database/postgress.js";
import { QueryResult } from 'pg';

export module attendanceService {
        export async function getAttendanceDate(){
           try{
                console.log("attendanceService call");
                const result: QueryResult = await pool.query('SELECT * FROM attendances');
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
            const allUsers: QueryResult = await pool.query('SELECT * FROM users');
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
            //     const result = await pool.query(`
            //     INSERT INTO attendances (date, employeeDetails, signIn, signOut, shift, workingHours, status, isWeekend, isRegularized, isHoliday, session)
            //     VALUES ($1, $2::json, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            //     RETURNING *
            // `, fieldValues);
            const fieldNames = Object.keys(obj);
            const placeholders = fieldNames.map((_, index) => `$${index + 1}`);
            // const query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;

            //  result = await pool.query(query, fieldValues);
            let query = `INSERT INTO attendances (${fieldNames.join(', ')}) VALUES (${fieldNames.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
            let params = fieldValues;
              result = await pool.query(query,params)

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