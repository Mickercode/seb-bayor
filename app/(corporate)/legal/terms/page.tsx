import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Seb & Bayor Pharmacy',
  description:
    'Terms and conditions governing the use of Seb & Bayor Pharmacy services, including ordering, prescriptions, delivery, and returns.',
}

export default function TermsOfServicePage() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: March 2026
          </p>

          {/* Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing or using the Seb &amp; Bayor Pharmacy website, mobile applications, or
              any of our services (collectively, the &ldquo;Services&rdquo;), you agree to be
              bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these
              Terms, please do not use our Services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the
              Services after changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          {/* Services Description */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              2. Services Description
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Seb &amp; Bayor Pharmacy provides retail and online pharmacy services, including but
              not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Dispensing of prescription and over-the-counter (OTC) medications</li>
              <li>Online medication ordering through our AnythingDrugs e-pharmacy platform</li>
              <li>Pharmacist consultations and drug information services</li>
              <li>Prescription review and verification</li>
              <li>Health and wellness product sales</li>
              <li>Medication delivery services</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              3. Account Registration
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our Services, you may be required to create an
              account. When registering, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information as needed</li>
              <li>Keep your login credentials secure and confidential</li>
              <li>Accept responsibility for all activity under your account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or
              contain fraudulent information.
            </p>
          </section>

          {/* Ordering and Payment */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              4. Ordering and Payment
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All prices are displayed in Nigerian Naira (NGN) and are inclusive of applicable
              taxes unless stated otherwise. We reserve the right to change prices at any time
              without prior notice.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Orders are subject to product availability and pharmacist verification.</li>
              <li>Payment is processed securely through Paystack. We accept bank transfers,
                debit/credit cards, and other supported payment methods.</li>
              <li>An order is confirmed only after successful payment and pharmacist review
                (where applicable).</li>
              <li>We reserve the right to cancel orders if we suspect fraud, pricing errors, or
                regulatory non-compliance.</li>
            </ul>
          </section>

          {/* Prescription Policy */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              5. Prescription Policy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In compliance with the Pharmacists Council of Nigeria (PCN) regulations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Prescription-only medications (Rx items)</strong> require a valid
                prescription from a licensed healthcare provider before they can be dispensed.
              </li>
              <li>Prescriptions must be uploaded or presented before or at the time of order
                processing.</li>
              <li>All prescriptions are reviewed and verified by our registered pharmacists
                before dispensing.</li>
              <li>We reserve the right to refuse dispensing if a prescription is invalid,
                expired, or raises safety concerns.</li>
              <li>Over-the-counter (OTC) medications may be purchased without a prescription,
                subject to pharmacist guidance on appropriate use.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our pharmacists may contact you or your prescribing doctor to clarify or verify
              prescription details. This is a regulatory requirement and is done to ensure your
              safety.
            </p>
          </section>

          {/* Delivery */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              6. Delivery
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Delivery is available within our supported service areas. Coverage areas and
                estimated delivery times are displayed at checkout.</li>
              <li>Delivery fees vary based on location and order value. Free delivery may be
                available for qualifying orders.</li>
              <li>You are responsible for providing an accurate delivery address and ensuring
                someone is available to receive the order.</li>
              <li>Certain medications may require temperature-controlled delivery. We take
                appropriate measures to maintain product integrity during transit.</li>
              <li>Risk of loss passes to you upon delivery. If an order is lost or damaged in
                transit, please contact us within 48 hours.</li>
            </ul>
          </section>

          {/* Returns and Refunds */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              7. Returns and Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We want you to be satisfied with your purchase. Our returns and refunds policy is as
              follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>
                <strong>Damaged or incorrect items:</strong> If you receive a damaged or
                incorrect product, contact us within 48 hours of delivery. We will arrange a
                replacement or full refund at no additional cost.
              </li>
              <li>
                <strong>Quality concerns:</strong> If you have concerns about product quality,
                contact us immediately. We will investigate and provide a resolution.
              </li>
              <li>
                <strong>Change of mind:</strong> Unopened, sealed products in their original
                packaging may be returned within 7 days of delivery for a refund, excluding
                delivery charges.
              </li>
              <li>
                <strong>Non-returnable items:</strong> For safety and regulatory reasons, the
                following cannot be returned: opened medications, prescription items that have
                been dispensed, cold-chain products, and items with broken tamper-evident seals.
              </li>
              <li>
                <strong>Refund processing:</strong> Approved refunds are processed within 5
                to 10 business days to the original payment method.
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To initiate a return or refund, please contact our customer support team with your
              order number and reason for the request.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by Nigerian law:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Seb &amp; Bayor Pharmacy shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of the
                Services.</li>
              <li>Our total liability for any claim arising from the Services shall not exceed
                the amount you paid for the specific product or service giving rise to the
                claim.</li>
              <li>We are not liable for delays or failures in performance resulting from
                circumstances beyond our reasonable control, including natural disasters,
                government actions, or supply chain disruptions.</li>
              <li>The information provided through our Services is not a substitute for
                professional medical advice, diagnosis, or treatment.</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              9. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the
              Federal Republic of Nigeria. Any disputes arising from these Terms or your use of
              the Services shall be subject to the exclusive jurisdiction of the courts of Lagos
              State, Nigeria.
            </p>
            <p className="text-gray-700 leading-relaxed">
              In the event of any conflict between these Terms and applicable Nigerian law,
              the provisions of the applicable law shall prevail.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              10. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions, concerns, or complaints regarding these Terms of Service, please
              contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-700 leading-relaxed">
              <p className="font-semibold mb-1">Seb &amp; Bayor Pharmacy</p>
              <p>123 Pharmacy Avenue, Lagos, Nigeria</p>
              <p>
                Email:{' '}
                <a
                  href="mailto:support@sebandbayor.com"
                  className="text-teal-600 underline hover:text-teal-800"
                >
                  support@sebandbayor.com
                </a>
              </p>
              <p>Phone: +234 800 000 0000</p>
            </div>
          </section>
        </article>
      </div>
    </section>
  )
}
