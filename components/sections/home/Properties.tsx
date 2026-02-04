import PropertyCardHorizontal from "@/components/property/PropertyCard/PropertyCardHorizontal";
import PropertyCardVertical from "@/components/property/PropertyCard/PropertyCardVertical";
import PropertyCardVerticalWide from "@/components/property/PropertyCard/PropertyCardVerticalWide";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHomepageFeaturedProperties } from "@/services/FeaturedPropertiesService";
import { PropertyData } from '@/types/property';
import AppLoader from "@/components/ui/AppLoader/AppLoader";

export default function Properties() {

    const [wide, setWide] = useState<PropertyData | null>(null);
    const [mini, setMini] = useState<PropertyData[]>([]);
    const [stack, setStack] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            const { wide, mini, stack } = await getHomepageFeaturedProperties();
            setWide(wide);
            setMini(mini);
            setStack(stack);
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return <>
            <section id="featured-properties" className="featured-properties section">

                {/* <!-- Section Title --> */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Featured Properties</h2>
                    <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
                </div>
                {/* <!-- End Section Title --> */}

                <div className="container" data-aos="fade-up" data-aos-delay="100">

                    <div className="text-center py-5">
                        <AppLoader />
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
        </>


    };

    return (
        <section id="featured-properties" className="featured-properties section">

            {/* <!-- Section Title --> */}
            <div className="container section-title" data-aos="fade-up">
                <h2>Featured Properties</h2>
                <p>Explore a curated selection of premium properties tailored to your lifestyle.</p>
            </div>
            {/* <!-- End Section Title --> */}

            <div className="container" data-aos="fade-up" data-aos-delay="100">

                <div className="grid-featured" data-aos="zoom-in" data-aos-delay="150">

                    {/* <PropertyCardVerticalWide data={{
                        id: "prop-002",
                        images: ["/img/real-estate/property-exterior-6.webp"],
                        title: "Seaside Villa with Infinity Pool",
                        address: "Coronado, CA 92118",
                        city: "Coronado",
                        showAddress: false,
                        bathrooms: 2,
                        bedrooms: 2,
                        description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                        saleCurrency: "IDR",

                        landSize: 1450,
                        buildingSize: 450,
                        sizeUnit: "ft2",
                        salePrice: 12000000000,

                        propertyType: "apartment",
                        status: ["For Sale"],

                        showAgent: false,

                        hot: true,
                    }} /> */}
                    {wide && <PropertyCardVerticalWide key={wide.id} data={wide} />}

                    <div className="mini-list">

                        {mini.map((property) => (
                            <PropertyCardHorizontal key={property.id} data={property} />
                        ))}

                        {/* <PropertyCardHorizontal data={{
                            id: "prop-002",
                            images: ["/img/real-estate/property-interior-2.webp"],
                            title: "Urban Loft with Skyline Views",
                            address: "Denver, CO 80203",
                            city: "Denver",
                            showAddress: false,
                            bathrooms: 2,
                            bedrooms: 2,
                            landSize: 1450,
                            buildingSize: 450,
                            sizeUnit: "ft2",
                            salePrice: 689000,
                            saleCurrency: "IDR",
                            description: "",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            hot: true,
                        }} />
                        <PropertyCardHorizontal data={{
                            id: "prop-002",
                            images: ["/img/real-estate/property-interior-2.webp"],
                            title: "Urban Loft with Skyline Views",
                            address: "Denver, CO 80203",
                            city: "Denver",
                            showAddress: false,
                            bathrooms: 2,
                            bedrooms: 2,
                            landSize: 1450,
                            buildingSize: 450,
                            sizeUnit: "ft2",
                            salePrice: 689000,
                            saleCurrency: "IDR",
                            description: "",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            hot: true,
                        }} />
                        <PropertyCardHorizontal data={{
                            id: "prop-002",
                            images: ["/img/real-estate/property-interior-2.webp"],
                            title: "Urban Loft with Skyline Views",
                            address: "Denver, CO 80203",
                            city: "Denver",
                            showAddress: false,
                            bathrooms: 2,
                            bedrooms: 2,
                            landSize: 1450,
                            buildingSize: 450,
                            sizeUnit: "ft2",
                            salePrice: 689000,
                            saleCurrency: "IDR",
                            description: "",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            hot: true,
                        }} /> */}

                    </div>
                    {/* <!-- End Mini List --> */}

                </div>

                <div className="row gy-4 mt-4">
                    {stack.map((property) => (
                        <PropertyCardVertical key={property.id} data={property} />
                    ))}
                    {/* <PropertyCardVertical
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
                            saleCurrency: "IDR",
                            description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            exclusive: true,
                        }}
                    />
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
                            saleCurrency: "IDR",
                            description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            exclusive: true,
                        }}
                    />
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
                            saleCurrency: "IDR",
                            description: "Praesent commodo cursus magna, fusce dapibus tellus ac cursus commodo, vestibulum id ligula porta felis euismod semper.",

                            propertyType: "apartment",
                            status: ["For Sale"],

                            showAgent: false,

                            exclusive: true,
                        }}
                    /> */}


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