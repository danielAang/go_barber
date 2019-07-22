import { Model } from "sequelize/types";

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      date: Sequelize.DATE,
      cancelled_at: Sequelize.DATE
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.User, { foreignKey: "provider_id", as: "provider" });
  }
}
export default Appointment;
