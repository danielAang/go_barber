import jwt from "jsonwebtoken";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    try {
      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: "Password does not match" });
      }
      const { id, name } = user;
      return res.json({
        id,
        name,
        email,
        token: jwt.sign(
          {
            id
          },
          "af9b49ece5e5f36085dba3c41d2e7021",
          { expiresIn: "7d" }
        )
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e });
    }
  }
}

export default new SessionController();
