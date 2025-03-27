import User from '../../shared/models/userModel.js';
import jwt from 'jsonwebtoken';

export const resourse_manager_login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        if (user.role !== 'admin' && user.role !== 'manager') {
            return res.status(403).json({ error: 'Access denied: Incorrect credentials' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '1d' });
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


