import { medicalInsuranceService } from "../../services/Hrms/medicalInsurance.service.js"


export async function getMedicalInsurances (request:any,reply:any){
    try{
        let result = await medicalInsuranceService.getMedicalInsurances()
        reply.send(result)
    }catch(error:any){
        reply.status(500).send(error.message)
    }
}

export async function upsertMedicalInsurances(request:any,reply:any){
    try{
        let result = await medicalInsuranceService.upsertMedicalInsurances(request.body)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function getMedicalInsurancesById(request:any,reply:any){
    try{
        let result = await medicalInsuranceService.getMedicalInsurancesById(request.params.id)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}

export async function deleteMedicalInsurancesById(request:any,reply:any){
    try{
        let result = await medicalInsuranceService.deleteMedicalInsurancesById(request.params.id)
        reply.send(result)
    }catch(error){
        reply.status(500).send(error.message)
    }
}