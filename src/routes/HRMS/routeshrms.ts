import { FastifyInstance } from "fastify";
import {
  deleteUser,
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

const Routes = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
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
  done();
};

export default Routes;
