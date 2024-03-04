import { QueryResult } from "pg";
import { query } from "../../database/postgress.js";
import { getStartandEndTIme } from "../../utils/HRMS/getStarttimeandEndTIme.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ExcelJS from 'exceljs'
import { getSingleUser } from "../../controllers/HRMS/user.Controller.js";
import { userService } from "./user.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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


    // non template function
    // export async function excelGenearator(request ,reply) {
    //     try {
    //         const data = request.body
    //         const workbook = new ExcelJS.Workbook();
    //         const worksheet = workbook.addWorksheet('Timesheet');
    //         // Define column headers
    //         worksheet.columns = [
    //         //   { header: 'S.No', key: 'sno', width: 10 },
    //           { header: 'Date', key: 'date', width: 10 },
    //           { header: 'Hours', key: 'hours', width: 10 },
    //           { header: 'Task Name', key: 'taskName', width: 20 },
    //           { header: 'Project Name', key: 'projectName', width: 20 },
    //           { header: 'Task Description', key: 'taskDescription', width: 30 }
    //         ];

    //         // Add data rows
    //         data.forEach(entry => {
    //           const dataset = new Date(Number(entry.date))
    //           const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`
    //           entry.timesheetdata.data.forEach((row, index) => {
    //             worksheet.addRow({
    //             //   sno: index + 1,
    //               date: datevalue,
    //               hours: row.hours,
    //               taskName: row.taskName,
    //               projectName: row.porjectName,
    //               taskDescription: row.taskdescription
    //             });
    //           });
    //         });

    //         // Generate a unique filename for the Excel file
    //         const fileName = `timesheet_${Date.now()}.xlsx`;
    //         const filePath = path.join(__dirname, '../../../uploads', fileName);

    //         // Save the workbook to a file
    //         await workbook.xlsx.writeFile(filePath);
    //         const fileUrl = `${request.protocol}://${request.headers.host}/${fileName}`;

    //         // Send the generated Excel file back to the client
    //         reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
    //         reply.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //         reply.send(fileUrl);
    //       } catch (error) {
    //         console.error('Error generating Excel file:', error);
    //         reply.code(500).send('Error generating Excel file');
    //       }
    // }


    //// template single record function

    //     export async function excelGenearator(request, reply) {
    //         try {
    //             const data = request.body;

    //             // Load the template Excel file
    //             const templatePath = path.join(__dirname, '../../../excel/Timesheet_Template.xlsx');
    //             const workbook = new ExcelJS.Workbook();
    //             await workbook.xlsx.readFile(templatePath);
    //             const worksheet = workbook.getWorksheet('sheet1');
    //             console.log(worksheet, 'WORK SHEETS');
    //             if (!worksheet) {
    //                 console.error('Worksheet not found');
    //                 reply.code(500).send('Worksheet not found');
    //                 return;
    //             }
    //         //  let dta =    worksheet. getRow(6).values
    //         //  console.log(dta ,'Data set reand');


    //         //     // Add data rows
    //         //     data.forEach(entry => {
    //         //         const dataset = new Date(Number(entry.date));
    //         //         const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`;
    //         //         entry.timesheetdata.data.forEach((row, index) => {
    //         //             worksheet.addRow({
    //         //                 date: datevalue,
    //         //                 "No. of Hours": row.hours,
    //         //                 "Task Type": row.taskName,
    //         //                 projectName: row.porjectName, // Corrected typo in property name
    //         //                 "Task Description": row.taskdescription // Corrected typo in property name
    //         //             });
    //         //         });
    //         //     });

    //         const headersRow = worksheet.getRow(6); // Assuming headers are in the first row
    // console.log(headersRow.values,'Header Row');
    // headersRow.values.forEach((e,index)=>{
    //     console.log(e);
    //     console.log(index);
    // })
    // // Find the indices of the headers you want to bind data to
    // let hoursIndex = headersRow.values.findIndex(header => header === 'No. of Hours');
    // let taskTypeIndex = headersRow.values.findIndex(header => header === 'Task Type');
    // let taskDescriptionIndex = headersRow.values.findIndex(header => header === 'Task Description'); 
    // let dateIndex = headersRow.values.findIndex(header => header === 'Date (dd/mm/yy)');
    // hoursIndex = hoursIndex -1
    // taskTypeIndex = taskTypeIndex -1
    // taskDescriptionIndex = taskDescriptionIndex-1
    // dateIndex = dateIndex-1
    // console.log(hoursIndex ,'Hours Index');
    // console.log(taskTypeIndex ,'Task Type Index');
    // console.log(taskDescriptionIndex ,'taskDescriptionIndex Index');
    // console.log(dateIndex ,'date Index');
    // // Iterate through the data and bind values to the respective columns
    // data.forEach((entry, entryIndex) => {
    //     const dataset = new Date(Number(entry.date));
    //     const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`;

    //     entry.timesheetdata.data.forEach((row, rowIndex) => {
    //         // Add data row
    //         const targetRowIndex = headersRow.number + 1 + rowIndex; // Add 1 to skip the header row
    // row.date = datevalue
    //         const newRow = worksheet.addRow({
    //             date: row.date,
    //             hours: row.hours,
    //             taskName: row.taskName,
    //             projectName: row.porjectName,
    //             taskDescription: row.taskdescription
    //         },targetRowIndex);

    //         // Calculate the row index where data is inserted
    //         // const targetRowIndex = newRow.number;

    //         // Bind values to respective columns
    //         if (hoursIndex !== -1) {
    //             console.log('if hoursIndex');
    //             console.log(row.hours ,'before hours');

    //             worksheet.getCell(`${String.fromCharCode(65 + hoursIndex)}${targetRowIndex}`).value = row.hours;
    //             console.log(row.hours ,'after hours');

    //         }

    //         if (taskTypeIndex !== -1) {
    //             console.log('if taskTypeIndex'); 
    //             console.log(row.taskName ,'before taskName');
    //             console.log(targetRowIndex ,'target row index');
    //             worksheet.getCell(`${String.fromCharCode(65 + taskTypeIndex)}${targetRowIndex}`).value = row.taskName;
    //             console.log(row.taskName ,'after taskName');
    //         }
    //         if (taskDescriptionIndex !== -1) {
    //             console.log('if taskDescriptionIndex'); 
    //             console.log(row.taskdescription ,'before taskDescriptionIndex');
    //             console.log(targetRowIndex ,'target row index');
    //             worksheet.getCell(`${String.fromCharCode(65 + taskDescriptionIndex)}${targetRowIndex}`).value = row.taskdescription;
    //             console.log(row.taskdescription ,'after taskDescriptionIndex');
    //         }
    //         if (dateIndex !== -1) {
    //             console.log('if date'); 
    //             console.log(row.date ,'before datevalue');
    //             console.log(targetRowIndex ,'target row index');
    //             worksheet.getCell(`${String.fromCharCode(65 + dateIndex)}${targetRowIndex}`).value = row.date;
    //             console.log(row.date ,'after datevalue');
    //         }
    //     });
    // });

    //             // Generate a unique filename for the Excel file
    //             const fileName = `timesheet_${Date.now()}.xlsx`;
    //             const filePath = path.join(__dirname, '../../../uploads', fileName);

    //             // Save the modified workbook to a new file
    //             await workbook.xlsx.writeFile(filePath);
    //             const fileUrl = `${request.protocol}://${request.headers.host}/${fileName}`;

    //             // Send the generated Excel file back to the client
    //             reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
    //             reply.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //             reply.send(fileUrl);
    //         } catch (error) {
    //             console.error('Error generating Excel file:', error);
    //             reply.code(500).send('Error generating Excel file');
    //         }
    //     }

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

    //template function  workded important 
    export async function excelGenearator(request, reply) {
        try {
            const { userId } = request.params;
            const getUser = await userService.getSingleUser(userId)
            const { employeeid, firstname, lastname, department, phone, joiningdate, designation } = getUser[0];
            const UserJoiningDate = new Date(Number(joiningdate));
            const UserJoiningDateValue = `${UserJoiningDate.getDate()}/${UserJoiningDate.getMonth() + 1}/${UserJoiningDate.getFullYear()}`;
            // console.log(UserJoiningDateValue, 'UserJoiningDateValue');
            // console.log(getUser, 'Got user Data');
            // console.log(userId, 'User Id is ');
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


            const data = request.body;
            const templatePath = path.join(__dirname, '../../../excel/Timesheet_Template.xlsx');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(templatePath);
            const worksheet = workbook.getWorksheet('sheet1');

            if (!worksheet) {
                console.error('Worksheet not found');
                reply.code(500).send('Worksheet not found');
                return;
            }

            const headersRow = worksheet.getRow(6); // Assuming headers are in the sixth row
            const headersRowEmployeedataone = worksheet.getRow(2);
            const headersRowEmployeedatatwo = worksheet.getRow(3);
            const headersRowEmployeedatathree = worksheet.getRow(4);
            const prepbyNameandDayworked = worksheet.getRow(51);
            const prepbysignatureandHolidays = worksheet.getRow(52);
            const prepbyDateandLeaves = worksheet.getRow(53);
            //  console.log(headersRowEmployeedataone ,'headersRowEmployeedataone');
            //  console.log(headersRowEmployeedatatwo ,'Employee data');
            //  console.log(headersRowEmployeedatatwo ,'headersRowEmployeedatatwo');

            // Find the indices of the headers you want to bind data to
            let hoursIndex = headersRow?.values?.findIndex(header => header === 'No. of Hours') - 1;
            let serialIndex = headersRow?.values?.findIndex(header => header === 'Sl. No.') - 1;
            let taskTypeIndex = headersRow?.values?.findIndex(header => header === 'Task Type') - 1;
            let taskDescriptionIndex = headersRow?.values?.findIndex(header => header === 'Task Description') - 1;
            let dateIndex = headersRow?.values?.findIndex(header => header === 'Date (dd/mm/yy)') - 1;
            let dayIndex = headersRow?.values?.findIndex(header => header === 'Day') - 1;
            let employeeIdindex = headersRowEmployeedataone?.values?.findIndex(header => header === 'Employee Id') - 1;
            let employeeNameIndex = headersRowEmployeedatatwo?.values?.findIndex(header => header === 'Employee Name') - 1;
            let TechnologyIndex = headersRowEmployeedatathree?.values?.findIndex(header => header === 'Technology') - 1;
            let employeeContactNumberIndex = headersRowEmployeedataone?.values?.findIndex(header => header === 'Contact number:') - 1;
            let employeeDateofJoiningIndex = headersRowEmployeedatatwo?.values?.findIndex(header => header === 'Date of Joining:') - 1;
            let employeeDesignationIndex = headersRowEmployeedatathree?.values?.findIndex(header => header === 'Designation:') - 1;
            let prepbyNameIndex = prepbyNameandDayworked?.values?.findIndex(header => header === 'Name:') - 1;
            let dayWorkedIndex = prepbyNameandDayworked?.values?.findIndex(header => header === 'Days worked') - 1;
            let prepbySignIndex = prepbysignatureandHolidays?.values?.findIndex(header => header === 'Signature') - 1;
            let holidayIndex = prepbysignatureandHolidays?.values?.findIndex(header => header === 'Holidays') - 1;
            let prepbyDateIndex = prepbyDateandLeaves?.values?.findIndex(header => header === 'Date:') - 1;
            let LeaveWorkedIndex = prepbyDateandLeaves?.values?.findIndex(header => header === 'Leaves') - 1;
            console.log(employeeIdindex, 'Employee ID');
            console.log(employeeNameIndex, 'employeeName');
            console.log(TechnologyIndex, 'Technology');
            console.log(employeeDateofJoiningIndex, 'employeeDateofJoining');
            console.log(employeeContactNumberIndex, 'employeeContactNumber');
            console.log(employeeDesignationIndex, 'employeeDesignation');
            console.log(prepbyNameIndex, 'prepbyNameIndex');
            console.log(headersRowEmployeedataone.number + 1, 'GOt Number');
            // hoursIndex = hoursIndex - 1
            // taskTypeIndex = taskTypeIndex - 1
            // taskDescriptionIndex = taskDescriptionIndex - 1
            // dateIndex = dateIndex - 1

            let startingRowIndex: any = headersRow.number + 1;
            console.log(hoursIndex);
            console.log(taskTypeIndex);
            console.log(taskDescriptionIndex);
            console.log(dateIndex);
            let serialvalue = 1
            const options :any = { day: 'numeric', month: 'numeric', year: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-GB', options);
            console.log(formattedDate);
            // Iterate through the data and bind values to the respective columns
            data.forEach((entry, indexdata) => {
                const dataset = new Date(Number(entry.date));
                console.log(dataset.getDay(), 'day is ');
                const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`;
                const currentDayOfWeek = daysOfWeek[dataset.getDay()];
                console.log(datevalue, 'day Value is ');
                entry.timesheetdata.data.forEach((row, rowIndex) => {
                    serialvalue = serialvalue
                    row.serial = serialvalue
                    row.date = datevalue
                    row.day = currentDayOfWeek
                    console.log(row.day, 'Current Day  of weeek');
                    serialvalue = serialvalue + 1
                    const newRow = worksheet.addRow({
                        serial: row.serial,
                        date: row.date,
                        day: row.day,
                        hours: row.hours,
                        taskName: row.taskName,
                        projectName: row.porjectName,
                        taskDescription: row.taskdescription
                    }, startingRowIndex);

                    // Bind values to respective columns
                    if (hoursIndex !== -1) {

                        worksheet.getCell(`${String.fromCharCode(65 + hoursIndex)}${startingRowIndex}`).value = row.hours;
                    }

                    if (taskTypeIndex !== -1) {
                        worksheet.getCell(`${String.fromCharCode(65 + taskTypeIndex)}${startingRowIndex}`).value = row.taskName;
                    }

                    if (taskDescriptionIndex !== -1) {
                        worksheet.getCell(`${String.fromCharCode(65 + taskDescriptionIndex)}${startingRowIndex}`).value = row.taskdescription;
                    }

                    if (dateIndex !== -1) {
                        worksheet.getCell(`${String.fromCharCode(65 + dateIndex)}${startingRowIndex}`).value = row.date;
                    }
                    if (dayIndex !== -1) {
                        worksheet.getCell(`${String.fromCharCode(65 + dayIndex)}${startingRowIndex}`).value = row.day;
                    }
                    if (serialIndex !== -1) {
                        worksheet.getCell(`${String.fromCharCode(65 + serialIndex)}${startingRowIndex}`).value = row.serial;
                    }

                    if (employeeIdindex !== -1) {
                        console.log('employee Id ');
                        console.log(headersRowEmployeedataone.number + 1);
                        worksheet.getCell(`E2`).value = employeeid;
                    }
                    if (employeeNameIndex !== -1) {
                        console.log('employeeNameIndex Id ');
                        worksheet.getCell(`E3`).value = `${firstname} ${lastname}`;
                    }
                    if (prepbyNameIndex !== -1) {
                        console.log('prepbyNameIndex Id ');
                        worksheet.getCell(`C51`).value = `${firstname} ${lastname}`;
                    }
                    if (dayWorkedIndex !== -1) {
                        console.log('dayWorkedIndex Id ');
                        worksheet.getCell(`H51`).value = ``;
                    }
                    if (prepbySignIndex !== -1) {
                        console.log('prepbySignIndex Id ');
                        worksheet.getCell(`C52`).value = `${firstname} ${lastname}`;
                    }
                    if (holidayIndex !== -1) {
                        console.log('holidayIndex Id ');
                        worksheet.getCell(`H52`).value = ``;
                    }
                    if (prepbyDateIndex !== -1) {
                        console.log('prepbyDateIndex Id ');
                        worksheet.getCell(`C53`).value = formattedDate;
                    }
                    if (LeaveWorkedIndex !== -1) {
                        console.log('LeaveWorkedIndex Id ');
                        worksheet.getCell(`H53`).value = ``;
                    }
                    if (TechnologyIndex !== -1) {
                        console.log('employee Id ');
                        console.log(headersRowEmployeedataone.number + 1);
                        worksheet.getCell(`E4`).value = department;
                    }

                    if (employeeContactNumberIndex !== -1) {
                        console.log('employeeContactNumberIndexd ');
                        console.log(headersRowEmployeedataone.number + 1);
                        worksheet.getCell(`H2`).value = phone;
                    }
                    if (employeeDateofJoiningIndex !== -1) {
                        console.log('employeeDateofJoiningIndex');
                        worksheet.getCell(`H3`).value = UserJoiningDateValue;
                    }
                    if (employeeDesignationIndex !== -1) {
                        console.log('employeeDesignationIndex ');
                        console.log(headersRowEmployeedataone.number + 1);
                        worksheet.getCell(`H4`).value = designation;
                    }

                    startingRowIndex++;
                });
            });

            // Generate a unique filename for the Excel file
            const fileName = `timesheet_${Date.now()}.xlsx`;
            const filePath = path.join(__dirname, '../../../uploads', fileName);

            // Save the modified workbook to a new file
            await workbook.xlsx.writeFile(filePath);
            const fileUrl = `${request.protocol}://${request.headers.host}/${fileName}`;

            // Send the generated Excel file back to the client
            reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
            reply.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            reply.send(fileUrl);
        } catch (error) {
            console.error('Error generating Excel file:', error);
            reply.code(500).send('Error generating Excel file');
        }
    }


    // export async function excelGenearator(request, reply) {
    //     try {
    //         const data = request.body;
    //         const templatePath = path.join(__dirname, '../../../excel/Timesheet_Template.xlsx');
    //         const workbook = new ExcelJS.Workbook();
    //         await workbook.xlsx.readFile(templatePath);
    //         const worksheet = workbook.getWorksheet('sheet1');

    //         if (!worksheet) {
    //             console.error('Worksheet not found');
    //             reply.code(500).send('Worksheet not found');
    //             return;
    //         }

    //         const headersRow = worksheet.getRow(6); // Assuming headers are in the sixth row

    //         // Find the indices of the headers you want to bind data to
    //         let hoursIndex = headersRow.values.findIndex(header => header === 'No. of Hours') - 1;
    //         let taskTypeIndex = headersRow.values.findIndex(header => header === 'Task Type') - 1;
    //         let taskDescriptionIndex = headersRow.values.findIndex(header => header === 'Task Description') - 1;
    //         let dateIndex = headersRow.values.findIndex(header => header === 'Date (dd/mm/yy)') - 1;

    //         // Find the starting row index to add new data
    //         let startingRowIndex = headersRow.number + 1;

    //         // Find the last row of existing data
    //         let lastRow = worksheet.lastRow;
    //         let lastDataRowIndex = lastRow ? lastRow.number : startingRowIndex;

    //         // Calculate available space between the last row of data and the footer
    //         let footerRowIndex = lastDataRowIndex + 1; // Assuming footer is right below the last data row
    //         let availableSpace = worksheet.rowCount - footerRowIndex;

    //         // Iterate through the data and bind values to the respective columns
    //         data.forEach((entry) => {
    //             const dataset = new Date(Number(entry.date));
    //             const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`;

    //             entry.timesheetdata.data.forEach((row:any, rowIndex:any) => {
    //                 row.date = datevalue;

    //                 // If available space is less than the number of rows to be added, insert additional rows
    //                 if (availableSpace <= rowIndex) {
    //                     worksheet.spliceRows(footerRowIndex, 0, rowIndex - availableSpace + 1);
    //                     availableSpace = worksheet.rowCount - footerRowIndex;
    //                 }

    //                 const newRow = worksheet.getRow(startingRowIndex);

    //                 // Bind values to respective columns
    //                 if (hoursIndex !== -1) {
    //                     newRow.getCell(hoursIndex + 1).value = row.hours;
    //                 }

    //                 if (taskTypeIndex !== -1) {
    //                     newRow.getCell(taskTypeIndex + 1).value = row.taskName;
    //                 }

    //                 if (taskDescriptionIndex !== -1) {
    //                     newRow.getCell(taskDescriptionIndex + 1).value = row.taskdescription;
    //                 }

    //                 if (dateIndex !== -1) {
    //                     newRow.getCell(dateIndex + 1).value = row.date;
    //                 }

    //                 startingRowIndex++;
    //             });
    //         });

    //         // Generate a unique filename for the Excel file
    //         const fileName = `timesheet_${Date.now()}.xlsx`;
    //         const filePath = path.join(__dirname, '../../../uploads', fileName);

    //         // Save the modified workbook to a new file
    //         await workbook.xlsx.writeFile(filePath);
    //         const fileUrl = `${request.protocol}://${request.headers.host}/${fileName}`;

    //         // Send the generated Excel file back to the client
    //         reply.header('Content-Disposition', `attachment; filename="${fileName}"`);
    //         reply.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //         reply.send(fileUrl);
    //     } catch (error) {
    //         console.error('Error generating Excel file:', error);
    //         reply.code(500).send('Error generating Excel file');
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
                console.log(data.timeSheetdata.data, 'data value is ');
                data.timeSheetdata.data.forEach((s) => {
                    totalHours = Number(s.hours) + totalHours
                })
                console.log(totalHours, 'Total Hpurs new insert');
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
