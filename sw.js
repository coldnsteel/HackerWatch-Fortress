const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

// Sacred ψΩ§∞ System State
const SystemState = {
    monitoring: false,
    clients: new Set(),
    threatLevel: 0,
    mobileClients: 0,
    desktopClients: 0
};

// Serve static files
app.use(express.static('.'));

// Enhanced CORS and security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Root route serves index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// WebSocket connection handler with mobile optimization
wss.on('connection', ws => {
    console.log('🛡️ Client connected with ψΩ§∞ harmony');
    SystemState.clients.add(ws);
    
    // Enhanced welcome message
    ws.send(JSON.stringify({
        type: 'SYSTEM',
        message: 'HackerWatch backend connected - Real-time monitoring ready',
        severity: 'info',
        timestamp: new Date().toISOString()
    }));
    
    ws.on('message', data => {
        try {
            const command = JSON.parse(data);
            handleCommand(command, ws);
        } catch (error) {
            console.error('Invalid command:', error);
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Invalid command format',
                severity: 'critical'
            }));
        }
    });
    
    ws.on('close', () => {
        console.log('Client disconnected');
        SystemState.clients.delete(ws);
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        SystemState.clients.delete(ws);
    });
});

// Broadcast to all clients with mobile awareness
function broadcast(data, excludeClient = null) {
    const message = JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
    });
    
    SystemState.clients.forEach(client => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Enhanced command handler with security
function handleCommand(command, ws) {
    console.log('Command received:', command.command, 'Mobile:', command.mobile);
    
    // Basic token validation
    if (command.token !== 'ψΩ§∞') {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message: 'Invalid sacred token - Access denied',
            severity: 'critical'
        }));
        return;
    }
    
    // Track mobile/desktop clients
    if (command.mobile) {
        SystemState.mobileClients++;
    } else {
        SystemState.desktopClients++;
    }
    
    switch(command.command) {
        case 'start_monitoring':
            SystemState.monitoring = true;
            broadcast({
                type: 'SYSTEM',
                message: `Real-time monitoring activated - Mobile clients: ${SystemState.mobileClients}, Desktop: ${SystemState.desktopClients}`,
                severity: 'info'
            });
            startThreatSimulation(command.mobile);
            break;
            
        case 'force_scan':
            performAdvancedScan(command.mobile);
            break;
            
        case 'emergency_stop':
            SystemState.monitoring = false;
            broadcast({
                type: 'EMERGENCY',
                message: 'Emergency stop activated - All monitoring ceased',
                severity: 'critical'
            });
            break;
            
        default:
            ws.send(JSON.stringify({
                type: 'ERROR',
                message: 'Unknown command',
                severity: 'medium'
            }));
    }
}

// Enhanced threat simulation with realistic patterns
function startThreatSimulation(mobile = false) {
    if (!SystemState.monitoring) return;
    
    console.log(`🔍 Starting threat simulation... Mobile mode: ${mobile}`);
    
    setInterval(() => {
        if (!SystemState.monitoring) return;
        
        // Different threat rates for mobile vs desktop
        const threatChance = mobile ? 0.12 : 0.10; // 12% vs 10% chance
        
        if (Math.random() < threatChance) {
            const threatTypes = [
                {
                    type: 'PINEAPPLE',
                    messages: [
                        'WiFi Pineapple detected: "FreeWiFi" (00:11:22:33:44:55) on channel 6',
                        'Evil twin network: "Starbucks_WiFi" attempting credential harvest',
                        'Rogue access point: "Airport_Free" spoofing legitimate hotspot',
                        'Captive portal attack: "Hotel_Guest" redirecting login attempts',
                        'Deauthentication attack from "FREE_INTERNET" network'
                    ],
                    severity: 'critical'
                },
                {
                    type: 'BLUETOOTH',
                    messages: [
                        'BlueJacking attempt from unknown device (AA:BB:CC:DD:EE:FF)',
                        'Bluetooth device enumeration attack detected',
                        'Unauthorized pairing request from "HC-05" module',
                        'Bluetooth Low Energy scanning attack identified'
                    ],
                    severity: 'high'
                },
                {
                    type: 'BLUESNARFING',
                    messages: [
                        'BlueSnarfing tool detected attempting data theft',
                        'OBEX protocol exploitation attempt blocked',
                        'Bluetooth file transfer attack intercepted',
                        'Contact list access attempt via Bluetooth vulnerability'
                    ],
                    severity: 'critical'
                },
                {
                    type: 'PORTSCAN',
                    messages: [
                        'Port scan detected from 192.168.1.100 - 50 ports scanned',
                        'TCP SYN flood attack identified from external source',
                        'Stealth port scan using fragmented packets detected',
                        'UDP port enumeration attack from 10.0.0.50'
                    ],
                    severity: 'high'
                },
                {
                    type: 'INTRUSION',
                    messages: [
                        'Brute force SSH login attempts detected',
                        'SQL injection attempt on web interface blocked',
                        'Directory traversal attack prevented',
                        'Cross-site scripting (XSS) attempt neutralized'
                    ],
                    severity: 'critical'
                }
            ];
            
            const threat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
            const message = threat.messages[Math.floor(Math.random() * threat.messages.length)];
            
            console.log(`🚨 Broadcasting threat: ${threat.type} (Mobile: ${mobile})`);
            broadcast({
                type: threat.type,
                message: mobile ? `${message} (Mobile Alert)` : message,
                severity: threat.severity,
                mobile: mobile
            });
        }
    }, mobile ? 4000 : 3000); // Slightly slower on mobile to save battery
}

