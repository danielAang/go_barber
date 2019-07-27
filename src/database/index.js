import Sequelize from "sequelize";
import mongoose, { mongo } from "mongoose";

import databaseConfig from "../config/database";
import User from "../app/models/User";
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.initSequelize();
    this.initMongoose();
  }

  initSequelize() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  initMongoose() {
    this.mongooseConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true
    });
  }
}

export default new Database();
