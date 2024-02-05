import { query } from "../../database/postgress.js";

export module PayslipServices {

    export async function generatePayslip(request: any) {
        const { month, year, utcSec } = request.params;
        const userId = request.params.userId;
        let startDate;
        let endDate;

        if (month && year) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = months.indexOf(month);

            if (monthIndex !== -1) {
                startDate = new Date(year, monthIndex, 1);
                endDate = new Date(year, monthIndex + 1, 0);
            }
        } else if (utcSec) {
            const utcDate = new Date(utcSec);
            startDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1);
            endDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, 0);
        } else {
            console.log('Invalid parameters');
            return;
        }

        const startTime = startDate.setHours(0, 0, 0, 0);
        const endTime = endDate.setHours(23, 59, 59, 999);

        console.log(startDate, '* startDate');
        console.log(endDate, '* endDate');
        console.log(startTime, '* startTime');
        console.log(endTime, '* endTime');

        try {
            let queryData = `SELECT * FROM attendances WHERE userId = ${userId} AND date>= ${startTime} AND date<=${endTime}`;
            console.log(queryData);
            let getAttendance = await query (queryData,{})

            console.log(getAttendance,"getAttendance result");
            return getAttendance.rows;
        } catch (error) {
            console.log(error.message, "getAttendance error");
            return error.message;
        }
    }
}