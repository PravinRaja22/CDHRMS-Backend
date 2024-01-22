export const FarmFetchSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "number" },
  },
};

export const FarmSearchSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    search_key: { type: "string" },
  },
};

export const FarmCreationSchema = {
  type: "object",
  required: ["name", "address"],
  properties: {
    name: { type: "string" },
    account_id: { type: "number" },
    address: { type: "string" },
    phone: { type: "number" },
    email: { type: "string", format: "email" },
  },
};

export const FarmUpdateSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    account_id: { type: "number" },
    address: { type: "string" },
    phone: { type: "number" },
    email: { type: "string", format: "email" },
  },
};

export const FarmActivationSchema = {
  type: "object",
  required: ["id", "active"],
  properties: {
    id: { type: "number" },
    active: { type: "boolean" },
  },
};
