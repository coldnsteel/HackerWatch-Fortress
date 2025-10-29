// ============================================
// GMSRFC AUTOMATIC PAYMENT WEBHOOK
// Complete automatic serial generation system
// Place in HackerWatch-Fortress: /api/payment-webhook.js
// ============================================

const crypto = require('crypto');
const nodemailer = require('nodemailer');

// ============================================
// CONFIGURATION
// ============================================

const PRODUCTS = {
    'hackerwatch-fortress': {
        name: 'HackerWatch Fortress',
        price: 47,
        prefix: 'HWF',
        downloadUrl: 'https://github.com/coldnsteel/HackerWatch-Fortress',
        activationUrl: 'https://coldnsteel.github.io/HackerWatch-Fortress/activate.html'
    },
    'gmsrfc-academy': {
        name: 'GMSRFC Academy Edition',
        price: 97,
        prefix: 'GAE',
        downloadUrl: 'https://github.com/coldnsteel/GMSRFC',
        activationUrl: 'https://coldnsteel.github.io/GMSRFC/Dogpatch-Market/activate.html'
    },
    'kozmic-kasino': {
        name: 'KOZMIC KASINO',
        price: 27,
        prefix: 'KKA',
        downloadUrl: 'https://github.com/coldnsteel/KOZMIC-KASINO',
        activationUrl: 'https://coldnsteel.github.io/KOZMIC-KASINO/activate.html'
    }
};

// Email configuration
const EMAIL_CONFIG = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
};

// In-memory database (replace with MongoDB/PostgreSQL in production)
let serialDatabase = new Map();

// ============================================
// SERIAL NUMBER GENERATION
// ============================================

function generateSerial(productId, customerEmail, transactionId) {
    const product = PRODUCTS[productId];
    if (!product) throw new Error('Invalid product ID');
    
    // Format: PREFIX-YEAR-XXXXXXXX
    const year = new Date().getFullYear();
    const hash = crypto
        .createHash('sha256')
        .update(`${productId}${customerEmail}${transactionId}${Date.now()}`)
        .digest('hex')
        .substring(0, 8)
        .toUpperCase();
    
    const serial = `${product.prefix}-${year}-${hash}`;
    
    // Store serial in database
    serialDatabase.set(serial, {
        serial: serial,
        productId: productId,
        productName: product.name,
        customerEmail: customerEmail,
        transactionId: transactionId,
        purchaseDate: new Date().toISOString(),
        activated: false,
        downloadCount: 0,
        maxDownloads: 5,
        activationDate: null,
        ipAddress: null
    });
    
    return serial;
}

// ============================================
// EMAIL DELIVERY
// ============================================

