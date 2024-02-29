import { PayslipServices } from "../../services/Hrms/payslip.service.js";

export async function generatePayslip(request: any, reply: any) {
  //generate payslip for single user request body has userId,Month,year
  console.log("generatePayslip");
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
    console.log(result, "result from getPaySlip Controller");
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}

export async function generateBulkPayslip(request: any, reply: any) {
  console.log("inside generateBulkPayslip control");
  try {
    let result = await PayslipServices.generateBulkPayslip(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}

export async function getPayslipByUserMonth(request: any, reply: any) {
  //generate payslip for single user request body has userId,Month,year
  console.log("getPayslipByUserMonth");
  try {
    let result = await PayslipServices.getPayslipByUserMonth(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}

export async function getAllPaySlipData(request: any, reply: any) {
  console.log("getAllPaySlipData");
  console.log(request.query, "request query from getAllPaySlipData controller");
  try {
    let result = await PayslipServices.getAllPaySlipData(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}

export async function generateBulkPaySlipData(request: any, reply: any) {
  console.log("inside generateBulkPaySlipData");
  console.log(request, "request from generateBulkPaySlipData");
  try {
    let result = await PayslipServices.generateBulkPayslipData(request);
    return result;
  } catch (error) {
    reply.send(error.message);
  }
}
