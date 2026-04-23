const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "la4400512@gmail.com",
        pass: "zsfs dvwg peso xokp", // Use App Password
    },
});

// Status-specific email messages
const statusMessages = {
    PENDING: "We're happy to let you know that your order #{{orderId}} has been Accepted by Supplier",
    ORDERED: "We're happy to let you know that your order #{{orderId}} has been initiated for further process.",
    RECEIVED: "We're happy to let you know that your order #{{orderId}} material has been moved for Inspection process",
    INVOICED: "We're happy to let you know that your order #{{orderId}} has been passed quality and moved for Invoicing",
    DISPATCHED: "We're happy to let you know that your order #{{orderId}} has moved OUT for DELIVERY",
    DELIVERED: "We're happy to let you know that your order #{{orderId}} has been Delivered Successfully."
};

// Generate status-specific email template
const generateEmailTemplate = (additionalData = {}) => {
    const { customerInfo, orderDetails, supportEmail, supportPhone } = additionalData;
    const status = orderDetails?.status || 'PENDING';
    
    // Get status-specific message
    let statusMessage = statusMessages[status] || statusMessages.PENDING;
    statusMessage = statusMessage.replace('{{orderId}}', orderDetails?.orderId || 'N/A');

    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        
        <p>Dear ${customerInfo?.name || 'Customer'},</p>

        <p>${statusMessage}</p>

        <h3>Order Details:</h3>

        <p><strong>Order Number:</strong> ${orderDetails?.orderId || 'N/A'}</p>
        <p><strong>Order Status:</strong> ${orderDetails?.status || 'N/A'}</p>
        <p><strong>Supplier:</strong> ${orderDetails?.supplierName || 'N/A'}</p>

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
            supportEmail: "sales@kietindia.com",
            supportPhone: "+91-9110638148"
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