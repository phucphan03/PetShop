import { useState } from "react";
import { authService } from "../services/authService";

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await authService.register(form);

            alert("Đăng ký thành công");
            window.location.href = "/login";
        } catch (err) {
            console.log(err.response?.data);
            alert("Đăng ký thất bại");
        }
    };

    return (
        <div className="container py-5">
            <h3>Register</h3>

            <form onSubmit={handleRegister}>
                <input
                    className="form-control mb-3"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                    }
                />
                <input
                    className="form-control mb-3"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />
                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                    }
                />
                <button className="btn btn-primary">Register</button>
            </form>
        </div>
    );
}