import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";

import Batch from "./Batch.model";
import Shed from "./Shed.model";
import Person from "./Person.model";

export default class BatchShed extends Model {}

BatchShed.init(
  {
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Batch,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    shed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Shed,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: {
        model: Person,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
      allowNull: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
