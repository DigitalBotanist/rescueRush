import schedule from '../models/scheduleModel.js';
import user from '../../shared/models/userModel.js';
import vehicle from '../../VehicleManagement/models/vehicleModel.js'
import mongoose from 'mongoose';
import { sendEmail, generateEmailContent } from '../../shared/utils/email.js';

// get all 
export const getSchedules = async (req, res) => {
    try {
        const schedules = await schedule.find({}).sort({ createdAt: -1 }); 
        res.status(200).json(schedules); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//get single
export const getScheduleBiID = async (req, res) => {
    const { id } = req.params;
    try {
        const schedule = await schedule.findById(id);
        if (!schedule) {
            return res.status(404).json({ error: 'schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//create new
export const createSchedule = async (req, res) => {
    try {
        const { date, shift, location, vin, driver, paramedic } = req.body;

        if (!date || !shift || !location || !driver || !paramedic) {
            return res.status(400).json({ error: 'Missing required fields' });
          }

          const newSchedule = new schedule({ date, shift, location, vin, driver, paramedic });
          await newSchedule.save();  
        
        const schedule = new schedule({date, shift, location, vin, driver, paramedic});
        await schedule.save();

        const driverUser = await user.findById(driver);
        const paramedicUser = await user.findById(paramedic);

        if (driverUser) {
            const { subject, text } = generateEmailContent('create', driverUser, newSchedule);
            await sendEmail(driverUser.email, subject, text);
          }
      
          if (paramedicUser) {
            const { subject, text } = generateEmailContent('create', paramedicUser, newSchedule);
            await sendEmail(paramedicUser.email, subject, text);
          }
      
          res.status(201).json(newSchedule);
        } catch (err) {
          res.status(400).json({ error: err.message });
        }
      };

       
export const deleteSchedulefull = async (req, res) => {
    const { date, shift } = req.body;
    
    if (!date || !shift) {
        return res.status(400).json({ error: 'Date and shift are required' });
    }

    try {
        // Find and delete schedule with matching date and shift
        const deleteschedule = await schedule.findOneAndDelete({ 
            date, 
            shift 
        });
        
        if (!deleteschedule) {
            return res.status(404).json({ error: 'Schedule not found for given date and shift' });
        }

        const driver = await user.findById(schedule.driver);
        const paramedic = await user.findById(schedule.paramedic);

        if (driver) {
            const { subject, text } = generateEmailContent('delete-full', driver, deleteschedule);
            await sendEmail(driver.email, subject, text);
        }

        if (paramedic) {
            const { subject, text } = generateEmailContent('delete-full', paramedic, deleteschedule);
            await sendEmail(paramedic.email, subject, text);
        }
        
        res.status(200).json({ msg: 'Schedule deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteScheduleById = async (req, res) => {
    const { id } = req.params; 
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid schedule ID' });
    }

    try {
        const deletedSchedule  = await schedule.findByIdAndDelete(id);
        
        if (!deletedSchedule ) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const driver = await user.findById(deletedSchedule .driver);
        const paramedic = await user.findById(deletedSchedule .paramedic);

        // Send email to driver
        if (driver) {
            const { subject, text } = generateEmailContent('delete', driver, deletedSchedule );
            await sendEmail(driver.email, subject, text);
        }

        if (paramedic) {
            const { subject, text } = generateEmailContent('delete', paramedic, deletedSchedule );
            await sendEmail(paramedic.email, subject, text);
        }

        
        res.status(200).json({ 
            msg: 'Schedule deleted successfully',
            deletedSchedule: schedule 
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//update
export const updateSchedule = async (req, res) => {
    const { id } = req.params;
  
    const { date, shift, location, vin, driver, paramedic } = req.body;
    const updates = { date, shift, location, vin, driver, paramedic };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid schedule ID' });
    }

    try {
        const oldSchedule = await schedule.findById(id);
        if (!oldSchedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const updatedSchedule = await schedule.findByIdAndUpdate(id, updates, { new: true });

        const oldDriver = await user.findById(oldSchedule.driver);
        const oldParamedic = await user.findById(oldSchedule.paramedic);

        const newDriver = updates.driver ? await user.findById(updates.driver) : null;
        const newParamedic = updates.paramedic ? await user.findById(updates.paramedic) : null;

        if (updates.driver && oldSchedule.driver.toString() !== updates.driver) {
            if (oldDriver) {
                const { subject, text } = generateEmailContent('update-removed', oldDriver, oldSchedule);
                await sendEmail(oldDriver.email, subject, text);
            }
            if (newDriver) {
                const { subject, text } = generateEmailContent('update-assigned', newDriver, updatedSchedule);
                await sendEmail(newDriver.email, subject, text);
            }
        }

        if (updates.paramedic && oldSchedule.paramedic.toString() !== updates.paramedic) {
            if (oldParamedic) {
                const { subject, text } = generateEmailContent('update-removed', oldParamedic, oldSchedule);
                await sendEmail(oldParamedic.email, subject, text);
            }
            if (newParamedic) {
                const { subject, text } = generateEmailContent('update-assigned', newParamedic, updatedSchedule);
                await sendEmail(newParamedic.email, subject, text);
            }
        }

        res.status(200).json(updatedSchedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



