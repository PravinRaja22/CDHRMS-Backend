import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";

import MetricPreset from "./MetricPreset.model";
import Person from "./Person.model";

export default class MetricPresetEntry extends Model {}

MetricPresetEntry.init(
  {
    metric_preset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MetricPreset,
        key: "id",
        deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
      },
    },
    week: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_feed: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_water: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
