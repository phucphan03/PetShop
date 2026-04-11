import Header from '../components/Header';
import Footer from '../components/Footer';

const teamMembers = [
    {
        name: "Rala Emaia",
        role: "Senior Director",
        img: "/src/assets/images/team/1.png",
    },
    {
        name: "John Smith",
        role: "Senior Director",
        img: "/src/assets/images/team/2.png",
    },
    {
        name: "Rala Emaia",
        role: "Senior Director",
        img: "/src/assets/images/team/3.png",
    },
];
export default function Home() {
    return (
        <>
            <Header />
            <div>
                {/* HERO / SLIDER */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row align-items-center">

                            {/* Text */}
                            <div className="col-lg-5 col-md-6">
                                <h1 className="fw-bold mb-3">
                                    We Care <br />
                                    <span className="text-primary">Your Pets</span>
                                </h1>

                                <p className="text-muted mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>

                                <a href="/contact" className="btn btn-primary">
                                    Contact Us
                                </a>
                            </div>

                            {/* Image */}
                            <div className="col-lg-7 d-none d-lg-block text-end">
                                <img
                                    src="/src/assets/images/banner/dog.png"
                                    alt="dog"
                                    className="img-fluid"
                                    style={{ maxHeight: "400px" }}
                                />
                            </div>

                        </div>
                    </div>
                </section>

                {/* SERVICES */}
                <section className="py-5">
                    <div className="container">

                        {/* Title */}
                        <div className="text-center mb-5">
                            <h2 className="fw-bold">Services for every dog</h2>
                            <p className="text-muted">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            </p>
                        </div>

                        {/* List */}
                        <div className="row g-4">

                            {/* Item 1 */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-0 shadow-sm h-100 text-center p-4">
                                    <img
                                        src="/src/assets/images/service/service_icon_1.png"
                                        alt=""
                                        className="mx-auto mb-3"
                                        style={{ width: 60 }}
                                    />
                                    <h5 className="fw-bold">Pet Boarding</h5>
                                    <p className="text-muted">
                                        Lorem ipsum dolor sit amet consectetur.
                                    </p>
                                </div>
                            </div>

                            {/* Item 2 */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-0 shadow h-100 text-center p-4">
                                    <img
                                        src="/src/assets/images/service/service_icon_2.png"
                                        alt=""
                                        className="mx-auto mb-3"
                                        style={{ width: 60 }}
                                    />
                                    <h5 className="fw-bold">Healthy Meals</h5>
                                    <p className="text-muted">
                                        Lorem ipsum dolor sit amet consectetur.
                                    </p>
                                </div>
                            </div>

                            {/* Item 3 */}
                            <div className="col-lg-4 col-md-6">
                                <div className="card border-0 shadow-sm h-100 text-center p-4">
                                    <img
                                        src="/src/assets/images/service/service_icon_3.png"
                                        alt=""
                                        className="mx-auto mb-3"
                                        style={{ width: 60 }}
                                    />
                                    <h5 className="fw-bold">Pet Spa</h5>
                                    <p className="text-muted">
                                        Lorem ipsum dolor sit amet consectetur.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* PET CARE */}
                <section className="py-5">
                    <div className="container">
                        <div className="row align-items-center">

                            {/* Image */}
                            <div className="col-lg-5 col-md-6 mb-4 mb-md-0">
                                <img
                                    src="/src/assets/images/about/pet_care.png"
                                    alt="pet care"
                                    className="img-fluid rounded"
                                />
                            </div>

                            {/* Content */}
                            <div className="col-lg-6 offset-lg-1 col-md-6">
                                <h2 className="fw-bold mb-3">
                                    <span className="text-primary">We care your pet</span>
                                    <br />
                                    As you care
                                </h2>

                                <p className="text-muted mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>

                                <a href="/about" className="btn btn-primary">
                                    About Us
                                </a>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ADOPT AREA */}
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row align-items-center">

                            {/* Left */}
                            <div className="col-lg-5 mb-4 mb-lg-0">
                                <h2 className="fw-bold mb-3">
                                    <span className="text-primary">We need your</span>
                                    <br />
                                    help Adopt Us
                                </h2>

                                <p className="text-muted mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                </p>

                                <a href="/contact" className="btn btn-outline-primary">
                                    Contact Us
                                </a>
                            </div>

                            {/* Right */}
                            <div className="col-lg-6">
                                <div className="row g-4 text-center">

                                    {/* Item 1 */}
                                    <div className="col-md-6">
                                        <div className="p-4 border rounded bg-white shadow-sm">
                                            <img
                                                src="/src/assets/images/adapt_icon/1.png"
                                                alt=""
                                                className="mb-3"
                                                style={{ width: 50 }}
                                            />
                                            <h3 className="fw-bold">452</h3>
                                            <p className="text-muted mb-0">Pets Available</p>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div className="col-md-6">
                                        <div className="p-4 border rounded bg-white shadow-sm">
                                            <img
                                                src="/src/assets/images/adapt_icon/2.png"
                                                alt=""
                                                className="mb-3"
                                                style={{ width: 50 }}
                                            />
                                            <h3 className="fw-bold">52+</h3>
                                            <p className="text-muted mb-0">Adopted</p>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div className="col-md-6">
                                        <div className="p-4 border rounded bg-white shadow-sm">
                                            <img
                                                src="/src/assets/images/adapt_icon/3.png"
                                                alt=""
                                                className="mb-3"
                                                style={{ width: 50 }}
                                            />
                                            <h3 className="fw-bold">52+</h3>
                                            <p className="text-muted mb-0">Happy Clients</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">

                                <div id="testimonialCarousel" className="carousel slide" data-bs-ride="carousel">

                                    <div className="carousel-inner">

                                        {/* Item 1 */}
                                        <div className="carousel-item active">
                                            <div className="d-flex align-items-center gap-4 p-4 bg-white shadow rounded">
                                                <img
                                                    src="/src/assets/images/testmonial/1.png"
                                                    alt=""
                                                    className="rounded-circle"
                                                    width="80"
                                                    height="80"
                                                />
                                                <div>
                                                    <h5 className="mb-1 fw-bold">Jhon Walker</h5>
                                                    <small className="text-muted">Head of web design</small>
                                                    <p className="mt-2 mb-0 text-muted">
                                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Item 2 */}
                                        <div className="carousel-item">
                                            <div className="d-flex align-items-center gap-4 p-4 bg-white shadow rounded">
                                                <img
                                                    src="/src/assets/images/testmonial/1.png"
                                                    alt=""
                                                    className="rounded-circle"
                                                    width="80"
                                                    height="80"
                                                />
                                                <div>
                                                    <h5 className="mb-1 fw-bold">Jhon Walker</h5>
                                                    <small className="text-muted">Head of web design</small>
                                                    <p className="mt-2 mb-0 text-muted">
                                                        Another testimonial content here.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Controls */}
                                    <button className="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon"></span>
                                    </button>

                                    <button className="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                                        <span className="carousel-control-next-icon"></span>
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <div className="team_area py-5">
                    <div className="container">
                        {/* Title */}
                        <div className="text-center mb-5">
                            <h3>Our Team</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                            </p>
                        </div>

                        {/* Team list */}
                        <div className="d-flex flex-wrap justify-content-center">
                            {teamMembers.map((member, index) => (
                                <div key={index} className="col-lg-4 col-md-6 mb-4">
                                    <div className="card text-center border-0 shadow-sm">
                                        <img src={member.img} alt="" className="card-img-top" />

                                        <div className="card-body">
                                            <h4>{member.name}</h4>
                                            <p>{member.role}</p>

                                            {/* Icon bằng thẻ i */}
                                            <div className="d-flex justify-content-center gap-3">
                                                <i className="fab fa-facebook-f"></i>
                                                <i className="fab fa-twitter"></i>
                                                <i className="fab fa-linkedin-in"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <section className="py-5 text-center bg-primary text-white">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8">

                                <h2 className="fw-bold mb-3">
                                    Why go with Anipat?
                                </h2>

                                <p className="mb-4">
                                    Because we know that even the best technology is only as good
                                    as the people behind it. 24/7 tech support.
                                </p>

                                <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3">

                                    <a href="/contact" className="btn btn-light text-primary fw-bold">
                                        Contact Us
                                    </a>

                                    <span>
                                        Or{" "}
                                        <a href="tel:+8804664216" className="text-white fw-bold text-decoration-underline">
                                            +880 4664 216
                                        </a>
                                    </span>

                                </div>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}