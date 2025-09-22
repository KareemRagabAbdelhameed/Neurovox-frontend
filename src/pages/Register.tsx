import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation/authSchema";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Brain } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUser, resetAuth } from "../store/authSlice";
import Swal from "sweetalert2";

type RegisterValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
  });

  

  const onSubmit = (data: RegisterValues) => {
    const { confirmPassword, ...payload } = data;
    dispatch(registerUser(payload));
  };

  // Toasts handling
  useEffect(() => {
    if (success) {
      Swal.fire({
        title: "Success!",
          text: success, // Display the message from the backend
          icon: "info",
          confirmButtonText: "OK",

      }).then((result) => {
        if(result.isConfirmed){
          window.location.href = "/";
        }
      });
      dispatch(resetAuth());
    }
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Create Account",
        text: error,
        confirmButtonColor: "#6D95EA",
        });
      dispatch(resetAuth());
    }
  }, [success, error, dispatch]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-0 lg:p-6 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-2xl rounded-none lg:rounded-3xl overflow-hidden`}
      >
        {/* Header */}
        <div className="text-center p-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Neurovox</h1>
          <p className="text-indigo-200">AI Investment Platform</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Create Account
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                First Name
              </label>
              <input
                {...register("firstName")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Last Name
              </label>
              <input
                {...register("lastName")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Phone
              </label>
              <input
                {...register("phone")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Date of Birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={`w-full p-3 rounded-xl border ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200"
                } focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <div
              className={`text-center mt-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Already have an account?{" "}
              <Link
                to="/"
                className="text-indigo-500 hover:text-indigo-600 font-medium"
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
