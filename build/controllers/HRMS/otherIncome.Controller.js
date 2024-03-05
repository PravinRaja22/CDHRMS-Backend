import { otherIncomeService } from "../../services/Hrms/otherIncome.service.js";
export async function getAllOtherIncomeData(request, reply) {
    try {
        let result = await otherIncomeService.getAllOtherIncomeData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSingleOtherIncomeData(request, reply) {
    console.log(request.params.id, "getSingleOtherIncomeData callback request");
    try {
        const recId = request.params.id;
        let result = await otherIncomeService.getOtherIncomeDataById(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getOtherIncomeDataByUserId(request, reply) {
    console.log(request.params.userId, "getOtherIncomeDataByUserId callback request");
    try {
        const userId = request.params.userId;
        let result = await otherIncomeService.getOtherIncomeDataByUserId(userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertOtherIncomeData(request, reply) {
    try {
        console.log("upsert Other Income Data are");
        let result = await otherIncomeService.upsertOtherIncomeData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteOtherIncomeData(request, reply) {
    try {
        let result = await otherIncomeService.deleteOtherIncomeData(request.params.id);
        return result;
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=otherIncome.Controller.js.map