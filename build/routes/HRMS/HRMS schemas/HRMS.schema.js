// export const loanSchema = {
//   type: "object",
//   properties: {
//     id: { type: "string", format: "int64" },
//     employeeId: {
//       type: "string",
//       example: "cd-0128",
//       description: "Logged in user id",
//     },
//     loanType: { type: "string", enum: ["Salary Advance"] },
//     loanAmount: { type: "string", example: "10000" },
//     loanTerm: { type: "string", example: "1 Year" },
//     repaymentStartDate: {
//       type: "integer",
//       format: "int64",
//       example: 1653177600,
//       description: "Repayment Start date UTC time seconds",
//     },
//     joiningDate: {
//       type: "integer",
//       format: "int64",
//       example: 1653177600,
//       description: "Start date UTC time seconds",
//     },
//     status: {
//       type: "string",
//       example: "Pending",
//       enum: ["Pending", "Approve", "Reject"],
//     },
//     applyingTo: { type: "object" },
//     approval: { type: "object" },
//     remarks: { type: "string", example: "Medical Emergency" },
//   },
//   required: [
//     "employeeId",
//     "loanType",
//     "loanAmount",
//     "loanTerm",
//     "repaymentStartDate",
//     "joiningDate",
//     "status",
//     "applyingTo",
//     "approval",
//   ],
//   additionalProperties: false,
// };
// export const scheduledInterviewsSchema = {
//   type: "object",
//   properties: {
//     id: { type: "integer" },
//     applicantId: { type: "object" },
//     scheduleTo: { type: "object" },
//     scheduledDate: { type: "string", format: "date" },
//     scheduledTime: { type: "string", format: "time" },
//     comments: { type: "string" },
//   },
//   required: ["applicantId", "scheduleTo", "scheduledDate", "scheduledTime"],
//   additionalProperties: false,
// };
// export const scheduledInterviewsSchema = {
//   schema: {
//     body: {
//       type: "object",
//       required: ["comments"],
//       properties: {
//         // id: { type: "integer" },
//         // applicantId: { type: "object" },
//         // scheduleTo: { type: "object" },
//         // scheduledDate: { type: "string", format: "date" },
//         // scheduledTime: { type: "string", format: "time" },
//         comments: { type: "string" },
//       },
//     },
//   },
// };
export const scheduledInterviewsSchema = {
    body: {
        type: "object",
        properties: {
            comments: { type: "string" },
        },
        required: ["comments"],
        errorMessage: {
            required: {
                comments: "Why no Comments!", // specify error message for when the
            },
        },
    },
};
// export const job_applicantsSchema = {
//   type: "object",
//   properties: {
//     id: { type: "integer" },
//     name: { type: "string", minLength: 1 },
//     email: { type: "string", format: "email" },
//     phone: { type: "string", pattern: "^[0-9]{10}$" },
//     country: { type: "string", minLength: 3 },
//     state: { type: "string", minLength: 3 },
//     city: { type: "string", minLength: 3 },
//     positionAppliedFor: { type: "string", minLength: 3 },
//     salaryExpectation: { type: "number" },
//     appliedDate: { type: "string", format: "date" },
//     education: { type: "string", minLength: 3 },
//     skills: { type: "string", minLength: 3 },
//     experience: { type: "string", minLength: 3 },
//     resume: { type: "string", minLength: 3 },
//     status: { type: "string", enum: ["Pending", "Approved", "Rejected"] },
//   },
//   required: [
//     "name",
//     "email",
//     "phone",
//     "positionAppliedFor",
//     "appliedDate",
//     "education",
//     "skills",
//     "experience",
//     "resume",
//   ],
//   additionalProperties: false,
// };
// export const onBoardingSchema = {
//   type: "object",
//   properties: {
//     id: { type: "integer" },
//     selectedCandidate: { type: "object" },
//     name: { type: "string", minLength: 1 },
//     experience: { type: "string", minLength: 1 },
//     email: { type: "string", format: "email", minLength: 1 },
//     ctc: { type: "string", minLength: 1 },
//     joiningDate: { type: "string", format: "date-time", minLength: 1 },
//     team: { type: "string", minLength: 1 },
//     employeeStatus: { type: "string", minLength: 1 },
//     stages: { type: "object" },
//     isOfferReleased: { type: "boolean" },
//   },
//   required: ["selectedCandidate", "name", "email", "joiningDate"],
//   additionalProperties: false,
// };
//# sourceMappingURL=HRMS.schema.js.map