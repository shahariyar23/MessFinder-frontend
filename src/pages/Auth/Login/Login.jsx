import CommonFrom from "@/components/Common/From";
import { Spinner } from "@/components/ui/spinner";
import { loginFromControls } from "@/config/config";
import { loginUser } from "@/store/auth/authSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const {isLoading, user} = useSelector(state=>state.auth);
  const dispatch =useDispatch();
  const nevigate = useNavigate()
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData)).then(res=>{
          
          if(res?.payload?.success){
            toast.success(`${res.payload.message}`)
            nevigate("/");
          }else{
            toast.error(`${res?.payload?.message}`)
          }
        })
    };
    return (
<div className="flex flex-1 items-center justify-center min-h-screen px-10 bg-gradient-to-br from-[#b4e0fb] to-[#e7eff3]">
      <div className="w-full max-w-md bg-white p-6 md:p-10 rounded-2xl shadow-xl relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex justify-center items-center bg-[#13a4ec] w-16 h-16 rounded-full shadow-lg">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24">
            <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-3.31 0-10 1.663-10 4.979V22h20v-3.021C22 15.663 15.31 14 12 14Z" fill="currentColor"/>
          </svg>
        </div>
        <h1 className="text-center text-2xl md:text-3xl font-bold text-[#0d171b] mt-8 mb-4">Log In</h1>
        <p className="text-center text-[#4c809a] mb-6 text-sm">
          Welcome back! Log in to access MessFinder.
        </p>
        <CommonFrom
          fromControls={loginFromControls}
          fromData={formData}
          setFromData={setFormData}
          onSubmit={handleSubmit}
          buttonText={ isLoading ? <Spinner/> : "Log In"}
          isButtonDisable={
            !formData.email ||
            !formData.password ||
            isLoading
          }
        />
        <p className="text-[#4c809a] text-sm text-center mt-5">
          Don&apos;t have an account? <Link to="/signup" className="underline hover:text-[#13a4ec]">Sign Up</Link>
        </p>
        <p className="text-[#4c809a] text-sm text-center mt-5">
           <Link to="/signup" className="underline hover:text-[#13a4ec]">FSorgot password</Link>
        </p>
      </div>
    </div>
    );
};



export default Login;
