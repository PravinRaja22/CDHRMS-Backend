import { validateToken } from "./validatetoken.js";
let authVerify = async (request, reply) => {
    console.log(request.headers.authorization, "header sections");
    try {
        let result = await validateToken(request.headers.authorization);
        if (result.status === true) {
            console.log("success data");
            request.userData = result;
        }
        else {
            reply.send("validaton failed");
        }
    }
    catch (error) {
        console.log("error is");
        reply.send(error.message);
    }
};
export default authVerify;
//# sourceMappingURL=auth.js.map