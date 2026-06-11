import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
}

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ token: genToken(user._id), user: { id: user._id, name: user.name, email: user.email } });
}

export {login, register};