# HackerWatch-Fortress
for phone and computer realtime monitoring of attacks ... it's cyberwar and you are issued your cyber defenses...
# 🛡️ HackerWatch Fortress - Universal ψΩ§∞ Protection

![HackerWatch Fortress](https://img.shields.io/badge/HackerWatch-Fortress-brightgreen?style=for-the-badge&logo=shield&logoColor=white)
![Sacred Token](https://img.shields.io/badge/Sacred%20Token-ψΩ§∞-gold?style=for-the-badge)
![Mobile Ready](https://img.shields.io/badge/Mobile-Ready-blue?style=for-the-badge&logo=mobile&logoColor=white)
![Real-Time](https://img.shields.io/badge/Real--Time-Active-red?style=for-the-badge&logo=lightning&logoColor=white)

Universal mobile-responsive cybersecurity threat detection system with real-time WiFi Pineapple, Bluetooth, and network intrusion monitoring. Features haptic feedback, PWA support, and cross-platform compatibility.

## ✨ Features

### 🔥 **Core Security**
- **WiFi Pineapple Detection** - Real-time scanning for rogue access points
- **Bluetooth Threat Radar** - BlueJacking, BlueSnarfing, BlueBugging detection  
- **Network Intrusion Monitor** - Port scans, ARP spoofing, DNS hijacking
- **Real-Time Alerts** - Instant visual, audio, and haptic notifications

### 📱 **Mobile Excellence**
- **Universal Responsive** - Fluid scaling on any device (phone → desktop)
- **Haptic Feedback** - Unique vibration patterns for each threat type
- **PWA Support** - Install on home screen, offline functionality
- **Touch Optimized** - 44px touch targets, gesture-friendly interface
- **Battery Optimized** - Reduced animations and efficient scanning

### 🌐 **Cross-Platform**
- **Desktop Features** - Full keyboard shortcuts, detailed logging
- **Mobile Features** - One-handed operation, native sharing
- **Universal** - Same threat detection on all platforms
- **Sacred ψΩ§∞** - Cosmic harmony across all devices

## 🚀 Quick Start

### **Option 1: Express Setup (5 minutes)**
```bash
# Clone and run
git clone https://github.com/coldnsteel/hackerwatch-fortress.git
cd hackerwatch-fortress
npm install
npm start

# Open browser
# http://localhost:3000
```

### **Option 2: Manual Setup (10 minutes)**
```bash
# Create directory
mkdir hackerwatch-fortress
cd hackerwatch-fortress

# Create files (copy from repository)
# - index.html
# - server.js  
# - package.json
# - manifest.json
# - sw.js

# Install and run
npm install
npm start
```

## 📋 System Requirements

### **Minimum (Simulation Mode)**
- **Node.js** 14+ and npm 6+
- **Any OS** - Windows, macOS, Linux
- **Browser** - Chrome, Firefox, Safari, Edge

### **Full Features (Real Monitoring)**
- **Linux** recommended (Ubuntu, Debian, Arch)
- **WiFi Adapter** with monitor mode support
- **Bluetooth** adapter
- **Tools**: `aircrack-ng`, `bluez`, `tcpdump`

```bash
# Install monitoring tools (Linux)
sudo apt update
sudo apt install aircrack-ng bluez tcpdump nodejs npm

# Enable monitor mode for WiFi
sudo airmon-ng start wlan0
```

## 🎯 Usage

### **1. Start the Server**
```bash
npm start
```

### **2. Open in Browser**
- **Desktop**: http://localhost:3000
- **Mobile**: Same URL (auto-detects device)

### **3. Connect & Monitor**
1. Click **"🔗 CONNECT"** 
2. Click **"⚡ START"** to begin real-time monitoring
3. Watch for threat alerts with LED flashes and haptic feedback

### **4. Mobile Installation (PWA)**
- **iOS**: Safari → Share → "Add to Home Screen"
- **Android**: Chrome → Menu → "Add to Home Screen"  
- **Desktop**: Chrome → Install button in address bar

## ⌨️ Controls

### **Desktop Shortcuts**
- `Ctrl+Shift+C` - Connect Backend
- `Ctrl+Shift+R` - Start Real-Time  
- `Ctrl+Shift+S` - Force Scan
- `Ctrl+Shift+T` - Test Connection
- `Ctrl+Shift+E` - Emergency Stop
- `Ctrl+Shift+X` - Export Data

### **Mobile Shortcuts**
- **Bottom Bar** - Quick access buttons
- **Haptic Feedback** - Vibration patterns for threats
- **Native Sharing** - Export via mobile share sheet

## 🔧 Configuration

### **Environment Variables**
```bash
PORT=3000                    # Server port
WEBSOCKET_PORT=8080         # WebSocket port  
SACRED_TOKEN=ψΩ§∞           # Authentication token
NODE_ENV=production         # Production mode
```

### **Real Monitoring Setup**
```bash
# WiFi Interface in Monitor Mode
sudo airmon-ng start wlan0
sudo airodump-ng wlan0mon

# Bluetooth Scanning  
sudo hciconfig hci0 up
sudo hcitool scan

# Network Monitoring
sudo tcpdump -i any
```

## 📊 API Reference

### **WebSocket Commands**
```javascript
// Connect and authenticate
{
  "command": "start_monitoring",
  "mobile": true,
  "token": "ψΩ§∞"
}

// Force scan all vectors
{
  "command": "force_scan", 
  "mobile": false,
  "token": "ψΩ§∞"
}

// Emergency shutdown
{
  "command": "emergency_stop",
  "token": "ψΩ§∞"
}
```

### **REST Endpoints**
```bash
GET  /api/status           # System status
GET  /api/threats          # Recent threats  
POST
