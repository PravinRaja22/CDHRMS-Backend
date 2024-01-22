import { SessionController } from "../controllers/Session.controller";
import { identifyReqSchema, authoriseReqSchema } from "./schemas/session.schema";
import { headerSchema } from "./schemas/headers.schema";
export default [
    {
        method: "GET",
        url: "/session/start",
        schema: {
            tags: ['session']
        },
        handler: SessionController.startSession,
    },
    {
        method: "POST",
        url: "/session/identify",
        schema: {
            tags: ['session'],
            body: identifyReqSchema,
            headers: headerSchema,
        },
        handler: SessionController.identify,
    },
    {
        method: "POST",
        url: "/session/validate",
        schema: {
            tags: ['session'],
            body: authoriseReqSchema,
            headers: headerSchema,
        },
        handler: SessionController.validate,
    }
];
//# sourceMappingURL=session.routes.js.map