import { useState, useEffect } from "react";
import api from "../config/axiosConfig";
import { useAppSelector } from "../store/hooks";
import Swal from "sweetalert2";

// Types
interface User {
  id: string;
  verified: boolean;
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  availableBalance: number | null;
  credits: number | null;
  lockedBalance : number | null,
  currentTier: string;
  tasksCompleted: number;
  points: number;
  level: number;
  referralCode: string;
}

interface Deposit {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  createdAt: string;
  confirmedAt?: string | null;
  user: User;
}

export default function DepositsPage() {
  const { token } = useAppSelector((state) => state.auth);
  const [amount, setAmount] = useState("");
  // const [currency, setCurrency] = useState("USD");
  const [method, setMethod] = useState("crypto");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", error: false });
    
  
  // Mock data for deposits and balance
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  useEffect(() => {
    
    fetchDeposits();
  }, []);

  const fetchDeposits = () => {
    api.get("deposits")
    .then((res) => {
      setDeposits(res.data.data);
      console.log(res.data);
    })
    .catch((err) => {
      console.error("Error fetching transactions:", err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };


  const showToast = (message: string, error = false) => {
    setToast({ show: true, message, error });
    setTimeout(() => setToast({ show: false, message: "", error: false }), 3000);
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast("Please enter a valid amount", true);
      return;
    }

    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Not Logged In",
        text: "You need to login first before making a deposit.",
        confirmButtonText: "Login",
      });
      return;
    }
      
    try {
      const res = await api.post(
        "/deposits",
        {
          amount: parseFloat(amount),
          method,
          // currency,
        }
      );

      showToast("Deposit initiated successfully!");
      setDeposits((prev) => [res.data.data, ...prev]);
      setAmount("");
    } catch (error: any) {
      console.error(error);
      showToast("Deposit failed, please try again.", true);
    }
  };  





  const getStatusBadge = (status:any) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <svg className="-ml-0.5 mr-1.5 h-3 w-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Failed
          </span>
        );
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">{status}</span>;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">

      {/* Toast Notification - Moved to top */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg text-white ${
          toast.error ? 'bg-red-500' : 'bg-green-500'
        } transition-opacity duration-300 z-50`}>
          {toast.message}
        </div>
      )}

      

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deposit Funds</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Add funds to your Neurovox wallet</p>
          </div>
        </div>
        
        {/* Deposit Form and History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">New Deposit</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Choose your deposit method and amount</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deposit Method</label>
                  <div className="mt-1">
                    <select 
                      value={method} 
                      onChange={(e) => setMethod(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="crypto">Cryptocurrency</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Credit/Debit Card</option>
                    </select>
                  </div>
                </div>

                {/* Currency */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div> */}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      placeholder="100.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                {method === 'crypto' && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Send only USDT/USDC to this address. Other tokens will be lost.
                    </p>
                  </div>
                )}
                
                <button
                  onClick={handleDeposit}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Confirm Deposit
                </button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Deposits are usually confirmed within 10-30 minutes
                </p>
              </div>
            </div>
          </div>
          
          {/* Deposit History */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Deposits</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Your deposit history</p>
              
              <div className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {isLoading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))
                ) : deposits.length > 0 ? (
                  deposits.map((deposit) => (
                    <div key={deposit.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">${deposit.amount} {deposit.currency}</span>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(deposit.status)}
                          
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="capitalize">{deposit.method}</span>
                        <span>{new Date(deposit.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No deposits yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}