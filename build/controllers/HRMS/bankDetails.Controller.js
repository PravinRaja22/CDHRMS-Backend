import { bankDetailsService } from "../../services/Hrms/bankdetails.service.js";
export async function upsertBankDetails(request, reply) {
    try {
        let result = await bankDetailsService.upsertBankDetails(request.body);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
}
export const getBankDetails = async (request, reply) => {
    try {
        let result = await bankDetailsService.getBankDetails();
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
export const deleteBankDetails = async (request, reply) => {
    try {
        const recId = request.params.id;
        let result = await bankDetailsService.deleteBankDetails(recId);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
export const getIndividualBankDetails = async (request, reply) => {
    try {
        const recId = request.params.id;
        let result = await bankDetailsService.getIndividualBankDetails(recId);
        reply.send(result);
    }
    catch (error) {
        reply.send(error.message);
    }
};
//# sourceMappingURL=bankDetails.Controller.js.map