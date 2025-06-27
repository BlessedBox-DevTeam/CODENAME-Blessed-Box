const { create, findByCredentials } = require("../models/User");

async function register(req, res) {
  const { username, password, email } = req.body;
  try {
    await create(email, password, email);
    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findByCredentials(email, password);
    if (user) {
      res.json({ message: "Login exitoso", user });
    } else {
      res.json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

module.exports = {
  register,
  login,
};
