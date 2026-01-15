import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatArea, formatNumber } from "@/utils/format";

export default function PropertyCardSimple({ data }: { data: PropertyData }) {
    const labels = [
        { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
        { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
        { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
        { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
    ];

    return (

        <div className="col-lg-4" data-aos="fade-up" data-aos-delay="300">
            <article className="stack-card">
                <figure className="stack-media">
                    <Image src={data.images[0]} alt="Modern Facade" className="img-fluid" loading="lazy" width={0} height={0} unoptimized />
                    <figcaption>
                        {/* <span className="chip exclusive">Exclusive</span> */}
                        {labels
                            .filter((label) => label.show)
                            .map((label, idx) => (
                                <span key={idx} className={`chip ${label.className}`}>{label.text}</span>
                            ))}
                    </figcaption>
                </figure>
                <div className="stack-body">
                    <h5>
                        <Link href={`/properties/${data.id}`}>Modern Courtyard Residence</Link></h5>
                    <div className="stack-loc"><i className="bi bi-geo-alt"></i> Scottsdale, AZ 85251</div>
                    <ul className="stack-specs">
                        <li><i className="bi bi-door-open"></i> 4</li>
                        <li><i className="bi bi-droplet"></i> 3</li>
                        <li><i className="bi bi-aspect-ratio"></i> {formatArea(data.landSize, data.sizeUnit)}</li>
                    </ul>
                    <div className="stack-foot">
                        <span className="stack-price">${formatNumber(data.salePrice)}</span>

                        <Link href={`/properties/${data.id}`} className="stack-link">View</Link>
                    </div>
                </div>
            </article>
        </div>

    );
    {/* <article className="highlight-card">
        <div className="media">
            <div className="badge-set">
                {labels
                    .filter((label) => label.show)
                    .map((label, idx) => (
                        <span key={idx} className="flag featured">{label.text}</span>
                    ))}
                <span className="flag premium">Premium</span>
            

            </div>
            <Link href={`/properties/${data.id}`} className="image-link">
                <Image src={data.images[0]} alt="Showcase Villa" className="img-fluid" width={0} height={0} unoptimized/>
            </Link>
            <div className="quick-specs">
                <span><i className="bi bi-door-open"></i> {data.bedrooms} Beds</span>
                <span><i className="bi bi-droplet"></i> {data.bathrooms} Baths</span>
                <span><i className="bi bi-aspect-ratio"></i> {formatNumber(data.areaSize ? data.areaSize : 0)} {data.areaUnit}</span>
            </div>
        </div>
        <div className="content">
            <div className="top">
                <div>
                    <h3><Link href={`/properties/${data.id}`}>{data.title}</Link></h3>
                    <div className="loc"><i className="bi bi-geo-alt-fill"></i> {data.address}</div>
                </div>
                <div className="price">${formatNumber(data.price)}</div>
            </div>
            <p className="excerpt">{data.description}</p>
            <div className="cta">
                <Link href={`/properties/${data.id}`} className="btn-main">Arrange Visit</Link>
                <Link href={`/properties/${data.id}`} className="btn-soft">More Photos</Link>
                <div className="meta">
                    <span className="status for-sale">{data.status}</span>
                    <span className="listed">Listed 2 days ago</span>
                </div>
            </div>
        </div>
    </article> */}
}