// Import the necessary modules here
import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (user) => {
  // Write your code here
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.STORFLEET_SMPT_MAIL,
      pass: process.env.STORFLEET_SMPT_MAIL_PASSWORD,
    },
  });

  const htmlTemplate = `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to Storefleet</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }

      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        padding: 30px;
        text-align: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .icon {
        font-size: 60px;
        margin-bottom: 10px;
      }

      h1 {
        color: #6a1b9a;
        margin-bottom: 10px;
      }

      p {
        color: #555;
        font-size: 16px;
        line-height: 1.5;
      }

      .btn {
        display: inline-block;
        margin-top: 25px;
        padding: 12px 30px;
        background-color: #2563eb;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }

      .footer {
        margin-top: 30px;
        font-size: 13px;
        color: #999;
      }
    </style>
  </head>

  <body>
    <div class="email-container">
      <div class="icon">🛒</div>

      <h1>Welcome to Storefleet</h1>

      <p>Hello, <strong>{{name}}</strong></p>

      <p>
        Thank you for registering with Storefleet. We’re excited to have you as
        a new member of our community.
      </p>

      <a href="{{redirectUrl}}" class="btn">Get Started</a>

      <div class="footer">
        <p>If you did not create this account, please ignore this email.</p>
        <p>© 2026 Storefleet. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

  await transporter.sendMail({
    from: `Storefleet <${process.env.STORFLEET_SMPT_MAIL}`,
    to: user.email,
    subject: "Welcome to StoreFleet🎉",
    html: htmlTemplate
      .replace("{{name}}", user.name)
      .replace("{{redirectUrl}}", "http://localhost:3000"),
  });
};
