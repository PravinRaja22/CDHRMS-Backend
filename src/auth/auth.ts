import { validateToken } from "./validatetoken.js";

let authVerify = async (request, reply, next) => {

  console.log(request.headers.authorization , "header sections");

  try {
    let result = await validateToken(request.headers.authorization);
    // console.log(result, "testing data set");
    if (result.status === true) {
      console.log("success data");
      request.userData = result;
      next();
    //   done()
    } else {
      reply.send("validaton failed");
    }
  } catch (error) {
    console.log("error is");
    reply.send(error.message);
  }
};

export default authVerify;
