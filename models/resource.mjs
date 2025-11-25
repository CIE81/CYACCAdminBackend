import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const Resource = sequelize.define(
  'Resource',
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
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('movie', 'book', 'podcast', 'website'),
      allowNull: false
    }
  },
  {
    tableName: 'resources',
    underscored: true
  }
);

export default Resource;


