export const headerSchema = {
    type: "object",
    required: ['token'],
    properties: {
        token: { type: "string", format: "uuid" },
    }
};
//# sourceMappingURL=headers.schema.js.map