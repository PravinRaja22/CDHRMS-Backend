import { AccountController } from "../controllers/Account.controller.js";
import { AccountFetchSchema, AccountCreationSchema, AccountUpdateSchema, AccountSearchSchema, AccountActivationSchema } from "./schemas/account.schema.js";
import { headerSchema } from "./schemas/headers.schema.js";
export default [
    {
        method: "GET",
        url: "/account/:id",
        schema: {
            tags: ["account"],
            params: AccountFetchSchema,
            headers: headerSchema,
        },
        handler: AccountController.getAccount,
    },
    {
        method: "POST",
        url: "/account/create",
        schema: {
            tags: ["account"],
            body: AccountCreationSchema,
            headers: headerSchema,
        },
        handler: AccountController.createAccount,
    },
    {
        method: "POST",
        url: "/account/update",
        schema: {
            tags: ["account"],
            body: AccountUpdateSchema,
            headers: headerSchema,
        },
        handler: AccountController.updateAccount,
    },
    {
        method: "POST",
        url: "/account/search",
        schema: {
            tags: ["account"],
            body: AccountSearchSchema,
            headers: headerSchema,
        },
        handler: AccountController.getAccounts,
    },
    {
        method: "POST",
        url: "/account/activate",
        schema: {
            tags: ["account"],
            body: AccountActivationSchema,
            headers: headerSchema,
        },
        handler: AccountController.updateAccount,
    }
];
//# sourceMappingURL=account.routes.js.map