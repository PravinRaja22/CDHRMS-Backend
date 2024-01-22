import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";
import Farm from "./Farm.model";
import Account from "./Account.model";
import Person from "./Person.model";
import OptionValue from "./OptionValue.model";
export default class Batch extends Model {
}
Batch.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    batch_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: OptionValue,
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    no_of_birds: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    farm_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Farm,
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        },
    },
    cost_per_bird: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    supplier: {
        type: DataTypes.INTEGER,
        references: {
            model: Account,
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        },
        allowNull: true,
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
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    scopes: {
        withAccount: {
            include: [
                { model: Account }
            ]
        }
    }
});
//# sourceMappingURL=Batch.model.js.map