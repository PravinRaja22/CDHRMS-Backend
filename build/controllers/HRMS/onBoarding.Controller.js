import { onboardingService } from "../../services/Hrms/onBoarding.service.js";
export async function getAllOnboardingData(request, reply) {
    try {
        let result = await onboardingService.getAllOnboardingData();
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.error || error.message);
    }
}
export async function getSingleOnboardingData(request, reply) {
    console.log(request.params.id, "getSingleOnboardingData callback request");
    try {
        const recId = request.params.id;
        let result = await onboardingService.getSingleOnboardingData(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.error || error.message);
    }
}
export async function upsertOnboardingData(request, reply) {
    try {
        console.log("upsert Onboarding Data");
        let result = await onboardingService.upsertOnboardingData(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.error || error.message);
    }
}
export async function deleteOnboardingData(request, reply) {
    try {
        console.log("Delete Onboarding Data");
        const recId = request.params.id;
        let result = await onboardingService.deleteOnboardingData(recId);
        reply.send(result);
    }
    catch (error) {
        reply.status(500).send(error.error || error.message);
    }
}
//# sourceMappingURL=onBoarding.Controller.js.map