import { query } from "../../database/postgress.js";
import {generatePayslipFile} from '../../utils/HRMS/payslipGenerator.js'
export module PayslipServices {

    export async function generatePayslip(request: any) {
        const { month, year, utcSec,userId } = request.params;
        // const userId = request.params.userId;
        console.log(request.params,"****** params");
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

            if(getAttendance.rowCount>0){
                let payslipAmount = calculatePayslip(getAttendance.rows,totalNumberOfDays,request) 
                return payslipAmount;
            }else{
                return []
            }

           
        } catch (error) {
            console.log(error.message, "getAttendance error");
            return error.message;
        }
    }

    const calculatePayslip =async (attendanceRecords,totalNumberOfDaysMonth,request)=>{
        console.log(attendanceRecords,"attendanceRecords calculatePayslip");
        console.log(request.params,"request.params calculatePayslip");
        // Net salary = Basic salary + HRA + Allowances – Income Tax – EPF – Professional Tax
        const { month, year, utcSec,userId } = request.params;

        //GET Users Records
      
        try{
            let getUsers = await query(`SELECT * FROM users WHERE id =$1`,[userId])
            let getuserPF = await query (`SELECT * FROM pfdetails WHERE userId =$1`,[userId])
            let getUserBank = await query(`SELECT * FROM bankdetails WHERE userId =$1`,[userId])
            let userRecord ;
            let pfRecord;
            let bankRecord;

            if( getUsers.rowCount >0){
                userRecord =getUsers.rows[0]
                console.log(getUsers.rows,"getUsers");
            }
            if( getuserPF.rowCount >0){
                pfRecord =getuserPF.rows[0]
                console.log(getuserPF.rows,"pfRecord");
            } if( getUserBank.rowCount >0){
                bankRecord =getUserBank.rows[0]
                console.log(getUserBank.rows,"bankRecord");
            }
           //need to pf,profetinal tax,income tax from user, now value is hardcoded,need to work
        let currentCTC = Number(userRecord?.ctc);
        let currentPF = (currentCTC/12)*0.03;
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
            }else if(i.status==="annualLeave"){
                noOfPresentDays++
            }            
            else if(i.status==="leave"){
                noOfLOPDays++
            }
        })

        console.log(noOfPresentDays,"noOfPresentDays");
        console.log(noOfLOPDays,"noOfLOPDays");

        let earningsPerDay = Math.round(currentCTC / (12* totalNumberOfDaysMonth));
        let monthCTC = Math.round(currentCTC / 12)

        let earnings = Math.round(earningsPerDay * noOfPresentDays);
        let LOP = Math.round(earningsPerDay * noOfLOPDays);
        let totalDeduction =Math.round( LOP + currentPF + currentIT + currentPT)
        let totalEarnings = monthCTC - totalDeduction
        let netPay = totalEarnings-totalDeduction
        let basics =  Math.round(0.4*totalEarnings)
        let HRA =  Math.round(0.5*basics)
        let otherAllowance =  Math.round(0.4*totalEarnings)
        let obj={
            "name" :`${userRecord?.firstname} ${userRecord?.lastname}`  ,
            "paySlipMonth" : month,
            "paySlipYear" : year,
            "employeeNo" : userRecord?.employeeid,
            "joiningDate" : new Date(userRecord?.joiningdate)?.toJSON()?.slice(0,10) || null,
            "designation" : userRecord?.designation,
            "department" : userRecord?.department,
            "location" : userRecord?.location,
            "effectiveWorkDays"  : noOfPresentDays,
            "lopDays" : noOfLOPDays,
            "bankName" : bankRecord?.bankname,
            "bankAccNo" :  bankRecord?.accountnumber,
            "panNo" : pfRecord?.pfnumber,
            "pfUan" : pfRecord?.uan,
            "earnings" : { totalEarnings ,basics,HRA,otherAllowance},
            "deductions" : {LOP,currentPF,currentIT,currentPT ,totalDeduction},
            "netPay" : netPay
        }
        console.log(obj,"obj****");

    //    await generatePayslipFile([obj])

        return obj
        }catch(error){
            console.log(error.message,"getusers error");
        }
       
    }
}