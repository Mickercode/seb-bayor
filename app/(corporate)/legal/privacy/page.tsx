import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Seb & Bayor Pharmacy',
  description:
    'NDPR-compliant privacy policy for Seb & Bayor Pharmacy. Learn how we collect, use, store, and protect your personal and health data.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: March 2026
          </p>

          {/* Introduction */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Seb &amp; Bayor Pharmacy (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
              is committed to protecting your privacy and personal data. This Privacy Policy
              explains how we collect, use, store, and share information when you use our website,
              mobile applications, and pharmacy services (collectively, the &ldquo;Services&rdquo;).
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy is issued in compliance with the Nigeria Data Protection Regulation
              (NDPR) 2019 and the Nigeria Data Protection Act (NDPA) 2023. By using our Services,
              you consent to the practices described herein.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may collect the following categories of information:
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Personal Information
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Full name, email address, phone number, delivery address, date of birth, and
              government-issued identification where required for prescription verification.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Health Data
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Prescription information, medication history, allergy records, and health conditions
              you share with our pharmacists during consultations. Health data is treated as
              sensitive personal data under the NDPR and is subject to additional safeguards.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Payment Data
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Transaction records, billing addresses, and payment method details. We do not store
              full card numbers directly; payment processing is handled by our third-party payment
              processor.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Usage Data
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Device information, browser type, IP address, pages viewed, referring URLs, and
              interaction data collected through cookies and similar technologies.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>To process and fulfil medication orders and prescriptions</li>
              <li>To verify prescriptions with licensed healthcare providers</li>
              <li>To provide pharmacist consultations and drug information services</li>
              <li>To process payments and prevent fraudulent transactions</li>
              <li>To communicate order updates, delivery status, and service notifications</li>
              <li>To improve and personalise our Services</li>
              <li>To comply with legal, regulatory, and professional obligations including the
                Pharmacists Council of Nigeria (PCN) requirements</li>
              <li>To respond to your enquiries and support requests</li>
            </ul>
          </section>

          {/* Data Storage and Security */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              4. Data Storage and Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard technical and organisational measures to protect your
              data, including encryption at rest and in transit, access controls, and regular
              security audits.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your data is stored on secure servers provided by our infrastructure partners. While
              we take all reasonable steps to protect your information, no system is completely
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              5. Third-Party Services
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We share data with the following third-party service providers, each bound by
              contractual obligations to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Paystack</strong> &mdash; Payment processing. Paystack processes your
                payment card data in accordance with PCI-DSS standards. See{' '}
                <a
                  href="https://paystack.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 underline hover:text-teal-800"
                >
                  Paystack&rsquo;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Supabase</strong> &mdash; Database and authentication infrastructure.
                Your account data and order records are stored securely on Supabase-managed
                servers.
              </li>
              <li>
                <strong>Delivery Partners</strong> &mdash; We share your name, phone number, and
                delivery address with our logistics partners solely for the purpose of fulfilling
                your orders.
              </li>
            </ul>
          </section>

          {/* Your Rights under NDPR */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              6. Your Rights under NDPR
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Under the Nigeria Data Protection Regulation, you have the following rights:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Right of Access</strong> &mdash; You may request a copy of the personal
                data we hold about you.
              </li>
              <li>
                <strong>Right to Rectification</strong> &mdash; You may request corrections to
                inaccurate or incomplete data.
              </li>
              <li>
                <strong>Right to Deletion</strong> &mdash; You may request deletion of your
                personal data, subject to legal and regulatory retention requirements.
              </li>
              <li>
                <strong>Right to Object</strong> &mdash; You may object to the processing of
                your data for direct marketing purposes.
              </li>
              <li>
                <strong>Right to Data Portability</strong> &mdash; You may request your data in a
                structured, commonly used, and machine-readable format.
              </li>
              <li>
                <strong>Right to Withdraw Consent</strong> &mdash; You may withdraw consent at
                any time. Withdrawal does not affect the lawfulness of processing carried out
                before withdrawal.
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              7. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal data only for as long as necessary to fulfil the purposes
              for which it was collected, including to satisfy legal, regulatory, and accounting
              requirements.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Account data is retained for the duration of your account and up to 12 months
                after deletion request, unless longer retention is required by law.</li>
              <li>Prescription and health records are retained for a minimum of 5 years in
                accordance with PCN regulations.</li>
              <li>Transaction records are retained for 6 years for tax and audit purposes.</li>
              <li>Usage data and analytics are retained in anonymised form indefinitely.</li>
            </ul>
          </section>

          {/* Contact Information for Data Requests */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              8. Contact Information for Data Requests
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To exercise any of your data protection rights, or if you have questions about this
              Privacy Policy, please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-700 leading-relaxed">
              <p className="font-semibold mb-1">Data Protection Officer</p>
              <p>Seb &amp; Bayor Pharmacy</p>
              <p>123 Pharmacy Avenue, Lagos, Nigeria</p>
              <p>
                Email:{' '}
                <a
                  href="mailto:privacy@sebandbayor.com"
                  className="text-teal-600 underline hover:text-teal-800"
                >
                  privacy@sebandbayor.com
                </a>
              </p>
              <p>Phone: +234 800 000 0000</p>
            </div>
            <p className="text-gray-700 leading-relaxed mt-4">
              We will respond to your request within 30 days. If you are unsatisfied with our
              response, you may lodge a complaint with the National Information Technology
              Development Agency (NITDA).
            </p>
          </section>

          {/* Updates to This Policy */}
          <section>
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              9. Updates to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our
              practices, legal requirements, or Services. When we make material changes, we will
              notify you by posting the updated policy on our website and updating the
              &ldquo;Last updated&rdquo; date above.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We encourage you to review this policy periodically to stay informed about how we
              protect your data.
            </p>
          </section>
        </article>
      </div>
    </section>
  )
}
