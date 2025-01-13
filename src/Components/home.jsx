import React, { useState, useEffect } from "react";
import "./css/home.css";
import { connectCoreWallet } from "./wallet";
import { ethers } from "ethers";

const Home = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [countdown, setCountdown] = useState(0); // in seconds
  const [tickets, setTickets] = useState(0);
  const [balance, setBalance] = useState(0);
  const [lotteryActive, setLotteryActive] = useState(false);
  const [supportedTokens, setSupportedTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(0);

  // Define the target date (the lottery draw date)
  const targetDate = new Date("2025-01-20T00:00:00Z").getTime(); // Set your target date and time here
  const  img2 = "data:image/jpeg;base64,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"
  // Connect Wallet
  const connectWallet = async () => {
    try {
      const { walletAddress, balance } = await connectCoreWallet();
      setWalletConnected(true);
      setWalletAddress(walletAddress);
      setBalance(balance);
    } catch (err) {
      alert("Failed to connect wallet: " + err.message);
    }
  };

  // Get Supported Tokens and Lottery Status
  const getLotteryDetails = async () => {
    try {
      const lotteryContract = await getLotteryContract();
      const activeStatus = await lotteryContract.lotteryActive();
      setLotteryActive(activeStatus);

      const tokens = await lotteryContract.getTokens();
      setSupportedTokens(tokens);

      // Assume we can fetch the ticket price of the first supported token
      if (tokens.length > 0) {
        const ticketPrice = await lotteryContract.supportedTokens(tokens[0]);
        setTicketPrice(ticketPrice.ticketPrice);
        setSelectedToken(tokens[0]);
      }
    } catch (err) {
      console.error("Error fetching lottery details: ", err);
    }
  };

  // Purchase Tickets
  const purchaseTicket = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    if (balance < ticketPrice) {
      alert("Insufficient funds to purchase a ticket.");
      return;
    }

    try {
      const lotteryContract = await getLotteryContract();
      const tx = await lotteryContract.buyTickets(selectedToken, 1); // Purchase 1 ticket
      await tx.wait();
      setTickets(tickets + 1);
      setBalance(balance - ticketPrice);
      alert("Ticket purchased successfully!");
    } catch (err) {
      alert("Error purchasing ticket: " + err.message);
    }
  };

  // Countdown Logic
  useEffect(() => {
    // Check if there's a saved countdown from localStorage
    const savedCountdown = localStorage.getItem("countdown");
    if (savedCountdown) {
      setCountdown(Number(savedCountdown)); // Initialize countdown from saved value
    }

    // Function to calculate and update the countdown
    const updateCountdown = () => {
      const now = new Date().getTime(); // Current time in milliseconds
      const distance = targetDate - now; // Time remaining in milliseconds

      if (distance <= 0) {
        clearInterval(timer);
        setCountdown(0);
        localStorage.setItem("countdown", 0);
      } else {
        setCountdown(Math.floor(distance / 1000)); // Set countdown in seconds
        localStorage.setItem("countdown", Math.floor(distance / 1000)); // Save countdown to localStorage
      }
    };

    const timer = setInterval(updateCountdown, 1000); // Update countdown every second
    return () => clearInterval(timer); // Clear the interval on component unmount
  }, []);

  const formatCountdown = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Helper function to get the Lottery contract instance
  const getLotteryContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractAddress = "<YOUR_CONTRACT_ADDRESS>";
    const abi = [
      "function lotteryActive() public view returns (bool)",
      "function getTokens() public view returns (address[] memory)",
      "function supportedTokens(address) public view returns (tuple(bool isActive, uint256 ticketPrice, uint256 totalTickets))",
      "function buyTickets(address _token, uint256 _amount) public nonReentrant",
    ];

    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    return contract;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Lottery-DAO</h1>
        <button className="wallet-button" onClick={connectWallet}>
          {walletConnected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </header>

      <main className="main">
        <div className="lottery-status">
          <h2>Lottery Status</h2>
          <p>
            Current Status: <span className={lotteryActive ? "active" : "inactive"}>{lotteryActive ? "Active" : "Inactive"}</span>
          </p>
          <p>Next Draw: <b>January 20, 2025</b></p>
          <p>Time Remaining: <b>{formatCountdown()}</b></p>
        </div>

        <div className="featured-prize">
          <h2>Featured Lottery Prize</h2>
          <img className="image2" src={img2} alt="Luxury Car" />
          <p><b>Luxury Prize</b></p>
                <p>
                Win an exciting prize in the upcoming draw! The reward is payable in AVAX. 
                Participate now to increase your chances.
                </p>

        </div>

        <div className="purchase-section">
          <h2>Purchase Tickets</h2>
          <p>Wallet Balance: {balance} ETH</p>
          <button className="purchase-button" onClick={purchaseTicket}>
            Buy Ticket ({ticketPrice} ETH)
          </button>
          <p>Total Tickets Purchased: {tickets}</p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Lottery-DAO. All rights reserved.</p>
        <div>
          <a href="#privacy">Privacy Policy</a> | <a href="#contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