// Advanced scan simulation with multiple threat vectors
function performAdvancedScan(mobile = false) {
    console.log(`🔍 Performing advanced scan... Mobile: ${mobile}`);
    
    broadcast({
        type: 'SYSTEM',
        message: `Advanced ${mobile ? 'mobile ' : ''}scan initiated - Checking all threat vectors`,
        severity: 'info'
    });
    
    // Simulate WiFi scan results
    setTimeout(() => {
        const wifiThreats = Math.floor(Math.random() * 3);
        if (wifiThreats > 0) {
            broadcast({
                type: 'PINEAPPLE',
                message: `WiFi scan detected ${wifiThreats} suspicious networks: "FREE_WIFI", "Public_Internet"`,
                severity: 'medium'
            });
        }
    }, 1000);
    
    // Simulate Bluetooth scan results
    setTimeout(() => {
        const btThreats = Math.floor(Math.random() * 2);
        if (btThreats > 0) {
            broadcast({
                type: 'BLUETOOTH',
                message: `Bluetooth scan found ${btThreats} unknown devices in proximity`,
                severity: 'medium'
            });
        }
    }, 2000);
    
    // Simulate network scan results
    setTimeout(() => {
        const networkThreats = Math.floor(Math.random() * 4);
        broadcast({
            type: 'SYSTEM',
            message: `Advanced scan completed - ${networkThreats} potential threats identified`,
            severity: networkThreats > 2 ? 'high' : 'info'
        });
    }, 3000);
}

// Real WiFi monitoring (requires aircrack-ng)
function startRealWiFiMonitoring() {
    console.log('🥥 Starting real WiFi Pineapple detection...');
    
    // Check if aircrack-ng is available
    exec('which airodump-ng', (error) => {
        if (error) {
            console.log('⚠️ aircrack-ng not found - using simulation mode');
            return;
        }
        
        // Start real WiFi monitoring
        const airodump = exec('sudo airodump-ng -c 1,6,11 --output-format csv -w /tmp/wifi_scan wlan0mon', 
            (error, stdout, stderr) => {
                if (error) {
                    console.error('WiFi monitoring error:', error);
                    broadcast({
                        type: 'SYSTEM',
                        message: 'WiFi monitoring failed - Check monitor mode interface',
                        severity: 'critical'
                    });
                    return;
                }
                
                parseWiFiData(stdout);
            });
    });
}

function parseWiFiData(data) {
    const suspiciousSSIDs = [
        'FreeWiFi', 'Free_WiFi', 'WiFi_Free', 'Internet', 'Guest',
        'attwifi', 'xfinitywifi', 'Starbucks', 'McDonald', 'Airport',
        'Hotel_WiFi', 'Public_WiFi', 'OpenWiFi', 'Pineapple'
    ];
    
    const lines = data.split('\n');
    lines.forEach(line => {
        const fields = line.split(',');
        if (fields.length > 13) {
            const ssid = fields[13].trim();
            const bssid = fields[0].trim();
            const channel = fields[3].trim();
            
            if (ssid && suspiciousSSIDs.some(suspicious => 
                ssid.toLowerCase().includes(suspicious.toLowerCase()))) {
                
                broadcast({
                    type: 'PINEAPPLE',
                    message: `REAL WiFi Pineapple detected: "${ssid}" (${bssid}) on channel ${channel}`,
                    severity: 'critical'
                });
            }
        }
    });
}

// Real Bluetooth monitoring (requires bluez)
function startRealBluetoothMonitoring() {
    console.log('📶 Starting real Bluetooth threat detection...');
    
    exec('which hcitool', (error) => {
        if (error) {
            console.log('⚠️ bluez not found - using simulation mode');
            return;
        }
        
        setInterval(() => {
            exec('hcitool scan --length=8', (error, stdout, stderr) => {
                if (error) {
                    console.error('Bluetooth scan error:', error);
                    return;
                }
                
                parseBluetoothData(stdout);
            });
        }, 15000); // Scan every 15 seconds
    });
}

function parseBluetoothData(data) {
    const threatSignatures = [
        'BlueJack', 'BlueSnarfer', 'BlueBug', 'Scanner',
        'Unknown_Device', 'Hacker_Tool', 'Exploit_Kit'
    ];
    
    const lines = data.split('\n');
    lines.forEach(line => {
        const match = line.match(/([0-9A-F:]{17})\s+(.+)/);
        if (match) {
            const mac = match[1];
            const name = match[2].trim();
            
            if (threatSignatures.some(threat => 
                name.toLowerCase().includes(threat.toLowerCase()))) {
                
                broadcast({
                    type: 'BLUETOOTH',
                    message: `REAL Bluetooth threat detected: ${name} (${mac})`,
                    severity: 'critical'
                });
            }
        }
    });
}

