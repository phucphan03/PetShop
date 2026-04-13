import { useState } from "react";
import { authService } from "../services/authService";
import { getUserFromToken } from "../utils/jwt";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { handleApiError } from "../utils/handleApiError";
import { toast } from 'react-toastify';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const token = await authService.login({ email, password });

            const user = getUserFromToken(token);

            if (user?.role === "Staff" || user?.role === "Admin") {
                toast.success("Đăng nhập thành công");
                navigate("/dashboard", { replace: true });
            } else {
                toast.success("Đăng nhập thành công");
                navigate("/", { replace: true });
            }

        } catch (err) {
            toast.error(handleApiError(err));

        }
    };

    return (
        <>
            <Header />
            <div className="container py-5">
                <h3>Login</h3>

                <form onSubmit={handleLogin}>
                    <input
                        className="form-control mb-3"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="form-control mb-3"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="btn btn-primary">Login</button>
                </form>
            </div>
            <Footer />
        </>
    );
}