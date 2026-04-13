import { useState } from "react";
import { authService } from "../services/authService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const passwordRules = {
        length: form.password.length >= 8,
        lowercase: /[a-z]/.test(form.password),
        uppercase: /[A-Z]/.test(form.password),
        number: /[0-9]/.test(form.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    };

    const isPasswordValid =
        passwordRules.length &&
        passwordRules.lowercase &&
        passwordRules.uppercase &&
        passwordRules.number &&
        passwordRules.special;

    const isConfirmValid =
        form.confirmPassword &&
        form.password === form.confirmPassword;

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await authService.register(form);

            alert("Đăng ký thành công");
            navigate("/verify-otp", { state: { email: form.email } });
        } catch (err) {
            console.log(err.response?.data);
            alert("Đăng ký thất bại");
        }
    };

    return (
        <>
            <Header />
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
                    <div className="mb-3">
                        <small className={passwordRules.length ? "text-success" : "text-danger"}>
                            <i className={`fa-solid ${passwordRules.length ? "fa-check" : "fa-xmark"}`} />
                            {" "}Ít nhất 8 ký tự
                        </small>
                        <br />

                        <small className={passwordRules.lowercase ? "text-success" : "text-danger"}>
                            <i className={`fa-solid ${passwordRules.lowercase ? "fa-check" : "fa-xmark"}`} />
                            {" "}Có chữ thường
                        </small>
                        <br />

                        <small className={passwordRules.uppercase ? "text-success" : "text-danger"}>
                            <i className={`fa-solid ${passwordRules.uppercase ? "fa-check" : "fa-xmark"}`} />
                            {" "}Có chữ hoa
                        </small>
                        <br />

                        <small className={passwordRules.number ? "text-success" : "text-danger"}>
                            <i className={`fa-solid ${passwordRules.number ? "fa-check" : "fa-xmark"}`} />
                            {" "}Có số
                        </small>
                        <br />

                        <small className={passwordRules.special ? "text-success" : "text-danger"}>
                            <i className={`fa-solid ${passwordRules.special ? "fa-check" : "fa-xmark"}`} />
                            {" "}Có ký tự đặc biệt (!@#$...)
                        </small>
                    </div>
                    <div style={{ position: "relative" }}>
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={(e) =>
                                setForm({ ...form, confirmPassword: e.target.value })
                            }
                        />

                        {form.confirmPassword && (
                            <i
                                className={`fa-solid ${isConfirmValid ? "fa-check text-success" : "fa-xmark text-danger"}`}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none"
                                }}
                            />
                        )}
                    </div>
                    <button
                        className="btn btn-primary"
                        disabled={!isPasswordValid || !isConfirmValid}
                    >
                        Register
                    </button>
                </form>
            </div>
            <Footer />
        </>
    );
}