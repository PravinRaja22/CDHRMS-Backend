import { medicalInsuranceService } from "../../services/Hrms/medicalInsurance.service.js";
export async function getMedicalInsurances(request, reply) {
    try {
        let result = await medicalInsuranceService.getMedicalInsurances();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function upsertMedicalInsurances(request, reply) {
    try {
        let result = await medicalInsuranceService.upsertMedicalInsurances(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function getMedicalInsurancesById(request, reply) {
    try {
        let result = await medicalInsuranceService.getMedicalInsurancesById(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
export async function deleteMedicalInsurancesById(request, reply) {
    try {
        let result = await medicalInsuranceService.deleteMedicalInsurancesById(request.params.id);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=medicalInsurance.Controller.js.map