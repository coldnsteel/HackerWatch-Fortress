// ============================================
// SERIAL VALIDATION API
// Place in HackerWatch-Fortress: /api/validate-serial.js
// ============================================

// In-memory database (shared with payment-webhook.js)
// In production, use MongoDB, PostgreSQL, or Redis
let serialDatabase = new Map();

// Product configuration (must match payment-webhook.js)
const PRODUCTS = {
    'hackerwatch-fortress': {
        name: 'HackerWatch Fortress',
        downloadUrl: 'https://github.com/coldnsteel/HackerWatch-Fortress/archive/refs/heads/main.zip'
    },
    'gmsrfc-academy': {
        name: 'GMSRFC Academy Edition',
        downloadUrl: 'https://github.com/coldnsteel/GMSRFC/archive/refs/heads/main.zip'
    },
    'kozmic-kasino': {
        name: 'KOZMIC KASINO',
        downloadUrl: 'https://github.com/coldnsteel/KOZMIC-KASINO/archive/refs/heads/main.zip'
    }
};

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
        const { serial, ipAddress } = req.body;
        
        if (!serial) {
            return res.status(400).json({ 
                valid: false, 
                error: 'Serial number is required' 
            });
        }
        
        // Retrieve serial from database
        const serialData = serialDatabase.get(serial);
        
        if (!serialData) {
            return res.status(404).json({ 
                valid: false, 
                error: 'Invalid serial number. Please check and try again.' 
            });
        }
        
        // Check if already at download limit
        if (serialData.downloadCount >= serialData.maxDownloads) {
            return res.status(403).json({ 
                valid: false, 
                error: `Download limit reached (${serialData.maxDownloads}/${serialData.maxDownloads}). Contact support for assistance.` 
            });
        }
        
        // Update activation status on first use
        if (!serialData.activated) {
            serialData.activated = true;
            serialData.activationDate = new Date().toISOString();
            serialData.ipAddress = ipAddress;
        }
        
        // Increment download count
        serialData.downloadCount++;
        serialDatabase.set(serial, serialData);
        
        // Get product info
        const product = PRODUCTS[serialData.productId];
        
        // Log activation
        console.log(`✅ Serial validated: ${serial} | Downloads: ${serialData.downloadCount}/${serialData.maxDownloads}`);
        
        return res.status(200).json({
            valid: true,
            productName: serialData.productName,
            downloadUrl: product.downloadUrl,
            downloadsRemaining: serialData.maxDownloads - serialData.downloadCount,
            activated: serialData.activated,
            purchaseDate: serialData.purchaseDate
        });
        
    } catch (error) {
        console.error('❌ Validation error:', error);
        return res.status(500).json({ 
            valid: false,
            error: 'Internal server error. Please try again or contact support.' 
        });
    }
};
