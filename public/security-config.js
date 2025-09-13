class SecurityConfig {
    constructor() {
        this.modules = { emailGuard: null, intrusionDetection: null, mfa: null };
        this.stats = { totalThreats: 0, emailThreats: 0, networkThreats: 0, lastUpdate: Date.now() };
        this.init();
    }
    init() { console.log("🛡️ Security Config initializing..."); }
    updateStats(type = 'network') {
        switch(type) {
            case 'email':
                this.stats.emailThreats++;
                break;
            case 'network':
                this.stats.networkThreats++;
                break;
            default:
                this.stats.networkThreats++;
        }
        this.stats.totalThreats++;
        this.stats.lastUpdate = Date.now();
        console.log(`Security stats updated: ${type} threat detected`);
    }
    getStats() {
        return {
            ...this.stats,
            lastUpdateFormatted: new Date(this.stats.lastUpdate).toLocaleString()
        };
    }
    getModuleStatus(module) {
        return this.modules[module] || { status: 'UNKNOWN', reason: 'Module not found' };
    }
}
window.SecurityConfig = SecurityConfig;
window.securityConfig = new SecurityConfig();
