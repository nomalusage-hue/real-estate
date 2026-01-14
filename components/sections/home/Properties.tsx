import Image from "next/image";

// import PropertyCard from "@/components/ui/PropertyCard";
import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
import Link from "next/link";

export default function Properties() {
    return (
        <section id="featured-properties" className="featured-properties section">

            {/* <!-- Section Title --> */}
            <div className="container section-title" data-aos="fade-up">
                <h2>Featured Properties</h2>
                <p>Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit</p>
            </div>
            {/* <!-- End Section Title --> */}

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">

                    <PropertyCardVerticalWide data={{
                        id: "prop-002",
                        images: ["/img/real-estate/property-exterior-6.webp"],
                        title: "Seaside Villa with Infinity Pool",
                        address: "Coronado, CA 92118",
                        city: "Coronado",
                        showAddress: false,
                        bathrooms: 2,
                        bedrooms: 2,
                        areaSize: 1450,
                        areaUnit: "ft2",
                        price: 3760000,
                        description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                        propertyType: "apartment",
                        status: "For Sale",

                        showAgent: false,

                        hot: true,
                    }} />
                    {/* <!-- End Highlight Card --> */}

                    <div className="mini-list">

                        {/* <article className="mini-card" data-aos="fade-up" data-aos-delay="200">
                            <a href="property-details.html" className="thumb">
                                <Image src="/img/real-estate/property-interior-2.webp" alt="Loft Haven" className="img-fluid" loading="lazy" width={0} height={0} unoptimized/>
                                <span className="label hot"><i className="bi bi-lightning-charge-fill"></i> Hot</span>
                            </a>
                            <div className="mini-body">
                                <h4><a href="property-details.html">Urban Loft with Skyline Views</a></h4>
                                <div className="mini-loc"><i className="bi bi-geo"></i> Denver, CO 80203</div>
                                <div className="mini-specs">
                                    <span><i className="bi bi-door-open"></i> 2</span>
                                    <span><i className="bi bi-droplet"></i> 2</span>
                                    <span><i className="bi bi-rulers"></i> 1,450 sq ft</span>
                                </div>
                                <div className="mini-foot">
                                    <div className="mini-price">$689,000</div>
                                    <a href="property-details.html" className="mini-btn">Details</a>
                                </div>
                            </div>
                        </article> */}
                        {/* <PropertyCard
                            image={"/img/real-estate/property-interior-2.webp"}
                            label={"hot"}
                            title={"Urban Loft with Skyline Views"}
                            lotion={"Denver, CO 80203"}
                            door_open={2}
                            droplet={2}
                            rulers={1450}
                            price={689000}
                        /> */}
                        <PropertyCardHorizontal data={{
                            id: "prop-002",
                            images: ["/img/real-estate/property-interior-2.webp"],
                            title: "Urban Loft with Skyline Views",
                            address: "Denver, CO 80203",
                            city: "Denver",
                            showAddress: false,
                            bathrooms: 2,
                            bedrooms: 2,
                            areaSize: 1450,
                            areaUnit: "ft2",
                            price: 689000,
                            description: "",

                            propertyType: "apartment",
                            status: "For Sale",

                            showAgent: false,

                            hot: true,
                        }} />
                        {/* PropertyCardSimple */}
                        {/* <!-- End Mini Card --> */}

                        <article className="mini-card" data-aos="fade-up" data-aos-delay="250">
                            <a href="property-details.html" className="thumb">
                                <Image src="/img/real-estate/property-exterior-3.webp" alt="Suburban Home" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                                <span className="label new"><i className="bi bi-star-fill"></i> New</span>
                            </a>
                            <div className="mini-body">
                                <h4><a href="property-details.html">Charming Suburban Retreat</a></h4>
                                <div className="mini-loc"><i className="bi bi-geo"></i> Austin, TX 78745</div>
                                <div className="mini-specs">
                                    <span><i className="bi bi-door-open"></i> 4</span>
                                    <span><i className="bi bi-droplet"></i> 3</span>
                                    <span><i className="bi bi-rulers"></i> 2,350 sq ft</span>
                                </div>
                                <div className="mini-foot">
                                    <div className="mini-price">$545,000</div>
                                    <a href="property-details.html" className="mini-btn">Details</a>
                                </div>
                            </div>
                        </article>
                        {/* <!-- End Mini Card --> */}

                        <article className="mini-card" data-aos="fade-up" data-aos-delay="300">
                            <a href="property-details.html" className="thumb">
                                <Image src="/img/real-estate/property-interior-7.webp" alt="Penthouse" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                                <span className="label featured"><i className="bi bi-gem"></i> Featured</span>
                            </a>
                            <div className="mini-body">
                                <h4><a href="property-details.html">Glass-Roof Penthouse Suite</a></h4>
                                <div className="mini-loc"><i className="bi bi-geo"></i> Miami, FL 33131</div>
                                <div className="mini-specs">
                                    <span><i className="bi bi-door-open"></i> 3</span>
                                    <span><i className="bi bi-droplet"></i> 3</span>
                                    <span><i className="bi bi-rulers"></i> 2,120 sq ft</span>
                                </div>
                                <div className="mini-foot">
                                    <div className="mini-price">$1,290,000</div>
                                    <a href="property-details.html" className="mini-btn">Details</a>
                                </div>
                            </div>
                        </article>
                        {/* <!-- End Mini Card --> */}

                    </div>
                    {/* <!-- End Mini List --> */}

                </div>

                <div className="row gy-4 mt-4">

                    {/* <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
                        <article className="stack-card">
                            <figure className="stack-media">
                                <Image src="/img/real-estate/property-exterior-8.webp" alt="Modern Facade" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                                <figcaption>
                                    <span className="chip exclusive">Exclusive</span>
                                </figcaption>
                            </figure>
                            <div className="stack-body">
                                <h5><a href="property-details.html">Modern Courtyard Residence</a></h5>
                                <div className="stack-loc"><i className="bi bi-geo-alt"></i> Scottsdale, AZ 85251</div>
                                <ul className="stack-specs">
                                    <li><i className="bi bi-door-open"></i> 4</li>
                                    <li><i className="bi bi-droplet"></i> 3</li>
                                    <li><i className="bi bi-aspect-ratio"></i> 2,980 sq ft</li>
                                </ul>
                                <div className="stack-foot">
                                    <span className="stack-price">$1,025,000</span>
                                    <a href="property-details.html" className="stack-link">View</a>
                                </div>
                            </div>
                        </article>
                    </div> */}
                    <PropertyCardVertical
                        data={{
                            id: "prop-002",
                            images: ["/img/real-estate/property-exterior-6.webp"],
                            title: "Seaside Villa with Infinity Pool",
                            address: "Coronado, CA 92118",
                            city: "Coronado",
                            showAddress: false,
                            bathrooms: 2,
                            bedrooms: 2,
                            landSize: 1450,
                            sizeUnit: "ft2",
                            salePrice: 3760000,
                            description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            exclusive: true,
                        }}
                    />

                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="350">
                        <article className="stack-card">
                            <figure className="stack-media">
                                <Image src="/img/real-estate/property-interior-10.webp" alt="Cozy Interior" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                                <figcaption>
                                    <span className="chip hot">Hot</span>
                                </figcaption>
                            </figure>
                            <div className="stack-body">
                                <h5><a href="property-details.html">Cozy Lakeview Townhouse</a></h5>
                                <div className="stack-loc"><i className="bi bi-geo-alt"></i> Madison, WI 53703</div>
                                <ul className="stack-specs">
                                    <li><i className="bi bi-door-open"></i> 3</li>
                                    <li><i className="bi bi-droplet"></i> 2</li>
                                    <li><i className="bi bi-aspect-ratio"></i> 1,780 sq ft</li>
                                </ul>
                                <div className="stack-foot">
                                    <span className="stack-price">$429,000</span>
                                    <a href="property-details.html" className="stack-link">View</a>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div className="col-lg-4" data-aos="fade-up" data-aos-delay="400">
                        <article className="stack-card">
                            <figure className="stack-media">
                                <Image src="/img/real-estate/property-exterior-10.webp" alt="Garden Home" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                                <figcaption>
                                    <span className="chip new">New</span>
                                </figcaption>
                            </figure>
                            <div className="stack-body">
                                <h5><a href="property-details.html">Garden Home Near Downtown</a></h5>
                                <div className="stack-loc"><i className="bi bi-geo-alt"></i> Raleigh, NC 27601</div>
                                <ul className="stack-specs">
                                    <li><i className="bi bi-door-open"></i> 3</li>
                                    <li><i className="bi bi-droplet"></i> 2</li>
                                    <li><i className="bi bi-aspect-ratio"></i> 1,920 sq ft</li>
                                </ul>
                                <div className="stack-foot">
                                    <span className="stack-price">$512,000</span>
                                    <a href="property-details.html" className="stack-link">View</a>
                                </div>
                            </div>
                        </article>
                    </div>

                </div>

                <div className="row mt-5">
                    <div className="col-12 d-flex justify-content-center">
                        <Link
                            href="/properties"
                            className="btn custom-button px-4"
                            style={{ background: "var(--accent-color)" }}
                            aria-label="Chat on WhatsApp"
                        >
                            {/* <i className="bi bi-whatsapp me-2"></i> */}
                            Explore More Properties
                        </Link>
                    </div>
                </div>


            </div>

        </section>
    );
}