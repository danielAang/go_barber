import Appointment from "../models/Appointment";
import Notification from "../schemas/Notification";
import * as Yup from "yup";
import User from "../models/User";
import File from "../models/File";
import { startOfHour, parseISO, isBefore, format, subHours } from "date-fns";
import enUS from "date-fns/locale/en-US";
import Queue from "../../lib/Queue";
import CancellationMail from "../jobs/CancellationMail";
class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        cancelled_at: null
      },
      order: ["date"],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ["id", "date"],
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["id", "name"],
          include: {
            model: File,
            as: "avatar",
            attributes: ["id", "path", "url"]
          }
        }
      ]
    });
    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation fails" });
    }

    const { provider_id, date } = req.body;
    const isUserProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isUserProvider) {
      return res
        .status(401)
        .json({ error: "You can only create appointments as a provider" });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: "Past days are not permmited" });
    }

    /**
     * Check availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart
      }
    });
    if (checkAvailability) {
      return res.status(400).json({ error: "Appointment date is available" });
    }

    /**
     * Notificate appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(hourStart, "MMMM dd, yyyy 'at' HH:mm aa", {
      locale: enUS
    });

    await Notification.create({
      content: `New appointment from ${user.name} to ${formattedDate}`,
      user: provider_id
    });

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    console.log("ID: " + req.params.id);
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "provider",
          attributes: ["name", "email"]
        },
        {
          model: User,
          as: "user",
          attributes: ["name"]
        }
      ]
    });
    if (!appointment) {
      res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.user_id !== req.userId) {
      res.status(401).json({
        error: "You don't have permission to cancel this appointment"
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res
        .status(401)
        .json({ error: "You can only cancel appointments 2hrs in advance" });
    }

    appointment.cancelled_at = new Date();
    await appointment.save();

    Queue.add(CancellationMail.key, { appointment });

    return res.json(appointment);
  }
}

export default new AppointmentController();
