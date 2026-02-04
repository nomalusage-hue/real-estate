'use client';

import Link from "next/link";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="main">
          {/* Page Title */}
          <div className="page-title">
            <div className="heading">
              <div className="container">
                <div className="row d-flex justify-content-center text-center">
                  <div className="col-lg-8">
                    <h1 className="heading-title">Something Went Wrong</h1>
                    <p className="mb-0">
                      We encountered an unexpected error while loading this page.
                      This might be a temporary issue. Don&#39;t worry — you can try again or continue browsing our listings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
    
            <nav className="breadcrumbs">
              <div className="container">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li className="current">Error</li>
                </ol>
              </div>
            </nav>
          </div>
          {/* End Page Title */}
    
          <section id="error" className="error-404 section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
              <div className="error-wrapper">
                <div className="row align-items-center">
                  <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
                    <div className="error-illustration">
                      <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                      <div className="circle circle-1"></div>
                      <div className="circle circle-2"></div>
                      <div className="circle circle-3"></div>
                    </div>
                  </div>
    
                  <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
                    <div className="error-content">
                      <span className="error-badge" data-aos="zoom-in" data-aos-delay="400">Error</span>
                      <h1 className="error-code" data-aos="fade-up" data-aos-delay="500">500</h1>
                      <h2 className="error-title" data-aos="fade-up" data-aos-delay="600">Something Went Wrong</h2>
                      <p className="error-description" data-aos="fade-up" data-aos-delay="700">
                        An unexpected error occurred. This might be due to a temporary server issue or a problem with your request.
                      </p>
    
                      <div className="error-actions" data-aos="fade-up" data-aos-delay="800">
                        <button
                          onClick={reset}
                          className="btn custom-button me-3"
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i> Try Again
                        </button>
                        <Link href="/" className="btn-help">
                          <i className="bi bi-house-door me-2"></i> Back to Home
                        </Link>
                        <Link href="/contact" className="btn-help">
                          <i className="bi bi-question-circle me-2"></i> Help Center
                        </Link>
                      </div>
    
                      <div className="error-suggestions mt-5" data-aos="fade-up" data-aos-delay="900">
                        <h3>You might want to:</h3>
                        <ul>
                          <li>
                            <Link href="/properties">
                              <i className="bi bi-arrow-right-circle me-2"></i> Browse available properties
                            </Link>
                          </li>
                          <li>
                            <Link href="/contact">
                              <i className="bi bi-arrow-right-circle me-2"></i> Contact our support team
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                window.history.back();
                              }}
                            >
                              <i className="bi bi-arrow-right-circle me-2"></i> Return to previous page
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                reset();
                              }}
                            >
                            <i className="bi bi-arrow-right-circle me-2"></i> Retry loading this page
                            </Link>
                          </li>
                        </ul>
                      </div>
    
                      {/* Error details for debugging */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-3 bg-light rounded" data-aos="fade-up" data-aos-delay="1000">
                          <details>
                            <summary className="text-muted cursor-pointer">
                              <small>Error Details (Development Only)</small>
                            </summary>
                            <pre className="mt-2 text-danger small">
                              {error.message}
                              {error.digest && `\nDigest: ${error.digest}`}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
  );
}