import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Only initialize Twilio if credentials are properly configured
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log('✅ Twilio WhatsApp initialized');
} else {
  console.log('⚠️  Twilio not configured - WhatsApp notifications disabled');
}

const getBookingConfirmationEmailHTML = (booking, trip) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #667eea; }
        .success-badge { background: #10b981; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p class="success-badge">Your seats are reserved</p>
        </div>
        <div class="content">
          <p>Dear ${booking.user.name},</p>
          <p>Great news! Your booking has been confirmed by our admin team.</p>
          
          <div class="booking-details">
            <h3 style="color: #667eea; margin-top: 0;">Trip Details</h3>
            <div class="detail-row">
              <span class="label">Route:</span>
              <span>${trip.route.from} → ${trip.route.to}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span>${new Date(trip.departureDate).toLocaleDateString('en-IN')}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span>${trip.departureTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Seat Numbers:</span>
              <span>${booking.seatNumbers.join(', ')}</span>
            </div>
            <div class="detail-row">
              <span class="label">Pickup Location:</span>
              <span>${booking.pickupLocation}</span>
            </div>
            <div class="detail-row">
              <span class="label">Total Amount:</span>
              <span>₹${booking.payment.amount}</span>
            </div>
          </div>
          
          <p><strong>Important:</strong> Please arrive at the pickup location 15 minutes before departure time.</p>
          <p>Safe travels!<br>Cab Booking Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getBookingRejectionEmailHTML = (booking, reason) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reason-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Update</h1>
        </div>
        <div class="content">
          <p>Dear ${booking.user.name},</p>
          <p>We regret to inform you that your booking request has been declined.</p>
          ${reason ? `<div class="reason-box"><strong>Reason:</strong> ${reason}</div>` : ''}
          <p>If you believe this is an error or would like to make a new booking, please contact our support team.</p>
          <p>Thank you for your understanding.<br>Cab Booking Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendBookingConfirmationEmail = async (booking, trip) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.user.email,
      subject: `✅ Booking Confirmed - ${trip.route.from} to ${trip.route.to}`,
      html: getBookingConfirmationEmailHTML(booking, trip)
    };
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

export const sendBookingRejectionEmail = async (booking, reason) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.user.email,
      subject: 'Booking Update - Action Required',
      html: getBookingRejectionEmailHTML(booking, reason)
    };
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Rejection email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return { success: false, error: error.message };
  }
};

export const sendWhatsAppNotification = async (phoneNumber, message) => {
  try {
    if (!twilioClient) {
      console.log('⚠️  Twilio not configured - skipping WhatsApp notification');
      return { success: false, error: 'Twilio not configured' };
    }
    const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
    const twilioMessage = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${formattedNumber}`,
      body: message
    });
    console.log('WhatsApp message sent:', twilioMessage.sid);
    return { success: true, messageSid: twilioMessage.sid };
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return { success: false, error: error.message };
  }
};

export const sendBookingConfirmationWhatsApp = async (booking, trip) => {
  const message = `🎉 *Booking Confirmed!*\n\nDear ${booking.user.name},\n\nYour booking has been confirmed:\n\n📍 Route: ${trip.route.from} → ${trip.route.to}\n📅 Date: ${new Date(trip.departureDate).toLocaleDateString('en-IN')}\n🕐 Time: ${trip.departureTime}\n💺 Seats: ${booking.seatNumbers.join(', ')}\n📌 Pickup: ${booking.pickupLocation}\n💰 Amount: ₹${booking.payment.amount}\n\nPlease arrive 15 minutes early. Safe travels!\n\n- Cab Booking Team`;
  return await sendWhatsAppNotification(booking.user.phone, message);
};

export const sendBookingRejectionWhatsApp = async (booking, reason) => {
  const message = `Dear ${booking.user.name},\n\nYour booking request has been declined.\n\n${reason ? `Reason: ${reason}` : ''}\n\nPlease contact support for assistance.\n\n- Cab Booking Team`;
  return await sendWhatsAppNotification(booking.user.phone, message);
};
