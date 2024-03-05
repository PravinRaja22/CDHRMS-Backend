import { medicalSectionEightyDService } from "../../services/Hrms/medicalSectionEightyD.service.js";
export async function getAllMedicalSectionEightyDData(request, reply) {
    try {
        let result = await medicalSectionEightyDService.getAllMedicalSectionEightyDData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getMedicalSectionEightyDDataById(request, reply) {
    console.log(request.params.id, "getMedicalSectionEightyDDataById callback request");
    try {
        const recId = request.params.id;
        let result = await medicalSectionEightyDService.getMedicalSectionEightyDDataById(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getMedicalSectionEightyDDataByUserId(request, reply) {
    console.log(request.params.userId, "getMedicalSectionEightyDDataByUserId callback request");
    try {
        const userId = request.params.userId;
        let result = await medicalSectionEightyDService.getMedicalSectionEightyDDataByUserId(userId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertMedicalSectionEightyDData(request, reply) {
    try {
        console.log("upsert Medical Section 80D Data are");
        let result = await medicalSectionEightyDService.upsertMedicalSectionEightyDData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteMedicalSectionEightyDData(request, reply) {
    try {
        let result = await medicalSectionEightyDService.deleteMedicalSectionEightyDData(request.params.id);
        return result;
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=medicalSectionEightyD.Controller.js.map