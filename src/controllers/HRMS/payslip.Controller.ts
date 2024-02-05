import { PayslipServices } from "../../services/Hrms/payslip.service.js"

export async function generatePayslip(request:any,reply:any){
    try{
        let result = await PayslipServices.generatePayslip(request)
        return result
    }
    catch(error){
        reply.send(error.message)
    }
}