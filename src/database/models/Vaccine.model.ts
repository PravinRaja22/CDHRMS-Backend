import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";

import Batch from "./Batch.model";
import Person from "./Person.model";

export default class Vaccine extends Model {}

Vaccine.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completed:{
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue : false
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull : false,
      references: {
        model: Batch,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
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
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
