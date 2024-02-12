import { array } from "joi";
import { query } from "../../database/postgress.js";
import { generateBulkPayslipFile } from "../../utils/HRMS/payslipGenerator.js";
import { userService } from "./user.service.js";
export module PayslipServices {
  export async function generatePayslip(request: any) {
    const { month, year, utcSec, userId } = request.params;
    console.log(request.params, "****** params");
    // const userId = request.params.userId;

    let startDate;
    let endDate;
    let totalNumberOfDays;

    if (month && year) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = months.indexOf(month);

      if (monthIndex !== -1) {
        startDate = new Date(year, monthIndex, 1);
        endDate = new Date(year, monthIndex + 1, 0);
        totalNumberOfDays = endDate.getDate();
      }
    } else if (utcSec) {
      const utcDate = new Date(utcSec);
      startDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1);
      endDate = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth() + 1,
        0
      );
      totalNumberOfDays = endDate.getDate();
    } else {
      console.log("Invalid parameters");
      return;
    }

    const startTime = startDate.setHours(0, 0, 0, 0);
    const endTime = endDate.setHours(23, 59, 59, 999);

    // console.log(startDate, "* startDate");
    // console.log(endDate, "* endDate");
    // console.log(startTime, "* startTime");
    // console.log(endTime, "* endTime");

    try {
      let queryData = `SELECT * FROM attendances WHERE userId = ${userId} AND date>= ${startTime} AND date<=${endTime}`;
      //   console.log(queryData);
      let getAttendance = await query(queryData, {});

      //   console.log(getAttendance, "getAttendance result1");
      if (getAttendance.rowCount > 0) {
        let payslipAmount = calculatePayslip(
          getAttendance.rows,
          totalNumberOfDays,
          request
        );
        return payslipAmount;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error.message, "getAttendance error");
      return error.message;
    }
  }

  export async function generateBulkPayslip(request: any) {
    console.log("generateBulkPayslip control");
    console.log("generateBulkPayslip", request);
    const { month, year, utcSec } = request.params;

    let startDate;
    let endDate;
    let totalNumberOfDays;

    if (month && year) {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = months.indexOf(month);
      console.log(monthIndex, "monthIndex");
      if (monthIndex !== -1) {
        startDate = new Date(year, monthIndex, 1);
        endDate = new Date(year, monthIndex + 1, 0);
        totalNumberOfDays = endDate.getDate();
      }
    } else if (utcSec) {
      const utcDate = new Date(utcSec);
      startDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1);
      endDate = new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth() + 1,
        0
      );
      totalNumberOfDays = endDate.getDate();
    } else {
      console.log("Invalid parameters");
      return;
    }

    const startTime = startDate.setHours(0, 0, 0, 0);
    const endTime = endDate.setHours(23, 59, 59, 999);
    console.log(startDate, "* startDate");
    console.log(endDate, "* endDate");
    console.log(endTime, "* endTime *startTime", startTime);

    try {
      let result = await query(
        `SELECT id, joiningdate, userName FROM users
                                  WHERE joiningDate < ${endTime}`,
        {}
      );
      console.log(result, "result users*** ");

      if (result.rowCount > 0) {
        let payslipAmounts = []; // Array to store payslip amounts

        for (const item of result.rows) {
          console.log(item, "item ***");
          let queryData = `SELECT * FROM attendances WHERE userId = ${item.id} AND date>= ${startTime} AND date<=${endTime}`;
          console.log(queryData, "queryData");

          let getAttendance = await query(queryData, {});
          console.log(getAttendance, "getAttendance");

          if (getAttendance.rowCount > 0) {
            let payslipAmount = await calculatePayslip(
              getAttendance.rows,
              totalNumberOfDays,
              request
            );
            console.log(payslipAmount, "payslipAmount");
            payslipAmounts.push(payslipAmount);
          } else {
            // payslipAmounts.push([]);
          }
        }
        let payslipFile ;
        if(payslipAmounts.length>0){
          payslipFile = await generateBulkPayslipFile(
            request,
            payslipAmounts
          );
          console.log(payslipFile, "payslipFile *******");
          return payslipFile;  //payslipAmounts 
               // Return array of payslip amounts OR paylsipFile inserted file
        }else{
          return payslipAmounts
        }

      } else {
        return [];
      }
    } catch (error) {
      console.log(error.message, "getAttendance error");
      return error.message;
    }
  }

  const calculatePayslip = async (
    attendanceRecords,
    totalNumberOfDaysMonth,
    request
  ) => {
    // console.log(attendanceRecords, "attendanceRecords calculatePayslip");
    // console.log(request.params, "request.params calculatePayslip");
    // Net salary = Basic salary + HRA + Allowances – Income Tax – EPF – Professional Tax
    const { month, year, utcSec } = request.params;
    const { userid, ...otherFields } = attendanceRecords[0];

    console.log(attendanceRecords, "calculatePayslip attendanceRecords");
    //GET Users Records
    // console.log(object);
    try {
      let joinUsersResult: any = await userService.getSingleUser(userid);
      // let getUsers = await query(`SELECT * FROM users WHERE id =$1`, [userid]);
      // console.log(getUsers, "Data is ");
      // let getuserPF = await query(`SELECT * FROM pfdetails WHERE userId=$1`, [
      //   userid,
      // ]);
      // let getUserBank = await query(
      //   `SELECT * FROM bankdetails WHERE userId=$1`,
      //   [userid]
      // );

      console.log("*******", joinUsersResult, "*********");

      let userRecord;
      // let pfRecord;
      // let bankRecord;

      if (joinUsersResult.length > 0) {
        userRecord = joinUsersResult[0];
      }
      // if (getuserPF.rowCount > 0) {
      //   pfRecord = getuserPF.rows[0];
      //   // console.log(getuserPF.rows, "pfRecord");
      // }
      // if (getUserBank.rowCount > 0) {
      //   bankRecord = getUserBank.rows[0];
      //   // console.log(getUserBank.rows, "bankRecord");
      // }
      //need to pf,profetinal tax,income tax from user, now value is hardcoded,need to work
      let currentCTC = Number(userRecord?.ctc);
      let currentPF = (currentCTC / 12) * 0.03;
      let currentIT = 0;
      let currentPT = 0;

      //calculate Present Days

      let noOfPresentDays = 0;
      let noOfLOPDays = 0;

      attendanceRecords.map((i) => {
        if (i.status === "present") {
          noOfPresentDays++;
        } else if (i.status === "weekoff") {
          noOfPresentDays++;
        } else if (i.status === "leave") {
          noOfLOPDays++;
        }
      });

      //   console.log(noOfPresentDays, "noOfPresentDays");
      //   console.log(noOfLOPDays, "noOfLOPDays");

      let earningsPerDay = Math.round(
        currentCTC / (12 * totalNumberOfDaysMonth)
      );
      let monthCTC = Math.round(currentCTC / 12);

      let earnings = Math.round(earningsPerDay * noOfPresentDays);
      let LOP = Math.round(earningsPerDay * noOfLOPDays);
      let totalDeduction = Math.round(LOP + currentPF + currentIT + currentPT);
      let totalEarnings = monthCTC - totalDeduction;
      let netPay = totalEarnings - totalDeduction;
      let basics = Math.round(0.4 * totalEarnings);
      let HRA = Math.round(0.2 * totalEarnings);
      let otherAllowance = Math.round(0.4 * totalEarnings);
      console.log(userRecord, "USER DATA");
      console.log(new Date(Number(userRecord?.joiningdate)), "USER DATA date");
      console.log(
        new Date(Number(userRecord?.joiningdate))?.toJSON()?.slice(0, 10),
        "USER DATA date"
      );
      let obj = {
        userId: `${userRecord?.id}`,
        name: `${userRecord?.firstname} ${userRecord?.lastname}`,
        paySlipMonth: month,
        paySlipYear: year,
        employeeNo: userRecord?.employeeid,
        joiningDate:
          new Date(Number(userRecord?.joiningdate))?.toJSON()?.slice(0, 10) ||
          null,
        designation: userRecord?.designation,
        department: userRecord?.department,
        location: userRecord?.location,
        effectiveWorkDays: noOfPresentDays,
        lopDays: noOfLOPDays,
        bankName: userRecord?.bankDetails?.bankname,
        bankAccNo: userRecord?.bankDetails?.accountnumber,
        panNo: userRecord?.pfDetails?.pfnumber,
        pfUan: userRecord?.pfDetails?.uan,
        earnings: { totalEarnings, basics, HRA, otherAllowance },
        deductions: { LOP, currentPF, currentIT, currentPT, totalDeduction },
        netPay: netPay,
      };
      console.log(obj, "obj");

      // let final = await generatePayslipFile([obj]);
      // console.log(final, "final is #####");
      // let fileurl =
      //   request.protocol +
      //   "://" +
      //   request.headers.host +
      //   "/" +
      //   final[0].payslipUrl;
      // console.log(fileurl, "DSA");

      return obj;
    } catch (error) {
      console.log(error.message, "getusers error");
    }
  };

  export async function insertpaySlip(data: any) {
    console.log(data, "Insert Pay slip Data");
      let {paySlipMonth,paySlipYear,userId,...otherFields} = data
      userId = Number(userId);
    try {
      let querydata2 = `SELECT * FROM payslips WHERE paySlipMonth = $1 AND payslipyear = $2 AND userId = $3 `;

      let queryParams = [paySlipMonth,paySlipYear,userId];
      let findMatchingdata = await query(querydata2, queryParams);
      console.log(findMatchingdata.rows, " Rows Length");

        let existPayslipRecords =findMatchingdata.rows
console.log("*******");
console.log(existPayslipRecords);
console.log("*******");
      if(findMatchingdata.rows.length>0){
        console.log("if");
        console.log(data);
        const { id, ...upsertFields } = data;
  
        const fieldNames = Object.keys(upsertFields);
        const fieldValues = Object.values(upsertFields);
  
        let querydata;
        let params = [];
  
        // If id is not provided, insert a new scheduled interview
        querydata = `UPSERT INTO payslips (${fieldNames.join(
          ", "
        )}) VALUES (${fieldValues
          .map((_, index) => `$${index + 1}`)
          .join(", ")}) WHERE id = ${id}  RETURNING *`;
        params = fieldValues;
  
        const result = await query(querydata, params);
  
        return {
          message: `${result.rowCount} payslips Updated`,
        };
      }else{
        console.log("else ***");
        console.log(data);
        const { id, ...upsertFields } = data;
  
        const fieldNames = Object.keys(upsertFields);
        const fieldValues = Object.values(upsertFields);
  
        let querydata;
        let params = [];
  
        // If id is not provided, insert a new scheduled interview
        querydata = `INSERT INTO payslips (${fieldNames.join(
          ", "
        )}) VALUES (${fieldValues
          .map((_, index) => `$${index + 1}`)
          .join(", ")}) RETURNING *`;
        params = fieldValues;
  
        const result = await query(querydata, params);
  
        return {
          message: `${result.rowCount} payslips inserted`,
        };
      }

     
    } catch (error) {
      console.log("error in insert data payslip ");
      return error.message;
    }
  }

  export async function getPayslip(request) {
    console.log(request);
    const { month, year, userId } = request.params;

    let querydata = `SELECT * FROM payslips WHERE paySlipMonth = $1 AND payslipyear = $2 AND userId = $3`;
    let queryParams = [month, year, userId];
    let result = await query(querydata, queryParams);
    console.log(result.rows);
    return result.rows;
  }
}
