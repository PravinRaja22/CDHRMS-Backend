import { FastifyInstance } from "fastify";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import path from "path";
// import ExcelJS from 'exceljs'
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
import {
  deleteUser,
  getAuthorizeduser,
  getSingleUser,
  getUser,
  getUsersBankdetails,
  getUsersPFdetails,
  upsertUser,
} from "../../controllers/HRMS/user.Controller.js";
import {
  getLeaveData,
  getLeavesByApprover,
  getLeavesByUsers,
  getSingleLeaves,
  upsertLeaves,
} from "../../controllers/HRMS/leave.Controller.js";
import {
  getLeaveBalanceByUsers,
  upsertLeaveBalanceByUsers,
} from "../../controllers/HRMS/leaveBalance.Controller.js";
import {
  getAttendanceDate,
  updateAttendance,
  upsertAttendance,
  getAttendanceByUserIdDate,
  updateAttendanceStatus,
  getsingleAttendance,
  upsertBulkAttendance,
  getAttendaceForMonthandYear,
  upsertAttendanceRecord,
  upsertAttendancetime,
} from "../../controllers/HRMS/attendance.Controller.js";
import {
  deleteLoan,
  getLoans,
  getSingleLoan,
  upsertLoan,
} from "../../controllers/HRMS/loan.Controller.js";
import {
  deleteJobApplicant,
  getAllJobApplicants,
  getSingleJobApplicant,
  upsertJobApplicant,
} from "../../controllers/HRMS/jobApplicants.Controller.js";
import {
  cancelScheduledInterview,
  getAllScheduledInterviews,
  getScheduledInterviewById,
  upsertScheduledInterview,
} from "../../controllers/HRMS/scheduleInterview.Controller.js";
import {
  deleteOnboardingData,
  getAllOnboardingData,
  getSingleOnboardingData,
  upsertOnboardingData,
} from "../../controllers/HRMS/onBoarding.Controller.js";
import {
  deleteBankDetails,
  getBankDetails,
  getIndividualBankDetails,
  upsertBankDetails,
} from "../../controllers/HRMS/bankDetails.Controller.js";
import {
  deletePFDetails,
  getIndividualPFDetails,
  getPFDetails,
  upsertPFDetails,
} from "../../controllers/HRMS/pfDetails.controller.js";
import {
  getAllAttendanceRegularize,
  insertAttendanceRegularize,
  getAttendanceRegularizebyUser,
  updateAttendanceRegularize,
  getAttendanceRegularizebyId,
  getRegularizeByUsers,
} from "../../controllers/HRMS/attendanceRegularize.Controller.js";
import {
  deleteEightyCData,
  getAllEightyCData,
  getEightyCDataById,
  getEightyCDataByUserId,
  upsertEightyCData,
} from "../../controllers/HRMS/eightyC.Controller.js";
import {
  deletepreviousEmployeeIncome,
  getAllpreviousEmployeeIncome,
  getSinglepreviousEmployeeIncome,
  getSinglepreviousEmployeeIncomebyuserId,
  upsertpreviousEmployeeIncome,
} from "../../controllers/HRMS/previousEmployeeIncome.controller.js";
import {
  deleteOtherChaptersData,
  getAllOtherChaptersData,
  getOtherChaptersDataByUserId,
  getSingleOtherChaptersData,
  upsertOtherChaptersData,
} from "../../controllers/HRMS/otherChapters.Controller.js";
import {
  deleteHouseRentAllowanceData,
  getAllHouseRentAllowanceData,
  getHouseRentAllowanceDataByUserId,
  getSingleHouseRentAllowanceData,
  upsertHouseRentAllowanceData,
} from "../../controllers/HRMS/houseRentAllowance.Controller.js";
// import { deleteBankDetails, getBankDetails, getIndividualBankDetails, upsertBankDetails } from "../../controllers/HRMS/bankDetails.Controller.js";
// import { deletePFDetails, getIndividualPFDetails, getPFDetails, upsertPFDetails } from "../../controllers/HRMS/pfDetails.controller.js";
// import { getAllAttendanceRegularize, insertAttendanceRegularize,
//   getAttendanceRegularizebyUser,updateAttendanceRegularize,getAttendanceRegularizebyId } from "../../controllers/HRMS/attendanceRegularize.Controller.js";
import {
  getAllApprovals,
  getApprovalbyApprover,
  getApprovalbySuperAdmin,
  getApprovalsById,
  insertApprovals,
  updateApprovals,
} from "../../controllers/HRMS/approval.Controller.js";

