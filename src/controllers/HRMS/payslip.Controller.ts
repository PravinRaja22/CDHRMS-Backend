import { PayslipServices } from "../../services/Hrms/payslip.service.js";

export async function generatePayslip(request: any, reply: any) {
  //generate payslip for single user request body has userId,Month,year

  try {
    let result = await PayslipServices.generatePayslip(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}



export async function getPaySlip(request: any, reply: any) {
  try {
    let result = await PayslipServices.getPayslip(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}


export async function generateBulkPayslip(request: any, reply: any) {
console.log("inside generateBulkPayslip control");
  try {
    let result = await PayslipServices.generateBulkPayslip(request)
    return result;
  } catch (error) {
    reply.send(error.message);
  }

}