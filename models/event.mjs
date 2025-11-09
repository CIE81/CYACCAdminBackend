import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const Event = sequelize.define(
  'Event',
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
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_date_time'
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_date_time'
    },
    pictureLink: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'picture_link'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'events',
    underscored: true
  }
);

export default Event;