import {
  getAllMedicalSectionEightyDData,
  getMedicalSectionEightyDDataById,
  getMedicalSectionEightyDDataByUserId,
  upsertMedicalSectionEightyDData,
  deleteMedicalSectionEightyDData,
} from "../../controllers/HRMS/medicalSectionEightyD.Controller.js";

import {
  getAllIncomeLossHousePropertiesData,
  getSingleIncomeLossHousePropertiesData,
  getIncomeLossHousePropertiesDataByUserId,
  upsertIncomeLossHousePropertiesData,
  deleteIncomeLossHousePropertiesData,
} from "../../controllers/HRMS/incomeLossHouseProperties.Controller.js";
import {
  deleteOtherIncomeData,
  getAllOtherIncomeData,
  getOtherIncomeDataByUserId,
  getSingleOtherIncomeData,
  upsertOtherIncomeData,
} from "../../controllers/HRMS/otherIncome.Controller.js";
import authVerify from "../../auth/auth.js";
import {
  deleteDeclaredTaxAmountData,
  getAllDeclaredTaxAmountData,
  getDeclaredTaxAmountDataByUserId,
  getSingleDeclaredTaxAmountData,
  upsertDeclaredTaxAmountData,
} from "../../controllers/HRMS/declaredTaxAmount.Controller.js";
import {
  generateBulkPaySlipData,
  generateBulkPayslip,
  generatePayslip,
  getAllPaySlipData,
  getPaySlip,
  getPayslipByUserMonth,
} from "../../controllers/HRMS/payslip.Controller.js";
import { generatePayslipFile } from "../../utils/HRMS/payslipGenerator.js";
import {
  getMedicalInsurances,
  getMedicalInsurancesById,
  upsertMedicalInsurances,
} from "../../controllers/HRMS/medicalInsurance.Controller.js";
import { filesUpload, Multer } from "../../multer/Multer.js";
import { testing } from "../../controllers/HRMS/testing.controller.js";
import {
  excelGenearator,
  getTimeSheet,
  getTimeSheetForMonthandYear,
  getTimeSheetbydateanduser,
  upsertTimeSheet,
} from "../../controllers/HRMS/timeSheet.controller.js";