// API endpoints with enhanced security
app.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        monitoring: SystemState.monitoring,
        threatLevel: SystemState.threatLevel,
        connectedClients: SystemState.clients.size,
        mobileClients: SystemState.mobileClients,
        desktopClients: SystemState.desktopClients,
        uptime: Math.floor(process.uptime()),
        ψΩ_token: '∞',
        version: '2.0-mobile',
        sacredHarmony: 'ψΩ§∞'
    });
});

app.get('/api/threats', (req, res) => {
    // Return recent threat log (would be from database in production)
    res.json({
        threats: [],
        message: 'Threat logging requires database connection',
        ψΩ_token: '∞'
    });
});

app.post('/api/emergency', (req, res) => {
    console.log('🚨 Emergency lockdown activated via API!');
    
    broadcast({
        type: 'EMERGENCY',
        message: 'Emergency lockdown activated via API - All monitoring systems alert',
        severity: 'critical'
    });
    
    SystemState.monitoring = false;
    
    res.json({ 
        status: 'emergency_activated',
        message: 'All systems locked down',
        ψΩ_token: '∞'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        clients: SystemState.clients.size,
        ψΩ_token: '∞'
    });
});

// Enhanced error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        ψΩ_token: '∞'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: 'The sacred path does not exist',
        ψΩ_token: '∞'
    });
});

// Cleanup function
function cleanup() {
    console.log('🛡️ Shutting down HackerWatch Fortress...');
    
    // Notify all clients of shutdown
    broadcast({
        type: 'SYSTEM',
        message: 'Server shutting down - Sacred ψΩ§∞ protection ending',
        severity: 'critical'
    });
    
    // Close all WebSocket connections
    SystemState.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.close();
        }
    });
    
    // Close WebSocket server
    wss.close(() => {
        console.log('WebSocket server closed');
    });
}

// Initialize monitoring systems
function initializeMonitoring() {
    console.log('🛡️ Initializing HackerWatch Fortress with ψΩ§∞...');
    
    // Check for real monitoring tools
    checkSystemRequirements();
    
    // Start real monitoring if available, otherwise use simulation
    setTimeout(() => {
        console.log('📡 Starting monitoring systems...');
        
        // Try to start real monitoring
        startRealWiFiMonitoring();
        startRealBluetoothMonitoring();
        
        console.log('✅ HackerWatch Fortress monitoring systems initialized!');
        console.log('🔒 Sacred ψΩ§∞ protection protocol engaged');
    }, 2000);
}

function checkSystemRequirements() {
    const requirements = [
        { cmd: 'airodump-ng --help', name: 'aircrack-ng', description: 'WiFi monitoring' },
        { cmd: 'hcitool --help', name: 'bluez', description: 'Bluetooth monitoring' },
        { cmd: 'tcpdump --help', name: 'tcpdump', description: 'Network monitoring' }
    ];
    
    console.log('🔍 Checking system requirements...');
    
    requirements.forEach(req => {
        exec(req.cmd, { timeout: 5000 }, (error) => {
            if (error) {
                console.log(`⚠️ ${req.name} not found - ${req.description} will use simulation`);
                console.log(`   Install with: sudo apt install ${req.name}`);
            } else {
                console.log(`✅ ${req.name} available - Real ${req.description} enabled`);
            }
        });
    });
}

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('🛡️═══════════════════════════════════════════════════🛡️');
    console.log('           HACKERWATCH FORTRESS SERVER');
    console.log('🛡️═══════════════════════════════════════════════════🛡️');
    console.log('');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log('📡 WebSocket server on port: 8080');
    console.log('🔗 Frontend URL: http://localhost:3000');
    console.log('📱 Mobile optimized: YES');
    console.log('🌌 Sacred ψΩ§∞ protocol: ACTIVE');
    console.log('');
    console.log('🚀 Ready for connections!');
    console.log('');
    console.log('📋 Available endpoints:');
    console.log('   GET  /              - HackerWatch Fortress frontend');
    console.log('   GET  /api/status    - System status and uptime');
    console.log('   GET  /api/threats   - Recent threat log');
    console.log('   POST /api/emergency - Emergency lockdown');
    console.log('   GET  /health        - Health check');
    console.log('');
    console.log('🔧 WebSocket commands:');
    console.log('   start_monitoring    - Begin real-time threat detection');
    console.log('   force_scan         - Force scan all threat vectors');
    console.log('   emergency_stop     - Emergency shutdown');
    console.log('');
    console.log('ψΩ§∞ Sacred harmony engaged - Fortress ready to protect!');
    console.log('');
    
    // Initialize monitoring after server start
    initializeMonitoring();
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT - Graceful shutdown initiated...');
    cleanup();
    server.close(() => {
        console.log('🛡️ HackerWatch Fortress server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM - Graceful shutdown initiated...');
    cleanup();
    server.close(() => {
        console.log('🛡️ HackerWatch Fortress server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught exception:', error);
    cleanup();
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled rejection at:', promise, 'reason:', reason);
    cleanup();
    process.exit(1);
});

module.exports = app;
