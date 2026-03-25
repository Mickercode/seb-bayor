import Link from 'next/link'
import {
  ShieldCheck,
  Stethoscope,
  Pill,
  HeartPulse,
  MonitorSmartphone,
  Users,
  ClipboardCheck,
  Truck,
  Phone,
  Star,
  Building2,
  BadgeCheck,
  Smartphone,
  FileText,
  MessageCircle,
  Activity,
} from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative bg-gradient-to-br from-teal-500 to-teal-700 text-white">
        <div className="container-max section-padding py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6">
              Trusted Pharmacy &amp; Digital Health Solutions in Nigeria
            </h1>
            <p className="text-lg md:text-xl text-teal-100 mb-10 leading-relaxed">
              Patient-centered care through retail, digital, and professional pharmacy services.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact" className="btn-accent text-sm px-8 py-3.5 font-bold">
                Visit Our Pharmacy
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-sm bg-white text-teal-700 rounded-[var(--radius)] hover:bg-gray-100 transition-colors"
              >
                Order Online
              </Link>
              <a
                href="https://wa.me/234XXXXXXXXXX?text=Hello%2C+I+need+to+speak+with+a+pharmacist."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-sm border-2 border-white text-white rounded-[var(--radius)] hover:bg-white/10 transition-colors"
              >
                <Phone size={16} />
                Speak to a Pharmacist
              </a>
            </div>
          </div>
        </div>
        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 50C480 40 240 10 0 30L0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ========== SERVICES GRID ========== */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive pharmacy and healthcare services designed to meet your needs — in-store and online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard
              icon={<Pill size={32} />}
              title="Retail Pharmacy"
              description="Walk-in dispensing, OTC medications, health products, and medication counseling at our physical location."
              href="/services/retail-pharmacy"
            />
            <ServiceCard
              icon={<MonitorSmartphone size={32} />}
              title="E-Pharmacy"
              description="Order medications online through AnythingDrugs — our pharmacist-verified e-commerce platform."
              href="/services/e-pharmacy"
              accent
            />
            <ServiceCard
              icon={<ClipboardCheck size={32} />}
              title="Drug Information"
              description="Professional drug counseling, medication safety guidance, and public health information resources."
              href="/services/drug-information"
            />
            <ServiceCard
              icon={<Stethoscope size={32} />}
              title="Health Consultations"
              description="Minor ailment management, medication therapy management, and chronic disease support."
              href="/services/consultations"
            />
          </div>
        </div>
      </section>

      {/* ========== DIGITAL HEALTH PREVIEW ========== */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              Digital Health Innovation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Leveraging technology to make quality healthcare accessible to every Nigerian.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <DigitalFeature
              icon={<Phone size={28} />}
              title="Telepharmacy"
              description="Remote consultations via phone or video with our registered pharmacists."
            />
            <DigitalFeature
              icon={<FileText size={28} />}
              title="Online Rx Review"
              description="Upload prescriptions digitally for pharmacist verification and processing."
            />
            <DigitalFeature
              icon={<MessageCircle size={28} />}
              title="Pharmacist Chat"
              description="Get medication guidance through WhatsApp from qualified pharmacists."
            />
            <DigitalFeature
              icon={<Activity size={28} />}
              title="Platform Integration"
              description="Seamless connection between our physical pharmacy and online services."
            />
          </div>

          <div className="text-center mt-10">
            <Link href="/digital-health" className="btn-primary">
              Explore Digital Health
            </Link>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-gray-900 mb-3">
              Why Choose Seb &amp; Bayor
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <TrustItem
              icon={<ShieldCheck size={28} />}
              label="Licensed & Regulated Pharmacy Practice"
            />
            <TrustItem
              icon={<HeartPulse size={28} />}
              label="Patient-Centered, Evidence-Based Care"
            />
            <TrustItem
              icon={<Truck size={28} />}
              label="Reliable Access to Quality Medicines"
            />
            <TrustItem
              icon={<MonitorSmartphone size={28} />}
              label="Convenient Online & Offline Services"
            />
            <TrustItem
              icon={<BadgeCheck size={28} />}
              label="PCN-Registered Pharmacists"
            />
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="section-padding bg-teal-500 text-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-3">
              What Our Patients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Seb & Bayor has been my go-to pharmacy for over a year. The pharmacists are knowledgeable and always take time to explain my medications."
              name="Adunni O."
              role="Patient"
            />
            <TestimonialCard
              quote="I ordered my mother's medications through AnythingDrugs and they arrived the same day. The prescription review process was seamless."
              name="Chidi E."
              role="Caregiver"
            />
            <TestimonialCard
              quote="As a healthcare professional, I appreciate the drug information services they provide. It's a reliable resource for both patients and colleagues."
              name="Dr. Fatima A."
              role="Physician"
            />
          </div>
        </div>
      </section>

      {/* ========== TRUST BANNER ========== */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            <div className="flex flex-col items-center">
              <Building2 size={32} className="text-teal-500 mb-2" />
              <span className="text-sm font-semibold text-gray-700">PCN Registered</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck size={32} className="text-teal-500 mb-2" />
              <span className="text-sm font-semibold text-gray-700">NAFDAC Compliant</span>
            </div>
            <div className="flex flex-col items-center">
              <BadgeCheck size={32} className="text-teal-500 mb-2" />
              <span className="text-sm font-semibold text-gray-700">CAC Registered</span>
            </div>
            <div className="flex flex-col items-center">
              <Users size={32} className="text-teal-500 mb-2" />
              <span className="text-sm font-semibold text-gray-700">Trusted by Patients</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-8 max-w-2xl mx-auto">
            This platform does not replace professional medical diagnosis or treatment.
            Always consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold font-heading text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Whether you need to visit our pharmacy, order medications online, or speak with a pharmacist — we are here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary px-8 py-3.5">
              Shop AnythingDrugs
            </Link>
            <Link href="/contact" className="btn-outline px-8 py-3.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ========== Sub-components ========== */

function ServiceCard({
  icon,
  title,
  description,
  href,
  accent,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  accent?: boolean
}) {
  return (
    <Link
      href={href}
      className={`group block p-6 rounded-lg border transition-all hover:shadow-lg ${
        accent
          ? 'bg-mint-50 border-mint-200 hover:border-mint-400'
          : 'bg-white border-gray-200 hover:border-teal-300'
      }`}
    >
      <div className={`mb-4 ${accent ? 'text-mint-600' : 'text-teal-500'}`}>{icon}</div>
      <h3 className="text-lg font-bold font-heading text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </Link>
  )
}

function DigitalFeature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-600 mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

function TrustItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-teal-500 mb-3">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string
  name: string
  role: string
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={16} fill="currentColor" className="text-yellow-300" />
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-4 text-teal-50">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold text-sm">{name}</p>
        <p className="text-xs text-teal-200">{role}</p>
      </div>
    </div>
  )
}
