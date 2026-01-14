import Link from "next/link";

export default function Error(){
    return (
        <main className="main">

            {/* <!-- Page Title --> */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1 className="heading-title">404</h1>
                                <p className="mb-0">
                                    Odio et unde deleniti. Deserunt numquam exercitationem. Officiis quo
                                    odio sint voluptas consequatur ut a odio voluptatem. Sit dolorum
                                    debitis veritatis natus dolores. Quasi ratione sint. Sit quaerat
                                    ipsum dolorem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <nav className="breadcrumbs">
                    <div className="container">
                        <ol>
                            <li><a href="index.html">Home</a></li>
                            <li className="current">404</li>
                        </ol>
                    </div>
                </nav>
            </div>
            {/* <!-- End Page Title --> */}

            {/* <!-- Error 404 Section --> */}
            <section id="error-404" className="error-404 section">

                <div className="container" data-aos="fade-up" data-aos-delay="100">

                    <div className="error-wrapper">
                        <div className="row align-items-center">
                            <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
                                <div className="error-illustration">
                                    <i className="bi bi-exclamation-triangle-fill"></i>
                                    <div className="circle circle-1"></div>
                                    <div className="circle circle-2"></div>
                                    <div className="circle circle-3"></div>
                                </div>
                            </div>
                            <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
                                <div className="error-content">
                                    <span className="error-badge" data-aos="zoom-in" data-aos-delay="400">Error</span>
                                    <h1 className="error-code" data-aos="fade-up" data-aos-delay="500">404</h1>
                                    <h2 className="error-title" data-aos="fade-up" data-aos-delay="600">Page Not Found</h2>
                                    <p className="error-description" data-aos="fade-up" data-aos-delay="700">
                                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                                    </p>

                                    <div className="error-actions" data-aos="fade-up" data-aos-delay="800">
                                        <Link href="/" className="btn-home">
                                            <i className="bi bi-house-door"></i> Back to Home
                                        </Link>
                                        <a href="#" className="btn-help">
                                            <i className="bi bi-question-circle"></i> Help Center
                                        </a>
                                    </div>

                                    <div className="error-suggestions" data-aos="fade-up" data-aos-delay="900">
                                        <h3>You might want to:</h3>
                                        <ul>
                                            <li><a href="#"><i className="bi bi-arrow-right-circle"></i> Check our sitemap</a></li>
                                            <li><a href="#"><i className="bi bi-arrow-right-circle"></i> Contact support</a></li>
                                            <li><a href="#"><i className="bi bi-arrow-right-circle"></i> Return to previous page</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </section>


        </main>
    );
}