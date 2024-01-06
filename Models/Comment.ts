import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Comment = sequelize.define('comment', {
    comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    stars: {
        type: DataTypes.INTEGER,
    }
},{
    timestamps: false
});

export { Comment };