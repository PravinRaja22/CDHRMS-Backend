import { PFDetailsService } from "../../services/Hrms/pfdetails.service.js";
export async function upsertPFDetails(request, reply) {
    try {
        let result = await PFDetailsService.upsertPFDetails(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
}
export const getPFDetails = async (request, reply) => {
    try {
        let result = await PFDetailsService.getPFDetails();
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
export const deletePFDetails = async (request, reply) => {
    try {
        const recId = request.params.id;
        let result = await PFDetailsService.deletePFDetails(recId);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
export const getIndividualPFDetails = async (request, reply) => {
    try {
        const recId = request.params.id;
        let result = await PFDetailsService.getIndividualPFDetails(recId);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
//# sourceMappingURL=pfDetails.controller.js.map