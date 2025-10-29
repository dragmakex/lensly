"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAccount, useChainId, useSwitchChain, useSendTransaction, useWaitForTransactionReceipt, useConnect } from "wagmi";
import { base } from "wagmi/chains";
import { parseUnits, encodeFunctionData } from "viem";
import { USDC_CONTRACT } from "@/wagmi";
import type { TopUser } from "@/types/charts";

const USDC_TRANSFER_ABI = [
  {
    constant: false,
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;

interface DonationComponentProps {
  className?: string;
  topUsers?: TopUser[] | null;
}

export default function DonationComponent({ className = "", topUsers }: DonationComponentProps) {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { connect, connectors } = useConnect();
  const { data: hash, error: txError, isPending, sendTransaction } = useSendTransaction();

  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed && hash) {
      setShowSuccess(true);
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    const switchToBase = async () => {
      if (chainId && chainId !== base.id) {
        try {
          await switchChainAsync({ chainId: base.id });
        } catch {
          // Silent error handling for production
        }
      }
    };
    switchToBase();
  }, [chainId, switchChainAsync]);

  useEffect(() => {
    if (selectedUser) {
      const username = selectedUser.split(' (')[0];
      fetchUserAddress(username);
    } else {
      setRecipientAddress("");
      setError("");
    }
  }, [selectedUser]);

  const fetchUserAddress = async (username: string) => {
    if (!username.trim() || username.length <= 2) {
      setRecipientAddress("");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/neynar/search/user/${encodeURIComponent(username)}`);
      const data = await response.json();

      if (data.success && data.data) {
        const address = data.data.verified_addresses?.primary?.eth_address;

        if (!address || !address.startsWith('0x') || address.length !== 42) {
          setRecipientAddress("");
          setError("User does not have a verified Ethereum address");
        } else {
          setRecipientAddress(address);
          setError("");
        }
      } else {
        setRecipientAddress("");
        setError(data.message || "User not found");
      }
    } catch (err) {
      setRecipientAddress("");
      setError("Failed to fetch user address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    setError("");
  };

  const resetForm = () => {
    setSelectedUser("");
    setAmount("");
    setRecipientAddress("");
    setError("");
    setShowSuccess(false);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!recipientAddress) {
      setError("Please enter a valid Farcaster username");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError("");

    try {
      if (!recipientAddress || !recipientAddress.startsWith('0x') || recipientAddress.length !== 42) {
        setError(`Invalid recipient address format: ${recipientAddress}`);
        return;
      }

      if (!USDC_CONTRACT.address || !USDC_CONTRACT.address.startsWith('0x') || USDC_CONTRACT.address.length !== 42) {
        setError(`Invalid USDC contract address: ${USDC_CONTRACT.address}`);
        return;
      }

      const amountInWei = parseUnits(amount, USDC_CONTRACT.decimals);

      const data = encodeFunctionData({
        abi: USDC_TRANSFER_ABI,
        functionName: 'transfer',
        args: [recipientAddress as `0x${string}`, amountInWei]
      });

      sendTransaction({
        to: USDC_CONTRACT.address,
        data,
        value: BigInt(0),
      });

    } catch {
      // Silent error handling for production
    }
  };

  if (showSuccess) {
    return (
      <div className={`liquid-glass rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-green-500/30">
              <Heart className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Donation Sent!</h3>
              <p className="text-xs opacity-70">Your donation was successful</p>
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <p className="text-sm text-green-300">Transaction confirmed on Base chain</p>
            {hash && (
              <p className="text-xs text-green-200 mt-1">
                TX: {hash.slice(0, 10)}...{hash.slice(-8)}
              </p>
            )}
          </div>
          <button
            onClick={resetForm}
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/20 border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
          >
            Send Another Donation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`liquid-glass rounded-2xl p-6 text-white relative overflow-hidden ${className}`}>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Send USDC on Base</h3>
            <p className="text-xs opacity-70">Support your favorite Farcaster users</p>
          </div>
        </div>

        {!isConnected ? (
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <p className="text-sm text-white/80 text-center mb-3">
              Connect your wallet to send donations
            </p>
            <button
              onClick={() => connect({ connector: connectors[0] })}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/20 border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate}>
            <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 opacity-90">
                Select Recipient
              </label>
              <select
                value={selectedUser}
                onChange={(e) => handleUserChange(e.target.value)}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
              >
                <option value="">Choose a user...</option>
                {topUsers?.map((user, index) => (
                  <option key={index} value={`${user.user_name} (FID: ${user.user_id})`}>
                    {user.user_name} (FID: {user.user_id})
                  </option>
                ))}
              </select>
              {isLoading && (
                <p className="text-xs text-yellow-400 mt-1">
                  Finding user address...
                </p>
              )}
              {recipientAddress && !isLoading && (
                <p className="text-xs text-green-400 mt-1">
                  ✓ Address found: {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-90">
                Amount (USDC)
              </label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all"
              />
            </div>

            {(txError || error) && (
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <p className="text-sm text-red-300">
                  {txError?.message || error}
                </p>
              </div>
            )}

            {hash && (
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <p className="text-sm text-green-300">Transaction submitted!</p>
                <p className="text-xs text-green-200 mt-1">
                  TX: {hash.slice(0, 10)}...{hash.slice(-8)}
                </p>
              </div>
            )}

            {isConfirming && (
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                <p className="text-sm text-yellow-300">Waiting for confirmation...</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedUser || !recipientAddress || !amount || parseFloat(amount) <= 0 || isPending || isConfirming}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-white text-sm font-medium rounded-lg bg-white/20 border border-white/30 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming...</span>
                </div>
              ) : (
                "Send Donation"
              )}
            </button>

            <div className="text-xs opacity-60 text-center">
              <p>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <p>Network: Base {chainId === base.id ? '✓' : '✗'}</p>
            </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}