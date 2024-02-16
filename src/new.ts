import fastify from "fastify";
import oauthPlugin from "@fastify/oauth2";
import cors from "@fastify/cors";
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join,resolve  } from 'path';
import Multer from 'fastify-multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDir = resolve(__dirname, '..');

console.log(__filename ,'fileName')
console.log(parentDir ,'Dir Name')
console.log(join(parentDir, "uploads") ,'join  Name')
// import { connection } from "./database/postgress.js";
import Routes from "./routes/HRMS/routeshrms.js";
import path from "path";
const server = fastify({
  logger: false,
});
await server.register(cors);
server.register(Multer.contentParser)
server.register(Routes);
server.register(fastifyStatic, {
  root: join(parentDir, "uploads"),
});

// server.register(oauthPlugin, {
//   name: "msOAuth2",
//   credentials: {
//     client: {
//       id: "ea82ec5f-8eed-4bcd-a8a9-a23281ed90df",
//       secret: "67030a96-ed24-4883-bc54-ec3698cdc7ff",
//     },
//     auth: oauthPlugin.MICROSOFT_CONFIGURATION,
//   },
//   // register a fastify url to start the redirect flow
//   startRedirectPath: "/login/facebook",
//   // facebook redirect here after the user login
//   callbackUri: "http://localhost:3000/login/facebook/callback",
// });
// let postgressconnection = connection();
// console.log(postgressconnection)
server.get("/login/ms/callback", async function (request, reply) {
  const { token } = await (
    this as any
  ).msOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

  console.log(token.access_token);

  // if later you need to refresh the token you can use
  // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)

  reply.send({ access_token: token.access_token });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    // process.exit(1)
  }
  console.log(`Server listening at ${address}`);
});
