import { sequelize } from '../db';
import { DataTypes } from 'sequelize';


const Publisher = sequelize.define('publisher', {
    publisher_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
    }  
},{
    timestamps: false
});

export { Publisher };