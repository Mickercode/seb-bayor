import Link from 'next/link'
import {
  ShieldCheck,
  HeartPulse,
  Globe,
  Lightbulb,
  Scale,
  ArrowRight,
  Award,
  Building2,
  FileCheck,
} from 'lucide-react'

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Seb & Bayor Pharmaceutical Ltd — our story, mission, values, and team.',
}

const coreValues = [
  {
    icon: ShieldCheck,
    label: 'Trust',
    description:
      'We earn confidence through transparency, consistency, and accountability in every interaction.',
  },
  {
    icon: HeartPulse,
    label: 'Patient Safety',
    description:
      'Every decision we make prioritises the health and wellbeing of the patients we serve.',
  },
  {
    icon: Globe,
    label: 'Accessibility',
    description:
      'We work to ensure quality pharmaceutical care reaches every Nigerian, regardless of location.',
  },
  {
    icon: Lightbulb,
    label: 'Innovation',
    description:
      'We embrace technology and creative solutions to modernise healthcare delivery across Nigeria.',
  },
  {
    icon: Scale,
    label: 'Integrity',
    description:
      'We uphold the highest ethical standards in pharmaceutical practice, without compromise.',
  },
]

const founders = [
  {
    name: 'Pharm. Sebastian Okonkwo',
    title: 'Co-Founder & Managing Director',
    credentials: 'B.Pharm, M.Sc Clinical Pharmacy, FPCPharm',
    bio: 'Sebastian brings over 15 years of pharmaceutical experience spanning community pharmacy, hospital practice, and regulatory affairs. His passion for improving medication access in underserved communities drove the founding of Seb & Bayor. He leads the company\u2019s clinical strategy and regulatory compliance initiatives.',
  },
  {
    name: 'Pharm. Bayonle Adeyemi',
    title: 'Co-Founder & Director of Operations',
    credentials: 'B.Pharm, MBA Healthcare Management, PCN',
    bio: 'Bayonle\u2019s background in healthcare operations and supply chain management ensures that Seb & Bayor delivers on its promise of accessibility. With a decade of experience in pharmaceutical distribution and digital health, she oversees the company\u2019s day-to-day operations, supply chain, and technology platforms.',
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* ── Company Story ── */}
      <section className="section-padding bg-teal-50">
        <div className="container-max">
          <h1 className="font-heading text-4xl md:text-5xl text-teal-500 mb-6">
            Our Story
          </h1>
          <div className="max-w-3xl space-y-5 text-gray-700 text-lg leading-relaxed">
            <p>
              We started Seb&nbsp;&amp;&nbsp;Bayor because we saw a gap that
              shouldn&rsquo;t exist. In a country of over 200&nbsp;million
              people, access to quality pharmaceutical care remains unevenly
              distributed. Millions of Nigerians still struggle to find
              genuine medications, receive proper counselling on their
              prescriptions, or connect with a pharmacist when they need one
              most.
            </p>
            <p>
              We&rsquo;d spent years working across community pharmacies,
              hospital settings, and supply chains&nbsp;&mdash; and we kept
              seeing the same problems: counterfeit drugs slipping through
              weak channels, patients self-medicating because professional
              advice wasn&rsquo;t accessible, and communities outside Lagos
              and Abuja being left behind entirely.
            </p>
            <p>
              So we built Seb&nbsp;&amp;&nbsp;Bayor to be different. Not just
              another pharmacy, but an integrated pharmaceutical care company
              that combines rigorous clinical standards with the convenience
              modern Nigerians deserve. From our PCN-registered retail
              operations to our digital health tools, everything we do is
              designed around one idea: every Nigerian should have access to
              safe, effective medications and the professional guidance to use
              them properly.
            </p>
            <p className="font-medium text-teal-600">
              This is personal to us&nbsp;&mdash; and we&rsquo;re just
              getting started.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="font-heading text-3xl md:text-4xl text-gray-900 text-center mb-12">
            Mission &amp; Vision
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="rounded-zone border border-teal-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-500">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-teal-500">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To improve health outcomes for Nigerians by providing safe,
                effective, and accessible pharmaceutical care through a
                patient-centered approach, powered by innovation and anchored
                in evidence-based practice.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-zone border border-teal-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-mint-100 text-mint-700">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl text-teal-500">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To become Nigeria&rsquo;s most trusted integrated healthcare
                company&nbsp;&mdash; connecting communities to quality
                medicines, professional pharmaceutical care, and digital
                health solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <h2 className="font-heading text-3xl md:text-4xl text-gray-900 text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.label}
                className="flex flex-col items-center text-center bg-white rounded-zone border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 text-teal-500 mb-4">
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-lg text-gray-900 mb-2">
                  {value.label}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership / Founders ── */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="font-heading text-3xl md:text-4xl text-gray-900 text-center mb-12">
            Meet Our Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start gap-6"
              >
                {/* Placeholder photo */}
                <div className="w-36 h-36 flex-shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500 text-xs uppercase tracking-wide">
                    Photo
                  </span>
                </div>

                <div>
                  <h3 className="font-heading text-xl text-teal-500">
                    {founder.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {founder.title}
                  </p>
                  <p className="text-xs text-teal-600 mt-0.5">
                    {founder.credentials}
                  </p>
                  <p className="text-gray-600 leading-relaxed mt-3 text-sm">
                    {founder.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regulatory Credentials ── */}
      <section className="section-padding bg-teal-50">
        <div className="container-max">
          <h2 className="font-heading text-3xl md:text-4xl text-gray-900 text-center mb-12">
            Regulatory Credentials
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* PCN */}
            <div className="flex flex-col items-center text-center bg-white rounded-zone border border-teal-200 p-6 shadow-sm">
              <Award className="w-10 h-10 text-teal-500 mb-3" />
              <h3 className="font-heading text-lg text-gray-900 mb-1">
                PCN Registered
              </h3>
              <p className="text-sm text-gray-600">
                Pharmacists Council of Nigeria
              </p>
              <p className="text-xs text-teal-600 mt-2 font-mono">
                Reg. No: PCN/XXXX/XXXX
              </p>
            </div>

            {/* CAC */}
            <div className="flex flex-col items-center text-center bg-white rounded-zone border border-teal-200 p-6 shadow-sm">
              <Building2 className="w-10 h-10 text-teal-500 mb-3" />
              <h3 className="font-heading text-lg text-gray-900 mb-1">
                CAC Registered
              </h3>
              <p className="text-sm text-gray-600">
                Corporate Affairs Commission
              </p>
              <p className="text-xs text-teal-600 mt-2 font-mono">
                RC: XXXXXXX
              </p>
            </div>

            {/* NAFDAC */}
            <div className="flex flex-col items-center text-center bg-white rounded-zone border border-teal-200 p-6 shadow-sm">
              <FileCheck className="w-10 h-10 text-teal-500 mb-3" />
              <h3 className="font-heading text-lg text-gray-900 mb-1">
                NAFDAC Compliant
              </h3>
              <p className="text-sm text-gray-600">
                All products sourced and stored in full compliance with
                NAFDAC regulations and Good Distribution Practice (GDP)
                standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-teal-500">
        <div className="container-max text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            Ready to experience better pharmaceutical care?
          </h2>
          <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need to order medications or simply want to learn
            more, we&rsquo;re here for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="btn-accent inline-flex items-center gap-2"
            >
              Order Medications
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="btn-outline inline-flex items-center gap-2 border-white text-white hover:bg-white hover:text-teal-500"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
