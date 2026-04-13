import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { handleApiError } from "../utils/handleApiError";
import { toast } from 'react-toastify';
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || "";
    const [email] = useState(emailFromState);
    const [otp, setOtp] = useState("");
    const [cooldown, setCooldown] = useState(0);
    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await authService.verifyOtp({ email, otp });
            toast.success("Xác thực OTP thành công");
            navigate("/login", { replace: true });
        } catch (err) {
            toast.error(handleApiError(err));
        }
    };

    const handleResend = async () => {
        if (cooldown > 0) return;

        try {
            await authService.resendOtp({ email });
            toast.success("Đã gửi lại OTP");

            setCooldown(60);

            const timer = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) clearInterval(timer);
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            toast.error(handleApiError(err));
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h3>Xác thực OTP</h3>

                {/* Hiển thị email (readonly) */}
                <input
                    className="form-control mb-2"
                    value={email}
                    readOnly
                />

                <form onSubmit={handleVerify}>
                    <input
                        className="form-control mb-2"
                        placeholder="Nhập OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button className="btn btn-primary">
                        Xác thực
                    </button>
                </form>

                <button disabled={cooldown > 0} onClick={handleResend}>
                    {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : "Gửi lại OTP"}
                </button>


            </div>
            <Footer />
        </>
    );
}