import Image from "next/image";
import { PropertyData } from "../../../types/property";
import Link from "next/link";
import { formatNumber } from "@/utils/format";
import { formatArea } from "@/utils/format";

// export default function PropertyCardSimpleWide() {
export default function PropertyCardSimpleWide({ data }: { data: PropertyData }) {
    const labels = [
        { show: data.hot, icon: "bi-lightning-charge-fill", text: "Hot", className: "hot" },
        { show: data.newListing, icon: "bi-star-fill", text: "New", className: "new" },
        { show: data.featured, icon: "bi-gem", text: "Featured", className: "featured" },
        { show: data.exclusive, icon: "bi-stars", text: "Exclusive", className: "exclusive" },
    ];

    return (
        <article className="highlight-card">
            <div className="media">
                <div className="badge-set">
                    {labels
                        .filter((label) => label.show)
                        .map((label, idx) => (
                            <span key={idx} className="flag featured">{label.text}</span>
                        ))}
                    {/* <span className="flag premium">{data.status}</span> */}
                    {/* <span className="flag featured">Featured</span> */}
                    <span className="flag premium">Premium</span>


                </div>
                <Link href={`/properties/${data.id}`} className="image-link">
                    <Image src={data.images[0]} alt="Showcase Villa" className="img-fluid" width={0} height={0} unoptimized />
                </Link>
                <div className="quick-specs">
                    <span><i className="bi bi-door-open"></i> {data.bedrooms} Beds</span>
                    <span><i className="bi bi-droplet"></i> {data.bathrooms} Baths</span>
                    {/* <span><i className="bi bi-aspect-ratio"></i> {formatNumber(data.areaSize ? data.areaSize : 0)} {data.areaUnit}</span> */}
                    <span><i className="bi bi-aspect-ratio"></i> {formatArea(data.areaSize, data.areaUnit)}</span>
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
        </article>
    );
}