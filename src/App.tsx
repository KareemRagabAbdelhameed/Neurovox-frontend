import { QueryClientProvider } from "@tanstack/react-query"
import MainLayout from "./Layout"
import { queryClient } from "./lib/queryClient"
import { Route, Routes } from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ResetPassword from "./pages/ResetPassword"
import InvestmentPlans from "./pages/InvestmentPlans"
import DepositsPage from "./pages/Deposits"
import WithdrawalsPage from "./pages/Withdrawals"
import VerifyEmail from "./pages/VerifyEmail"
import ForgotPassword from "./pages/ForgotPassword"
import Settings from "./pages/Settings"
import { useEffect } from "react"
import i18n from "./i18n"
import type { AppDispatch, RootState } from "./store/store"
import { useDispatch, useSelector } from "react-redux"
import { setTheme } from "./store/themeSlice"
import ProfilePage from "./pages/ProfilePage"
import ProtectedRoute from "./validation/ProtectedRoute"

const App = () => {

  const dispatch: AppDispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      dispatch(setTheme(JSON.parse(savedTheme)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(lang);
  }, []);
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
          <Route index element={<InvestmentPlans />} />
          <Route path="plans" element = {<InvestmentPlans />} />
          <Route path="dashboard" element = {<InvestmentPlans />} />
          <Route path="missions" element = {<InvestmentPlans />} />
          <Route path="deposits" element = {<DepositsPage />} />
          <Route path="withdrawals" element = {<WithdrawalsPage />} />
          <Route path="teams" element = {<p><InvestmentPlans /></p>} />
          <Route path="analytics" element = {<p><InvestmentPlans /></p>} />
          <Route path="settings" element = {<Settings />} />
          <Route path="profile" element = {
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
      </QueryClientProvider>
    </div>
  )
}

export default App
