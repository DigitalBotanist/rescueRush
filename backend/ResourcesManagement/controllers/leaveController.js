import mongoose from 'mongoose';
import Leave from '../models/leaveModel.js';
import User from '../../shared/models/userModel.js';

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const userId = req.user.id;
    const email = req.user.email;

    const leaveRequest = new leave({
      user: userId,
      email,
      type,
      startDate,
      endDate,
      status: 'pending',
    });

    await leaveRequest.save();

    res.status(201).json({
      msg: 'Leave request created successfully',
      leaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Notify the resource manager
    const managers = await User.find({ role: 'resource_manager' });
    for (const manager of managers) {
      const notification = new Notification({
        message: New leave request from ${req.user.name} (${req.user.employeeId}) for ${leaveType},
        recipient: manager._id,
      });
      await notification.save();
    }

    res.status(201).json({
      msg: 'Leave request created successfully',
      leaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};*/

// Get leave requests for the logged-in user (employee)
export const getMyLeaveRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const leaveRequests = await Leave.find({ user: userId }).populate('user', 'firstName lastName');

    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leave requests (for resource manager)
export const getAllLeaveRequests = async (req, res) => {
  try {

    const leaveRequests = await Leave.find().populate('user', 'firstName lastName');
    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a leave request (employee or manager)
export const updateLeaveRequest = async (req, res) => {
  const { id } = req.params;
  const { type, startDate, endDate, status } = req.body;
  const updates = { type, startDate, endDate };

  if (status) updates.status = status; // Only managers can update status

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid leave request ID' });
  }

  try {
    const leaveRequest = await Leave.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Check permissions
    if (req.user.role !== 'manager' && leaveRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If employee is updating, prevent status changes
    if (req.user.role !== 'manager' && status) {
      return res.status(403).json({ error: 'Only resource managers can update status' });
    }

    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(id, updates, { new: true });

    

    res.status(200).json({
      msg: 'Leave request updated successfully',
      updatedLeaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a leave request (employee or manager)
export const deleteLeaveRequest = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid leave request ID' });
  }

  try {
    const leaveRequest = await Leave.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Check permissions
    if (req.user.role !== 'manager' && leaveRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedLeaveRequest = await Leave.findByIdAndDelete(id);

    

    res.status(200).json({
      msg: 'Leave request deleted successfully',
      deletedLeaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for the logged-in user
/*export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};*/