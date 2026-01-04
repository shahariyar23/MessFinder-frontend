import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verificationLoginOtp, checkAuth } from "@/store/auth/authSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

const OTP_EXPIRY_SECONDS = 600; // ⏳ 10 minutes

const VerifyLoginOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth); // Get user from Redux store

  const [email, setEmail] = useState("");
  const [from, setFrom] = useState(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // 🔒 BLOCK DIRECT ACCESS
  useEffect(() => {
    if (
      !location.state?.email ||
      location.state?.otpSession !== true
    ) {
      navigate("/login", { replace: true });
      return;
    }

    setEmail(location.state.email);
    setFrom(location.state.from || null);
  }, [location, navigate]);

  // ⏳ Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("OTP expired. Please login again.");
      navigate("/login");
      return;
    }

    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }

    setLoading(true);
    try {
      const res = await dispatch(
        verificationLoginOtp({ email, otp: code })
      ).unwrap();

      if (res?.success) {
        toast.success("Login verified");

        // ✅ IMPORTANT: Refresh auth state to get latest user data
        await dispatch(checkAuth());

        // Give Redux a moment to update
        setTimeout(() => {
          // Check user role and redirect accordingly
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          
          if (user?.role === 'admin') {
            navigate("/admin", { replace: true });
          } else {
            // For non-admin roles, use original redirect or go to home
            const redirectPath = from?.pathname
              ? `${from.pathname}${from.search || ""}`
              : "/";
            navigate(redirectPath, { replace: true });
          }
        }, 100);
        
      } else {
        toast.error(res?.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center">
            Verify Login OTP
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Enter the 6-digit code sent to
          </p>
          <p className="text-center font-medium text-sky-600">
            {email}
          </p>
          <p className="text-center text-sm text-red-500">
            Expires in {minutes}:{seconds.toString().padStart(2, "0")}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyLoginOtp;