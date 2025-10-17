import CommonFrom from "@/components/Common/From";
import { Spinner } from "@/components/ui/spinner";
import { registerFromControls } from "@/config/config";
import { registerUser } from "@/store/auth/authSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const SignUp = () => {
  const {isLoading} = useSelector(state=>state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((res) => {
      if (res?.payload?.success) {
         toast.success(`${res?.payload?.message}`)
        navigate("/login");
      } else {
       toast.error(`${res?.payload?.message}`)
      }
    });
  
  };

  return (
    <div className="flex flex-1 items-center justify-center min-h-screen px-10 bg-gradient-to-br from-[#b4e0fb] to-[#e7eff3]">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-xl mt-10 mb-10 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex justify-center items-center bg-[#13a4ec] w-16 h-16 rounded-full shadow-lg">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-3.31 0-10 1.663-10 4.979V22h20v-3.021C22 15.663 15.31 14 12 14Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mt-8 mb-4">Sign Up</h1>
        <p className="text-center text-[#4c809a] mb-6 text-sm">
          Create your account—join as a student or a mess owner!
        </p>
        <CommonFrom
          fromControls={registerFromControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText={isLoading? <Spinner/> : "Register"}
          isButtonDisable={
            !formData.userName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.role ||
            formData.password !== formData.confirmPassword ||
            isLoading 
          }
        />
        <p className="text-[#4c809a] text-sm text-center mt-5">
          Already have an account? <Link to="/login" className="underline hover:text-[#13a4ec]">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
