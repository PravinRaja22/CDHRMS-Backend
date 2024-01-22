import { DataTypes, Model } from "sequelize";
import { sequelize } from "../postgress.js";
export default class users extends Model {
}
users.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
//# sourceMappingURL=user-model.js.map