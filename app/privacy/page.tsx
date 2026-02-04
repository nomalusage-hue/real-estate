"use client";

import { SITE } from "@/src/config/site";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="main">

      {/* Page Title */}
      <div className="page-title">
        <div className="heading">
          <div className="container">
            <div className="row d-flex justify-content-center text-center">
              <div className="col-lg-8">
                <h1 className="heading-title">Privacy Policy</h1>
                <p className="mb-0">
                  Learn how we collect, use, and protect your personal information
                  while using {SITE.name}. Your privacy and security are important to us.
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
              <li className="current">Privacy Policy</li>
            </ol>
          </div>
        </nav>
      </div>
      {/* End Page Title */}


      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="mb-4">Privacy Policy</h1>

            <p className="text-muted">
              Last updated: {new Date().getFullYear()}
            </p>

            <p>
              <strong>{SITE.name}</strong> values your privacy. This page explains how
              basic personal information is handled when you use our website and services.
            </p>


            <h5 className="mt-4">Information We Collect</h5>
            <p>
              When you sign in or use our platform, we may collect limited personal
              information necessary to operate the service. This may include your
              name, email address, and profile image when provided through
              third-party authentication services such as Google.
            </p>

            <p>
              We do not require users to provide sensitive personal information to
              browse property listings.
            </p>

            <h5 className="mt-4">How We Use Your Information</h5>
            <p>
              The information we collect is used solely for the following
              purposes:
            </p>
            <ul>
              <li>To create and manage user accounts</li>
              <li>To enable authentication and secure access</li>
              <li>To personalize user experience</li>
              <li>To maintain and improve platform functionality</li>
            </ul>

            <h5 className="mt-4">Legal Basis for Processing (GDPR)</h5>
            <p>
              Where applicable under the General Data Protection Regulation
              (GDPR), we process personal data based on one or more of the
              following legal grounds:
            </p>
            <ul>
              <li>Your consent</li>
              <li>Performance of a contract or service request</li>
              <li>Legitimate interests related to operating and securing the platform</li>
            </ul>

            <h5 className="mt-4">Third-Party Services</h5>
            <p>
              We use trusted third-party services to provide core functionality,
              including authentication and data storage. These services may
              process limited personal information in accordance with their own
              privacy policies.
            </p>
            <p>
              Third-party services we rely on may include:
            </p>
            <ul>
              <li>Google (for authentication)</li>
              <li>Supabase (for authentication and data storage)</li>
            </ul>

            <h5 className="mt-4">Data Storage and Security</h5>
            <p>
              Protecting your information is important to us. We rely on secure systems and
              established providers to help keep personal data safe.
            </p>


            <h5 className="mt-4">Data Retention</h5>
            <p>
              Personal information is retained only for as long as necessary to
              provide the service or to comply with legal obligations. You may
              request deletion of your account and associated data.
            </p>

            <h5 className="mt-4">Your Rights</h5>
            <p>
              Depending on your location, you may have certain rights regarding
              your personal data, including the right to access, correct, or
              request deletion of your information, as well as the right to
              withdraw consent where applicable.
            </p>

            <h5 className="mt-4">Children&#39;s Privacy</h5>
            <p>
              Our services are not intended for individuals under the age of 13.
              We do not knowingly collect personal information from children.
            </p>

            <h5 className="mt-4">Changes to This Policy</h5>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated revision date.
            </p>

            <h5 className="mt-4">Contact</h5>
            <p>
              If you have any questions about this Privacy Policy, you can reach us through
              the contact page on this website.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}