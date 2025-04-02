import mongoose from "mongoose";
import Hospital from "../../shared/models/hospitalModel.js";

//get
export const getdetails = async (req, res) => {
    const getDetails = await Hospital.find({});

    res.status(200).json(getDetails);
};

//get using id
export const getdetailsbyid = async (req, res) => {
    const User_id = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ ërror: "No such workoutdfddf" });
    }

    const detail = await Hospital.findById(id);

    if (!detail) {
        return res.status(400).json({ ërror: "No such workout21221" });
    }

    return res.status(200).json(detail);
};

//create
export const createDetails = async (req, res) => {
    const { location, name,city, Bed, ICU, Emergency_Unit } = req.body;
    // add doc to db
    try {
        const User_id = req.user._id;
        const detail = await Hospital.createNew(
            location,
            name,
            city,
            Bed,
            ICU,
            Emergency_Unit,
            User_id
        );
        res.status(200).json(detail);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

//delete
export const deleteDetails = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ ërror: "No details" });
    }

    const detail = await Hospital.findOneAndDelete({ _id: id });

    if (!detail) {
        return res.status(400).json({ ërror: "No details" });
    }

    return res.status(200).json(detail);
};

//update
export const upadateDetails = async (req, res) => {
    const { _id: id } = req.user;
    const { location, name,city, Bed, ICU, Emergency_Unit } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ ërror: "No details" });
    }

    const detail = await Hospital.findOneAndUpdate(
        { user_id: id },
        {
            location,
            name,
            city,
            Bed,
            ICU,
            Emergency_Unit,
        },
        {
            new: true,
        }
    );

    if (!detail) {
        return res.status(400).json({ error: "No details" });
    }

    return res.status(200).json(detail);
};
