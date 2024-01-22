import { FarmController } from "../controllers/Farm.controller";
import {
  FarmFetchSchema,
  FarmCreationSchema,
  FarmUpdateSchema,
  FarmSearchSchema,
  FarmActivationSchema
} from "./schemas/farm.schema";
import { headerSchema } from "./schemas/headers.schema";
export default [
  {
    method: "GET",
    url: "/farm/:id",
    schema: {
      tags: ["farm"],
      params: FarmFetchSchema,
      headers: headerSchema,
    },
    handler: FarmController.getFarm,
  },
  {
    method: "POST",
    url: "/farm/create",
    schema: {
      tags: ["farm"],
      body: FarmCreationSchema,
      headers: headerSchema,
    },
    handler: FarmController.createFarm,
  },
  {
    method: "POST",
    url: "/farm/update",
    schema: {
      tags: ["farm"],
      body: FarmUpdateSchema,
      headers: headerSchema,
    },
    handler: FarmController.updateFarm,
  },
  {
    method: "POST",
    url: "/farm/search",
    schema: {
      tags: ["farm"],
      body: FarmSearchSchema,
      headers: headerSchema,
    },
    handler: FarmController.searchFarms,
  },
  {
    method: "POST",
    url: "/farm/activate",
    schema: {
      tags: ["farm"],
      body: FarmActivationSchema,
      headers: headerSchema,
    },
    handler: FarmController.updateFarm,
  }
];
