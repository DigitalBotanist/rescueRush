import jwt from "jsonwebtoken";
import User from "../../shared/models/userModel.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const rootDir = path.resolve(process.cwd());

// create a jwt for admin
export const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "6h" });
};

// admin creates a new user
export const createNewUser = async (req, res) => {
    const { first, last, email, password, role } = req.body;

    try {
        // Create the new user
        const user = await User.createNew(first, last, email, password, role);

        // add image
        if (req.file) {
            const ext = path.extname(req.file.originalname);
            const newFilename = `${user._id}${ext}`;
            const originalFilePath = path.join(rootDir, "uploads", newFilename);

            try {
                // Resize the image before saving
                await sharp(req.file.path)
                    .resize(300, 300) // Resize to 300x300 pixels (you can change the dimensions)
                    .toFile(originalFilePath);
                    const profileImageUrl = `/uploads/${newFilename}`;
                user.profileImage = profileImageUrl;
                await user.save();
                fs.unlinkSync(req.file.path); // Delete the temporary file
            } catch (err) {
                console.log("Error during sharp processing:", err);

                return res.status(500).json({ error: "Error resizing image" });
            }
        }

        // Send response back to the client
        res.status(200).json({ msg: "New account is created", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateUserPicture = async (req, res) => {
    const userId = req.params.userId;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const ext = path.extname(file.originalname);
    const newFilename = `${userId}${ext}`;
    const newFilePath = path.join(rootDir, "uploads", newFilename);

    try {
        // Resize the image before saving
        await sharp(file.path).resize(300, 300).toFile(newFilePath);

        // Delete the temporary file
        fs.unlinkSync(file.path);

        // Update the user with the new profile image URL (update in database)
        const profileImageUrl = `/uploads/${newFilename}`;
        const user = await User.findById(userId);
        user.profileImage = profileImageUrl;
        await user.save();

        // Return updated user data
        res.status(200).json({ profileImage: profileImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process image" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({ users });
    } catch (error) {
        res.status(400).json({ Error: error.message });
    }
};
export const deleteUser = async (req, res) => {
    const { id } = req.params; // Extract ID from the URL parameter

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// login as a admin
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        if (user.role !== "admin") {
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
