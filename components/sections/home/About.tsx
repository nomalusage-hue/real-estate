import Image from "next/image";
import Link from "next/link";

export default function About() {
  return <section id="home-about" className="home-about section">

    <div className="container" data-aos="fade-up" data-aos-delay="100">

      <div className="row align-items-center gy-5">

        <div className="col-lg-6 order-lg-2" data-aos="fade-left" data-aos-delay="200">
          <div className="image-section">
            <div className="main-image-wrapper">
              <Image src="/img/real-estate/property-exterior-7.webp" alt="Premium Property" className="img-fluid main-image" width={0} height={0} unoptimized />
              <div className="floating-card">
                <div className="card-content">
                  <div className="icon">
                    <i className="bi bi-award"></i>
                  </div>
                  <div className="text">
                    <span className="number"><span data-purecounter-start="0" data-purecounter-end="12" data-purecounter-duration="1" className="purecounter"></span>+</span>
                    <span className="label">Awards Won</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="secondary-images">
              <div className="small-image">
                <Image src="/img/real-estate/property-interior-8.webp" alt="Interior Design" className="img-fluid" width={0} height={0} unoptimized />
              </div>
              <div className="small-image">
                <Image src="/img/real-estate/agent-3.webp" alt="Expert Agent" className="img-fluid" width={0} height={0} unoptimized />
              </div>
            </div>
          </div>
        </div>
        {/* 
          <div className="col-lg-6 order-lg-1" data-aos="fade-right" data-aos-delay="300">
            <div className="content-wrapper">
              <div className="section-badge">
                <i className="bi bi-buildings"></i>
                <span>Premium Real Estate</span>
              </div>

              <h2>Transforming Real Estate Dreams Into Reality</h2>

              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip consequat.</p>

              <div className="stats-grid">
                <div className="stat-item" data-aos="zoom-in" data-aos-delay="400">
                  <div className="stat-number">
                    <span data-purecounter-start="0" data-purecounter-end="2800" data-purecounter-duration="2" className="purecounter"></span>+
                  </div>
                  <div className="stat-label">Properties Listed</div>
                </div>

                <div className="stat-item" data-aos="zoom-in" data-aos-delay="450">
                  <div className="stat-number">
                    <span data-purecounter-start="0" data-purecounter-end="95" data-purecounter-duration="1" className="purecounter"></span>%
                  </div>
                  <div className="stat-label">Success Rate</div>
                </div>

                <div className="stat-item" data-aos="zoom-in" data-aos-delay="500">
                  <div className="stat-number">
                    <span data-purecounter-start="0" data-purecounter-end="24" data-purecounter-duration="1" className="purecounter"></span>/7
                  </div>
                  <div className="stat-label">Client Support</div>
                </div>
              </div>

              <div className="features-list">
                <div className="feature-item">
                  <i className="bi bi-check-circle"></i>
                  <span>Expert market analysis and pricing strategies</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-check-circle"></i>
                  <span>Personalized property matching services</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-check-circle"></i>
                  <span>Professional photography and virtual tours</span>
                </div>
              </div>

              <div className="cta-wrapper">
                <a href="about.html" className="btn-primary">
                  <span>Learn More About Us</span>
                  <i className="bi bi-arrow-right-circle"></i>
                </a>
                <div className="contact-quick">
                  <i className="bi bi-headset"></i>
                  <div className="contact-text">
                    <span>Need assistance?</span>
                    <a href="tel:+15559876543">+1 (555) 987-6543</a>
                  </div>
                </div>
              </div>
            </div>
          </div> */}


        <div
          className="col-lg-6 order-lg-1"
          data-aos="fade-right"
          data-aos-delay="300"
        >
          <div className="content-wrapper">
            <div className="section-badge">
              <i className="bi bi-buildings"></i>
              <span>Property Listings Platform</span>
            </div>

            <h2>A Simple and Transparent Way to Explore Properties</h2>

            <p>
              We provide a growing collection of property listings with clear details,
              accurate information, and easy navigation. Our goal is to help buyers
              explore opportunities without pressure, hidden fees, or misleading claims.
            </p>

            {/* Value-based highlights instead of fake stats */}
            <div className="stats-grid">
              <div className="stat-item" data-aos="zoom-in" data-aos-delay="400">
                <div className="stat-number">Verified</div>
                <div className="stat-label">Property Details</div>
              </div>

              <div className="stat-item" data-aos="zoom-in" data-aos-delay="450">
                <div className="stat-number">Clear</div>
                <div className="stat-label">Pricing Information</div>
              </div>

              <div className="stat-item" data-aos="zoom-in" data-aos-delay="500">
                <div className="stat-number">Growing</div>
                <div className="stat-label">Property Collection</div>
              </div>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Detailed listings with photos and key information</span>
              </div>

              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Easy search and filtering by location and price</span>
              </div>

              <div className="feature-item">
                <i className="bi bi-check-circle"></i>
                <span>Direct access to available properties without intermediaries</span>
              </div>
            </div>

            <div className="cta-wrapper">
              <Link href="/properties" className="btn-primary">
                <span>Browse Available Properties</span>
                <i className="bi bi-arrow-right-circle"></i>
              </Link>
            </div>
          </div>
        </div>


      </div>

    </div>

  </section>;
}