import mongoose from 'mongoose';
import LeaveRequest from '../models/leave.js';
import userModel from '../../shared/models/User.js';

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.body;
    const userId = req.user.id;
    const email = req.user.email;

    const leaveRequest = new LeaveRequest({
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
    const leaveRequests = await LeaveRequest.find({ user: userId }).populate('user', 'firstName lastName');

    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leave requests (for resource manager)
export const getAllLeaveRequests = async (req, res) => {
  try {
    if (req.user.role !== 'manager') {
      return res.status(403).json({ error: 'Access denied. Resource managers only.' });
    }

    const leaveRequests = await LeaveRequest.find().populate('user', 'firstName lastName');
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
    const leaveRequest = await LeaveRequest.findById(id);
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

    /* Changed: Removed notification code and duplicate response
       - Removed notification code to avoid errors from undefined Notification model, incorrect fields (req.user.name, req.user.employeeId, leaveRequest.leaveType), and incorrect variable names (user, oldLeaveRequest, LeaveRequest.user).
       - Removed duplicate res.status(200).json call that used undefined updateLeaveRequest variable to prevent "Cannot set headers" error.
    */

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
    const leaveRequest = await LeaveRequest.findById(id);
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // Check permissions
    if (req.user.role !== 'manager' && leaveRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedLeaveRequest = await LeaveRequest.findByIdAndDelete(id);

    

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