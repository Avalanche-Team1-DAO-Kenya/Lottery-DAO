'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LOTTERY_ABI_ARTIFACT from '../../deployments/MultiTokenLottery.json';

const LOTTERY_ABI = LOTTERY_ABI_ARTIFACT.abi;

const MultiTokenLotteryApp = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [tokenConfigs, setTokenConfigs] = useState({});
  const [selectedToken, setSelectedToken] = useState('');
  const [ticketAmount, setTicketAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState(0);
  const [userTickets, setUserTickets] = useState({});

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);

          const accounts = await newProvider.listAccounts();
          if (accounts.length > 0) {
            setAccount(accounts[0].address);

            const contractAddress = '0x21C4432DD0e56242A5aBB19b482470A7C2Bb4A0c';
            const newContract = new ethers.Contract(contractAddress, LOTTERY_ABI, newProvider);
            console.log(newContract)
            setContract(newContract);

            await updateLotteryState(newContract, accounts[0].address);
          }
        } catch (err) {
          handleError(err, 'Failed to initialize');
        }
      } else {
        setError('Please install MetaMask');
      }
    };

    init();
  }, []);

  const handleError = (err, message) => {
    console.error(message, err);
    setError(`${message}: ${err.message}`);
  };

  const updateLotteryState = async (contractInstance, userAccount) => {
    if (!contractInstance || !userAccount) return;

    try {
      const [active, lotteryEndTime, availableTokens, participantCount] = await Promise.all([
        contractInstance.lotteryActive(),
        contractInstance.lotteryEndTime(),
        contractInstance.getTokens(),
        contractInstance.getParticipantCount(),
      ]);

      setIsActive(active);
      setEndTime(Number(lotteryEndTime));
      setTokens(availableTokens);
      setParticipants(Number(participantCount));

      const configs = {};
      const tickets = {};

      for (const token of availableTokens) {
        const config = await contractInstance.supportedTokens(token);
        configs[token] = {
          isActive: config.isActive,
          ticketPrice: formatTicketPrice(Number(config.ticketPrice)),
          totalTickets: Number(config.totalTickets),
        };

        const userTicketCount = await contractInstance.ticketHoldings(token, userAccount);
        tickets[token] = Number(userTicketCount);
      }


      setTokenConfigs(configs);
      setUserTickets(tickets);
    } catch (err) {
      handleError(err, 'Failed to update lottery state');
    }
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.listAccounts();
        setAccount(accounts[0].address);
        await updateLotteryState(contract, accounts[0].address);
      }
    } catch (err) {
      handleError(err, 'Failed to connect wallet');
    }
  };

  const formatTicketPrice = (priceInWei, decimals = 6 ) => {
    // Ensure priceInWei is valid before formatting
    if (!priceInWei || priceInWei <= 0) {
      console.error('Invalid ticket price:', priceInWei);
      return '0.0000'; 
    }

    console.log(priceInWei)

    try {
      const price = ethers.formatUnits(priceInWei, decimals);
      return parseFloat(price).toFixed(2); 
    } catch (err) {
      console.error('Error formatting ticket price:', err);
      return '0.0000'; 
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setContract(null);
    setAccount('');
    setIsActive(false);
    setEndTime(0);
    setTokens([]);
    setTokenConfigs({});
    setUserTickets({});
    setError('');
  };

  const buyTickets = async () => {
    if (!contract || !selectedToken || !ticketAmount) return;
  
    setLoading(true);
    setError('');
  
    try {
      const signer = await provider.getSigner();
      const connectedContract = contract.connect(signer);
  
      const tokenContract = new ethers.Contract(
        selectedToken,
        ['function allowance(address owner, address spender) view returns (uint256)',
         'function approve(address spender, uint256 amount) public returns (bool)'],
        signer
      );
  
      const totalCost = tokenConfigs[selectedToken].ticketPrice * Number(ticketAmount);
  
      // Get the current allowance
      const allowance = await tokenContract.allowance(account, contract.target);
  
      if (allowance < totalCost) {
        // If allowance is less than total cost, approve the contract to spend the required amount
        const approveTx = await tokenContract.approve(contract.target, totalCost);
        await approveTx.wait();
        console.log('Allowance granted');
      } else {
        console.log('Sufficient allowance already granted');
      }
  
      // Proceed with buying tickets
      const tx = await connectedContract.buyTickets(selectedToken, ticketAmount);
      await tx.wait();
  
      setTicketAmount('');
      await updateLotteryState(contract, account);
    } catch (err) {
      handleError(err, 'Failed to buy tickets');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = () => {
    if (!endTime) return 'Not started';
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = endTime - now;
    if (timeLeft <= 0) return 'Ended';

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Token Lottery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {!account ? (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-sm">Connected: {formatAddress(account)}</div>
                <Button onClick={disconnectWallet} variant="outline">Disconnect</Button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>Status: {isActive ? 'Active' : 'Inactive'}</div>
              <div>Time Left: {formatTimeLeft()}</div>
              <div>Total Participants: {participants}</div>
            </div>

            {tokens.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Ticket Price</TableHead>
                    <TableHead>Total Tickets</TableHead>
                    <TableHead>Your Tickets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map((token) => (
                    <TableRow key={token}>
                      <TableCell>{formatAddress(token)}</TableCell>
                      <TableCell>{tokenConfigs[token]?.ticketPrice} </TableCell>
                      <TableCell>{tokenConfigs[token]?.totalTickets}</TableCell>
                      <TableCell>{userTickets[token] || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Select Token</label>
                <select
                  className="block w-full mt-1"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                >
                  <option value="" disabled>Select a token</option>
                  {tokens.map((token) => (
                    <option key={token} value={token}>
                      {formatAddress(token)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Number of Tickets</label>
                <Input
                  type="number"
                  min="1"
                  value={ticketAmount}
                  onChange={(e) => setTicketAmount(e.target.value)}
                  placeholder="Enter ticket amount"
                />
              </div>

              <Button onClick={buyTickets} disabled={!selectedToken || !ticketAmount || loading}>
                {loading ? 'Processing...' : 'Buy Tickets'}
              </Button>
            </div>

            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiTokenLotteryApp;

