import { houseRentAllowanceService } from "../../services/Hrms/houseRentAllowance.service.js";

export async function getAllHouseRentAllowanceData(request: any, reply: any) {
  try {
    let result = await houseRentAllowanceService.getAllHouseRentAllowanceData();
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getSingleHouseRentAllowanceData(
  request: any,
  reply: any
) {
  console.log(
    request.params.id,
    "getSingleHouseRentAllowanceData callback request"
  );
  try {
    const recId = request.params.id;
    let result = await houseRentAllowanceService.getHouseRentAllowanceDataById(
      recId
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getHouseRentAllowanceDataByUserId(
  request: any,
  reply: any
) {
  console.log(
    request.params.userId,
    "getHouseRentAllowanceDataByUserId callback request"
  );
  try {
    const userId = request.params.userId;
    let result =
      await houseRentAllowanceService.getHouseRentAllowanceDataByUserId(userId);
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function upsertHouseRentAllowanceData(request: any, reply: any) {
  try {
    console.log("upsert House Rent Allowance Data");
    let result = await houseRentAllowanceService.upsertHouseRentAllowanceData(
      request.body
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function deleteHouseRentAllowanceData(request: any, reply: any) {
  try {
    let result = await houseRentAllowanceService.deleteHouseRentAllowanceData(
      request.params.id
    );
    return result;
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
