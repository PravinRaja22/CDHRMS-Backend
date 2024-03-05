import { eightyCService } from "../../services/Hrms/eightyC.service.js";
export async function getAllEightyCData(request, reply) {
    try {
        const result = await eightyCService.getAllEightyCData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getEightyCDataById(request, reply) {
    try {
        const eightyCId = request.params.id;
        const result = await eightyCService.getEightyCDataById(eightyCId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getEightyCDataByUserId(request, reply) {
    try {
        const eightyCId = request.params.userId;
        const result = await eightyCService.getEightyCDataByUserId(eightyCId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertEightyCData(request, reply) {
    try {
        const result = await eightyCService.upsertEightyCData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteEightyCData(request, reply) {
    try {
        const eightyCId = request.params.id;
        const result = await eightyCService.deleteEightyCData(eightyCId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=eightyC.Controller.js.map