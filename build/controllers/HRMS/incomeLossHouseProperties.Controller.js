import { incomeLossHousePropertiesService } from "../../services/Hrms/incomeLossHouseProperties.service.js";
export async function getAllIncomeLossHousePropertiesData(request, reply) {
    try {
        let result = await incomeLossHousePropertiesService.getAllIncomeLossHousePropertiesData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getSingleIncomeLossHousePropertiesData(request, reply) {
    console.log(request.params.id, "getSingleIncomeLossHousePropertiesData callback request");
    try {
        const recId = request.params.id;
        let result = await incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataById(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getIncomeLossHousePropertiesDataByUserId(request, reply) {
    console.log(request.params.userId, "getIncomeLossHousePropertiesDataByUserId callback request");
    try {
        const userId = request.params.userId;
        let result = await incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataByUserId(userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertIncomeLossHousePropertiesData(request, reply) {
    try {
        console.log("upsert Income Loss House Properties Data are");
        let result = await incomeLossHousePropertiesService.upsertIncomeLossHousePropertiesData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteIncomeLossHousePropertiesData(request, reply) {
    try {
        let result = await incomeLossHousePropertiesService.deleteIncomeLossHousePropertiesData(request.params.id);
        return result;
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=incomeLossHouseProperties.Controller.js.map