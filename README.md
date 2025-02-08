# 🎲 Lottery-DAO

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/your-username/lottery-dao)

## 🌟 Description
Lottery-DAO is a cutting-edge decentralized lottery system built on the Avalanche blockchain. We've created a seamless platform where users can participate in token-based lotteries using various ERC20 tokens. By leveraging Avalanche's lightning-fast transactions and minimal fees, we deliver an exceptional user experience that's both secure and efficient.

## ✨ Key Features

### 🪙 Multi-Token Support
- Buy tickets using your favorite ERC20 tokens
- Each token maintains its own prize pool with unique ticket pricing
- Flexible token management system for future expansion

### 🎫 Smart Ticket System
- Seamless ticket purchasing with your chosen tokens
- Real-time tracking of your ticket holdings
- Transparent pool management for each token type

### 🔒 Rock-Solid Security
- Ironclad protection against reentrancy attacks
- Secure administrative controls through ownership management
- Battle-tested token transfer handling with comprehensive error checking

### 🎮 Lottery Mechanics
- Customizable lottery duration to suit different game styles
- Tamper-proof winner selection powered by blockchain randomness
- Independent prize pools for each supported token
- Hassle-free automated prize distribution

## 🛠️ Tech Stack

### Languages & Frameworks
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Blockchain
![Avalanche](https://img.shields.io/badge/Avalanche-E84142?style=for-the-badge&logo=avalanche&logoColor=white)
![Web3.js](https://img.shields.io/badge/Web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white)

### Development Tools
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-4E5EE4?style=for-the-badge&logo=OpenZeppelin&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

## 🚀 Getting Started

### Prerequisites
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

1. Clone the project
```bash
git clone <repo-url>
cd backend
```

2. Set up dependencies
```bash
npm install
```

3. Configure your Avalanche network settings
Head to [hardhat.config.js](./backend/hardhat.config.js) and configure your Avalanche network parameters.

4. Deploy to Avalanche Fuji
```bash
npx hardhat ignition deploy ./ignition/modules/multiTokenLottery.js --network avalancheFuji
npx hardhat run scripts/initialize.js --network avalancheFuji
```

5. Fire up the local environment
```bash
cd ..
npm install
npm run dev
```

> 💡 Remember to update the contract address in your configuration!

## 👥 The Team

### Core Contributors
| Name | Role | Contact |
|------|------|---------|
| Richard Kabi | Developer | [![GitHub](https://img.shields.io/badge/GitHub-NebulaScout-181717?style=flat&logo=github)](https://github.com/NebulaScout) [![Email](https://img.shields.io/badge/Email-kabirichard27%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:kabirichard27@gmail.com) |
| Collins Kamau | Full Stack Dev | [![GitHub](https://img.shields.io/badge/GitHub-JBcollo1-181717?style=flat&logo=github)](https://github.com/JBcollo1) [![Email](https://img.shields.io/badge/Email-jbcollins254%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:jbcollins254@gmail.com) |
| Aisha Barasa | Developer | [![GitHub](https://img.shields.io/badge/GitHub-Aisha--Barasa-181717?style=flat&logo=github)](https://github.com/Aisha-Barasa) [![Email](https://img.shields.io/badge/Email-aishabarasa19%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:aishabarasa19@gmail.com) |
| Alvin Kiprotich | Backend Dev | [![GitHub](https://img.shields.io/badge/GitHub-AlvinKiprotich--dev-181717?style=flat&logo=github)](https://github.com/AlvinKiprotich-dev) [![Email](https://img.shields.io/badge/Email-alvinkiprotichkipchoge%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:alvinkiprotichkipchoge@gmail.com) |
| Keith Kadima | Full Stack Dev | [![GitHub](https://img.shields.io/badge/GitHub-tufstraka-181717?style=flat&logo=github)](https://github.com/tufstraka) [![Email](https://img.shields.io/badge/Email-keithkadima%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:keithkadima@gmail.com) |
| Jude Kimathi | Backend Dev | [![GitHub](https://img.shields.io/badge/GitHub-jxkimathi-181717?style=flat&logo=github)](https://github.com/jxkimathi) [![Email](https://img.shields.io/badge/Email-judekimathii%40gmail.com-EA4335?style=flat&logo=gmail)](mailto:judekimathii@gmail.com) |

## 🏆 Project Milestones

### Frontend & Wallet Integration
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

#### Completed Deliverables
1. **💫 Landing Page**
   - Sleek, modern design with intuitive wallet connection
   - Clear project overview and value proposition
   - ![Landing Page](https://github.com/user-attachments/assets/ba6f5807-9237-4b56-842e-4979ef8cd91f)

2. **👛 Wallet Integration**
   - Smooth MetaMask/Core integration
3. **🎮 Lottery Interface**
   - Browse active lotteries and ticket options
   - User-friendly ticket purchasing system
   - ![Lottery Interface](https://github.com/user-attachments/assets/57976104-a487-46c8-a6e9-31cc2bb30af0)
   - ![Ticket Purchase](https://github.com/user-attachments/assets/a24f5a53-f655-483f-9042-80f8a47d9737)

4. **⚙️ Admin Dashboard**
   - Comprehensive lottery management system
   - Token configuration and pricing controls
   - Real-time participation metrics
   - ![Admin Overview](https://github.com/user-attachments/assets/016f7bd2-0492-4ffd-b2e8-55f81b6ce89d)
   - ![Token Management](https://github.com/user-attachments/assets/b3e777a3-9b3b-4332-834f-f7640ade8b6d)
   - ![Analytics Dashboard](https://github.com/user-attachments/assets/9409ba6e-2a60-4ae8-a759-3a3b13a52923)

## ⛰️ Avalanche Integration

### Why Avalanche?
![Network Status](https://img.shields.io/badge/Network-Active-success?style=for-the-badge&logo=avalanche)

1. **🚄 Speed & Performance**
   - Lightning-fast transaction finality
   - Seamless user experience with minimal waiting times

2. **📝 Smart Contract Deployment**
   - Fully tested on Avalanche's Fuji testnet
   - Hardhat deployment pipeline for reliable updates

3. **💰 Cost Efficiency**
   - Minimal transaction fees
   - Economical for both users and operators

## 🔮 Vision
Lottery-DAO represents the future of decentralized lottery. By combining blockchain transparency with user-friendly design, we're creating an inclusive platform that appeals to both crypto veterans and newcomers. Stay tuned for exciting new features and community initiatives!

## 📊 Project Status
![Development Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Build Status](https://img.shields.io/badge/Build-Passing-success?style=for-the-badge)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25-green?style=for-the-badge)

