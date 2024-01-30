import { loanService } from "../../services/Hrms/loan.service.js";

export async function getLoans(request: any, reply: any) {
  try {
    const loans = await loanService.getAllLoans();
    reply.send(loans);
  } catch (error: any) {
    console.error("Error in GET /loan:", error);
    reply.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getSingleLoan(request: any, reply: any) {
  console.log(request.params.id, "getSingleLoan callback request");
  try {
    const loan = await loanService.getLoanById(request.params.id);
    reply.send(loan);
  } catch (error: any) {
    console.error(`Error in GET /loan/${request.params.id}:`, error);
    reply.status(500).json({ error: "Internal Server Error" });
  }
}

export async function upsertLoan(request: any, reply: any) {
  try {
    console.log("upsert Loans are");
    const result = await loanService.upsertLoan(request.body);
    reply.send(result);
  } catch (error: any) {
    console.error("Error in POST /loan:", error);
    reply.status(500).json({ error: "Internal Server Error" });
  }
}

export async function deleteLoan(request: any, reply: any) {
  try {
    const result = await loanService.deleteLoan(request.params.id);
    return result;
  } catch (error: any) {
    console.error(`Error in DELETE /loan/${request.params.id}:`, error);
    reply.status(500).json({ error: "Internal Server Error" });
  }
}
