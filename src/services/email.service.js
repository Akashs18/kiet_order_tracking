const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "la4400512@gmail.com",
        pass: "zsfs dvwg peso xokp", // Use App Password
    },
});

// Generate clean email template
const generateEmailTemplate = (additionalData = {}) => {
    const { customerInfo, orderDetails, supportEmail, supportPhone } = additionalData;

    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        
        <p>Dear ${customerInfo?.name || 'Customer'},</p>

        <p>Thank you for shopping with us!</p>

        <p>
            We’re happy to let you know that your order 
            <strong>#${orderDetails?.orderId || 'N/A'}</strong> 
            has been <strong>${orderDetails?.status || 'processed'}</strong> 
            successfully and is on its way to you.
        </p>

        <h3>Order Details:</h3>

        <p><strong>Order Number:</strong> ${orderDetails?.orderId || 'N/A'}</p>
        <p><strong>Shipping Date:</strong> ${orderDetails?.shippingDate || 'N/A'}</p>
        <p><strong>Estimated Delivery:</strong> ${orderDetails?.deliveryDate || 'N/A'}</p>

        <p>
            If you have any questions or need assistance, feel free to reply to this email 
            or contact our support team 
            ${supportEmail ? `at ${supportEmail}` : ''} 
            ${supportPhone ? `or ${supportPhone}` : ''}.
        </p>

        <p>
        To track your order, click on the link below:
        <a href="https://kiet-order-tracking.onrender.com/auth/login">Track Order</a>
        </p>

        <p>We appreciate your business and hope you enjoy your purchase!</p>

        <p>
            Warm regards,<br>
            <strong>KIET TECHNOLOGIES</strong>
        </p>

    </div>
    `;
};

// Send plain text email (optional)
exports.sendEmail = async (to, subject, message) => {
    try {
        const info = await transporter.sendMail({
            from: '"Order Tracking System" <la4400512@gmail.com>',
            to,
            subject,
            text: message,
        });

        console.log(`Email sent to ${to}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send formatted email
exports.sendFormattedEmail = async (to, subject, additionalData = {}) => {
    try {
        const htmlContent = generateEmailTemplate(additionalData);

        const info = await transporter.sendMail({
            from: '"Order Tracking System" <la4400512@gmail.com>',
            to,
            subject,
            html: htmlContent,
            text: "Your order update", // fallback
        });

        console.log(`Formatted email sent to ${to}`);
        return info;
    } catch (error) {
        console.error('Error sending formatted email:', error);
        throw error;
    }
};

// Send order notification (main function)
exports.sendOrderNotification = async (to, customerInfo, orderDetails) => {
    try {
        const subject = `Order #${orderDetails.orderId} - ${orderDetails.status}`;
        const htmlContent = generateEmailTemplate({
            customerInfo,
            orderDetails,
            supportEmail: "support@kiet.com",
            supportPhone: "+91-9876543210"
        });

        const info = await transporter.sendMail({
            from: '"Order Tracking System" <la4400512@gmail.com>',
            to,
            subject,
            html: htmlContent,
            text: `Your order ${orderDetails.orderId} is ${orderDetails.status}`,
        });

        console.log(`Order email sent to ${to}`);
        return info;
    } catch (error) {
        console.error('Error sending order email:', error);
        throw error;
    }
};