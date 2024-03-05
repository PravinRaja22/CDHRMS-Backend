export async function testing(request, reply) {
    try {
        console.log("Inside Testing");
        console.log(request);
        console.log(request.files);
        let url = request.protocol + "://" + request.headers.host + "/" + request.files[0].filename;
        console.log(url);
    }
    catch (error) {
        reply.status(500).send(error.message);
    }
}
//# sourceMappingURL=testing.controller.js.map