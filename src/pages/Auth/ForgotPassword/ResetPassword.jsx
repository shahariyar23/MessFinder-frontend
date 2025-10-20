import CommonFrom from "@/components/Common/From";
import { Spinner } from "@/components/ui/spinner";
import { resetPasswordControls } from "@/config/config";
import { resetPassword } from "@/store/auth/authSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (location.state?.email && location.state?.otp) {
      setEmail(location.state.email);
      setOtp(location.state.otp);
    } else {
      navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
console.log(formData)
    // Dispatch action to reset password
    dispatch(resetPassword({ 
      email, 
      code: otp, 
      newPassword: formData.newPassword 
    })).then(res => {
      if(res?.payload?.success) {
        toast.success(`${res.payload.message}`);
        navigate("/login");
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mt-8 mb-4">Reset Password</h1>
        <p className="text-center text-[#4c809a] mb-6 text-sm">
          Create your new password
        </p>
        
        {email && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 text-sm text-center">
              Resetting password for: <span className="font-semibold">{email}</span>
            </p>
          </div>
        )}

        <CommonFrom
          fromControls={resetPasswordControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText={isLoading ? <Spinner /> : "Reset Password"}
          isButtonDisable={
            !formData.newPassword ||
            !formData.confirmPassword ||
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

export default ResetPassword;