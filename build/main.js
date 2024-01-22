import * as path from "path";
import fastify from "fastify";
import swagger from "fastify-swagger";
if (require.main === module) {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}
import * as Database from "./database";
import { CacheStore } from "./helpers/CacheStore";
import { checkSessionID } from "./utils/Middleware";
const server = fastify({
    logger: {
        level: "info",
        file: "./logs/log",
    },
});
server.register(swagger, {
    routePrefix: "/api/farmutate/dev/documentation",
    swagger: {
        info: {
            title: "Farmutate APIs",
            description: "Farmutate APIs",
            version: "0.1.0",
        },
        host: "smartapis.cyou",
        schemes: ["https"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [
            { name: 'session' },
            { name: 'account', description: 'In Development. Do Not Test' },
            { name: 'farm', description: 'In Development. Do Not Test' }
        ],
        securityDefinitions: {
            apiKey: {
                type: "apiKey",
                name: "apiKey",
                in: "header",
            },
        },
    },
    exposeRoute: true,
});
const APP_ROUTE_PREFIX = 'api/farmutate/dev';
const APP_PUBLIC_ROUTES = ['/session/start'];
const APP_OPEN_ROUTES = ['/session/identify', '/session/validate'];
const APP_SESSION_ID_HEADER_LABEL = 'token';
server.register(require("./routes"), { prefix: APP_ROUTE_PREFIX });
server.decorateRequest('session', null);
server.decorateRequest('sessionId', null);
server.ready((err) => {
    if (err)
        throw err;
    // server.swagger();
});
//
server.addHook("onRequest", (request, reply, done) => {
    if (request.routerPath.indexOf('/api/farmutate/dev/documentation') > -1)
        done();
    else {
        request.sessionId = request.headers[APP_SESSION_ID_HEADER_LABEL];
        //Populate Session Info into request
        checkSessionID(request.headers[APP_SESSION_ID_HEADER_LABEL]).then((session) => {
            request.session = session;
            //Check Authenticity for non-public routes
            // Note : Authorisation handled in route - hooks
            if (!APP_PUBLIC_ROUTES.includes(request.routerPath.replace('/' + APP_ROUTE_PREFIX, ''))) {
                if (!request.session) {
                    reply.code(401).send();
                }
                else {
                    if (!APP_OPEN_ROUTES.includes(request.routerPath.replace('/' + APP_ROUTE_PREFIX, ''))) {
                        if (!request.session.isValidated) {
                            reply.code(401).send();
                        }
                        else {
                            done();
                        }
                    }
                    else {
                        done();
                    }
                }
            }
            else {
                done();
            }
        }, (error) => {
            reply.code(401).send({ msg: 3 });
        });
        //give the request id back to response for debugging purpose
        reply.header("r-id", request.id);
    }
});
Database.init().then(() => {
    CacheStore.connect().then(() => {
        if (require.main === module) {
            // called directly i.e. "node app"
            server.listen(Number(process.env["PORT"]), (err, address) => {
                console.log("server listening");
                if (err)
                    throw err;
                server.log.info(`server listening on ${address}`);
            });
        }
        else {
            // required as a module => executed on aws lambda
            module.exports = server;
        }
    }, (error) => {
        console.log("Super error", error);
    });
}, (error) => {
    console.log("Super error", error);
});
//# sourceMappingURL=main.js.map