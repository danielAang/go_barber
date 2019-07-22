import jwt from "jsonwebtoken";
import User from "../models/User";
import authConfig from "../../config/auth";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    let _user;
    User.findOne({ where: { email } })
      .then(user => {
        _user = user;
        return user.checkPassword(password);
      })
      .catch(err => {
        return res.status(500).json({ error: err.message });
      })
      .then(bool => {
        if (bool) {
          return res.json({
            id: _user.id,
            name: _user.name,
            email: _user.email,
            token: jwt.sign(
              {
                id: _user.id
              },
              authConfig.secret,
              { expiresIn: authConfig.expiresIn }
            )
          });
        } else {
          return res.status(401).json({ error: "Password does not match" });
        }
      })
      .catch(err => {
        return res.status(500).json({ error: err.message });
      });
  }
}

export default new SessionController();
