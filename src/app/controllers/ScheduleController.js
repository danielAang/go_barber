import Appointment from "../models/Appointment";
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";

class ScheduleController {
  async index(req, res) {
    const date = req.query.date;

    const parsedDate = parseISO(date);

    const schedule = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ["date"]
    });
    return res.json(schedule);
  }
}

export default new ScheduleController();
