import { PFDetailsService } from "../../services/Hrms/pfdetails.service.js";
export async function upsertPFDetails(request: any, reply: any) {
    try {
        let result = await PFDetailsService.upsertPFDetails(request.body);
        reply.send(result)
    }
    catch (error) {
        reply.send(error.message)
    }
}


export const getPFDetails = async (request: any, reply: any) => {
    try {
        let result = await PFDetailsService.getPFDetails();
        reply.send(result)
    } catch (error) {
        reply.send(error.message)
    }
}

export const deletePFDetails = async (request: any, reply: any) => {
    try {
        const recId = request.params.id;
        let result = await PFDetailsService.deletePFDetails(recId)
        reply.send(result)

    } catch (error) {
        reply.send(error.message)
    }
}

export const getIndividualPFDetails = async (request:any,reply:any)=>{
    try{
        const recId = request.params.id;
        let result = await PFDetailsService.getIndividualPFDetails(recId)
        reply.send(result)
    }
    catch(error){
        reply.send(error.message)
    }
}