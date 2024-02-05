import { FastifyInstance } from "fastify";
import {
  deleteUser,
  getAuthorizeduser,
  getSingleUser,
  getUser,
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

  //User Object Routes
  fastify.get("/users", getUser);
  fastify.get("/users/:id", getSingleUser);
  fastify.post("/users", upsertUser);
  fastify.delete("/users/:id", deleteUser);

  //Leave Object Routes
  fastify.get("/leaves", getLeaveData);
  fastify.get("/leaves/:id", getSingleLeaves);
  fastify.post("/leaves", upsertLeaves);
  fastify.get("/leaves/user/:userId", getLeavesByUsers);
  fastify.get("/leaves/approver/:approverId", getLeavesByApprover);

  //Leave-Balance Object Routes
  fastify.get("/leave-balance/:userId", getLeaveBalanceByUsers);
  fastify.post("/leave-balance/:userId", upsertLeaveBalanceByUsers);

  //attendance
  fastify.get("/attendance", getAttendanceDate);
  fastify.post("/attendance", upsertAttendance);
  fastify.get("/attendance/:userId/:attendanceDate", getAttendanceByUserIdDate);
  fastify.put("/attendance/:userId/:attendanceDate", updateAttendance);
  fastify.put("/attendance/:attendanceDate", updateAttendanceStatus);
  fastify.get("/attendance/:id", getsingleAttendance);

  //attendance Regularize
  fastify.get("/attendance-regularize", getAllAttendanceRegularize);
  fastify.post("/attendance-regularize", insertAttendanceRegularize);
  fastify.get(
    "/attendance-regularize/userdetails/:userId",
    getAttendanceRegularizebyUser
  );
  fastify.get("/attendance-regularize/:id", getAttendanceRegularizebyId);
  fastify.put("/attendance-regularize/:id", updateAttendanceRegularize);

  //Approval

  fastify.get("/approval", getAllApprovals);
  fastify.post("/approval", insertApprovals);
  fastify.get("/approval/:approverId", getApprovalbyApprover);
  fastify.put("/approval/:id", updateApprovals);

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

  fastify.post("/otherChapters", upsertOtherChaptersData);
  fastify.get("/otherChapters", getAllOtherChaptersData);
  fastify.get("/otherChapters/:id", getSingleOtherChaptersData);
  fastify.get("/otherChapters/user/:userId", getOtherChaptersDataByUserId);
  fastify.delete("/otherChapters/:id", deleteOtherChaptersData);

  //houseRentAllowance

  fastify.post("/houseRentAllowance", upsertHouseRentAllowanceData);
  fastify.get("/houseRentAllowance", getAllHouseRentAllowanceData);
  fastify.get("/houseRentAllowance/:id", getSingleHouseRentAllowanceData);
  fastify.get(
    "/houseRentAllowance/user/:userId",
    getHouseRentAllowanceDataByUserId
  );
  fastify.delete("/houseRentAllowance/:id", deleteHouseRentAllowanceData);

  //medicalSectionEightyD

  fastify.post("/medicalSectionEightyD", {}, upsertMedicalSectionEightyDData);
  fastify.get("/medicalSectionEightyD", getAllMedicalSectionEightyDData);
  fastify.get("/medicalSectionEightyD/:id", getMedicalSectionEightyDDataById);
  fastify.get(
    "/medicalSectionEightyD/user/:userId",
    getMedicalSectionEightyDDataByUserId
  );
  fastify.delete("/medicalSectionEightyD/:id", deleteMedicalSectionEightyDData);

  //incomeLossHouseProperties

  fastify.post(
    "/incomeLossHouseProperties",
    {},
    upsertIncomeLossHousePropertiesData
  );
  fastify.get(
    "/incomeLossHouseProperties",
    getAllIncomeLossHousePropertiesData
  );
  fastify.get(
    "/incomeLossHouseProperties/:id",
    getSingleIncomeLossHousePropertiesData
  );
  fastify.get(
    "/incomeLossHouseProperties/user/:userId",
    getIncomeLossHousePropertiesDataByUserId
  );
  fastify.delete(
    "/incomeLossHouseProperties/:id",
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
