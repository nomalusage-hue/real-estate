"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { createClient } from "@/lib/supabase/supabase";
import { checkIfAdmin } from "@/utils/checkIfAdmin";
import rawSite from "@/src/config/site.json";
import rawContact from "@/src/config/contact.json";
import rawCurrencies from "@/src/config/currencies.json";
import Link from "next/link";

export default function AdminConfigurationPage() {
    const router = useRouter();
    const supabase = createClient();

    const [checking, setChecking] = useState(true);

    const [siteConfig, setSiteConfig] = useState(rawSite);
    const [contactConfig, setContactConfig] = useState(rawContact);
    const [currenciesConfig, setCurrenciesConfig] = useState(rawCurrencies);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Check admin auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/login");
                return;
            }

            const admin = await checkIfAdmin(session.user.id);
            if (!admin) {
                router.replace("/");
                return;
            }

            setChecking(false);
        };
        checkAuth();
    }, [router, supabase]);

    if (checking) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <AppLoader />
                    <p className="mt-3">Verifying permissions...</p>
                </div>
            </div>
        );
    }

    // Save JSON function
    const saveConfig = async (fileName: string, data: any) => {
        setSaving(true);
        setMessage(null);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        try {
            const res = await fetch("/api/admin/update-config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    fileName,
                    data
                }),
            });
            const json = await res.json();
            if (json.success) setMessage(`${fileName} updated successfully!`);
            else setMessage(`Error: ${json.error}`);
        } catch (err) {
            setMessage("Failed to save config");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <main className="main">
            {/* Page Title */}
            <div className="page-title">
                <div className="heading">
                    <div className="container">
                        <div className="row d-flex justify-content-center text-center">
                            <div className="col-lg-8">
                                <h1 className="heading-title">Admin Configuration</h1>
                                <p className="mb-0">
                                    Manage your site configuration, contact details, and currency settings from here.
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
                            <li>
                                <Link href="/admin">Admin</Link>
                            </li>
                            <li className="current">Configuration</li>
                        </ol>
                    </div>
                </nav>
            </div>
            {/* End Page Title */}

            <div className="container py-5">
                <h1 className="mb-4">Admin Configuration</h1>

                {/* SITE */}
                <div className="card mb-4">
                    <div className="card-header">Site Config</div>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={siteConfig.name}
                            onChange={e => setSiteConfig({ ...siteConfig, name: e.target.value })}
                            placeholder="Site Name"
                        />
                        <input
                            type="number"
                            className="form-control mb-2"
                            value={siteConfig.startingYear}
                            onChange={e => setSiteConfig({ ...siteConfig, startingYear: Number(e.target.value) })}
                            placeholder="Starting Year"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={siteConfig.founderName}
                            onChange={e => setSiteConfig({ ...siteConfig, founderName: e.target.value })}
                            placeholder="Founder Name"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={siteConfig.founderAvatar}
                            onChange={e => setSiteConfig({ ...siteConfig, founderAvatar: e.target.value })}
                            placeholder="Founder Avatar URL"
                        />

                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => saveConfig("site.json", siteConfig)}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Site Config"}
                        </button>
                    </div>
                </div>

                {/* CONTACT */}
                <div className="card mb-4">
                    <div className="card-header">Contact Config</div>
                    <div className="card-body">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={contactConfig.email}
                            onChange={e => setContactConfig({ ...contactConfig, email: e.target.value })}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={contactConfig.phone}
                            onChange={e => setContactConfig({ ...contactConfig, phone: e.target.value })}
                            placeholder="Phone"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={contactConfig.social.instagram}
                            onChange={e => setContactConfig({
                                ...contactConfig,
                                social: { ...contactConfig.social, instagram: e.target.value }
                            })}
                            placeholder="Instagram URL"
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={contactConfig.social.facebook}
                            onChange={e => setContactConfig({
                                ...contactConfig,
                                social: { ...contactConfig.social, facebook: e.target.value }
                            })}
                            placeholder="Facebook URL"
                        />

                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => saveConfig("contact.json", contactConfig)}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Contact Config"}
                        </button>
                    </div>
                </div>

                {/* CURRENCIES */}
                <div className="card mb-4">
                    <div className="card-header">Currencies Config</div>
                    <div className="card-body">
                        {currenciesConfig.map((cur: any, idx: number) => (
                            <div key={idx} className="mb-2">
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={cur.code}
                                    onChange={e => {
                                        const updated = [...currenciesConfig];
                                        updated[idx].code = e.target.value;
                                        setCurrenciesConfig(updated);
                                    }}
                                    placeholder="Code"
                                />
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={cur.label}
                                    onChange={e => {
                                        const updated = [...currenciesConfig];
                                        updated[idx].label = e.target.value;
                                        setCurrenciesConfig(updated);
                                    }}
                                    placeholder="Label"
                                />
                                <input
                                    type="text"
                                    className="form-control mb-1"
                                    value={cur.symbol}
                                    onChange={e => {
                                        const updated = [...currenciesConfig];
                                        updated[idx].symbol = e.target.value;
                                        setCurrenciesConfig(updated);
                                    }}
                                    placeholder="Symbol"
                                />
                                <label className="form-check-label me-2">
                                    <input
                                        type="checkbox"
                                        checked={cur.priority || false}
                                        onChange={e => {
                                            const updated = [...currenciesConfig];
                                            updated[idx].priority = e.target.checked;
                                            setCurrenciesConfig(updated);
                                        }}
                                    /> Priority
                                </label>
                            </div>
                        ))}

                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => saveConfig("currencies.json", currenciesConfig)}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Currencies Config"}
                        </button>
                    </div>
                </div>

                {message && <p className="text-success">{message}</p>}
            </div>
        </main>
    );
}