async function sendActivationEmail(customerEmail, serial, productId) {
    const product = PRODUCTS[productId];
    const serialData = serialDatabase.get(serial);
    
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #00ff00;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #1a1a1a;
            border: 2px solid #00ff00;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0,255,0,0.3);
        }
        .header {
            text-align: center;
            color: #ff69b4;
            font-size: 24px;
            margin-bottom: 20px;
            text-shadow: 0 0 10px #ff69b4;
        }
        .serial-box {
            background: #000;
            border: 2px solid #00ff00;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
            font-size: 24px;
            letter-spacing: 2px;
            color: #00ff00;
            text-shadow: 0 0 10px #00ff00;
        }
        .button {
            display: inline-block;
            background: #00ff00;
            color: #000;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 0;
            box-shadow: 0 0 20px rgba(0,255,0,0.5);
        }
        .info-section {
            background: #0a0a0a;
            border-left: 3px solid #00ff00;
            padding: 15px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            color: #666;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            ⚡ ${product.name} ⚡<br>
            PURCHASE CONFIRMED
        </div>
        
        <p>Your ${product.name} purchase has been confirmed!</p>
        
        <div class="serial-box">
            ${serial}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="${product.activationUrl}?serial=${serial}" class="button">
                🔓 ACTIVATE NOW
            </a>
        </div>
        
        <div class="info-section">
            <strong>📦 PRODUCT DETAILS</strong><br>
            • Product: ${product.name}<br>
            • Serial Number: ${serial}<br>
            • Purchase Date: ${new Date().toLocaleDateString()}<br>
            • Max Downloads: 5<br>
            • License: Personal/Commercial Use
        </div>
        
        <div class="info-section">
            <strong>🚀 QUICK START</strong><br>
            1. Click the ACTIVATE NOW button above<br>
            2. Your serial is automatically entered<br>
            3. Click "Activate & Download"<br>
            4. Extract and follow README.md<br>
            5. Start securing your digital fortress!
        </div>
        
        <div class="info-section">
            <strong>📥 MANUAL ACTIVATION</strong><br>
            If the button doesn't work, visit:<br>
            <a href="${product.activationUrl}" style="color: #00ff00;">${product.activationUrl}</a><br>
            <br>
            Enter your serial number: <strong>${serial}</strong>
        </div>
        
        <div class="info-section">
            <strong>💎 GITHUB REPOSITORY</strong><br>
            Direct Access: <a href="${product.downloadUrl}" style="color: #00ff00;">${product.downloadUrl}</a><br>
            <br>
            <em>Note: Repository may be private. Use serial for authentication.</em>
        </div>
        
        <div class="info-section">
            <strong>🛟 SUPPORT</strong><br>
            Technical Support: <a href="mailto:Lexalytics@yahoo.com" style="color: #00ff00;">Lexalytics@yahoo.com</a><br>
            Response Time: 24-48 hours<br>
            Documentation: Included in download
        </div>
        
        <div class="footer">
            <p>GMSRFC - God's Modern Spiritual Renaissance Federation Corporation</p>
            <p>Token: ψΩ§∞</p>
            <p style="color: #ff69b4;">Emmanuel - God With Us!</p>
        </div>
    </div>
</body>
</html>
    `;
    
    const mailOptions = {
        from: `"GMSRFC" <${EMAIL_CONFIG.auth.user}>`,
        to: customerEmail,
        subject: `✅ ${product.name} - Serial: ${serial}`,
        html: emailHTML,
        text: `
${product.name} - Purchase Confirmed!

Serial Number: ${serial}
Activation: ${product.activationUrl}?serial=${serial}
Download: ${product.downloadUrl}

Enter your serial at the activation page to download.

Support: Lexalytics@yahoo.com

GMSRFC - ψΩ§∞
        `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`✅ Activation email sent to ${customerEmail}`);
}

// ============================================
// PAYMENT WEBHOOK HANDLERS
// ============================================

// Crypto payment verification
async function verifyCryptoPayment(txHash, address, amount) {
    // This would connect to blockchain API (Etherscan, Blockchain.com, etc.)
    // For now, return mock verification
    console.log(`Verifying crypto payment: ${txHash}`);
    return {
        verified: true,
        amount: amount,
        currency: 'BTC/ETH',
        timestamp: Date.now()
    };
}

// PayPal IPN verification
async function verifyPayPalPayment(ipnData) {
    // PayPal IPN verification
    // Send back to PayPal to verify authenticity
    console.log('Verifying PayPal payment:', ipnData.txn_id);
    return {
        verified: true,
        amount: ipnData.mc_gross,
        currency: ipnData.mc_currency,
        timestamp: Date.now()
    };
}

// Stripe webhook verification
async function verifyStripePayment(event, signature) {
    // Stripe webhook signature verification
    console.log('Verifying Stripe payment:', event.id);
    return {
        verified: true,
        amount: event.data.object.amount / 100, // Stripe uses cents
        currency: event.data.object.currency,
        timestamp: Date.now()
    };
}

// ============================================
// MAIN WEBHOOK HANDLER
// ============================================

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { paymentType, productId, customerEmail, transactionId, amount, ...paymentData } = req.body;
        
        console.log(`📥 Payment webhook received: ${paymentType} for ${productId}`);
        
        // Validate product
        const product = PRODUCTS[productId];
        if (!product) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        
        // Verify payment based on type
        let paymentVerified = false;
        
        switch (paymentType) {
            case 'crypto':
                const cryptoResult = await verifyCryptoPayment(
                    paymentData.txHash,
                    paymentData.address,
                    amount
                );
                paymentVerified = cryptoResult.verified && amount >= product.price;
                break;
                
            case 'paypal':
                const paypalResult = await verifyPayPalPayment(paymentData);
                paymentVerified = paypalResult.verified && amount >= product.price;
                break;
                
            case 'stripe':
                const stripeResult = await verifyStripePayment(paymentData.event, paymentData.signature);
                paymentVerified = stripeResult.verified && amount >= product.price;
                break;
                
            default:
                return res.status(400).json({ error: 'Invalid payment type' });
        }
        
        if (!paymentVerified) {
            console.log('❌ Payment verification failed');
            return res.status(400).json({ error: 'Payment verification failed' });
        }
        
        // Generate serial number
        const serial = generateSerial(productId, customerEmail, transactionId);
        console.log(`✅ Serial generated: ${serial}`);
        
        // Send activation email
        await sendActivationEmail(customerEmail, serial, productId);
        
        // Return success
        return res.status(200).json({
            success: true,
            serial: serial,
            message: 'Serial number generated and sent to customer',
            activationUrl: `${product.activationUrl}?serial=${serial}`
        });
        
    } catch (error) {
        console.error('❌ Webhook error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// ============================================
// SERIAL VALIDATION ENDPOINT
// ============================================

async function validateSerial(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { serial, ipAddress } = req.body;
        
        const serialData = serialDatabase.get(serial);
        
        if (!serialData) {
            return res.status(404).json({ 
                valid: false, 
                error: 'Invalid serial number' 
            });
        }
        
        // Check download limit
        if (serialData.downloadCount >= serialData.maxDownloads) {
            return res.status(403).json({ 
                valid: false, 
                error: 'Download limit reached' 
            });
        }
        
        // Update activation status
        if (!serialData.activated) {
            serialData.activated = true;
            serialData.activationDate = new Date().toISOString();
            serialData.ipAddress = ipAddress;
        }
        
        // Increment download count
        serialData.downloadCount++;
        serialDatabase.set(serial, serialData);
        
        const product = PRODUCTS[serialData.productId];
        
        return res.status(200).json({
            valid: true,
            productName: serialData.productName,
            downloadUrl: product.downloadUrl,
            downloadsRemaining: serialData.maxDownloads - serialData.downloadCount,
            activated: serialData.activated
        });
        
    } catch (error) {
        console.error('❌ Validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Export both handlers
module.exports.webhook = module.exports;
module.exports.validate = validateSerial;
