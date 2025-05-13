
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/leave.css";


const LeaveForm = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        employeeId: "",
        branch: "",
        phone: "",
        email: "",
        leaveType: "sick",
        startDate: "",
        endDate: "",
        comments: "",
        attachments: []
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
    };

    const removeAttachment = (index) => {
        const newAttachments = formData.attachments.filter((_, i) => i !== index);
        setFormData({ ...formData, attachments: newAttachments });
    };

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formPayload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'attachments') {
                    formPayload.append(key, value);
                }
            });
            
            formData.attachments.forEach(file => {
                formPayload.append('attachments', file);
            });

            const response = await fetch("/api/leave", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formPayload,
            });

            if (response.ok) {
                navigate("/confirmation");
            }
        } catch (error) {
            console.error("Submission error:", error);
        }
    };

    const handleNavigateBack = () => navigate(-1);

    return (
        <div className="leave-container">
            <div className="back-arrow" onClick={handleNavigateBack}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </div>

            <form onSubmit={handleSubmit} className="leave-form">
                <h2>Leave Application Form</h2>
                
                <div className="form-section">
                    <h3>Personal Information</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Employee ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Branch</label>
                            <input
                                type="text"
                                name="branch"
                                value={formData.branch}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Leave Details</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Leave Type</label>
                            <div className="radio-group">
                                <label>
                                    <input
                                        type="radio"
                                        name="leaveType"
                                        value="sick"
                                        checked={formData.leaveType === "sick"}
                                        onChange={handleChange}
                                    />
                                    Sick Leave
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="leaveType"
                                        value="holiday"
                                        checked={formData.leaveType === "holiday"}
                                        onChange={handleChange}
                                    />
                                    Holiday
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Days Requested</label>
                            <input
                                type="text"
                                value={calculateDays()}
                                readOnly
                                className="days-display"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Additional Information</h3>
                    <div className="form-group">
                        <label>Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Attachments</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            accept=".pdf,.jpg,.png"
                        />
                        <div className="attachments-list">
                            {formData.attachments.map((file, index) => (
                                <div key={index} className="attachment-item">
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(index)}
                                        className="remove-attachment"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default LeaveForm;