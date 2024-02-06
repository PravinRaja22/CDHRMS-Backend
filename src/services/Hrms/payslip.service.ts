import { query } from "../../database/postgress.js";

export module PayslipServices {

    export async function generatePayslip(request: any) {
        const { month, year, utcSec,userId } = request.params;
        // const userId = request.params.userId;
        let startDate;
        let endDate;
        let totalNumberOfDays ;

        if (month && year) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthIndex = months.indexOf(month);

            if (monthIndex !== -1) {
                startDate = new Date(year, monthIndex, 1);
                endDate = new Date(year, monthIndex + 1, 0);
                totalNumberOfDays= endDate.getDate();
            }
        } else if (utcSec) {
            const utcDate = new Date(utcSec);
            startDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1);
            endDate = new Date(utcDate.getUTCFullYear(), utcDate.getUTCMonth() + 1, 0);
            totalNumberOfDays= endDate.getDate();
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

            let payslipAmount = calculatePayslip(getAttendance.rows,totalNumberOfDays,userId) 

            return payslipAmount;
        } catch (error) {
            console.log(error.message, "getAttendance error");
            return error.message;
        }
    }

    const calculatePayslip =(attendanceRecords,totalNumberOfDaysMonth,userId)=>{
        console.log(attendanceRecords,"attendanceRecords calculatePayslip");
        // Net salary = Basic salary + HRA + Allowances – Income Tax – EPF – Professional Tax


        //GET Users Records

        let getUsers = query(`SELECT * FROM users WHERE id =$1`,[userId])

        console.log(getUsers,"getUsers");


        //need to get CTC,pf,profetinal tax,income tax from user, now value is hardcoded,need to work
        let currentCTC = 700000;
        let currentPF = 2500;
        let currentIT = 0;
        let currentPT = 0;

        //calculate Present Days

            let noOfPresentDays=0 ;
            let noOfLOPDays=0 ;

            attendanceRecords.map(i=>{
                if(i.status==="present"){
                    noOfPresentDays++
                }else if(i.status==="weekoff"){
                    noOfPresentDays++
                }else if(i.status==="leave"){
                    noOfLOPDays++
                }
            })

            console.log(noOfPresentDays,"noOfPresentDays");
            console.log(noOfLOPDays,"noOfLOPDays");

            let earningsPerDay = currentCTC / (12* totalNumberOfDaysMonth);
            let monthCTC = currentCTC / 12

            let earnings = earningsPerDay * noOfPresentDays;
            let LOP = earningsPerDay * noOfLOPDays;
            let totalDeduction = LOP + currentPF + currentIT + currentPT
            let totalEarnings = monthCTC - totalDeduction
          
            let basics =  0.4*totalEarnings
            let HRA =  0.2*totalEarnings
            let otherAllowance =  0.4*totalEarnings

            return{
                earning:{ totalEarnings ,basics,HRA,otherAllowance},
                deduction:{LOP,currentPF,currentIT,currentPT}
        }

            

    }
}