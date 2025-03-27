import User from '../../shared/models/userModel.js';
import jwt from 'jsonwebtoken';

export const resourse_manager_login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        if (user.role !== 'manager') {
            return res.status(403).json({ error: 'Access denied: Incorrect credentials' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '1d' });
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const response = await fetch('/api/user/resourse_manager_login', {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
});

const json = await response.json();
if (!response.ok) {
    setIsLoading(false);
    setError(json.error);
}

