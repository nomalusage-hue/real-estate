"use client";

import { CONTACT } from "@/src/config/contact";
import { openWhatsApp } from "@/src/utils/whatsapp";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function ContactPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [sent, setSent] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (!showModal) return
        const t = setTimeout(() => setShowModal(false), 4000)
        return () => clearTimeout(t)
    }, [showModal])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSent(false)

        // Per-field validation
        const errors: { [key: string]: string } = {}
        if (!name.trim()) errors.name = 'Name is required'
        if (!email.trim()) errors.email = 'Email is required'
        else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email'
        if (!message.trim()) errors.message = 'Message is required'

        if (Object.keys(errors).length) {
            setFieldErrors(errors)
            setError('Please correct the highlighted fields')
            return
        }

        setFieldErrors({})

        setLoading(true)

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, subject, message })
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data?.error || 'Failed to send message')
            } else {
                setSent(true)
                setShowModal(true)
                setName('')
                setEmail('')
                setSubject('')
                setMessage('')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return <main className="main">

        {/* Page Title */}
        <div className="page-title">
            <div className="heading">
                <div className="container">
                    <div className="row d-flex justify-content-center text-center">
                        <div className="col-lg-8">
                            <h1 className="heading-title">Contact</h1>
                            <p className="mb-0">
                                Have a question or want to schedule a tour? Reach out directly via WhatsApp or email, and we’ll get back to you promptly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="breadcrumbs">
                <div className="container">
                    <ol>
                        <li><Link href="/">Home</Link></li>
                        <li className="current">Contact</li>
                    </ol>
                </div>
            </nav>
        </div>

        {/* Contact Info Section */}
        <section id="contact-2" className="contact-2 section">
            <div className="container" data-aos="fade-up" data-aos-delay="100">
                <div className="row gy-4 mb-5">

                    {/* Email */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <div className="contact-info-box">
                            <div className="icon-box">
                                <i className="bi bi-envelope"></i>
                            </div>
                            <div className="info-content">
                                <h4>Email Address</h4>
                                <p>
                                    {/* <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
                                        {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                                    </a> */}
                                    <a href={`mailto:${CONTACT.email}`}>
                                        {CONTACT.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="contact-info-box">
                            <div className="icon-box">
                                <i className="bi bi-whatsapp"></i>
                            </div>
                            <div className="info-content">
                                <h4>WhatsApp</h4>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openWhatsApp();
                                    }}
                                    className="btn custom-button"
                                    aria-label="Chat on WhatsApp"
                                >
                                    <i className="bi bi-whatsapp me-2"></i>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Contact Form */}
                {/* <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
                    <div className="col-lg-10">
                        <div className="contact-form-wrapper">
                            <h2 className="text-center mb-4">Send Us a Message</h2>

                            <form action="forms/contact.php" method="post" className="php-email-form">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-group input-with-icon">
                                            <i className="bi bi-person"></i>
                                            <input type="text" className="form-control" name="name" placeholder="First Name" required />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group input-with-icon">
                                            <i className="bi bi-envelope"></i>
                                            <input type="email" className="form-control" name="email" placeholder="Email Address" required />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group input-with-icon">
                                            <i className="bi bi-text-left"></i>
                                            <textarea className="form-control" name="message" placeholder="Write your message..." style={{ height: "180px" }} required></textarea>
                                        </div>
                                    </div>

                                    <div className="col-12 text-center">
                                        <button type="submit" className="btn btn-primary btn-submit">SEND MESSAGE</button>
                                    </div>
                                </div>

                                <div className="loading">Loading</div>
                                <div className="error-message"></div>
                                <div className="sent-message">Your message has been sent. Thank you!</div>
                            </form>
                        </div>
                    </div>
                </div>

                 */}



                <div className="container form-container-overlap" style={{ "marginTop": "0px" }}>
                    <div className="row justify-content-center" data-aos="fade-up" data-aos-delay="300">
                        <div className="col-lg-10">
                            <div className="contact-form-wrapper">
                                <h2 className="text-center mb-4">Send Us a Message</h2>

                                <form onSubmit={handleSubmit} className="php-email-form" noValidate>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="input-with-icon">
                                                    <i className="bi bi-person"></i>
                                                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`} name="name" placeholder="First Name" required />
                                                    {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <div className="input-with-icon">
                                                    <i className="bi bi-envelope"></i>
                                                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`} name="email" placeholder="Email Address" required />
                                                    {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <div className="input-with-icon">
                                                    <i className="bi bi-text-left"></i>
                                                    <input value={subject} onChange={(e) => setSubject(e.target.value)} type="text" className="form-control" name="subject" placeholder="Subject" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <div className="input-with-icon">
                                                    <i className="bi bi-chat-dots message-icon"></i>
                                                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} className={`form-control ${fieldErrors.message ? 'is-invalid' : ''}`} name="message" placeholder="Write Message..." maxLength={1000} style={{ "height": "180px" }} required></textarea>
                                                    {fieldErrors.message && <div className="invalid-feedback">{fieldErrors.message}</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            {loading && <div className="loading">Loading</div>}
                                            {error && <div className="error-message text-danger">{error}</div>}
                                            {sent && <div className="sent-message text-success">Your message has been sent. Thank you!</div>}
                                        </div>

                                        <div className="col-12 text-center">
                                            <button type="submit" disabled={loading} className="btn btn-primary btn-submit">{loading ? 'SENDING...' : 'SEND MESSAGE'}</button>
                                        </div>
                                    </div>


                                    {/* fallback messages already shown above */}

                                </form>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Thank-you modal (pro style) */}
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }} role="dialog" aria-modal="true">
                        <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', maxWidth: '520px', width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Thank you!</h3>
                            <p style={{ marginBottom: '1rem' }}>Your message has been received. We’ll get back to you shortly.</p>
                            <button className="btn btn-primary custom-button" onClick={() => setShowModal(false)}>Close</button>
                        </div>
                    </div>
                )}

            </div>
        </section>

    </main>
}