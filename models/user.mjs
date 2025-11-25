import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'user_name'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    superAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'super_admin'
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'reset_token'
    },
    resetTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'reset_token_expires'
    }
  },
  {
    tableName: 'users',
    underscored: true
  }
);

export default User;
