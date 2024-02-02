import { validateToken } from "./validatetoken.js"

let authVerify = async (request, reply, next) => {
    // console.log(request.body.token)
    try {
        let result =await validateToken(request.body.token)
        console.log(result)
        if (result) {
            console.log('success data')
            next()
        }
        else {
            reply.send("validaton failed")
        }

    } catch (error) {
        console.log('error is')
        reply.send(error.message)
    }
}


export default authVerify
