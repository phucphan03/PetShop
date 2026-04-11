import { getToken } from "../utils/auth";
import { authService } from "../services/authService";
export default function Header() {
    const token = getToken();

    const handleLogout = async () => {
        await authService.logout();
        window.location.href = "/";
    };
    return (
        <header>

            {/* Top bar */}
            <div className="bg-light py-2 border-bottom">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-md-6">
                            <span className="me-3">
                                <i className="fas fa-phone me-1"></i>
                                +880 4664 216
                            </span>
                            <span>
                                <i className="fas fa-clock me-1"></i>
                                Mon - Sat 10:00 - 7:00
                            </span>
                        </div>

                        <div className="col-md-6 text-md-end">
                            <a href="#" className="text-dark me-3">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-dark me-3">
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                            <a href="#" className="text-dark me-3">
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a href="#" className="text-dark">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>

                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container">

                    {/* Logo */}
                    <a className="navbar-brand fw-bold" href="/">
                        {/* hoặc */}
                        <img src="/src/assets/images/logo.png" height="40" />
                    </a>

                    {/* Toggle mobile */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Menu */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">

                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/about">About</a>
                            </li>

                            {/* Blog dropdown */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Blog
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/blog">Blog</a></li>
                                    <li><a className="dropdown-item" href="/single-blog">Single Blog</a></li>
                                </ul>
                            </li>

                            {/* Pages dropdown */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    data-bs-toggle="dropdown"
                                >
                                    Pages
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/elements">Elements</a></li>
                                </ul>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/service">Services</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" href="/contact">Contact</a>
                            </li>
                            <li className="nav-item dropdown ms-3">
                                <button
                                    type="button"
                                    className="btn d-flex align-items-center justify-content-center rounded-circle border border-secondary-subtle bg-light"
                                    style={{ width: "40px", height: "40px" }}
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-user"></i>
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    {!token ? (
                                        <>
                                            <li><a className="dropdown-item" href="/login">Login</a></li>
                                            <li><a className="dropdown-item" href="/register">Register</a></li>
                                        </>
                                    ) : (
                                        <li>
                                            <button className="dropdown-item" onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
        </header>
    );
}
