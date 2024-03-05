import { previousEmployeeIncomeService } from "../../services/Hrms/previousEmployeeIncome.service.js";
export async function getAllpreviousEmployeeIncome(request, reply) {
    try {
        let result = await previousEmployeeIncomeService.getAllpreviousEmployeeIncome();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSinglepreviousEmployeeIncome(request, reply) {
    try {
        let result = await previousEmployeeIncomeService.getSinglepreviousEmployeeIncome(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertpreviousEmployeeIncome(request, reply) {
    try {
        let result = await previousEmployeeIncomeService.upsertpreviousEmployeeIncome(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSinglepreviousEmployeeIncomebyuserId(request, reply) {
    try {
        let result = await previousEmployeeIncomeService.getSinglepreviousEmployeeIncomebyuserId(request.params.userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deletepreviousEmployeeIncome(request, reply) {
    try {
        let result = await previousEmployeeIncomeService.deletepreviousEmployeeIncome(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=previousEmployeeIncome.controller.js.map