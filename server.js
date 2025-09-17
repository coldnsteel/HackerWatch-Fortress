const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

let threats = {
    total: 0,
    network: 0,
    email: 0,
    lastUpdate: Date.now()
};

let persistentEvents = [];
let registeredUsers = [
    { email: 'coldnsteel@test.com', serial: 'HWF-2025-001', mfaCode: '123456' },
    { email: 'lexalytics@yahoo.com', serial: 'HWF-2025-002', mfaCode: '654321' }
];

// Product database for automated fulfillment
const products = {
    'fortress-pass': { 
        name: 'HackerWatch Fortress Pass', 
        prefix: 'HWF', 
        description: 'Professional cybersecurity monitoring system with real-time threat detection and government agency reporting.',
        features: [
            'Real-time IP and network monitoring',
            'Professional security scanning',
            'Government agency reporting (HSI, FBI, CISA, ICE NINE)',
            'VPN detection and vulnerability alerts',
            'Multi-factor authentication'
        ]
    },
    'kozmic-studio': { 
        name: 'Ultimate Cosmic Studio', 
        prefix: 'KST', 
        description: 'Complete music production platform with AI assistance and professional tools.',
        features: [
            'AI Music Assistant',
            'Multitrack recording',
            'Ultimate jam modes',
            'Professional mixing tools',
            'Collaboration features'
        ]
    },
    'comedy-show': { 
        name: 'GMSRFC Comedy Lounge', 
        prefix: 'CML', 
        description: 'Premium AI comedy collection with interactive features.',
        features: [
            '100+ premium jokes',
            'AI comedy interactions',
            'Kozmic Casino access',
            'Interactive comedy games'
        ]
    }
};

// Email transporter setup
const transporter = nodemailer.createTransporter({
    service: 'yahoo',
    auth: {
        user: process.env.EMAIL_USER || 'lexalytics@yahoo.com',
        pass: process.env.EMAIL_PASS || 'YOUR_EMAIL_PASSWORD' // Replace with actual password
    }
});

wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'init', message: 'HackerWatch-Fortress Server Active' }));

    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'scan') {
            const scanResult = {
                type: 'scanResult',
                ports: '3 (Secure)',
                timestamp: new Date().toLocaleTimeString()
            };
            ws.send(JSON.stringify(scanResult));
            threats.network++;
            threats.total++;
            threats.lastUpdate = Date.now();
        } else if (data.type === 'threat') {
            const event = {
                id: persistentEvents.length + 1,
                type: data.threatType,
                details: data.details,
                timestamp: new Date().toLocaleTimeString()
            };
            persistentEvents.push(event);
            ws.send(JSON.stringify({ type: 'log', message: `[${event.timestamp}] [THREAT] ${event.details}` }));

            if (data.threatType === 'persistent') {
                reportToAgency(event);
            }
        }
    });
});

async function reportToAgency(event) {
    try {
        const response = await axios.post('https://api.cisa.gov/ais/submit', {
            eventId: event.id,
            type: event.type,
            details: event.details,
            timestamp: event.timestamp
        });
        console.log(`Reported to CISA: ${response.data}`);
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'log',
                message: `[${new Date().toLocaleTimeString()}] [AGENCY] Reported to CISA: ${event.details}`
            }));
        });
    } catch (error) {
        console.error('Agency referral failed:', error);
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'log',
                message: `[${new Date().toLocaleTimeString()}] [ERROR] Agency referral failed`
            }));
        });
    }
}

