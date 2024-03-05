import { scheduleInterviewService } from "../../services/Hrms/scheduleInterview.service.js";
export async function getAllScheduledInterviews(request, reply) {
    try {
        let result = await scheduleInterviewService.getAllScheduledInterviews();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getScheduledInterviewById(request, reply) {
    console.log(request.params.applicantId, "getScheduledInterviewById callback request");
    try {
        const interviewId = request.params.applicantId;
        let result = await scheduleInterviewService.getScheduledInterviewById(interviewId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertScheduledInterview(request, reply) {
    try {
        console.log("scheduleInterview");
        let result = await scheduleInterviewService.upsertScheduledInterview(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send({ error: error.message });
    }
}
export async function cancelScheduledInterview(request, reply) {
    try {
        console.log("cancelScheduledInterview");
        let result = await scheduleInterviewService.cancelScheduledInterview(request.params.applicantId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=scheduleInterview.Controller.js.map