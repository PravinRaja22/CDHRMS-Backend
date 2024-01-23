import { leaveService } from "../../services/Hrms/leave.service.js";
export async function getLeaveData(request, reply) {
    try {
        let result = await leaveService.getLeaves();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSingleLeaves(request, reply) {
    try {
        let result = await leaveService.getSingleLeaves(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertLeaves(request, reply) {
    try {
        let result = await leaveService.upsertLeaves(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getLeavesByUsers(request, reply) {
    try {
        let result = await leaveService.getLeavesByUsers(request.params.userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getLeavesByApprover(request, reply) {
    try {
        let result = await leaveService.getLeavesByUsers(request.params.approverId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=leave.Controller.js.map