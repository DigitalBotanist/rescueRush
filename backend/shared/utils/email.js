import nodemailer from 'nodemailer';

// Function to generate email content based on the event type
const generateEmailContent = (eventType, user, schedule) => {
    let subject, text;

    switch (eventType) {
        case 'create':
            subject = 'Assigned to a New Schedule';
            text = `Dear ${user.firstName} ${user.lastName},\n\nYou have been assigned to a new schedule on ${schedule.date} (${schedule.shift} shift) at ${schedule.location}. Vehicle: ${schedule.vehicle}.`;
            break;

        case 'update-assigned':
            subject = 'Assigned to a Schedule';
            text = `Dear ${user.firstName} ${user.lastName},\n\nYou have been assigned as a ${user.role === 'driver' ? 'driver' : 'paramedic'} to the schedule on ${schedule.date} (${schedule.shift} shift) at ${schedule.location}. Vehicle: ${schedule.vehicle}.`;
            break;

        case 'update-removed':
            subject = 'Removed from Schedule';
            text = `Dear ${user.firstName} ${user.lastName},\n\nYou have been removed from the schedule on ${schedule.date} (${schedule.shift} shift) at ${schedule.location}.`;
            break;
        
        case 'delete-full':
            subject = 'Schedule Cancellation';
            text = `Dear ${user.firstName} ${user.lastName},\n\nThe schedule on ${schedule.date} (${schedule.shift} shift) at ${schedule.location} has been canceled.`;
            break;
            
        default:
            subject = 'Schedule Notification';
            text = `Dear ${user.firstName} ${user.lastName},\n\nA schedule update has occurred.`;
    }

    return { subject, text };
};

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

export { sendEmail, generateEmailContent };