import User from '../../shared/models/userModel.js';

// Call Operator Login
export const loginCallOperator = async (req, res) => {
    const { username, password } = req.body;

    try {
        const operator = await User.findOne({ username });
        if (!operator) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, operator.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: operator._id, role: operator.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, username: operator.username });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};