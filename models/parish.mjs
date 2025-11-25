import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const Parish = sequelize.define(
  'Parish',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    massSchedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'mass_schedule'
    },
    confessionSchedule: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'confession_schedule'
    }
  },
  {
    tableName: 'parishes',
    underscored: true
  }
);

export default Parish;


