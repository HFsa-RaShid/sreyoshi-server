import nodemailer from 'nodemailer';


export const sendInvitationEmail = async (to: string, setupLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  process.env.gmail_user,
      pass:  process.env.gmail_pass, 
    },
  });

  const mailOptions = {
    from: `"Sreyoshi Admin" <${process.env.gmail_user}>`,
    to,
    subject: 'Invitation to Join Sreyoshi Portal',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; rounded: 12px;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to Sreyoshi!</h2>
        <p>Hello,</p>
        <p>An administrator has invited you to create an account on our platform.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${setupLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Set Up Your Account</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you weren't expecting this invitation, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};