import mongoose from 'mongoose';
import LeaveRequest from '../models/leaveModel.js';
import user from '../../shared/models/userModel.js';


// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, totalDays } = req.body;
    const userId = req.user.id; 
    const email = req.user.email;

    const leaveRequest = new LeaveRequest({
      user: userId,
      email,
      type,
      leaveType,
      startDate,
      endDate,
      totalDays,
      status: 'pending',
    });

    await leaveRequest.save();

    //new
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
        message: `New leave request from ${req.user.name} (${req.user.employeeId}) for ${leaveType}`,
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
    const leaveRequests = await LeaveRequest.find({ user: userId }).populate('user', 'name employeeId');

    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all leave requests (for resource manager)
export const getAllLeaveRequests = async (req, res) => {
  try {
    if (req.user.role !== 'resource_manager') {
      return res.status(403).json({ error: 'Access denied. Resource managers only.' });
    }

    const leaveRequests = await LeaveRequest.find().populate('user', 'name employeeId');
    res.status(200).json({ leaveRequests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a leave request (employee or manager)
export const updateLeaveRequest = async (req, res) => {
  const { id } = req.params;
  const { leaveType, startDate, endDate, totalDays, status } = req.body;
  const updates = { leaveType, startDate, endDate, totalDays };

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
    if (req.user.role !== 'resource_manager' && leaveRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // If employee is updating, prevent status changes
     if (req.user.role !== 'resource_manager' && status) {
      return res.status(403).json({ error: 'Only resource managers can update status' });
    }

    const updatedLeaveRequest = await LeaveRequest.findByIdAndUpdate(id, updates, { new: true });

    res.status(200).json({
      msg: 'Leave request updated successfully',
      updatedLeaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });

    // Notify resource manager if employee updates the request
    if (req.user.role !== 'resource_manager') {
      const managers = await user.find({ role: 'resource_manager' });
      for (const manager of managers) {
        const notification = new Notification({
          message: `${req.user.name} (${req.user.employeeId}) updated their leave request for ${leaveRequest.leaveType}`,
          recipient: manager._id,
        });
        await notification.save();
      }
    }

    // Notify employee if manager updates status
    if (req.user.role === 'resource_manager' && status && oldLeaveRequest.status !== status) {
      const employee = await user.findById(LeaveRequest.user);
      if (employee) {
        const notification = new Notification({
          message: `Your leave request for ${LeaveRequest.leaveType} has been ${status.toLowerCase()} by the resource manager`,
          recipient: employee._id,
        });
        await notification.save();
      }
    }

    res.status(200).json({
      msg: 'Leave request updated successfully',
      updateLeaveRequest,
    });
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
    if (req.user.role !== 'resource_manager' && leaveRequest.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const deletedLeaveRequest = await LeaveRequest.findByIdAndDelete(id);

    // Notify resource manager if employee deletes the request
    if (req.user.role !== 'resource_manager') {
      const managers = await user.find({ role: 'resource_manager' });
      for (const manager of managers) {
        const notification = new Notification({
          message: `${req.user.name} (${req.user.employeeId}) deleted their leave request for ${deletedLeaveRequest.leaveType}`,
          recipient: manager._id,
        });
        await notification.save();
      }
    }

    // Notify employee if manager deletes the request
    if (req.user.role === 'resource_manager') {
      const employee = await User.findById(leaveRequest.user);
      if (employee) {
        const notification = new Notification({
          message: `Your leave request for ${deletedLeaveRequest.leaveType} has been deleted by the resource manager`,
          recipient: employee._id,
        });
        await notification.save();
      }
    }

    res.status(200).json({
      msg: 'Leave request deleted successfully',
      deletedLeaveRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};