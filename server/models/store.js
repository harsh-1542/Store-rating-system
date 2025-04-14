// File: /backend/src/models/store.js
import { DataTypes } from 'sequelize';


export default  (sequelize) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [5, 60]
      }
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Store.associate = (models) => {
    Store.belongsTo(models.User, { foreignKey: 'owner_id', as: 'owner' });
    Store.hasMany(models.Rating, { foreignKey: 'store_id', as: 'ratings' });
  };

  return Store;
};

