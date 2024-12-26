import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

app.get('/healthy', (req, res) => {
    res.json({
        msg: "server running healthy"
    });
});

app.use('/v1', router);

app.listen(8080, () => {
    console.log("server running at port 8080");
});

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'babygardenssm@gmail.com',
        pass: 'wazl kbao snbp pftu',
    },
    secure: true, // use secure connection
});

// POST route to send emails
router.post('/text-mail', (req, res) => {
    const { name, email, subject, message, phone } = req.body;

    // First email (sent to the backend email with form details)
    const mailDataToSelf = {
        from: 'babygardenssm@gmail.com',
        to: "babygardenssm@gmail.com", // Backend email
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8f8f8;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #2c3e50; padding-bottom: 10px;">New Contact Form Submission</h2>
                <p style="color: #34495e;"><strong>Name:</strong> ${name}</p>
                <p style="color: #34495e;"><strong>Phone No.:</strong> ${phone}</p>
                <p style="color: #34495e;"><strong>Email:</strong> ${email}</p>
                <p style="color: #34495e;"><strong>Subject:</strong> ${subject}</p>
                <p style="color: #34495e;"><strong>Message:</strong> ${message}</p>
            </div>
        `,
    };

    // Second email (sent to the user's email with a greeting message)
    const mailDataToUser = {
        from: 'babygardenssm@gmail.com',
        to: email, // User's email from the form
        subject: `Thank you for contacting us, ${name}!`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #27ae60; text-align: center;">Thank you for reaching out, ${name}!</h2>
                    <p style="color: #34495e; font-size: 16px;">Dear ${name},</p>
                    <p style="color: #34495e; font-size: 16px;">Thank you for reaching out to Baby Garden. We have received your message and will get back to you shortly.</p>
                    <p style="color: #34495e; font-size: 16px;">Best regards,<br>The Baby Garden Team</p>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p style="color: #95a5a6;">Baby Garden | Sasaram, Bihar</p>
                        <p style="color: #95a5a6;">Email: bgsssm8@gmail.com</p>
                    </footer>
                </div>
            </div>
        `,
    };

    // Send the first email (to the backend)
    transporter.sendMail(mailDataToSelf, (error, info) => {
        if (error) {
            console.log("Error sending mail to backend: ", error);
            return res.status(500).send({ message: "Failed to send backend email." });
        }
        console.log("Mail sent to backend: ", info.messageId);
    });

    // Send the second email (to the user)
    transporter.sendMail(mailDataToUser, (error, info) => {
        if (error) {
            console.log("Error sending mail to user: ", error);
            return res.status(500).send({ message: "Failed to send user email." });
        }
        console.log("Mail sent to user: ", info.messageId);
        res.status(200).send({ message: "Mail sent successfully", message_id: info.messageId });
    });
});
