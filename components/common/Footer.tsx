// "use client";
// // import Link from "next/link";

// export default function Footer() {
//     return (
//         <footer id="footer" className="footer position-relative">
//             <div className="container">
//                 <div className="row gy-5">
//                     <div className="col-lg-4">
//                         <div className="footer-content">
//                             <a href="index.html" className="logo d-flex align-items-center mb-4">
//                                 <span className="sitename">TheProperty</span>
//                             </a>
//                             <p className="mb-4">
//                                 Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
//                                 posuere cubilia curae. Donec velit neque auctor sit amet aliquam
//                                 vel ullamcorper sit amet ligula.
//                             </p>

//                             <div className="newsletter-form">
//                                 <h5>Stay Updated</h5>
//                                 <form
//                                     action="forms/newsletter.php"
//                                     method="post"
//                                     className="php-email-form"
//                                 >
//                                     <div className="input-group">
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             className="form-control"
//                                             placeholder="Enter your email"
//                                             required
//                                         />
//                                         <button type="submit" className="btn-subscribe">
//                                             <i className="bi bi-send"></i>
//                                         </button>
//                                     </div>
//                                     <div className="loading">Loading</div>
//                                     <div className="error-message"></div>
//                                     <div className="sent-message">Thank you for subscribing!</div>
//                                 </form>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col-lg-2 col-6">
//                         <div className="footer-links">
//                             <h4>Company</h4>
//                             <ul>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> About
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Careers
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Press
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Blog
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Contact
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="col-lg-2 col-6">
//                         <div className="footer-links">
//                             <h4>Solutions</h4>
//                             <ul>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Digital Strategy
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Cloud Computing
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Data Analytics
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> AI Solutions
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a href="#">
//                                         <i className="bi bi-chevron-right"></i> Cybersecurity
//                                     </a>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>

//                     <div className="col-lg-4">
//                         <div className="footer-contact">
//                             <h4>Get in Touch</h4>
//                             <div className="contact-item">
//                                 <div className="contact-icon">
//                                     <i className="bi bi-geo-alt"></i>
//                                 </div>
//                                 <div className="contact-info">
//                                     <p>
//                                         2847 Maple Avenue
//                                         <br />
//                                         Los Angeles, CA 90210
//                                         <br />
//                                         United States
//                                     </p>
//                                 </div>
//                             </div>

//                             <div className="contact-item">
//                                 <div className="contact-icon">
//                                     <i className="bi bi-telephone"></i>
//                                 </div>
//                                 <div className="contact-info">
//                                     <p>+1 (555) 987-6543</p>
//                                 </div>
//                             </div>

//                             <div className="contact-item">
//                                 <div className="contact-icon">
//                                     <i className="bi bi-envelope"></i>
//                                 </div>
//                                 <div className="contact-info">
//                                     <p>contact@example.com</p>
//                                 </div>
//                             </div>

//                             <div className="social-links">
//                                 <a href="#">
//                                     <i className="bi bi-facebook"></i>
//                                 </a>
//                                 <a href="#">
//                                     <i className="bi bi-twitter-x"></i>
//                                 </a>
//                                 <a href="#">
//                                     <i className="bi bi-linkedin"></i>
//                                 </a>
//                                 <a href="#">
//                                     <i className="bi bi-youtube"></i>
//                                 </a>
//                                 <a href="#">
//                                     <i className="bi bi-github"></i>
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>


//             <div className="footer-bottom"></div>

//         </footer>
//     );
// }

"use client";

import { CONTACT } from "@/src/config/contact";
import { openWhatsApp } from "@/src/utils/whatsapp";
import Link from "next/link";
import "./css/Footer.css"
import { SITE } from "@/src/config/site";

export default function Footer() {
    return (
        <footer id="footer" className="footer position-relative">
            <div className="container">
                <div className="row gy-4 align-items-start">

                    {/* Brand & Description */}
                    <div className="col-lg-4">
                        <div className="footer-content">
                            <div className="logo mb-3">
                                <span className="sitename">{SITE.name}</span>
                            </div>

                            <p className="mb-3">
                                Find verified properties for sale and rent.
                                Schedule tours, inquire instantly, and connect directly via WhatsApp.
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-4 col-6">
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link href="/properties"><i className="bi bi-chevron-right"></i> Browse Properties</Link></li>
                                <li><Link href="/properties?type=sale"><i className="bi bi-chevron-right"></i> Buy</Link></li>
                                <li><Link href="/properties?type=rent"><i className="bi bi-chevron-right"></i> Rent</Link></li>
                                <li><Link href="/contact"><i className="bi bi-chevron-right"></i> Contact</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-4 col-6">
                        <div className="footer-contact">
                            <h4>Contact</h4>


                            <div className="contact-item flex2column">
                                <div className="contact-icon">
                                    <i className="bi bi-telephone"></i>
                                </div>
                                <div className="contact-info">
                                    <a
                                        style={{ "background": "var(--accent-color)" }}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openWhatsApp()
                                        }}
                                        className="btn custom-button"
                                        aria-label="Chat on WhatsApp"
                                    >
                                        <i className="bi bi-whatsapp me-2"></i>
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>

                            <div className="contact-item flex2column">
                                <div className="contact-icon">
                                    <i className="bi bi-envelope"></i>
                                </div>
                                <div className="contact-info">
                                    <a
                                        style={{ "display": "flex", "alignItems": "center", "height": "40px" }}
                                        href={`mailto:${CONTACT.email}`}>
                                        {CONTACT.email}
                                    </a>
                                </div>
                            </div>

                            {/* <p>
                                <strong>Phone / WhatsApp:</strong>
                                <br />
                                <a
                                    style={{ "background": "var(--accent-color)", "marginLeft": "10px", "marginTop": "5px" }}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openWhatsApp()
                                    }}
                                    className="btn btn-success"
                                    aria-label="Chat on WhatsApp"
                                >
                                    <i className="bi bi-whatsapp me-2"></i>
                                    Chat on WhatsApp
                                </a>

                            </p>

                            <p>
                                <strong>Email:</strong><br />
                                <a 
                                    style={{ "marginLeft": "10px", "marginTop": "5px" }}
                                    href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                                    {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                                </a>

                            </p> */}

                            <div className="social-links mt-3">
                                <Link href={CONTACT.social.instagram} target="_blank"><i className="bi bi-instagram"></i></Link>
                                <Link href={CONTACT.social.facebook} target="_blank"><i className="bi bi-facebook"></i></Link>
                                {/* <a href="#"><i className="bi bi-youtube"></i></a> */}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom */}
            <div className="footer-bottom text-center mt-4 bg-white">
            </div>
        </footer>
    );
}
