import { validateToken } from "./validatetoken.js";

let authVerify = async (request, reply, next) => {
  console.log(request.body);
  console.log("*****");
  console.log(request.headers["Authorization"], "header sections");
  try {
    let result = await validateToken(request.body);
    console.log(result, "testing data set");
    if (result.status === true) {
      console.log("success data");
      console.log(result, "sucees data 2");
      next();
    } else {
      reply.send("validaton failed");
    }
  } catch (error) {
    console.log("error is");
    reply.send(error.message);
  }
};

export default authVerify;
