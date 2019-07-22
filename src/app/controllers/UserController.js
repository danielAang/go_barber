import * as Yup from "yup";
import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(4)
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation failed" });
    }
    const existsUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (existsUser) {
      return res.status(400).json({ error: "User already exists." });
    }
    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(4),
        password: Yup.string()
          .min(4)
          .when("oldPassword", (oldPassword, field) => {
            return oldPassword ? field.required() : field;
          })
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validation failed" });
      }
      const { email, oldPassword } = req.body;
      const user = await User.findByPk(req.userId);
      if (email !== user.email) {
        const existsUser = await User.findOne({ where: { email } });
        if (existsUser) {
          return res.status(400).json({ error: "User already exists." });
        }
      }
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Password does not match" });
      }
      const { id, name, provider } = await user.update(req.body);
      return res.json({
        id,
        name,
        email,
        provider
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  }
}

export default new UserController();
