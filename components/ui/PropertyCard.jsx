import Image from "next/image";
import Link from "next/link";

function formatNumber(num) {
    return new Intl.NumberFormat("en-US").format(num);
}

export default function PropertyCard({ image, label, title, lotion, door_open, droplet, rulers, price }) {

  return (
    <article className="mini-card" data-aos="fade-up" data-aos-delay="200">
      <a href="property-details.html" className="thumb">
        <Image
          src={image}
          alt="Loft Haven"
          className="img-fluid"
          loading="lazy"
          width={0}
          height={0}
          unoptimized
        />
        <span className="label hot">
          <i className="bi bi-lightning-charge-fill"></i> {label}
        </span>
      </a>
      <div className="mini-body">
        <h4>
          <a href="property-details.html">{title}</a>
        </h4>
        <div className="mini-loc">
          <i className="bi bi-geo"></i> {lotion}
        </div>
        <div className="mini-specs">
          <span>
            <i className="bi bi-door-open"></i> {door_open}
          </span>
          <span>
            <i className="bi bi-droplet"></i> {droplet}
          </span>
          <span>
            <i className="bi bi-rulers"></i> {formatNumber(rulers)} sq ft
          </span>
        </div>
        <div className="mini-foot">
          <div className="mini-price">${formatNumber(price)}</div>
          <Link href="/property-details" className="mini-btn">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
