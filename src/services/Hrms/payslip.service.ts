import { query } from "../../database/postgress.js";
import { generatePayslipFile } from "../../utils/HRMS/payslipGenerator.js";
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

  const calculatePayslip = async (
    attendanceRecords,
    totalNumberOfDaysMonth,
    request
  ) => {
    // console.log(attendanceRecords, "attendanceRecords calculatePayslip");
    // console.log(request.params, "request.params calculatePayslip");
    // Net salary = Basic salary + HRA + Allowances – Income Tax – EPF – Professional Tax
    const { month, year, utcSec, userId } = request.params;

    //GET Users Records

    try {
      let getUsers = await query(`SELECT * FROM users WHERE id =$1`, [userId]);
      console.log(getUsers, "Data is ");
      let getuserPF = await query(`SELECT * FROM pfdetails WHERE userId=$1`, [
        userId,
      ]);
      let getUserBank = await query(
        `SELECT * FROM bankdetails WHERE userId=$1`,
        [userId]
      );

      let userRecord;
      let pfRecord;
      let bankRecord;

      if (getUsers.rowCount > 0) {
        userRecord = getUsers.rows[0];
      }
      if (getuserPF.rowCount > 0) {
        pfRecord = getuserPF.rows[0];
        // console.log(getuserPF.rows, "pfRecord");
      }
      if (getUserBank.rowCount > 0) {
        bankRecord = getUserBank.rows[0];
        // console.log(getUserBank.rows, "bankRecord");
      }
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
        bankName: bankRecord?.bankname,
        bankAccNo: bankRecord?.accountnumber,
        panNo: pfRecord?.pfnumber,
        pfUan: pfRecord?.uan,
        earnings: { totalEarnings, basics, HRA, otherAllowance },
        deductions: { LOP, currentPF, currentIT, currentPT, totalDeduction },
        netPay: netPay,
      };
      //   console.log(obj, "obj");

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

    try {
      let querydata2 = `SELECT * FROM payslips WHERE paySlipMonth = $1 AND payslipyear = $2`;
      let queryParams = [data.paySlipMonth, data.paySlipYear];
      let findMatchingdata = await query(querydata2, queryParams);
      console.log(findMatchingdata.rows, " Rows Length");
      if (findMatchingdata.rows.length > 0) {
        console.log("ID IFF FLKS ");
        return findMatchingdata.rows;
        // const { id, uuid, ...upsertFields } = findMatchingdata.rows[0];
        // // console.log(request, "upsertUser Request body");
        // console.log("Update payslips ", upsertFields);
        // const fieldNames = Object.keys(data);
        // const fieldValues = Object.values(data);
        // console.log(fieldNames, "upsert  payslips fieldNames");
        // console.log(fieldValues, "upsert  payslips fieldValues");
        // let querydata;
        // let params: any[] = [];
        // // If id is not provided, insert a new user
        // querydata = `UPDATE payslips SET ${fieldNames
        //   .map((field, index) => `${field} = $${index + 1}`)
        //   .join(", ")} WHERE id = $${fieldNames.length + 1}`;
        // params = [...fieldValues, id];
        // console.log(querydata, "upsert payslip query");
        // console.log(params, "upsert payslip params");
        // let result = await query(querydata, params);
        // console.log(result, "Result is data set ");
        // // let result = await pool.query(querydata,params)
        // let message = `payslip updated`;
        // return { message };
      } else {
        console.log("else");
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