import { QueryResult } from "pg";
import { query } from "../../database/postgress.js";
import { getStartandEndTIme } from "../../utils/HRMS/getStarttimeandEndTIme.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import ExcelJS from 'exceljs'
import { userService } from "./user.service.js";
import { attendanceService } from "./attendance.service.js";
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
    export async function excelGenearator(request, reply) {
        try {
            const { userId, Year, Month } = request.params;
            const getUser = await userService.getSingleUser(userId)
            console.log(Month, "Month");
            console.log(Year, "Year");
            console.log(userId, 'User ID');
            console.log(request.params);
            const getAttendace = await attendanceService.caculateAttendaceForMonth(Month, Year, userId)
            console.log(getAttendace, "Get Attendance data set");
            const { totaldays, noOfPresentDays, noOfLeaveDays, nofoLopDays, noofWeekofDays } = getAttendace
            const { employeeid, firstname, lastname, department, phone, joiningdate, designation } = getUser[0];
            const UserJoiningDate = new Date(Number(joiningdate));
            const UserJoiningDateValue = `${UserJoiningDate.getDate()}/${UserJoiningDate.getMonth() + 1}/${UserJoiningDate.getFullYear()}`;
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const data = request.body;
            const templatePath = path.join(__dirname, '../../../excel/Timesheet_Template.xlsx');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(templatePath);
            const worksheet = workbook.getWorksheet('sheet1');

            if (!worksheet) {
                console.error('Worksheet not found');
                reply.code(500).send('Worksheet not found');
                return 'file Not Availble please contact admin';
            }

            const headersRow = worksheet.getRow(6); // Assuming headers are in the sixth row
            const headersRowEmployeedataone = worksheet.getRow(2);
            const headersRowEmployeedatatwo = worksheet.getRow(3);
            const headersRowEmployeedatathree = worksheet.getRow(4);
            const prepbyNameandDayworked = worksheet.getRow(51);
            const prepbysignatureandHolidays = worksheet.getRow(52);
            const prepbyTotalDays = worksheet.getRow(90);
            const prepbyDateandLeaves = worksheet.getRow(53);
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
            let totalDaysIndex = prepbyTotalDays?.values?.findIndex(header => header === 'Total') - 1;
            let startingRowIndex: any = headersRow.number + 1;

            let serialvalue = 1
            const options: any = { day: 'numeric', month: 'numeric', year: 'numeric' };
            const formattedDate = new Date().toLocaleDateString('en-GB', options);
            let previousDate;
            // Iterate through the data and bind values to the respective columns
            data.forEach((entry, indexdata) => {
                const dataset = new Date(Number(entry.date));
                const datevalue = `${dataset.getDate()}/${dataset.getMonth() + 1}/${dataset.getFullYear()}`;
                const currentDayOfWeek = daysOfWeek[dataset.getDay()];
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
                        const cell = worksheet.getCell(`${String.fromCharCode(65 + taskDescriptionIndex)}${startingRowIndex}`);
                        cell.value = row.taskdescription;
                        cell.alignment = { wrapText: true };
                        // Calculate the height needed for the content
                        const text = row.taskdescription;
                        const wrapCount = text.length;
                        const estimatedLineHeight = 11; // Adjust this value based on your font and font size
                        const textHeight = (wrapCount * estimatedLineHeight)/50;
                        // Set the row height based on the content size
                        const currentRow = worksheet.getRow(startingRowIndex);
                        const currentRowHeight = currentRow.height;
                        const newRowHeight = Math.max(currentRowHeight, textHeight);
                        currentRow.height = newRowHeight;
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
                        worksheet.getCell(`E2`).value = employeeid;
                    }
                    if (employeeNameIndex !== -1) {
                        worksheet.getCell(`E3`).value = `${firstname} ${lastname}`;
                    }
                    if (prepbyNameIndex !== -1) {
                        console.log('prepbyNameIndex Id ');
                        worksheet.getCell(`C87`).value = `${firstname} ${lastname}`;
                    }
                    if (dayWorkedIndex !== -1) {
                        worksheet.getCell(`H87`).value = noOfPresentDays;
                    }
                    if (prepbySignIndex !== -1) {
                        worksheet.getCell(`C88`).value = `${firstname} ${lastname}`;
                    }
                    if (holidayIndex !== -1) {
                        worksheet.getCell(`H88`).value = noofWeekofDays;
                    }
                    if (prepbyDateIndex !== -1) {
                        worksheet.getCell(`C89`).value = formattedDate;
                    }
                    if (LeaveWorkedIndex !== -1) {
                        worksheet.getCell(`H89`).value = noOfLeaveDays;
                    }
                    if (totalDaysIndex !== -1) {
                        worksheet.getCell(`H90`).value = totaldays;
                    }
                    if (TechnologyIndex !== -1) {
                        worksheet.getCell(`E4`).value = department;
                    }

                    if (employeeContactNumberIndex !== -1) {
                        worksheet.getCell(`H2`).value = phone;
                    }
                    if (employeeDateofJoiningIndex !== -1) {
                        worksheet.getCell(`H3`).value = UserJoiningDateValue;
                    }
                    if (employeeDesignationIndex !== -1) {
                        worksheet.getCell(`H4`).value = designation;
                    }
                    startingRowIndex++;
                });
            });
            // Generate a unique filename for the Excel file
            const fileName = `${employeeid}_${firstname}_timesheet_${Month}_${Year}.xlsx`;
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
