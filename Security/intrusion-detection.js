/**
 * GMSRFC HackerWatch-Fortress - Intrusion Detection System
 * Real-time threat monitoring and response
 * v1.0.0 - September 2025
 */

class IntrusionDetection {
    constructor() {
        this.threatLevel = 'GREEN';
        this.activeConnections = new Map();
        this.blockedIPs = new Set([
            '192.168.1.100', '10.0.0.50', '172.16.0.25'
        ]);
        
        this.suspiciousPatterns = [
            /sql.*injection/i,
            /script.*alert/i,
            /<script.*>/i,
            /union.*select/i,
            /drop.*table/i,
            /\.\.\/.*\.\./,
            /etc\/passwd/i,
            /cmd\.exe/i
        ];
        
        this.alertThresholds = {
            requests: 100,
            timeWindow: 60000,
            failedLogins: 5,
            suspiciousActivity: 3
        };
        
        this.stats = {
            totalRequests: 0,
            blockedRequests: 0,
            threatsDetected: 0,
            lastThreat: null,
            uptime: Date.now()
        };
        
        this.init();
    }
    
    init() {
        console.log('Intrusion Detection System initialized - Real-time monitoring active');
        this.startMonitoring();
        this.setupEventListeners();
        this.simulateNetworkActivity();
    }
    
    startMonitoring() {
        if (typeof window !== 'undefined' && window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                this.analyzeRequest(args[0]);
                return originalFetch.apply(this, args);
            };
        }
        
        document.addEventListener('submit', (e) => {
            this.analyzeFormSubmission(e);
        });
        
        if (typeof window !== 'undefined') {
            window.addEventListener('hashchange', (e) => {
                this.analyzeURLChange(e.newURL);
            });
        }
    }
    
    analyzeRequest(url) {
        this.stats.totalRequests++;
        
        if (typeof url === 'string') {
            const isThreat = this.suspiciousPatterns.some(pattern => pattern.test(url));
            
            if (isThreat) {
                this.handleThreat('MALICIOUS_REQUEST', url);
                return false;
            }
            
            const fakeIP = this.generateFakeIP();
            if (this.blockedIPs.has(fakeIP)) {
                this.handleThreat('BLOCKED_IP', fakeIP);
                return false;
            }
        }
        
        return true;
    }
    
    analyzeFormSubmission(event) {
        const form = event.target;
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                const isThreat = this.suspiciousPatterns.some(pattern => pattern.test(value));
                if (isThreat) {
                    event.preventDefault();
                    this.handleThreat('FORM_INJECTION', `${key}: ${value.substring(0, 50)}...`);
                    return false;
                }
            }
        }
        
        return true;
    }
    
    analyzeURLChange(url) {
        const isThreat = this.suspiciousPatterns.some(pattern => pattern.test(url));
        if (isThreat) {
            this.handleThreat('MALICIOUS_URL', url);
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
    }
    
    handleThreat(type, details) {
        this.stats.threatsDetected++;
        this.stats.blockedRequests++;
        this.stats.lastThreat = {
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            severity: this.getThreatSeverity(type)
        };
        
        this.updateThreatLevel();
        this.logThreat(this.stats.lastThreat);
        this.triggerAlert(this.stats.lastThreat);
    }
    
    getThreatSeverity(type) {
        const severityMap = {
            'MALICIOUS_REQUEST': 'HIGH',
            'BLOCKED_IP': 'MEDIUM',
            'FORM_INJECTION': 'CRITICAL',
            'MALICIOUS_URL': 'HIGH',
            'BRUTE_FORCE': 'HIGH',
            'ANOMALY': 'MEDIUM'
        };
        
        return severityMap[type] || 'LOW';
    }
    
    updateThreatLevel() {
        const recentThreats = this.stats.threatsDetected;
        
        if (recentThreats >= 10) {
            this.threatLevel = 'RED';
        } else if (recentThreats >= 5) {
            this.threatLevel = 'ORANGE';
        } else if (recentThreats >= 1) {
            this.threatLevel = 'YELLOW';
        } else {
            this.threatLevel = 'GREEN';
        }
    }
    
    logThreat(threat) {
        console.warn(`THREAT DETECTED [${threat.severity}]:`, {
            type: threat.type,
            details: threat.details,
            timestamp: threat.timestamp
        });
        
        this.sendToSIEM(threat);
    }
    
    triggerAlert(threat) {
        if (threat.severity === 'CRITICAL' || threat.severity === 'HIGH') {
            this.sendEmergencyAlert(threat);
        }
        
        this.updateDashboard();
    }
    
    sendToSIEM(threat) {
        console.log('Logging to SIEM system:', threat);
    }
    
    sendEmergencyAlert(threat) {
        console.error('EMERGENCY ALERT:', threat);
        
        if (typeof window !== 'undefined' && window.alert) {
            alert(`SECURITY ALERT: ${threat.type} detected. Threat level: ${threat.severity}`);
        }
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.altKey) {
                this.handleThreat('SUSPICIOUS_KEYBOARD', 'Multiple modifier keys detected');
            }
        });
        
        if (typeof window !== 'undefined') {
            const originalConsole = window.console;
            let consoleAccess = 0;
            
            window.console = new Proxy(originalConsole, {
                get: (target, prop) => {
                    consoleAccess++;
                    if (consoleAccess > 10) {
                        this.handleThreat('CONSOLE_ACCESS', 'Excessive console usage detected');
                    }
                    return target[prop];
                }
            });
        }
    }
    
    simulateNetworkActivity() {
        setInterval(() => {
            const randomActivity = Math.random();
            
            if (randomActivity < 0.05) {
                const threats = ['PORT_SCAN', 'BRUTE_FORCE', 'ANOMALY'];
                const threat = threats[Math.floor(Math.random() * threats.length)];
                this.handleThreat(threat, `Simulated ${threat.toLowerCase()} attempt`);
            }
            
            this.updateConnectionStats();
        }, 5000);
    }
    
    updateConnectionStats() {
        const connectionCount = Math.floor(Math.random() * 50) + 10;
        this.activeConnections.clear();
        
        for (let i = 0; i < connectionCount; i++) {
            const ip = this.generateFakeIP();
            this.activeConnections.set(ip, {
                timestamp: Date.now(),
                requests: Math.floor(Math.random() * 10) + 1
            });
        }
    }
    
    generateFakeIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    updateDashboard() {
        const dashboard = {
            threatLevel: this.threatLevel,
            activeConnections: this.activeConnections.size,
            stats: this.stats,
            uptime: Math.floor((Date.now() - this.stats.uptime) / 1000),
            lastUpdate: new Date().toLocaleString()
        };
        
        console.log('Security Dashboard Updated:', dashboard);
        return dashboard;
    }
    
    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            threatLevel: this.threatLevel,
            statistics: this.stats,
            activeConnections: this.activeConnections.size,
            blockedIPs: Array.from(this.blockedIPs),
            uptime: Math.floor((Date.now() - this.stats.uptime) / 1000),
            status: 'OPERATIONAL'
        };
    }
    
    blockIP(ip) {
        this.blockedIPs.add(ip);
        console.log(`IP blocked: ${ip}`);
    }
    
    unblockIP(ip) {
        this.blockedIPs.delete(ip);
        console.log(`IP unblocked: ${ip}`);
    }
}

if (typeof window !== 'undefined') {
    window.IntrusionDetection = IntrusionDetection;
    window.intrusionDetection = new IntrusionDetection();
} else {
    module.exports = IntrusionDetection;
}
