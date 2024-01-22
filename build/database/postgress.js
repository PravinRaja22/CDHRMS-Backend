import { Sequelize } from "Sequelize";
export const connection = async () => {
    const sequelize = new Sequelize('test', 'postgres', 'admin', {
        host: 'localhost',
        dialect: 'postgres',
    });
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
//# sourceMappingURL=postgress.js.map