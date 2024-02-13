export async function testing(request: any, reply: any) {
    try {
        console.log("Inside Testing");
    } catch (error: any) {
        reply.status(500).send(error.message);
    }
}