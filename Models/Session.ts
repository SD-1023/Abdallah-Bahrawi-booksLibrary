import { sequelize } from '../db';
import { DataTypes } from 'sequelize';

const Session = sequelize.define("Session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    isAuth: {
      type: DataTypes.BOOLEAN, 
      defaultValue: false,
    }
},{
    timestamps: false
});
  
export { Session };