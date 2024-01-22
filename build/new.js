import fastify from "fastify";
import oauthPlugin from "@fastify/oauth2";
import { connection } from "./database/postgress.js";
const server = fastify({
    logger: true,
});
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
});
connection();
server.get('/login/ms/callback', async function (request, reply) {
    const { token } = await this.msOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    console.log(token.access_token);
    // if later you need to refresh the token you can use
    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(token)
    reply.send({ access_token: token.access_token });
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('test');
    console.log(process.env.DATABASE_CONNECTION_STRING);
    console.log('test2');
    console.log('test2');
    console.log(`Server listening at ${address}`);
});
//# sourceMappingURL=new.js.map