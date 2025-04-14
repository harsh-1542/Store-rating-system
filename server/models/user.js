// File: /backend/src/models/user.js
import { DataTypes } from 'sequelize';

export default  (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [3, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'store_owner'),
      defaultValue: 'user'
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Store, { foreignKey: 'owner_id', as: 'ownedStores' });
    User.hasMany(models.Rating, { foreignKey: 'user_id', as: 'ratings' });
  };

  return User;
};
