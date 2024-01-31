import { otherChaptersService } from "../../services/Hrms/otherChapters.service.js";

export async function getAllOtherChaptersData(request: any, reply: any) {
  try {
    let result = await otherChaptersService.getAllOtherChaptersData();
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getSingleOtherChaptersData(request: any, reply: any) {
  console.log(request.params.id, "getSingleOtherChaptersData callback request");
  try {
    const recId = request.params.id;
    let result = await otherChaptersService.getOtherChaptersDataById(recId);
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function getOtherChaptersDataByUserId(request: any, reply: any) {
  console.log(
    request.params.userId,
    "getOtherChaptersDataByUserId callback request"
  );
  try {
    const userId = request.params.userId;
    let result = await otherChaptersService.getOtherChaptersDataByUserId(
      userId
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function upsertOtherChaptersData(request: any, reply: any) {
  try {
    console.log("upsert Other Chapters are");
    let result = await otherChaptersService.upsertOtherChaptersData(
      request.body
    );
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}

export async function deleteOtherChaptersData(request: any, reply: any) {
  try {
    let result = await otherChaptersService.deleteOtherChaptersData(
      request.params.id
    );
    return result;
  } catch (error: any) {
    reply.status(500).send(error.message);
  }
}
