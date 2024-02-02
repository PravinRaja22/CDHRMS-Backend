import { declaredTaxAmountService } from "../../services/Hrms/declaredTaxAmount.service.js";

export async function getAllDeclaredTaxAmountData(request: any, reply: any) {
  try {
    let result = await declaredTaxAmountService.getAllDeclaredTaxAmountData();
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getSingleDeclaredTaxAmountData(request: any, reply: any) {
  console.log(
    request.params.id,
    "getSingleDeclaredTaxAmountData callback request"
  );
  try {
    const recId = request.params.id;
    let result = await declaredTaxAmountService.getDeclaredTaxAmountDataById(
      recId
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getDeclaredTaxAmountDataByUserId(
  request: any,
  reply: any
) {
  console.log(
    request.params.userId,
    "getDeclaredTaxAmountDataByUserId callback request"
  );
  try {
    const userId = request.params.userId;
    let result =
      await declaredTaxAmountService.getDeclaredTaxAmountDataByUserId(userId);
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function upsertDeclaredTaxAmountData(request: any, reply: any) {
  try {
    console.log("upsert Declared Tax Amount Data are");
    let result = await declaredTaxAmountService.upsertDeclaredTaxAmountData(
      request.body
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function deleteDeclaredTaxAmountData(request: any, reply: any) {
  try {
    let result = await declaredTaxAmountService.deleteDeclaredTaxAmountData(
      request.params.id
    );
    return result;
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
