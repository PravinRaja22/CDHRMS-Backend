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
import { deleteBankDetails, getBankDetails, upsertBankDetails } from "../../controllers/HRMS/bankDetails.Controller.js";

const Routes = function (fastify: FastifyInstance,opts: any,done: () => void) {
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

  //loan
  fastify.get("/loan", getLoans);
  fastify.get("/loan/:id", getSingleLoan);
  fastify.post("/loan", upsertLoan);
  fastify.delete("/loan/:id", deleteLoan);

  //jobApplicants
  fastify.post("/job/application", upsertJobApplicant);
  fastify.get("/job/application", getAllJobApplicants);
  fastify.get("/job/application/:applicantId", getSingleJobApplicant);
  fastify.delete("/job/application/:applicantId", deleteJobApplicant);

  //scheduleInterview
  fastify.post("/schedule_interview", upsertScheduledInterview);
  fastify.get("/schedule_interview", getAllScheduledInterviews);
  fastify.get("/schedule_interview/:applicantId", getScheduledInterviewById);
  fastify.delete("/schedule_interview/:applicantId", cancelScheduledInterview);

  //onBoarding
  fastify.post("/onboarding", upsertOnboardingData);
  fastify.get("/onboarding", getAllOnboardingData);
  fastify.get("/onboarding/:id", getSingleOnboardingData);
  fastify.delete("/onboarding/:id", deleteOnboardingData);

  //bankDetails
  fastify.post("/bank-detials",upsertBankDetails)
  fastify.get("/bank-detials",getBankDetails)
  fastify.delete("/bank-detials/:id",deleteBankDetails)
  done();
};

export default Routes;
