// File: /backend/src/models/index.js
import { Sequelize } from 'sequelize';
import config from '../config/database.js';

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false
  }
);

import User from './user.js';
import Store from './store.js';
import Rating from './rating.js';

const models = {
  User: User(sequelize),
  Store: Store(sequelize),
  Rating: Rating(sequelize)
};

// Run associations if they exist
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
