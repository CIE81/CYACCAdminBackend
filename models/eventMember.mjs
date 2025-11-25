import { DataTypes } from 'sequelize';
import sequelize from '../config/connection.mjs';

const EventMember = sequelize.define(
  'EventMember',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_id'
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'member_id'
    }
  },
  {
    tableName: 'event_members',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'member_id']
      }
    ]
  }
);

export default EventMember;

