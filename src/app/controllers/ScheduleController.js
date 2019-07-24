import Appointment from "../models/Appointment";

class ScheduleController {
  async index(req, res) {
    const schedule = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        date: req.query.date
      }
    });
    return res.json(schedule);
  }
}

export default new ScheduleController();
