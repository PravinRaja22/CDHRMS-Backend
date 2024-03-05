import { houseRentAllowanceService } from "../../services/Hrms/houseRentAllowance.service.js";
export async function getAllHouseRentAllowanceData(request, reply) {
    try {
        let result = await houseRentAllowanceService.getAllHouseRentAllowanceData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSingleHouseRentAllowanceData(request, reply) {
    console.log(request.params.id, "getSingleHouseRentAllowanceData callback request");
    try {
        const recId = request.params.id;
        let result = await houseRentAllowanceService.getHouseRentAllowanceDataById(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getHouseRentAllowanceDataByUserId(request, reply) {
    console.log(request.params.userId, "getHouseRentAllowanceDataByUserId callback request");
    try {
        const userId = request.params.userId;
        let result = await houseRentAllowanceService.getHouseRentAllowanceDataByUserId(userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertHouseRentAllowanceData(request, reply) {
    try {
        console.log("upsert House Rent Allowance Data");
        let result = await houseRentAllowanceService.upsertHouseRentAllowanceData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteHouseRentAllowanceData(request, reply) {
    try {
        let result = await houseRentAllowanceService.deleteHouseRentAllowanceData(request.params.id);
        return result;
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=houseRentAllowance.Controller.js.map