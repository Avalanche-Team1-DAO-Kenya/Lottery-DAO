import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import "./css/AdminDashboard.css"

const LOTTERY_ADDRESS = '0x21C4432DD0e56242A5aBB19b482470A7C2Bb4A0c';
const ADMINS = [
  '0x5B058198Fc832E592edA2b749bc6e4380f4ED458',
];

// ABI definition for required functions
const LOTTERY_ABI = [
  "function owner() view returns (address)",
  "function lotteryActive() view returns (bool)",
  "function lotteryEndTime() view returns (uint256)",
  "function getParticipantCount() view returns (uint256)",
  "function participants(uint256) view returns (address addr, uint256 tickets, address tokenUsed)",
  "function getTokens() view returns (address[])",
  "function startLottery() external",
  "function selectWinners() external",
  "function ticketHoldings(address, address) view returns (uint256)",
  "function supportedTokens(address) view returns (bool isActive, uint256 ticketPrice, uint256 totalTickets)"
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lotteryState, setLotteryState] = useState({
    isActive: false,
    participants: 0,
    totalTickets: 0,
    endTime: 0,
  });
  const [participantData, setParticipantData] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [connectingWallet, setConnectingWallet] = useState(false);


  const connectWallet = async () => {
    if (connectingWallet) return; // Prevent multiple connection attempts
    
    try {
      setConnectingWallet(true);
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // First check if we're already connected
      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts.length === 0) {
        // Only request access if we're not already connected
        await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
      }
      
      // Get the current account
      const currentAccounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      
      if (currentAccounts.length === 0) {
        throw new Error('No authorized account found');
      }

      const currentAccount = currentAccounts[0];
      setAccount(currentAccount);

      // Initialize provider and contract
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const lotteryContract = new ethers.Contract(LOTTERY_ADDRESS, LOTTERY_ABI, signer);
      setContract(lotteryContract);

      return true;
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
      return false;
    } finally {
      setConnectingWallet(false);
    }
  };
  // Initialize web3 connection and contract
  useEffect(() => {
    const init = async () => {
      try {
        const connected = await connectWallet();
        
        if (connected) {
          // Setup event listeners only after successful connection
          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });

          window.ethereum.on('disconnect', () => {
            window.location.reload();
          });
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  // Check admin status and fetch data
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      if (!contract || !account) return;

      try {
        const owner = await contract.owner();
        const isCurrentOwner = owner.toLowerCase() === account.toLowerCase();
        const isCurrentAdmin = ADMINS.map(a => a.toLowerCase()).includes(account.toLowerCase());

        setIsOwner(isCurrentOwner);
        setIsAdmin(isCurrentOwner || isCurrentAdmin);

        if (!isCurrentOwner && !isCurrentAdmin) {
          navigate('/');
          return;
        }

        // Fetch lottery state
        const [active, endTime, participantCount, tokens] = await Promise.all([
          contract.lotteryActive(),
          contract.lotteryEndTime(),
          contract.getParticipantCount(),
          contract.getTokens()
        ]);

        setLotteryState({
          isActive: active,
          participants: Number(participantCount), // Convert BigInt to Number
          endTime: Number(endTime), // Convert BigInt to Number
        });

        setTokenList(tokens);

        // Fetch participant details
        const participantList = [];
        for (let i = 0; i < Number(participantCount); i++) {
          const participant = await contract.participants(i);
          participantList.push({
            addr: participant.addr,
            tickets: Number(participant.tickets), // Convert BigInt to Number
            tokenUsed: participant.tokenUsed,
          });
        }
        setParticipantData(participantList);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
    const interval = setInterval(checkAdminAndFetchData, 30000);
    return () => clearInterval(interval);
  }, [contract, account, navigate]);

  const startLottery = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.startLottery();
      await tx.wait();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const endLottery = async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const tx = await contract.selectWinners();
      await tx.wait();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  if (!isAdmin && !isOwner) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Lottery Admin Dashboard</h1>
        <div className="lottery-controls">
          {isOwner && (
            <button
              className={`control-button ${lotteryState.isActive ? 'end' : 'start'}`}
              onClick={lotteryState.isActive ? endLottery : startLottery}
              disabled={loading}
            >
              {loading ? 'Processing...' : lotteryState.isActive ? 'End Lottery' : 'Start Lottery'}
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Participants</h3>
          <p className="stat-value">{lotteryState.participants}</p>
        </div>
        <div className="stat-card">
          <h3>Status</h3>
          <p className={`stat-value ${lotteryState.isActive ? 'active' : 'inactive'}`}>
            {lotteryState.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="stat-card">
          <h3>End Time</h3>
          <p className="stat-value">
            {lotteryState.endTime > 0 ? new Date(lotteryState.endTime * 1000).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>

      <div className="participants-table-container">
        <h2>Participant Details</h2>
        <div className="table-wrapper">
          <table className="participants-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Tickets</th>
                <th>Token Used</th>
              </tr>
            </thead>
            <tbody>
              {participantData.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.addr}</td>
                  <td>{participant.tickets}</td>
                  <td>{participant.tokenUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;