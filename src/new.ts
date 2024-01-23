import fastify from "fastify";
import oauthPlugin from "@fastify/oauth2";
// import { connection } from "./database/postgress.js";
import Routes from "./routes/HRMS/routeshrms.js";
const server = fastify({
  logger:false,
});
server.register(Routes);
 server.register(oauthPlugin, {
    name: 'msOAuth2',
    credentials: {
      client: {
        id: 'ea82ec5f-8eed-4bcd-a8a9-a23281ed90df',
        secret: '67030a96-ed24-4883-bc54-ec3698cdc7ff'
      },
      auth: oauthPlugin.MICROSOFT_CONFIGURATION
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/login/facebook',
    // facebook redirect here after the user login
    callbackUri: 'http://localhost:3000/login/facebook/callback'
  })
  // let postgressconnection = connection();
  // console.log(postgressconnection)
  server.get('/login/ms/callback', async function (request, reply) {
    const { token } = await (this as any).msOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)
  
    console.log(token.access_token)
  
    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)
  
    reply.send({ access_token: token.access_token })
  })

  server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err)
      // process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })