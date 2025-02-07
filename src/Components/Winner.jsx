import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import "./css/Winners.css"

const CONTRACT_ADDRESS = '0xeADD42c14c50397E64b4dc94a4beD91175c1E011';
const ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "prize",
        "type": "uint256"
      }
    ],
    "name": "WinnerSelected",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getTokens",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lotteryActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const generateBlockchainImage = (seed) => {
  const colors = ['#1a237e', '#ffd700', '#4a90e2', '#c2185b', '#ffa726'];
  const randomColor = colors[Math.abs(seed.charCodeAt(0)) % colors.length];
  
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${randomColor}" strokeOpacity="0.2" strokeWidth="1"/>
      </pattern>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:${randomColor};stop-opacity:0.5"/>
        <stop offset="100%" style="stop-color:${randomColor};stop-opacity:0"/>
      </radialGradient>
    </defs>
    <rect width="200" height="200" fill="url(#grid)"/>
    <circle cx="100" cy="100" r="80" fill="url(#glow)"/>
    <polygon points="100,20 180,100 100,180 20,100" fill="${randomColor}" fillOpacity="0.3" stroke="${randomColor}" strokeWidth="2"/>
  </svg>`;
};

const WinnersPage = () => {
  const [winners, setWinners] = useState([]);
  const [latestWinner, setLatestWinner] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      setLoading(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const newContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      
      setContract(newContract);
      setAccount(accounts[0]);
      setIsConnected(true);
      setLoading(false);
      
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
      setLoading(false);
      console.error('Connection error:', err);
    }
  };

  useEffect(() => {
    if (!contract) return;

    const handleWinnerSelected = (winner, token, prize, event) => {
      const newWinner = {
        address: winner,
        token: token,
        prize: ethers.formatUnits(prize, 18),
        date: new Date().toLocaleDateString(),
        image: generateBlockchainImage(winner),
        transactionHash: event.transactionHash
      };

      setWinners(prev => [newWinner, ...prev]);
      setLatestWinner(newWinner);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    contract.on('WinnerSelected', handleWinnerSelected);

    return () => {
      contract.off('WinnerSelected', handleWinnerSelected);
    };
  }, [contract]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setIsConnected(false);
          setAccount('');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  const NoWinnersDisplay = () => (
    <div className="no-winners-container">
      <div className="hologram-coin"></div>
      <h2 className="future-text">No Winners Yet... The Future Awaits!</h2>
      <p className="scroll-text">Be the first to make history in the lottery!</p>
      <button className="cyber-button" onClick={connectWallet} disabled={loading}>
        {loading ? 'Initializing...' : 'Enter Now & Win Big'}
        <span className="cyber-button-glitch"></span>
      </button>
    </div>
  );

  return (
    <div className="cyber-container">
      <div className="grid-overlays"></div>
      <div className="node-animation"></div>

      {!isConnected && (
        <div className="connect-section">
          <NoWinnersDisplay />
          {error && <div className="cyber-error">{error}</div>}
        </div>
      )}

      {showNotification && latestWinner && (
        <div className="winner-notification">
          🎉 New Winner: {latestWinner.address.substring(0, 6)}...{latestWinner.address.substring(38)} 
          won {latestWinner.prize} tokens!
        </div>
      )}

      <h1 className="cyber-title">🏆 Cyber Lottery Winners</h1>

      {isConnected && loading && (
        <div className="loading-container">
          <div className="cyber-loader"></div>
          <p>Initializing blockchain connection...</p>
        </div>
      )}

      {isConnected && !loading && winners.length === 0 && <NoWinnersDisplay />}

      {isConnected && winners.length > 0 && (
        <div className="winners-grid">
          {winners.map((winner, index) => (
            <div key={index} className="winner-card">
              <div className="card-hologram">
                <img 
                  src={winner.image} 
                  alt="Winner's blockchain pattern" 
                  className="winner-image"
                />
              </div>
              <div className="winner-details">
                <h2 className="winner-address">
                  {winner.address.substring(0, 6)}...{winner.address.substring(38)}
                </h2>
                <p className="winner-prize">
                  {winner.prize} 
                  <span className="token-address">
                    ({winner.token.substring(0, 6)}...{winner.token.substring(38)})
                  </span>
                </p>
                <p className="winner-date">{winner.date}</p>
                <a 
                  href={`https://etherscan.io/tx/${winner.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transaction-link"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WinnersPage;