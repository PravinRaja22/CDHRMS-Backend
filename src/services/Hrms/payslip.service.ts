import { array } from "joi";
import { query } from "../../database/postgress.js";
import {
  generateBulkPayslipFile,
  generatePayslipFile,
} from "../../utils/HRMS/payslipGenerator.js";
import { userService } from "./user.service.js";
export module PayslipServices {
  export async function generatePayslip(request: any) {
    const { month, year, utcSec, userId } = request.params;
    console.log(request.params, "****** params");

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
    console.log(startTime, "* startTime");
    console.log(endTime, "* endTime");

    try {
      let queryData = `SELECT * FROM attendances WHERE userId = ${userId} AND date>= ${startTime} AND date<=${endTime}`;
      //   console.log(queryData);
      let getAttendance = await query(queryData, {});
      console.log("%%%%%%%%%%%%%");
      // console.log(getAttendance, "getAttendance result1");
      if (getAttendance.rowCount > 0) {
        console.log("if calculate payslip  getAttendance has records ");
        let generatePayslip = await calculatePayslip(
          getAttendance.rows,
          totalNumberOfDays,
          request
        );
        console.log(generatePayslip, "generatePayslip");
        let payslipAmounts = [generatePayslip];
        let payslipFile;
        console.log(payslipAmounts, "payslipAmounts");
        if (payslipAmounts.length > 0) {
          payslipFile = await generateBulkPayslipFile(request, payslipAmounts);
          console.log(payslipFile, "payslipFile generateBulkPayslipFile");
          return payslipFile; //payslipAmounts
          // Return array of payslip amounts OR paylsipFile inserted file
        } else {
          return payslipAmounts;
        }

        return generatePayslip;
      } else {
        console.log("else  getAttendance has no records ");
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
            console.log("if getAttendance has rec , call calculate payslip");
            let payslipAmount = await calculatePayslip(
              getAttendance.rows,
              totalNumberOfDays,
              request
            );
            console.log(payslipAmount, "payslipAmount");
            payslipAmounts.push(payslipAmount);
          } else {
            console.log("else getAttendance no records");
            // payslipAmounts.push([]);
          }
        }
        let payslipFile;
        if (payslipAmounts.length > 0) {
          payslipFile = await generateBulkPayslipFile(request, payslipAmounts);
          console.log(payslipFile, "payslipFile *******");
          return payslipFile; //payslipAmounts
          // Return array of payslip amounts OR paylsipFile inserted file
        } else {
          return payslipAmounts;
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
    let result;
    try {
      let joinUsersResult: any = await userService.getSingleUser(userid);

      console.log("*******", joinUsersResult, "*********");

      let userRecord;

      if (joinUsersResult.length > 0) {
        userRecord = joinUsersResult[0];
      }
      //need to pf,profetinal tax,income tax from user, now value is hardcoded,need to work
      let currentCTC = Number(userRecord?.ctc);
      let currentPF = Math.round((currentCTC / 12) * 0.03);
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
        name: `${userRecord?.firstname} ${
          userRecord?.lastname === null ? "" : userRecord?.lastname
        }`,
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
      result = obj;
      return obj;
    } catch (error) {
      console.log(error.message, "getusers error");
    }
  };

  export async function insertpaySlip(data: any) {
    console.log(data, "Insert Pay slip Data");
    let { payslipmonth, payslipyear, userid, ...otherFields } = data;
    userid = Number(userid);
    try {
      let querydata2 = `SELECT * FROM payslips WHERE paySlipMonth = $1 AND payslipyear = $2 AND userId = $3 `;

      let queryParams = [payslipmonth, payslipyear, userid];
      let findMatchingdata = await query(querydata2, queryParams);
      console.log(findMatchingdata.rows, "findMatchingdata row");

      let existPayslipRecords = findMatchingdata.rows[0];
      console.log("*******");
      console.log(existPayslipRecords);
      console.log("*******");
      if (findMatchingdata.rows.length > 0) {
        console.log("if");
        console.log(data);
        const mergedData = { ...existPayslipRecords, ...data };
        console.log(mergedData, "mergedData");

        //remove uuid
        const { uuid, ...mergedDataFields } = mergedData;

        const fieldNames = Object.keys(mergedDataFields);
        const fieldValues = Object.values(mergedDataFields);

        let querydata;
        let params = [];
        let existPayslipRecord = existPayslipRecords[0];
        // If id is not provided, insert a new scheduled interview
        console.log(existPayslipRecord, "existPayslipRecord");
        // querydata = `UPDATE  payslips SET(${fieldNames.join(
        //   ", "
        // )}) VALUES (${fieldValues
        //   .map((_, index) => `$${index + 1}`)
        //   .join(", ")}) WHERE id = ${mergedData.id}  RETURNING *`;

        querydata = `UPDATE payslips SET ${fieldNames
          .map((field, index) => `${field} = $${index + 1}`)
          .join(", ")} WHERE id = $${fieldNames.length + 1} RETURNING *`;

        params = [...fieldValues, mergedData.id];
        let upsertPayslipResult;
        console.log(querydata, "querydata");
        console.log(params, "params");
        try {
          console.log("try");
          upsertPayslipResult = await query(querydata, params);
          console.log(
            upsertPayslipResult,
            "********** upsertPayslipResult result"
          );
        } catch (error) {
          console.log("catch");
          console.log(error.message, "upsert payslip error ");
        }

        return {
          message: `${upsertPayslipResult.rowCount} payslips Updated`,
        };
      } else {
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
        console.log(querydata, "QueryData Insertion");
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

  export async function getPayslipByUserMonth(request) {
    console.log(request, "getPayslipByUserMonth");
    const { month, year, userId } = request.params;
    try {
      let querydata = `SELECT * FROM payslips WHERE paySlipMonth = $1 AND payslipyear = $2 AND userId = $3`;
      let queryParams = [month, year, userId];
      let result = await query(querydata, queryParams);
      console.log(result, "QueryResult getPayslipByUserMonth");
      return result.rows;
    } catch (error) {
      return error.message;
    }
  }

  export async function getAllPaySlipData(request) {
    console.log("Inside Get All Pay Slip Data");
    let keys = Object.keys(request.query);
    let values = Object.values(request.query);
    console.log(keys, values, "getpayslipdatabyuserquery");

    const conditions = keys
      .map((key, index) => `LOWER( payslips.${key}) LIKE LOWER($${index + 1})`)
      .join(" AND ");
    let params = values.map((value) => `%${value}%`);

    try {
      let queryData = `SELECT payslips.*,
      jsonb_build_object(
          'id', users.id,
          'firstname', users.firstname,
            'lastname', users.lastname,
              'employeeid', users.employeeid
      ) AS "jsonPayslipUsers"
      FROM
      payslips
      INNER JOIN users ON users.id = payslips.userid
      WHERE ${conditions}`;
      let result = await query(queryData, params);
      console.log(result.rows, "Query Result getAllPaySlipData");
      return result.rows;
    } catch (error) {
      console.log(error.message);
    }
  }

  export async function generateBulkPayslipData(request) {
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
            console.log("if getAttendance has rec , call calculate payslip");
            let payslipAmount = await calculatePayslip(
              getAttendance.rows,
              totalNumberOfDays,
              request
            );
            console.log(payslipAmount, "payslipAmount");
            payslipAmounts.push(payslipAmount);
          } else {
            console.log("else getAttendance no records");
            // payslipAmounts.push([]);
          }
        }
        return payslipAmounts;
        // let payslipFile;
        // if (payslipAmounts.length > 0) {
        //   payslipFile = await generateBulkPayslipFile(request, payslipAmounts);
        //   console.log(payslipFile, "payslipFile *******");
        //   return payslipFile; //payslipAmounts
        //   // Return array of payslip amounts OR paylsipFile inserted file
        // } else {
        //   return payslipAmounts;
        // }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error.message, "getAttendance error");
      return error.message;
    }
  }
}
