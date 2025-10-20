import { Spinner } from "@/components/ui/spinner";
import { verifyResetCode } from "@/store/auth/authSlice";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  // ✅ All hooks at the top level
  const { isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Local loading state
  const inputRefs = useRef([]);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(pasteData.length - 1, 5);
      inputRefs.current[lastFilledIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Dispatch action to verify OTP
      const result = await dispatch(verifyResetCode({ email, code: otpValue })).unwrap();
      
      if (result?.success) {
        toast.success(result.message || "OTP verified successfully!");
        {
            isSubmitting !== true && navigate("/reset-password", { state: { email, otp: otpValue } });
        }
      } else {
        toast.error(result?.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = otp.every(digit => digit !== "") && !isSubmitting;

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen px-10 bg-gradient-to-br from-[#b4e0fb] to-[#e7eff3]">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-xl relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex justify-center items-center bg-[#13a4ec] w-16 h-16 rounded-full shadow-lg">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mt-8 mb-4">Verify Code</h1>
        <p className="text-center text-[#4c809a] mb-2 text-sm">
          Enter the 6-digit code sent to your email
        </p>
        {email && (
          <p className="text-center text-[#13a4ec] font-medium mb-6 text-sm">
            {email}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-[#b4e0fb] rounded-lg focus:border-[#13a4ec] focus:outline-none focus:ring-2 focus:ring-[#13a4ec]/20 transition-all"
                autoFocus={index === 0}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-[#13a4ec] hover:bg-[#0f8cc5] disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? <Spinner /> : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <p className="text-[#4c809a] text-sm text-center">
            Didn't receive the code? <button 
              type="button" 
              className="underline hover:text-[#13a4ec]"
              // Add resend functionality here
            >
              Resend
            </button>
          </p>
          <p className="text-[#4c809a] text-sm text-center">
            <Link to="/login" className="underline hover:text-[#13a4ec]">Back to Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;