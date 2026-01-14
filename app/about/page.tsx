"use client";

import Image from "next/image";
import Link from "next/link";
// import NoSSrWrapper from "@/components/layout/NoSSRWrapper";

export default function About() {
  return (
    // <NoSSrWrapper>

      <main className="main">
        <div className="page-title">
          <div className="heading">
            <div className="container">
              <div className="row d-flex justify-content-center text-center">
                <div className="col-lg-8">
                  <h1 className="heading-title">About</h1>
                  <p className="mb-0">
                    We provide personalized real estate services focused on clarity, trust, and long-term value. Every client receives direct attention, strategic guidance, and market-driven advice throughout the entire property journey.
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
                <li className="current">About</li>
              </ol>
            </div>
          </nav>
        </div>

        <section id="about" className="about section">
          <div className="container" data-aos="fade-up" data-aos-delay="100">
            <div className="row align-items-center mb-5">
              <div className="col-lg-7">
                <div
                  className="intro-content"
                  data-aos="fade-right"
                  data-aos-delay="200"
                >
                  <div className="section-badge">
                    <i className="bi bi-house-heart"></i>
                    <span>Your Trusted Real Estate Partner</span>
                  </div>
                  {/* <h2>Building Dreams, Creating Homes Since 2010</h2> */}
                  <h2>Connecting People With the Right Properties</h2>
                  <p className="lead-text">
                    We help buyers, sellers, and renters navigate the real estate market with clarity and confidence. By understanding each client’s goals, preferences, and budget, we focus on connecting the right people with properties that truly fit their needs—whether it’s a family home, an investment opportunity, or a rental in the right location.
                  </p>
                  <p>
                    Our approach is simple and transparent: informed guidance, local market insight, and carefully selected listings. Rather than pushing options, we work to align expectations with real opportunities, ensuring every decision is based on accurate information, practical advice, and long-term value.
                  </p>

                  <div
                    className="founder-highlight"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="founder-image">
                      <Image
                        src="/img/person/person-m-7.webp"
                        alt="Founder"
                        className="img-fluid"
                        width={0}
                        height={0}
                        unoptimized
                      />
                    </div>
                    <div className="founder-info">
                      <blockquote>
                        &quot; Neque porro quisquam est qui dolorem ipsum quia
                        dolor sit amet consectetur adipisci velit.&quot;
                      </blockquote>
                      <div className="founder-details">
                        <h5>Michael Thompson</h5>
                        <span>Founder &amp; CEO</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div
                  className="visual-section"
                  data-aos="fade-left"
                  data-aos-delay="250"
                >
                  <div className="main-image">
                    <Image
                      src="/img/real-estate/property-exterior-7.webp"
                      alt="Luxury Development"
                      className="img-fluid"
                      width={0}
                      height={0}
                      unoptimized
                    />
                    <div className="experience-badge">
                      <div className="badge-number">14+</div>
                      <div className="badge-text">Years of Excellence</div>
                    </div>
                  </div>
                  <div className="overlay-image">
                    <Image
                      src="/img/real-estate/property-interior-6.webp"
                      alt="Interior Design"
                      className="img-fluid"
                      width={0}
                      height={0}
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="achievements-grid"
              data-aos="fade-up"
              data-aos-delay="350"
            >
              <div className="row text-center">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div
                    className="achievement-item"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                  >
                    <div className="achievement-icon">
                      <i className="bi bi-key"></i>
                    </div>
                    <div className="achievement-number">
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="2850"
                        data-purecounter-duration="2"
                        className="purecounter"
                      ></span>
                      +
                    </div>
                    <div className="achievement-label">Properties Sold</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div
                    className="achievement-item"
                    data-aos="zoom-in"
                    data-aos-delay="450"
                  >
                    <div className="achievement-icon">
                      <i className="bi bi-heart-fill"></i>
                    </div>
                    <div className="achievement-number">
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="98"
                        data-purecounter-duration="2"
                        className="purecounter"
                      ></span>
                      %
                    </div>
                    <div className="achievement-label">Client Satisfaction</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div
                    className="achievement-item"
                    data-aos="zoom-in"
                    data-aos-delay="500"
                  >
                    <div className="achievement-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                    <div className="achievement-number">
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="35"
                        data-purecounter-duration="2"
                        className="purecounter"
                      ></span>
                    </div>
                    <div className="achievement-label">Cities Covered</div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div
                    className="achievement-item"
                    data-aos="zoom-in"
                    data-aos-delay="550"
                  >
                    <div className="achievement-icon">
                      <i className="bi bi-award"></i>
                    </div>
                    <div className="achievement-number">
                      <span
                        data-purecounter-start="0"
                        data-purecounter-end="127"
                        data-purecounter-duration="2"
                        className="purecounter"
                      ></span>
                    </div>
                    <div className="achievement-label">Industry Awards</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="timeline-section"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="section-header text-center mb-5">
                    <h3>Our Journey of Excellence</h3>
                    <p>
                      Sed ut perspiciatis unde omnis iste natus error sit
                      voluptatem accusantium doloremque laudantium totam rem
                      aperiam.
                    </p>
                  </div>

                  <div className="timeline">
                    <div
                      className="timeline-item"
                      data-aos="fade-right"
                      data-aos-delay="450"
                    >
                      <div className="timeline-year">2010</div>
                      <div className="timeline-content">
                        <h4>Company Founded</h4>
                        <p>
                          Ut enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                    <div
                      className="timeline-item"
                      data-aos="fade-left"
                      data-aos-delay="500"
                    >
                      <div className="timeline-year">2015</div>
                      <div className="timeline-content">
                        <h4>1000th Property Milestone</h4>
                        <p>
                          Duis aute irure dolor in reprehenderit in voluptate
                          velit esse cillum dolore eu fugiat nulla pariatur.
                        </p>
                      </div>
                    </div>
                    <div
                      className="timeline-item"
                      data-aos="fade-right"
                      data-aos-delay="550"
                    >
                      <div className="timeline-year">2020</div>
                      <div className="timeline-content">
                        <h4>Digital Innovation Launch</h4>
                        <p>
                          Excepteur sint occaecat cupidatat non proident, sunt in
                          culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                      </div>
                    </div>
                    <div
                      className="timeline-item"
                      data-aos="fade-left"
                      data-aos-delay="600"
                    >
                      <div className="timeline-year">2024</div>
                      <div className="timeline-content">
                        <h4>Regional Expansion</h4>
                        <p>
                          At vero eos et accusamus et iusto odio dignissimos
                          ducimus qui blanditiis praesentium voluptatum deleniti.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="team-preview" data-aos="fade-up" data-aos-delay="450">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <h3>Meet Our Expert Team</h3>
                  <p className="team-description">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua
                    quis nostrud exercitation.
                  </p>

                  <div className="team-grid">
                    <div className="row justify-content-center">
                      <div className="col-lg-4 col-md-6 mb-4">
                        <div
                          className="team-member"
                          data-aos="flip-up"
                          data-aos-delay="500"
                        >
                          <div className="member-image">
                            <Image
                              src="/img/real-estate/agent-5.webp"
                              alt="Team Member"
                              className="img-fluid"
                              width={0}
                              height={0}
                              unoptimized
                            />
                          </div>
                          <div className="member-info">
                            <h5>Sarah Martinez</h5>
                            <span>Senior Property Advisor</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 mb-4">
                        <div
                          className="team-member"
                          data-aos="flip-up"
                          data-aos-delay="550"
                        >
                          <div className="member-image">
                            <Image
                              src="/img/real-estate/agent-2.webp"
                              alt="Team Member"
                              className="img-fluid"
                              width={0}
                              height={0}
                              unoptimized
                            />
                          </div>
                          <div className="member-info">
                            <h5>David Chen</h5>
                            <span>Investment Specialist</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a href="team.html" className="view-team-btn">
                    View Full Team
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    // </NoSSrWrapper>
  );
}
