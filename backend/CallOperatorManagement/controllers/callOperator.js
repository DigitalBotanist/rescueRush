import User from "../../shared/models/userModel.js";
import jwt from "jsonwebtoken";

// create a jwt
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "6h" });
};

export const callOpLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        console.log(user.role);
        if (user.role !== "admin" && user.role !== "callop") {
            return res.status(403).json({ error: "Permission denied" });
        }

        // create token
        const token = createToken(user._id);

        const safeUser = user.toObject();
        delete safeUser.password;

        res.status(200).json({ ...safeUser, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createEmergency = async (req, res) => {
    const { location, caller, details, patients, emergencyType } = req.body;
    const token = req.token;

    console.log(location)

    const formattedLocation = {
        type: "Point",
        coordinates: [location.lng, location.lat],
    }  


    try {
        const response = await fetch(
            `http://localhost:${process.env.PORT}/api/fleet/create_emergency`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    location: formattedLocation,
                    caller,
                    details,
                    patients,
                    emergencyType,
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) {
            res.status(400).json({ ...data });
            return
        }
        res.status(200).json({ ...data });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching data",
            error: error.message,
        });
    }
};
