import { leaveBalanceService } from "../../services/Hrms/leaveBalance.service.js";
export async function getLeaveBalanceByUsers(request, reply) {
    try {
        let queryParams = request.params.userId;
        let result = await leaveBalanceService.getLeaveBalanceByUsers(Number(queryParams));
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertLeaveBalanceByUsers(request, reply) {
    try {
        let queryParams = request.params.userId;
        let requestBody = request.body;
        console.log("upsertLeaveBalanceByUsers");
        let result = await leaveBalanceService.upsertLeaveBalanceByUsers(queryParams, requestBody);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=leaveBalance.Controller.js.map