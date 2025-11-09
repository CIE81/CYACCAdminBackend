import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const PrayersRequest = sequelize.define(
  'PrayersRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  },
  {
    tableName: 'prayers_requests',
    underscored: true
  }
);

export default PrayersRequest;
