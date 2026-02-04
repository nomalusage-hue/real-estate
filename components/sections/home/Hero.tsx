"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    property_type: "",
    price_range: "",
    bedrooms: "",
    bathrooms: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();

    // Location as searchTerm
    if (formData.location.trim()) {
      params.set("searchTerm", formData.location.trim());
    }

    // Property type - map condo to apartment, townhouse to house
    let mappedPropertyType = formData.property_type;
    if (formData.property_type === 'condo') {
      mappedPropertyType = 'apartment';
    } else if (formData.property_type === 'townhouse') {
      mappedPropertyType = 'house';
    }
    if (mappedPropertyType) {
      params.set("propertyType", mappedPropertyType);
    }

    // Price range
    if (formData.price_range) {
      const [min, max] = formData.price_range.split("-").map(v => v.replace(/[^\d]/g, ""));
      if (min) params.set("minSalePrice", min);
      if (max && max !== "+") params.set("maxSalePrice", max);
    }

    // Bedrooms
    if (formData.bedrooms) {
      const bedrooms = formData.bedrooms.replace("+", "");
      params.set("minBedrooms", bedrooms);
    }

    // Bathrooms
    if (formData.bathrooms) {
      const bathrooms = formData.bathrooms.replace("+", "");
      params.set("minBathrooms", bathrooms);
    }

    // Navigate to properties page with params
    router.push(`/properties?${params.toString()}`);
  };
  return (
    <section id="hero" className="hero section">
      <div
        className="container aos-init"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="hero-content">
          <div className="row align-items-center">
            <div
              className="col-lg-6 hero-text"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              {/* <div className="hero-badge">
                <i className="bi bi-star-fill"></i>
                <span>Premium Properties</span>
              </div>
              <h1>Discover Your Perfect Home in the Heart of the City</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Browse thousands of verified listings from trusted agents.
              </p> */}

              <div className="hero-badge">
                <i className="bi bi-star-fill"></i>
                <span>Verified Listings</span>
              </div>

              <h1>Find the Right Property, Faster and Smarter</h1>

              <p>
                Explore a curated selection of verified properties for sale and rent.
                Filter by location, price, and features to find homes that truly match
                your lifestyle — all from trusted agents and owners.
              </p>


              <div
                className="search-form"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          // placeholder="Search by title, description, location..."
                        />
                        <label htmlFor="location">Search by title, description, location...</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="property-type"
                          name="property_type"
                          value={formData.property_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Villa</option>
                          <option value="commercial">Commercial</option>
                          <option value="land">Land</option>
                        </select>
                        <label htmlFor="property-type">Property Type</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="price-range"
                          name="price_range"
                          value={formData.price_range}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Price Range</option>
                          <option value="0-200000">Under $200K</option>
                          <option value="200000-500000">$200K - $500K</option>
                          <option value="500000-800000">$500K - $800K</option>
                          <option value="800000-1200000">$800K - $1.2M</option>
                          <option value="1200000+">Above $1.2M</option>
                        </select>
                        <label htmlFor="price-range">Price Range</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="bedrooms"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleInputChange}
                        >
                          <option value="">Bedrooms</option>
                          <option value="1">1 Bedroom</option>
                          <option value="2">2 Bedrooms</option>
                          <option value="3">3 Bedrooms</option>
                          <option value="4">4 Bedrooms</option>
                          <option value="5+">5+ Bedrooms</option>
                        </select>
                        <label htmlFor="bedrooms">Bedrooms</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating">
                        <select
                          className="form-select"
                          id="bathrooms"
                          name="bathrooms"
                          value={formData.bathrooms}
                          onChange={handleInputChange}
                        >
                          <option value="">Bathrooms</option>
                          <option value="1">1 Bathroom</option>
                          <option value="2">2 Bathrooms</option>
                          <option value="3">3 Bathrooms</option>
                          <option value="4+">4+ Bathrooms</option>
                        </select>
                        <label htmlFor="bathrooms">Bathrooms</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-search w-100">
                        <i className="bi bi-search"></i>
                        Search Properties
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* <div
                className="hero-stats"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="row">
                  <div className="col-4">
                    <div className="stat-item">
                      <h3>
                        <span
                          data-purecounter-start="0"
                          data-purecounter-end="2847"
                          data-purecounter-duration="1"
                          className="purecounter"
                        ></span>
                        +
                      </h3>
                      <p>Properties Listed</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <h3>
                        <span
                          data-purecounter-start="0"
                          data-purecounter-end="156"
                          data-purecounter-duration="1"
                          className="purecounter"
                        ></span>
                        +
                      </h3>
                      <p>Verified Agents</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-item">
                      <h3>
                        <span
                          data-purecounter-start="0"
                          data-purecounter-end="98"
                          data-purecounter-duration="1"
                          className="purecounter"
                        ></span>
                        %
                      </h3>
                      <p>Client Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div> */}

              <div
                className="hero-stats"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="row">
                  <div className="col-4">
                    <div className="stat-item">
                      <h3>Verified</h3>
                      <p>Property Information</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="stat-item">
                      <h3>Transparent</h3>
                      <p>Pricing & Details</p>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="stat-item">
                      <h3>Simple</h3>
                      <p>Buying Process</p>
                    </div>
                  </div>
                </div>
              </div>



            </div>
            {/* <!-- End Hero Text --> */}

            <div
              className="col-lg-6 hero-images"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <div className="image-stack">
                <div className="main-image">
                  <Image
                    // src="/img/real-estate/property-exterior-3.webp"
                    // src="/img/home/ian-macdonald-W8z6aiwfi1E-unsplash (1).jpg"
                    src="/properties-images/image-1.jpeg"
                    alt="Luxury Property"
                    className="img-fluid"
                    width={0}
                    height={0}
                    unoptimized
                  />
                  <div className="property-tag">
                    {/* <span className="price">$850,000</span> */}
                    <span className="price">Excellent Value</span>
                    <span className="type">Featured</span>
                  </div>
                </div>

                <div className="secondary-image">
                  <Image
                    src="/properties-images/kitchens/kitchen-1.jpeg"
                    // src="/img/home/webaliser-_TPTXZd9mOo-unsplash.jpg"
                    // src="/properties-images/image-2.jpeg"
                    alt="Property Interior"
                    className="img-fluid"
                    width={0}
                    height={0}
                    unoptimized
                  />
                </div>

                {/* <div className="floating-card">
                  <div className="agent-info">
                    <Image
                      src="/img/real-estate/agent-4.webp"
                      alt="Agent"
                      className="agent-avatar"
                      width={0}
                      height={0}
                      unoptimized
                    />
                    <div className="agent-details">
                      <h5>Sarah Johnson</h5>
                      <p>Top Real Estate Agent</p>
                      <div className="rating">
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <i className="bi bi-star-fill"></i>
                        <span>4.9 (127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>


{/* <div
  className="col-lg-6 hero-images"
  data-aos="fade-left"
  data-aos-delay="400"
>
  <div className="image-stack">
    <div className="main-image">
      <Image
        src="/img/real-estate/property-exterior-3.webp"
        alt="Featured Property"
        className="img-fluid"
        width={0}
        height={0}
        unoptimized
      />

      <div className="property-tag">
        <span className="type">Featured Property</span>
      </div>
    </div>

    <div className="secondary-image">
      <Image
        src="/img/real-estate/property-interior-7.webp"
        alt="Property Interior"
        className="img-fluid"
        width={0}
        height={0}
        unoptimized
      />
    </div>

    <div className="floating-card">
      <div className="highlight-info">
        <h5>Carefully Selected Listings</h5>
        <p>Updated regularly with available properties</p>
      </div>
    </div>
  </div>
</div> */}



          </div>
        </div>
      </div>
    </section>
  );
}
