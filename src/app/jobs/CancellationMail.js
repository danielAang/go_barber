import Mail from "../../lib/Mail";
import { format, parseISO } from "date-fns";
import enUS from "date-fns/locale/en-US";

class CancellationMail {
  get key() {
    return "CancellationMail";
  }

  async handle({ data }) {
    console.log("Executing queue with data: " + data);
    const { appointment } = data;
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: "Appointment cancelled",
      template: "cancellation",
      context: {
        provider_name: appointment.provider.name,
        user_name: appointment.user.name,
        appointment_date: format(
          parseISO(appointment.date),
          "MMMM dd, yyyy 'at' HH:mm aa",
          {
            locale: enUS
          }
        )
      }
    });
  }
}

export default new CancellationMail();
