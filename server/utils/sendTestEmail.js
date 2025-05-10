import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Function to send a test email using alternative Gmail configuration
const sendTestEmail = async () => {
  try {
    console.log('Sending test email...');
    
    // Create Gmail-specific transporter using OAuth2
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 465, // Try secure port instead
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Configure to ignore certificate issues
      tls: {
        rejectUnauthorized: false
      },
      debug: true
    });

    console.log('Email configuration:');
    console.log('- Using Gmail on port 465');
    console.log('- User:', process.env.EMAIL_USER);
    console.log('Email transporter created');
    
    const result = await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: "mohamedahmar06@gmail.com",
      subject: "Test Email from Elegance Shop",
      text: "This is a test email to verify functionality",
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px;">
          <h1 style="color: #4a6bf5;">Test Email</h1>
          <p>This is a test email to verify the email sending functionality.</p>
          <p>If you received this, email sending is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });
    
    console.log('Test email sent successfully!', result.messageId);
  } catch (error) {
    console.error('Failed to send test email:', error);
  }
};

// Execute the function
sendTestEmail();