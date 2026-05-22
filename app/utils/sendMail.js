const transporter = require("../config/emailconfig");

const sendEmail = async (req,user) => {

  return await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Your Account Credentials",
    html: `
        <p>Hello ${user.name},</p>

        <p>Your account has been created successfully.</p>

        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Temporary Password:</strong> ${req.body.password}</p>

        <p>
          Login Here:
          <a href="http://localhost:3008/login">
            http://localhost:3008/login
          </a>
        </p>

        <p>Please change your password after login.</p>
      `,
  });

};

module.exports = sendEmail;
