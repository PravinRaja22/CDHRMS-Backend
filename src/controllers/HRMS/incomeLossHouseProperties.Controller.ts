import { incomeLossHousePropertiesService } from "../../services/Hrms/incomeLossHouseProperties.service.js";
export async function getAllIncomeLossHousePropertiesData(
  request: any,
  reply: any
) {
  try {
    let result =
      await incomeLossHousePropertiesService.getAllIncomeLossHousePropertiesData();
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getSingleIncomeLossHousePropertiesData(
  request: any,
  reply: any
) {
  console.log(
    request.params.id,
    "getSingleIncomeLossHousePropertiesData callback request"
  );
  try {
    const recId = request.params.id;
    let result =
      await incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataById(
        recId
      );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getIncomeLossHousePropertiesDataByUserId(
  request: any,
  reply: any
) {
  console.log(
    request.params.userId,
    "getIncomeLossHousePropertiesDataByUserId callback request"
  );
  try {
    const userId = request.params.userId;
    let result =
      await incomeLossHousePropertiesService.getIncomeLossHousePropertiesDataByUserId(
        userId
      );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function upsertIncomeLossHousePropertiesData(
  request: any,
  reply: any
) {
  try {
    console.log("upsert Income Loss House Properties Data are");
    let result =
      await incomeLossHousePropertiesService.upsertIncomeLossHousePropertiesData(
        request.body
      );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function deleteIncomeLossHousePropertiesData(
  request: any,
  reply: any
) {
  try {
    let result =
      await incomeLossHousePropertiesService.deleteIncomeLossHousePropertiesData(
        request.params.id
      );
    return result;
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
