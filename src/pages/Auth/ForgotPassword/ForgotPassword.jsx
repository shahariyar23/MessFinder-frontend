import CommonFrom from "@/components/Common/From";
import { Spinner } from "@/components/ui/spinner";
import { forgotPasswordControls } from "@/config/config";
import { generateResetCode } from "@/store/auth/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch action to send reset password email
    dispatch(generateResetCode(formData)).then(res => {
      if(res?.payload?.success) {
        toast.success(`${res.payload.message}`);
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        toast.error(`${res?.payload?.message}`);
      }
    });
  };

  

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen px-10 bg-gradient-to-br from-[#b4e0fb] to-[#e7eff3]">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-xl relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex justify-center items-center bg-[#13a4ec] w-16 h-16 rounded-full shadow-lg">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mt-8 mb-4">Forgot Password</h1>
        <p className="text-center text-[#4c809a] mb-6 text-sm">
          Enter your email address and we'll send you a code to reset your password.
        </p>
        <CommonFrom
          fromControls={forgotPasswordControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText={isLoading ? <Spinner /> : "Send Reset Code"}
          isButtonDisable={
            !formData.email ||
            isLoading
          }
        />
        <div className="mt-6 space-y-3">
          <p className="text-[#4c809a] text-sm text-center">
            Remember your password? <Link to="/login" className="underline hover:text-[#13a4ec]">Log In</Link>
          </p>
          <p className="text-[#4c809a] text-sm text-center">
            Don't have an account? <Link to="/signup" className="underline hover:text-[#13a4ec]">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;