import { DataTypes, Model, Deferrable } from "sequelize";
import { sequelize } from "../index";
import Account from "./Account.model";
export default class Person extends Model {
    set created_by(val) {
        this.setDataValue("created_by", val);
    }
}
Person.init({
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    account_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Account,
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        },
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'option_values',
            key: "id",
            deferrable: new Deferrable.INITIALLY_IMMEDIATE(),
        }
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
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
//# sourceMappingURL=Person.model.js.map