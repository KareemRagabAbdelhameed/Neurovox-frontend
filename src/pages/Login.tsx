import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/authSchema";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { Brain } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, resetAuth } from "../store/authSlice";
import Swal from "sweetalert2";
import { useEffect } from "react";

type LoginValues = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const { loading, success, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const { isDarkMode } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    console.log("Login Data:", data);
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: "success",
        title: "Login Successfuly",
        text : success,
        draggable: true,
        }).then((result)=>{
        if(result.isConfirmed){
            navigate("/");
            }
        }
        );
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
    <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      <div className={`w-full max-w-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl rounded-3xl overflow-hidden`}>
        {/* Branded Header */}
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
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Login to Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className={`block mb-1.5 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
              <input
                type="password"
                {...register("password")}
                className={`w-full p-3 rounded-xl border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:ring-2 focus:ring-indigo-500 transition-all`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-indigo-500 hover:text-indigo-600 font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] mt-6"
            >
               {loading ? "Logging in..." : "Login"}
            </button>

            <div className={`text-center mt-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium">
                Register now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