// NEW: Automated Payment Verification Endpoint
app.post('/verify-payment', async (req, res) => {
    const { txid, method, email, product, amount } = req.body;
    
    console.log(`Payment verification request: ${method} ${txid} for ${product} ($${amount})`);
    
    try {
        let isValid = false;
        
        if (method === 'bitcoin') {
            // Verify Bitcoin transaction
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/txs/${txid}`);
            const tx = response.data;
            const walletAddress = 'bc1qvevxcage66n8j86rtzvxn8xrzw9k5nOp5fxg';
            
            // Check if transaction includes our wallet and amount is reasonable
            isValid = tx.addresses && tx.addresses.includes(walletAddress) && tx.total >= amount * 50000000; // Conservative satoshi conversion
            
        } else if (method === 'ethereum') {
            // Verify Ethereum transaction
            const response = await axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txid}&apikey=${process.env.ETHERSCAN_API_KEY || 'YourApiKeyToken'}`);
            const tx = response.data.result;
            const walletAddress = '0xfD9FD0c94caf9AdDbEd6c968504cC47f2638C158';
            
            isValid = tx && tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase();
            
        } else if (method === 'venmo') {
            // For Venmo, we'll accept the transaction ID and manually verify later
            // This is a fallback until Venmo API integration is possible
            isValid = txid && txid.length > 5; // Basic validation
            console.log(`Venmo transaction ${txid} accepted for manual verification`);
        }
        
        if (isValid) {
            // Generate access code
            const productInfo = products[product] || { prefix: 'GMS', name: product };
            const accessCode = `${productInfo.prefix}-${new Date().getFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
            
            // Create access file content
            const accessContent = `${productInfo.name.toUpperCase()} - ACTIVE
${'='.repeat(productInfo.name.length + 10)}
Access Code: ${accessCode}
Security Level: MAXIMUM
Token: ψΩ§∞
${productInfo.description || 'Premium digital product access'}

Features:
${productInfo.features ? productInfo.features.map(f => `- ${f}`).join('\n') : '- Full feature access'}

Valid Until: 2025-12-31
Mission: STARCOM-0908-LS-GMSRFC-DOGPATCH-V211
`;
            
            // Save to assets directory (simulate for now)
            const assetsPath = path.join(__dirname, 'assets', `${product}-pass.txt`);
            console.log(`Saving access code to: ${assetsPath}`);
            console.log('Access content:', accessContent);
            
            // In production, uncomment this to actually save the file:
            // fs.writeFileSync(assetsPath, accessContent);
            
            // Email the access code
            const emailContent = `
Dear Valued Customer,

Your ${productInfo.name} purchase has been confirmed and activated!

🔑 ACCESS DETAILS:
Access Code: ${accessCode}
Product: ${productInfo.name}
Transaction: ${txid}
Method: ${method.toUpperCase()}

📋 FEATURES UNLOCKED:
${productInfo.features ? productInfo.features.map(f => `✅ ${f}`).join('\n') : '✅ Full feature access'}

📞 SUPPORT:
Technical Support: lexalytics@yahoo.com
Token: ψΩ§∞

Your digital fortress is ready for deployment!

Best regards,
GMSRFC Team
Mission: STARCOM-0908-LS-GMSRFC-DOGPATCH-V211
            `;
            
            await transporter.sendMail({
                from: 'lexalytics@yahoo.com',
                to: email,
                subject: `${productInfo.name} - License Activated`,
                text: emailContent
            });
            
            // Log the successful transaction
            const logEntry = {
                timestamp: new Date().toISOString(),
                email: email,
                product: product,
                accessCode: accessCode,
                txid: txid,
                method: method,
                amount: amount,
                status: 'completed'
            };
            
            console.log('Transaction completed:', logEntry);
            
            // Add to registered users if it's HackerWatch Fortress
            if (product === 'fortress-pass') {
                const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
                registeredUsers.push({ 
                    email: email, 
                    serial: accessCode, 
                    mfaCode: mfaCode 
                });
                console.log(`Added to registered users: ${email} -> ${accessCode}`);
            }
            
            res.json({ 
                success: true, 
                accessCode: accessCode,
                message: `License activated! Check your email (${email}) for full details.`
            });
            
        } else {
            res.status(400).json({ 
                success: false, 
                error: 'Payment verification failed. Please check transaction ID or contact support.' 
            });
        }
        
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Verification service unavailable. Please try again or contact support.' 
        });
    }
});

// Serial/MFA Registration Endpoint (unchanged)
app.post('/validate-serial', (req, res) => {
    const { serial, email, mfaCode } = req.body;
    
    const user = registeredUsers.find(u => 
        u.email === email && 
        u.serial === serial && 
        u.mfaCode === mfaCode
    );
    
    if (user) {
        res.json({ 
            success: true, 
            message: 'Access granted. Welcome to HackerWatch-Fortress Professional!' 
        });
        
        // Log successful authentication
        wss.clients.forEach(client => {
            client.send(JSON.stringify({
                type: 'log',
                message: `[${new Date().toLocaleTimeString()}] [AUTH] User authenticated: ${email}`
            }));
        });
    } else {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid serial number, email, or MFA code. Please check your credentials.' 
        });
    }
});

// Generate Serial (for manual serial creation - unchanged)
app.post('/generate-serial', (req, res) => {
    const { email } = req.body;
    const serial = 'HWF-2025-' + Math.random().toString(36).substr(2, 3).toUpperCase();
    const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    registeredUsers.push({ email, serial, mfaCode });
    
    res.json({ 
        serial, 
        mfaCode, 
        message: 'Serial generated successfully. MFA code provided for testing.' 
    });
});

// NEW: Get payment status
app.get('/payment-status/:txid', (req, res) => {
    // This endpoint can be used to check payment status
    // Implementation depends on your logging system
    res.json({ 
        status: 'pending',
        message: 'Check your email for confirmation or contact support.' 
    });
});

app.get('/stats', (req, res) => {
    res.json(threats);
});

app.get('/events', (req, res) => {
    res.json(persistentEvents);
});

app.listen(port, () => {
    console.log(`HackerWatch-Fortress Server running on port ${port}`);
    console.log('Registered users:', registeredUsers.length);
    console.log('Payment automation: ACTIVE');
    console.log('Supported products:', Object.keys(products));
});
