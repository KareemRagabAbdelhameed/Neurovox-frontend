import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "../validation/authSchema";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetAuth, resetPassword } from "../store/authSlice";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

type ResetValues = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useAppSelector((state) => state.auth);
  const { isDarkMode } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetValues>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetValues) => {
    dispatch(resetPassword({ password: data.password }));
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: success,
        position: "top",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => navigate("/login"));
      dispatch(resetAuth());
    }
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Reset Password",
        text: error,
        position: "top",
        timer: 2000,
        showConfirmButton: false,
      });
      dispatch(resetAuth());
    }
  }, [success, error, dispatch, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl rounded-3xl overflow-hidden`}
      >
        {/* Header */}
        <div className="text-center p-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-center mb-3">
            <Link to={"/"}>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Neurovox</h1>
          <p className="text-indigo-200">AI Investment Platform</p>
        </div>

        <div className="p-8">
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Reset Password
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                className={`block mb-1.5 text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                New Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className={`block mb-1.5 text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
