export const sessionResSchema = {
    type: "object",
    properties: {
        sid: { type: "string", format: "uuid" },
    },
};
export const identifyReqSchema = {
    type: "object",
    required: ['username'],
    properties: {
        username: { type: "number", minimum: 6000000000, maximum: 9999999999 },
    }
};
export const authoriseReqSchema = {
    type: "object",
    required: ['otp'],
    properties: {
        otp: { type: "number", minimum: 100000, maximum: 999999 },
    }
};
//# sourceMappingURL=session.schema.js.map