export default function Footer() {
    return (
        <footer className="bg-dark text-white pt-5">

            {/* TOP */}
            <div className="container">
                <div className="row g-4">

                    {/* Contact */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">Contact Us</h5>
                        <ul className="list-unstyled">
                            <li>+555 0000 565</li>
                            <li>
                                <a href="mailto:demomail@gmail.com" className="text-white text-decoration-none">
                                    demomail@gmail.com
                                </a>
                            </li>
                            <li>700, Green Lane, New York, USA</li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">Our Services</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-white text-decoration-none">Pet Insurance</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Pet Surgeries</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Pet Adoption</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Dog Insurance</a></li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/about" className="text-white text-decoration-none">About Us</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Terms of Service</a></li>
                            <li><a href="#" className="text-white text-decoration-none">Login Info</a></li>
                        </ul>
                    </div>

                    {/* Logo + Social */}
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold mb-3">About</h5>

                        {/* Logo */}
                        <img
                            src="/src/assets/images/logo.png"
                            alt="logo"
                            className="mb-3"
                            style={{ maxWidth: "120px" }}
                        />

                        <p className="text-muted">
                            239 E 5th St, New York NY 10003, USA
                        </p>

                        {/* Social */}
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-white">
                                <i className="fab fa-pinterest-p"></i>
                            </a>
                            <a href="#" className="text-white">
                                <i className="fab fa-google-plus-g"></i>
                            </a>
                            <a href="#" className="text-white">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>

                    </div>

                </div>
            </div>

            {/* BOTTOM */}
            <div className="border-top mt-5 py-3 text-center">
                <small>
                    © {new Date().getFullYear()} All rights reserved
                </small>
            </div>

        </footer>
    );
}