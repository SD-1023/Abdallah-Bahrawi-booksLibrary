import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Book = sequelize.define('book', {
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    year: {
        type: DataTypes.DATE,
    },
    author: {
        type: DataTypes.STRING,
    },
    pages: {
        type: DataTypes.INTEGER,
    }
},{
    timestamps: false
});

export { Book };