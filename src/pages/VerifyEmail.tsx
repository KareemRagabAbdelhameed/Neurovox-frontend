import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const status = searchParams.get("status"); // success | failed
  const message = searchParams.get("message");

  useEffect(() => {
    if (status === "success") {
      Swal.fire({
        icon: "success",
        title: message || "Your email has been verified 🎉",
        timer: 2000,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
      setTimeout(() => navigate("/login"), 2000);
    } else if (status === "failed") {
      Swal.fire({
        icon: "error",
        title: message || "Verification failed ❌",
        timer: 2000,
        toast: true,
        position: "top",
        showConfirmButton: false,
      });
    }
  }, [status, message, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {status === "success" && (
          <p className="text-green-600">Your email has been successfully verified ✅</p>
        )}
        {status === "failed" && (
          <p className="text-red-600">Verification failed. Please try again.</p>
        )}
        {!status && (
          <p className="text-gray-600">Processing verification, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
