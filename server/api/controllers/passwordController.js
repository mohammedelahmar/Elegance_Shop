import User from '../../models/User.js';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import sendEmail from '../../utils/sendEmail.js';
import bcrypt from 'bcryptjs';

// @desc    Request password reset
// @route   POST /api/password/forgot
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  console.log('Received forgot password request for:', req.body.email);
  
  const { email } = req.body;
  
  if (!email) {
    console.log('No email provided');
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const user = await User.findOne({ email });
  console.log('User found:', user ? 'Yes' : 'No');
  
  if (!user) {
    res.status(404);
    throw new Error('User with this email does not exist');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  console.log('Reset token generated');
  
  // Hash token and save to database
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  
  await user.save();
  console.log('User saved with reset token');
  
  // Create reset URL
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  console.log('Reset URL:', resetUrl);
  
  // Create message with better styling
  const message = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a90e2; color: white; padding: 10px 20px; text-align: center; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .button { display: inline-block; background-color: #4a90e2; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 4px; margin-top: 20px; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You recently requested to reset your password for your ${process.env.FROM_NAME || 'Elegance Shop'} account. 
         Click the button below to reset it.</p>
      <p><a href="${resetUrl}" class="button" clicktracking="off">Reset Your Password</a></p>
      <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
      <p>This password reset link is only valid for 30 minutes.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${process.env.FROM_NAME || 'Elegance Shop'}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  try {
    console.log('Attempting to send email');
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    console.log('Email sent successfully');
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    res.status(500);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }
  
  // Hash the password before saving it
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
  // Set new password (hashed)
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

export { forgotPassword, resetPassword };