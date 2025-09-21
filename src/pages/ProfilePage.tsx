import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/userSlice';
import type { AppDispatch, RootState } from '../store/store';
import api from '../config/axiosConfig';

interface ReferredUser {
  name: string;
  email: string;
  createdAt: string;
  level : number;
}

const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
  const { data: userInfo, loading, error } = useSelector((state: RootState) => state.user);
    const token = useSelector((state: any) => state.auth.token);
    const [copied, setCopied] = useState(false);

  const referredUsers: ReferredUser[] = [
    { name: 'Alice Smith', email: 'alice@example.com', createdAt: '20-11-2024',level : 1 },
    { name: 'Bob Johnson', email: 'bob@example.com', createdAt: '5-5-2035' , level : 2 },
  ];

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userInfo?.inviteLink ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 lg:ml-32 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <img
                src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                alt={userInfo?.firstName}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="text-white hover:text-blue-400 transition-colors">
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo?.firstName} {userInfo?.lastName}</h1>
              <p className="text-gray-500 dark:text-gray-400">{userInfo?.email}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FiEdit2 size={20} />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <FiTrash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white text-center md:text-left">
            <h3 className="text-lg font-medium opacity-90">Available Balance</h3>
            <p className="text-3xl font-bold mt-2">${userInfo?.availableBalance === null ? "0.00" : userInfo?.availableBalance.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white text-center md:text-left">
            <h3 className="text-lg font-medium opacity-90">Locked Balance</h3>
            <p className="text-3xl font-bold mt-2">${userInfo?.lockedBalance === null ? "0.00" : userInfo?.lockedBalance.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white text-center md:text-left">
            <h3 className="text-lg font-medium opacity-90">Credits</h3>
            <p className="text-3xl font-bold mt-2">${userInfo?.credits === null ? "0.00" : userInfo?.credits.toLocaleString()}</p>
          </div>
        </div>

        {/* Invite Link */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center md:text-left">Invite Link</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <input
              type="text"
              value={userInfo?.inviteLink}
              readOnly
              className="w-full sm:flex-1 min-w-0 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-gray-200 focus:outline-none text-center sm:text-left"
            />
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors w-full sm:w-auto"
            >
              {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Referred Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700 text-center md:text-left">
            Referred Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Created At</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {referredUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hidden sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.createdAt}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {referredUsers.length === 0 && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              <p>No referred users yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;