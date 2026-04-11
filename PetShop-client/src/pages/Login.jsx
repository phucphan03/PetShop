import { useState } from "react";
import { authService } from "../services/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await authService.login({ email, password });

            window.location.href = "/";
        } catch (err) {
            alert("Login failed", err);
        }
    };

    return (
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
    );
}