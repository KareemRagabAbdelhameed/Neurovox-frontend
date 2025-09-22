import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiCopy, FiCheck } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/userSlice';
import type { AppDispatch, RootState } from '../store/store';
import axios from 'axios';
// api is imported but not used in the provided snippet, keeping it for completeness
// import api from '../config/axiosConfig';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: userInfo, loading, error } = useSelector((state: RootState) => state.user);
  const token = useSelector((state: any) => state.auth.token); // Assuming auth state has a token
  const [copied, setCopied] = useState(false);
  const [referedUsers, setReferedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);
  console.log(userInfo);
  useEffect(() => {
    axios
      .get(`http://195.200.15.135/users/referral/${userInfo.id}`)
      .then((res) => 
        setReferedUsers(res.data.data)
      )
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = async () => {
    if (userInfo?.inviteLink) {
      await navigator.clipboard.writeText(userInfo.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };



  // Handle error state if necessary
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center text-red-500 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      pb-24
      pt-8 lg:py-8 
      px-4 sm:px-6 lg:px-8 
      /* تم إزالة lg:ml-32 للسماح للمحتوى بالتركز بشكل صحيح على جميع الشاشات */
      transition-colors duration-300
    ">
     
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8"> {/* Padding scales with screen size */}
          {loading ? ( // Skeleton for Profile Header
            <div className="flex flex-col items-center text-center animate-pulse">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
              <div className="flex gap-4 justify-center">
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          ) : ( // Actual Profile Header Content
            <div className="flex flex-col items-center text-center"> {/* Stacks content vertically and centers it */}
              <div className="relative group mb-4">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                  alt={userInfo?.firstName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="text-white hover:text-blue-400 transition-colors">
                    {/* <FiCamera size={20} /> Add an icon for changing profile picture if desired */}
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userInfo?.firstName} {userInfo?.lastName}</h1>
                <p className="text-gray-500 dark:text-gray-400">{userInfo?.email}</p>
              </div>

              <div className="flex gap-4 justify-center"> {/* Buttons remain centered and spaced */}
                <button className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <FiEdit2 size={20} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Balance Cards */}
        {/* grid-cols-2 للموبايل، md:grid-cols-3 للشاشات المتوسطة وما فوق */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"> {/* Grid layout adapts to screen size */}
          {loading ? ( // Skeleton for Balance Cards
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                {/* Title Placeholder */}
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
                {/* Value Placeholder */}
                <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            ))
          ) : ( // Actual Balance Cards Content
            <>
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
            </>
          )}
        </div>

        {/* Invite Link */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          {loading ? ( // Skeleton for Invite Link
            <div className="animate-pulse">
              {/* Title Placeholder */}
              <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Input Placeholder */}
                <div className="w-full sm:flex-1 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                {/* Button Placeholder */}
                <div className="w-full sm:w-24 h-10 bg-blue-200 dark:bg-blue-800 rounded-lg"></div>
              </div>
            </div>
          ) : ( // Actual Invite Link Content
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center md:text-left">Invite Link</h2>
              {/* flex-col for mobile, sm:flex-row for small screens and up */}
              {/* justify-center for mobile, md:justify-start for medium screens and up */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <input
                  type="text"
                  value={userInfo?.inviteLink || ""} // Ensure value is never undefined
                  readOnly
                  className="
                    w-full sm:flex-1 min-w-0 
                    px-4 py-2 bg-gray-100 dark:bg-gray-700 
                    rounded-lg text-gray-800 dark:text-gray-200 
                    focus:outline-none 
                    text-center sm:text-left
                  "
                />
                <button
                  onClick={handleCopy}
                  className="
                    flex items-center justify-center gap-2 
                    px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white 
                    rounded-lg transition-colors 
                    w-full sm:w-auto {/* Button is full width on mobile, auto width on larger screens */}
                  "
                >
                  {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Referred Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {loading ? ( // Skeleton for Referred Users Table
            <div className="animate-pulse">
              {/* Table Title Placeholder */}
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md p-6 border-b border-gray-200 dark:border-gray-700"></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      {/* Table Headers Placeholder */}
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium hidden sm:table-cell">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Table Rows Placeholder */}
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm">
                          <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                        </td>
                        <td className="px-4 py-3 text-sm hidden sm:table-cell">
                          <div className="h-4 w-40 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="h-4 w-24 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="h-4 w-12 bg-gray-100 dark:bg-gray-700 rounded-md"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : ( // Actual Referred Users Table Content
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-6 border-b border-gray-200 dark:border-gray-700 text-center md:text-left">
                Referred Users
              </h2>
              {/* overflow-x-auto makes the table horizontally scrollable on small screens if content is too wide */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                      {/* Email column is hidden on extra small screens, visible from sm and up */}
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 hidden sm:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Created At</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {referedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.name}</td>
                        {/* Email column is hidden on extra small screens, visible from sm and up */}
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 hidden sm:table-cell">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.createdAt}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200">{user.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {referedUsers.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <p>No referred users yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;