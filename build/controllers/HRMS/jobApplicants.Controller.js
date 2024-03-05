import { jobApplicantService } from "../../services/Hrms/jobApplicants.service.js";
export async function getAllJobApplicants(request, reply) {
    try {
        console.log("getAllJobApplicants callback");
        const jobApplicants = await jobApplicantService.getAllJobApplicants();
        reply.send(jobApplicants);
    }
    catch (error) {
        console.error("Error in GET /jobapplicants:", error);
        reply.status(500).json({ error: "Internal Server Error" });
    }
}
export async function getSingleJobApplicant(request, reply) {
    try {
        console.log("getSingleJobApplicant callback");
        console.log(request.params.applicantId, "applicantId");
        const jobApplicant = await jobApplicantService.getJobApplicantById(request.params.applicantId);
        reply.send(jobApplicant);
    }
    catch (error) {
        console.error(`Error in GET /jobapplicants/${request.params.applicantId}:`, error);
        reply.status(500).json({ error: "Internal Server Error" });
    }
}
export async function upsertJobApplicant(request, reply) {
    try {
        console.log("upsertJobApplicant callback");
        console.log("upsert Applicants are");
        console.log(request.body, "upsertJobApplicant Request body");
        const result = await jobApplicantService.upsertJobApplicant(request.body);
        console.log(result, "upsert result");
        reply.send(result);
    }
    catch (error) {
        console.error("Error in POST /jobapplicants:", error);
        reply.status(500).json({ error: "Internal Server Error" });
    }
}
export async function deleteJobApplicant(request, reply) {
    try {
        console.log("deleteJobApplicant callback");
        console.log(request.params.applicantId, "applicantId");
        const result = await jobApplicantService.deleteJobApplicant(request.params.applicantId);
        console.log(result, "delete result");
        reply.send(result);
    }
    catch (error) {
        console.error(`Error in DELETE /jobapplicants/${request.params.applicantId}:`, error);
        reply.status(500).json({ error: "Internal Server Error" });
    }
}
//# sourceMappingURL=jobApplicants.Controller.js.map