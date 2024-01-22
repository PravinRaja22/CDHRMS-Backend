"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Account_controller_1 = require("../controllers/Account.controller");
const account_schema_1 = require("./schemas/account.schema");
const headers_schema_1 = require("./schemas/headers.schema");
exports.default = [
    {
        method: "GET",
        url: "/account/:id",
        handler: Account_controller_1.AccountController.getAccount,
    },
    {
        method: "POST",
        url: "/account/create",
        schema: {
            body: account_schema_1.AccountCreationSchema,
            headers: headers_schema_1.headerSchema,
        },
        handler: Account_controller_1.AccountController.createAccount,
    },
    {
        method: "POST",
        url: "/account/update",
        schema: {
            body: account_schema_1.AccountUpdateSchema,
            headers: headers_schema_1.headerSchema,
        },
        handler: Account_controller_1.AccountController.updateAccount,
    }
];