const Routes = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  //Authentication
  // fastify.post("/signup", { preHandler: authVerify }, (req, reply) => {
  //   console.log(req.userData.result.account ,'dataset is ')
  //   reply.send("yes ");
  // });
  fastify.post("/signup", { preHandler: [authVerify] }, getAuthorizeduser);
  fastify.get("/", (req, res) => {
    res.send("Hi Man");
  });

  //User Object Routes
  fastify.get("/users", getUser);
  fastify.get("/users/:id", getSingleUser);
  fastify.post("/users", upsertUser);
  fastify.delete("/users/:id", deleteUser);

  fastify.get("/users/:id/bank-details", getUsersBankdetails);
  fastify.get("/users/:id/PF-details", getUsersPFdetails);
  fastify.get("/users/:id/medical-insurences", getUsersBankdetails);

  //Leave Object Routes
  fastify.get("/leaves", getLeaveData);
  fastify.get("/leaves/:id", getSingleLeaves);
  // fastify.post("/leaves", { preHandler: filesUpload }
  //   , testing);
  fastify.post("/leaves", { preHandler: filesUpload }, upsertLeaves);

  fastify.get("/leaves/user/:userId", getLeavesByUsers);
  fastify.get("/leaves/approver/:approverId", getLeavesByApprover);

  //Leave-Balance Object Routes
  fastify.get("/leave-balance/:userId", getLeaveBalanceByUsers);
  fastify.post("/leave-balance/:userId", upsertLeaveBalanceByUsers);

  fastify.get("/Time-sheet/:userId", getTimeSheet);
  fastify.get("/Time-sheet/:userId/:applidDate", getTimeSheetbydateanduser);
  fastify.post("/Time-sheet", upsertTimeSheet);
  fastify.get("/Time-sheet/:userId/:month/:year", getTimeSheetForMonthandYear);

  //attendance
  fastify.get("/attendance", getAttendanceDate);
  fastify.post("/attendance", upsertAttendance);
  fastify.get("/attendance/:userId/:attendanceDate", getAttendanceByUserIdDate);
  fastify.get("/attendance/:userId/:month/:year", getAttendaceForMonthandYear);
  fastify.put("/attendance/:userId/:attendanceDate", updateAttendance);
  fastify.put(
    "/attendance/status/:attendanceDate/:userId",
    updateAttendanceStatus
  );
  fastify.get("/attendance/:id", getsingleAttendance);
  fastify.post("/attendance/bulk", upsertBulkAttendance);
  fastify.post("/attendance/time/:userId", upsertAttendancetime);

  //attendance Regularize
  fastify.get("/attendance-regularize", getAllAttendanceRegularize);
  fastify.post("/attendance-regularize", insertAttendanceRegularize);
  fastify.get(
    "/attendance-regularize/user/:userId",
    getAttendanceRegularizebyUser
  );
  fastify.get("/attendance-regularize/:id", getAttendanceRegularizebyId);
  fastify.put("/attendance-regularize/:id", updateAttendanceRegularize);
  // fastify.get("/attendance-regularize/user/:userId", getRegularizeByUsers);

  //Payslip

  fastify.get("/payslip/:userId/:month/:year", getPayslipByUserMonth);
  fastify.get("/payslip/bulk/:month/:year", generateBulkPayslip);
  fastify.post("/payslip/file", generatePayslipFile);
  fastify.get("/payslip/file/:userId/:month/:year", getPaySlip);
  fastify.get("/payslips", getAllPaySlipData);
  fastify.get("/payslip/bulk-data/:month/:year", generateBulkPaySlipData);
  // fastify.post("/generate/excel", async (request, reply) => {
  //   try {
  //     let data = await excelGenearator(request,reply);
  //     console.log(data);
  //     return data
  //   } catch (error) {
  //     console.log(error.message);
  //     return error.message
  //   }
  // });
  fastify.post("/generate/excel/:userId/:Year/:Month",excelGenearator) 
  //Approval

  fastify.get("/approval", getAllApprovals);
  fastify.post("/approval", insertApprovals);
  fastify.get("/approval/:id", getApprovalsById);
  fastify.put("/approval/:id", updateApprovals);
  fastify.get("/approval/approver/:approverId", getApprovalbyApprover);
  fastify.get("/approval/superadmin/:superadminId", getApprovalbySuperAdmin);
  //loan
  fastify.get("/loan", getLoans);
  fastify.get("/loan/:id", getSingleLoan);
  fastify.post("/loan", upsertLoan);
  fastify.delete("/loan/:id", deleteLoan);

  //jobApplicants
  fastify.post("/job-application", upsertJobApplicant);
  fastify.get("/job-application", getAllJobApplicants);
  fastify.get("/job-application/:applicantId", getSingleJobApplicant);
  fastify.delete("/job-application/:applicantId", deleteJobApplicant);

  //scheduleInterview
  fastify.post("/schedule-interview", upsertScheduledInterview);
  fastify.get("/schedule-interview", getAllScheduledInterviews);
  fastify.get("/schedule-interview/:applicantId", getScheduledInterviewById);
  fastify.delete("/schedule-interview/:applicantId", cancelScheduledInterview);

  //onBoarding
  fastify.post("/onboarding", upsertOnboardingData);
  fastify.get("/onboarding", getAllOnboardingData);
  fastify.get("/onboarding/:id", getSingleOnboardingData);
  fastify.delete("/onboarding/:id", deleteOnboardingData);

  //bankDetails
  fastify.post("/bank-details", upsertBankDetails);
  fastify.get("/bank-details", getBankDetails);
  fastify.get("/bank-details/:id", getIndividualBankDetails);
  fastify.delete("/bank-details/:id", deleteBankDetails);

  //pfDetails
  fastify.post("/pf-details", upsertPFDetails);
  fastify.get("/pf-details", getPFDetails);
  fastify.get("/pf-details/:id", getIndividualPFDetails);
  fastify.delete("/pf-details/:id", deletePFDetails);

  //medical

  fastify.get("/medical-insurences", getMedicalInsurances);
  fastify.post("/medical-insurences", upsertMedicalInsurances);
  fastify.get("/medical-insurences/:id", getMedicalInsurancesById);
  fastify.delete("/medical-insurences/:id", deletePFDetails);

  //eightyC
  fastify.post("/eightyC", upsertEightyCData);
  fastify.get("/eightyC", getAllEightyCData);
  fastify.get("/eightyC/:id", getEightyCDataById);
  fastify.get("/eightyC/user/:userId", getEightyCDataByUserId);
  fastify.delete("/eightyC/:id", deleteEightyCData);

  //previousEmpoyeeIncome
  fastify.get(
    "/income-Tax-Declaration/PrevEmployeeIncome",
    getAllpreviousEmployeeIncome
  );
  fastify.get(
    "/income-Tax-Declaration/PrevEmployeeIncome/:id",
    getSinglepreviousEmployeeIncome
  );
  fastify.post(
    "/income-Tax-Declaration/PrevEmployeeIncome",
    upsertpreviousEmployeeIncome
  );
  fastify.get(
    "/income-Tax-Declaration/PrevEmployeeIncome/user/:userId",
    getSinglepreviousEmployeeIncomebyuserId
  );
  fastify.delete(
    "/income-Tax-Declaration/PrevEmployeeIncome/:id",
    deletepreviousEmployeeIncome
  );
  //otherChapters

  fastify.post("/other-chapters", upsertOtherChaptersData);
  fastify.get("/other-chapters", getAllOtherChaptersData);
  fastify.get("/other-chapters/:id", getSingleOtherChaptersData);
  fastify.get("/other-chapters/user/:userId", getOtherChaptersDataByUserId);
  fastify.delete("/other-chapters/:id", deleteOtherChaptersData);

  //houseRentAllowance

  fastify.post("/house-rent-allowance", upsertHouseRentAllowanceData);
  fastify.get("/house-rent-allowance", getAllHouseRentAllowanceData);
  fastify.get("/house-rent-allowance/:id", getSingleHouseRentAllowanceData);
  fastify.get(
    "/house-rent-allowance/user/:userId",
    getHouseRentAllowanceDataByUserId
  );
  fastify.delete("/house-rent-allowance/:id", deleteHouseRentAllowanceData);

  //medicalSectionEightyD

  fastify.post("/medical-section-eightyd", upsertMedicalSectionEightyDData);
  fastify.get("/medical-section-eightyd", getAllMedicalSectionEightyDData);
  fastify.get("/medical-section-eightyd/:id", getMedicalSectionEightyDDataById);
  fastify.get(
    "/medical-section-eightyd/user/:userId",
    getMedicalSectionEightyDDataByUserId
  );
  fastify.delete(
    "/medical-section-eightyd/:id",
    deleteMedicalSectionEightyDData
  );

  //incomeLossHouseProperties

  fastify.post(
    "/income-loss-house-properties",
    upsertIncomeLossHousePropertiesData
  );
  fastify.get(
    "/income-loss-house-properties",
    getAllIncomeLossHousePropertiesData
  );
  fastify.get(
    "/income-loss-house-properties/:id",
    getSingleIncomeLossHousePropertiesData
  );
  fastify.get(
    "/income-loss-house-properties/user/:userId",
    getIncomeLossHousePropertiesDataByUserId
  );
  fastify.delete(
    "/income-loss-house-properties/:id",
    deleteIncomeLossHousePropertiesData
  );

  // otherIncome

  fastify.post("/otherIncome", upsertOtherIncomeData);
  fastify.get("/otherIncome", getAllOtherIncomeData);
  fastify.get("/otherIncome/:id", getSingleOtherIncomeData);
  fastify.get("/otherIncome/user/:userId", getOtherIncomeDataByUserId);
  fastify.delete("/otherIncome/:id", deleteOtherIncomeData);

  //declaredTaxAmount

  fastify.post("/declaredTaxAmount", upsertDeclaredTaxAmountData);
  fastify.get("/declaredTaxAmount", getAllDeclaredTaxAmountData);
  fastify.get("/declaredTaxAmount/:id", getSingleDeclaredTaxAmountData);
  fastify.get(
    "/declaredTaxAmount/user/:userId",
    getDeclaredTaxAmountDataByUserId
  );
  fastify.delete("/declaredTaxAmount/:id", deleteDeclaredTaxAmountData);

  done();
};

export default Routes;
