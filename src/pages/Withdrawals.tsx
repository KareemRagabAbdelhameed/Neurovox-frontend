import { useState } from "react";

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("crypto");
  const [destination, setDestination] = useState("");
  const [withdrawals, setWithdrawals] = useState([{}]);
  const [balance, setBalance] = useState({ available: 250.0, locked: 50.0 });

  const handleWithdrawal = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (!destination) {
      alert("Please enter a destination");
      return;
    }
    if (amt > balance.available) {
      alert("Insufficient balance");
      return;
    }

    const fee = (amt * 0.05).toFixed(2);
    const net = (amt * 0.95).toFixed(2);

    const newWithdrawal = {
      id: Date.now(),
      amount: amt.toFixed(2),
      fee,
      netAmount: net,
      status: "pending",
      method,
      destination,
      createdAt: new Date(),
    };

    setWithdrawals([newWithdrawal, ...withdrawals]);
    setBalance({
      ...balance,
      available: balance.available - amt,
    });

    setAmount("");
    setDestination("");
  };

  

  const calculateFee = (amt: string) => ((parseFloat(amt) || 0) * 0.05).toFixed(2);
  const calculateNet = (amt: string) => ((parseFloat(amt) || 0) * 0.95).toFixed(2);

  return (
    <div className="container mx-auto p-6 pb-36 lg:pb-0 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Withdraw Funds
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer funds from your wallet
          </p>
        </div>
      </div>

      {/* Balance */}
      {/* <div className="bg-gradient-to-r from-indigo-500 to-purple-600  dark:bg-gray-900 shadow rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-white dark:text-indigo-400">
              ${balance.available.toFixed(2)}
            </p>
            <p className="text-white dark:text-gray-400 text-sm mt-1">
              Available Balance
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white dark:text-gray-400">
              Locked Funds
            </p>
            <p className="text-xl font-semibold text-white dark:text-gray-200">
              ${balance.locked.toFixed(2)}
            </p>
          </div>
        </div>
      </div> */}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            New Withdrawal
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Request a withdrawal from your account
          </p>

          <div className="p-3 border border-blue-200 dark:border-blue-700 rounded bg-blue-50 dark:bg-blue-800 text-sm text-blue-700 dark:text-blue-100">
            Withdrawals include a 5% processing fee. Minimum withdrawal: $10
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Withdrawal Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            >
              <option value="crypto">Cryptocurrency</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {method === "crypto" ? "Wallet Address" : "Account Details"}
            </label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={
                method === "crypto" ? "0x..." : "Account number / IBAN"
              }
              className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100.00"
              className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Fee & Net */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Withdrawal Amount:
                </span>
                <span className="font-medium">${amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Processing Fee (5%):
                </span>
                <span className="text-red-600 dark:text-red-400">
                  -${calculateFee(amount)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                <span className="font-medium">You will receive:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  ${calculateNet(amount)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleWithdrawal}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500"
          >
            Request Withdrawal
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Withdrawals are typically processed within 24–48 hours
          </p>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Withdrawals
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your withdrawal history
          </p>

          {withdrawals.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No withdrawals yet
            </p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map(() => (
                <div
                //   key={w.id}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex justify-between mb-2">
                    <div>
                      {/* <span className="font-medium">${w.amount}</span> */}
                      <span className="font-medium">${5}</span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {/* (Net: ${w.netAmount}) */}
                        (Net: ${12})
                      </span>
                    </div>
                    {/* {getStatusBadge(w.status)} */}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      {/* <span>Fee: ${w.fee}</span> */}
                      <span>Fee: ${5}</span>
                      {/* <span>{w.method}</span> */}
                      <span>{"add"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="truncate max-w-[150px]">
                        {/* {w.destination} */}
                        {"destination"}
                      </span>
                      {/* <span>{w.createdAt.toLocaleDateString()}</span> */}
                      <span>{"20/3/2025"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
