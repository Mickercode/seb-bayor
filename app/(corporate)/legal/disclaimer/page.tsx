import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Medical Disclaimer | Seb & Bayor Pharmacy',
  description:
    'Medical disclaimer for Seb & Bayor Pharmacy. Our platform does not replace professional medical advice, diagnosis, or treatment.',
}

export default function MedicalDisclaimerPage() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
            Medical Disclaimer
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: March 2026
          </p>

          {/* Not a Substitute */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              This Platform Does Not Replace Professional Medical Care
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information, products, and services provided by Seb &amp; Bayor Pharmacy
              through this website, mobile applications, and related platforms (collectively, the
              &ldquo;Platform&rdquo;) are intended to support &mdash; not replace &mdash; the
              relationship between you and your healthcare provider.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nothing on this Platform should be construed as professional medical advice,
              diagnosis, or treatment. The availability of medications and health products on our
              Platform does not constitute a recommendation for their use without appropriate
              medical guidance.
            </p>
          </section>

          {/* Educational Purposes */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              Information Is for Educational Purposes
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Health-related content on this Platform &mdash; including drug descriptions,
              dosage information, side-effect profiles, health articles, and pharmacist guidance
              &mdash; is provided for general educational and informational purposes only.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This content is not tailored to your individual health circumstances. Individual
              responses to medications vary based on age, weight, medical history, genetics, and
              other factors that only a qualified healthcare professional can properly evaluate.
            </p>
          </section>

          {/* Always Consult a Professional */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              Always Consult a Qualified Healthcare Professional
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Before starting, stopping, or changing any medication or treatment plan, you should
              consult a qualified healthcare professional such as a doctor, pharmacist, or other
              licensed practitioner.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Do not disregard professional medical advice because of information you read
                on this Platform.</li>
              <li>Do not delay seeking medical attention based on information obtained through
                our Services.</li>
              <li>Always inform your healthcare provider about all medications you are taking,
                including over-the-counter products and supplements.</li>
              <li>If you are pregnant, nursing, have a pre-existing condition, or are taking
                other medications, seek professional advice before using any product purchased
                through our Platform.</li>
            </ul>
          </section>

          {/* Drug Information Accuracy */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              Drug Information Accuracy
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              While we make every reasonable effort to ensure that drug information displayed on
              our Platform is accurate, complete, and up to date, we cannot guarantee that it is
              free from errors or omissions.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
              <li>Drug information is sourced from manufacturer data, regulatory databases, and
                professional references, but may not reflect the most recent updates or
                country-specific labelling.</li>
              <li>Product images are for illustrative purposes and may not exactly represent the
                product you receive due to manufacturer packaging changes.</li>
              <li>Our pharmacists review product listings for accuracy, but you should always
                read the product label and patient information leaflet supplied with your
                medication.</li>
              <li>If you notice any discrepancy between information on our Platform and the
                product packaging, follow the product packaging and consult your pharmacist.</li>
            </ul>
          </section>

          {/* Emergency Disclaimer */}
          <section className="mb-10">
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              Emergency Situations
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <p className="text-red-800 font-semibold mb-2">
                This Platform is not designed for medical emergencies.
              </p>
              <p className="text-red-700 leading-relaxed">
                If you are experiencing a medical emergency, a severe allergic reaction, chest
                pain, difficulty breathing, suspected poisoning, or any life-threatening
                condition, please <strong>call emergency services immediately</strong> or go to
                your nearest hospital emergency department. Do not rely on this Platform for
                emergency medical assistance.
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Nigeria emergency numbers: <strong>112</strong> (general emergency) or{' '}
              <strong>199</strong> (fire/ambulance). You may also contact the National Poison
              Information Centre or your local hospital directly.
            </p>
          </section>

          {/* Limitation */}
          <section>
            <h2 className="text-xl font-bold font-heading text-gray-900 mb-3">
              Limitation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Seb &amp; Bayor Pharmacy, its directors, employees, and affiliated pharmacists
              shall not be held liable for any harm, injury, or damages resulting from the use
              or misuse of information provided on this Platform, or from reliance on any
              content, product, or service offered through the Platform.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using this Platform, you acknowledge that you have read and understood this
              Medical Disclaimer and agree to its terms. If you have questions about this
              disclaimer, please contact us at{' '}
              <a
                href="mailto:support@sebandbayor.com"
                className="text-teal-600 underline hover:text-teal-800"
              >
                support@sebandbayor.com
              </a>.
            </p>
          </section>
        </article>
      </div>
    </section>
  )
}
