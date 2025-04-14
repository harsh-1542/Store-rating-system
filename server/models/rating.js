// File: /backend/src/models/rating.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Rating = sequelize.define('Rating', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['store_id', 'user_id']
      }
    ]
  });

  Rating.associate = (models) => {
    Rating.belongsTo(models.Store, { foreignKey: 'store_id', as: 'store' });
    Rating.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Rating;
};
