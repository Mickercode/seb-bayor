import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ========== CATEGORIES ==========
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Prescription Medications', slug: 'prescription', icon: 'Pill' },
    }),
    prisma.category.create({
      data: { name: 'Over-the-Counter (OTC)', slug: 'otc', icon: 'ShoppingBag' },
    }),
    prisma.category.create({
      data: { name: 'Vitamins & Supplements', slug: 'vitamins', icon: 'Apple' },
    }),
    prisma.category.create({
      data: { name: 'Personal Care', slug: 'personal-care', icon: 'Heart' },
    }),
    prisma.category.create({
      data: { name: 'Baby Care', slug: 'baby-care', icon: 'Baby' },
    }),
    prisma.category.create({
      data: { name: 'Medical Devices', slug: 'medical-devices', icon: 'Activity' },
    }),
  ])

  const [prescription, otc, vitamins, personalCare, babyCare, devices] = categories

  // ========== PRODUCTS ==========
  const products = [
    // Prescription Medications
    {
      nameGeneric: 'Amoxicillin',
      nameBrand: 'Amoxil',
      slug: 'amoxicillin-500mg',
      description: 'A broad-spectrum antibiotic used to treat a variety of bacterial infections including respiratory tract infections, urinary tract infections, and skin infections.',
      indications: 'Bacterial infections of the ear, nose, throat, urinary tract, and skin.',
      dosageGuidance: '500mg every 8 hours for 7-10 days. Always complete the full course as prescribed.',
      warnings: 'Do not use if allergic to penicillin. May cause diarrhoea, nausea, or skin rash. Inform your pharmacist of all other medications.',
      storage: 'Store below 25°C in a dry place. Keep out of reach of children.',
      price: 1500,
      categoryId: prescription.id,
      requiresPrescription: true,
      stockQty: 200,
      images: '[]',
      nafdacNumber: 'A4-0012',
      brand: 'GlaxoSmithKline',
    },
    {
      nameGeneric: 'Metformin',
      nameBrand: 'Glucophage',
      slug: 'metformin-500mg',
      description: 'An oral diabetes medication that helps control blood sugar levels. Used to treat type 2 diabetes.',
      indications: 'Type 2 diabetes mellitus, either alone or in combination with other medications.',
      dosageGuidance: '500mg twice daily with meals. Dose may be increased gradually as directed by your doctor.',
      warnings: 'Do not use in severe kidney disease. May cause stomach upset initially. Avoid excessive alcohol.',
      storage: 'Store below 30°C. Protect from moisture.',
      price: 2000,
      categoryId: prescription.id,
      requiresPrescription: true,
      stockQty: 150,
      images: '[]',
      nafdacNumber: 'A4-0234',
      brand: 'Merck',
    },
    {
      nameGeneric: 'Amlodipine',
      nameBrand: 'Norvasc',
      slug: 'amlodipine-5mg',
      description: 'A calcium channel blocker used to treat high blood pressure and chest pain (angina).',
      indications: 'Hypertension and chronic stable angina.',
      dosageGuidance: '5mg once daily. Maximum dose 10mg daily.',
      warnings: 'May cause ankle swelling, dizziness, or flushing. Do not stop suddenly without consulting your doctor.',
      storage: 'Store below 30°C in original packaging.',
      price: 1800,
      categoryId: prescription.id,
      requiresPrescription: true,
      stockQty: 180,
      images: '[]',
      nafdacNumber: 'A4-0567',
      brand: 'Pfizer',
    },
    {
      nameGeneric: 'Ciprofloxacin',
      nameBrand: 'Ciprotab',
      slug: 'ciprofloxacin-500mg',
      description: 'A fluoroquinolone antibiotic effective against a wide range of bacterial infections.',
      indications: 'Urinary tract infections, respiratory infections, gastrointestinal infections, and skin infections.',
      dosageGuidance: '500mg twice daily for 7-14 days as prescribed.',
      warnings: 'Not recommended for children under 18. May cause tendon problems. Avoid dairy products within 2 hours of taking.',
      storage: 'Store below 25°C. Protect from light.',
      price: 2500,
      categoryId: prescription.id,
      requiresPrescription: true,
      stockQty: 120,
      images: '[]',
      nafdacNumber: 'A4-0891',
      brand: 'Fidson Healthcare',
    },

    // OTC Medications
    {
      nameGeneric: 'Paracetamol',
      nameBrand: 'Panadol',
      slug: 'paracetamol-500mg',
      description: 'A widely used pain reliever and fever reducer. Safe and effective for mild to moderate pain.',
      indications: 'Headache, toothache, muscle pain, menstrual cramps, cold and flu symptoms, fever.',
      dosageGuidance: '500mg to 1000mg every 4-6 hours. Maximum 4000mg in 24 hours.',
      warnings: 'Do not exceed recommended dose. Avoid alcohol. Not suitable for patients with severe liver disease.',
      storage: 'Store below 25°C in a dry place.',
      price: 200,
      categoryId: otc.id,
      requiresPrescription: false,
      stockQty: 500,
      images: '[]',
      nafdacNumber: 'A4-1001',
      brand: 'GlaxoSmithKline',
    },
    {
      nameGeneric: 'Ibuprofen',
      nameBrand: 'Nurofen',
      slug: 'ibuprofen-400mg',
      description: 'A non-steroidal anti-inflammatory drug (NSAID) for pain relief and reducing inflammation.',
      indications: 'Headache, dental pain, muscular pain, arthritis, menstrual cramps, fever.',
      dosageGuidance: '200-400mg every 4-6 hours with food. Maximum 1200mg in 24 hours.',
      warnings: 'Take with food to reduce stomach irritation. Not recommended for those with stomach ulcers or asthma triggered by NSAIDs.',
      storage: 'Store below 25°C.',
      price: 350,
      categoryId: otc.id,
      requiresPrescription: false,
      stockQty: 400,
      images: '[]',
      nafdacNumber: 'A4-1023',
      brand: 'Reckitt Benckiser',
    },
    {
      nameGeneric: 'Loratadine',
      nameBrand: 'Loratyn',
      slug: 'loratadine-10mg',
      description: 'A non-drowsy antihistamine for the relief of allergy symptoms.',
      indications: 'Hay fever, allergic rhinitis, hives, and other allergic conditions.',
      dosageGuidance: '10mg once daily. Can be taken with or without food.',
      warnings: 'Consult pharmacist if pregnant or breastfeeding. May rarely cause drowsiness.',
      storage: 'Store below 30°C.',
      price: 500,
      categoryId: otc.id,
      requiresPrescription: false,
      stockQty: 300,
      images: '[]',
      nafdacNumber: 'A4-1045',
      brand: 'Emzor Pharmaceuticals',
    },
    {
      nameGeneric: 'Oral Rehydration Salts',
      nameBrand: 'ORS',
      slug: 'ors-sachets',
      description: 'Essential oral rehydration therapy for the treatment and prevention of dehydration due to diarrhoea.',
      indications: 'Dehydration from diarrhoea, vomiting, or excessive sweating.',
      dosageGuidance: 'Dissolve one sachet in 1 litre of clean drinking water. Sip frequently.',
      warnings: 'Use only clean water. Discard unused solution after 24 hours.',
      storage: 'Store in a cool, dry place.',
      price: 100,
      categoryId: otc.id,
      requiresPrescription: false,
      stockQty: 600,
      images: '[]',
      nafdacNumber: 'A4-1100',
      brand: 'Emzor Pharmaceuticals',
    },
    {
      nameGeneric: 'Artemether/Lumefantrine',
      nameBrand: 'Coartem',
      slug: 'coartem-tablets',
      description: 'An antimalarial combination therapy for the treatment of uncomplicated malaria.',
      indications: 'Acute uncomplicated Plasmodium falciparum malaria.',
      dosageGuidance: 'Adults: 4 tablets initially, then 4 tablets at 8, 24, 36, 48 and 60 hours. Take with food.',
      warnings: 'Complete the full course. Not for prevention. Seek medical attention for severe malaria symptoms.',
      storage: 'Store below 30°C. Protect from moisture.',
      price: 1200,
      categoryId: otc.id,
      requiresPrescription: false,
      stockQty: 350,
      images: '[]',
      nafdacNumber: 'A4-1150',
      brand: 'Novartis',
    },

    // Vitamins & Supplements
    {
      nameGeneric: 'Vitamin C',
      nameBrand: 'Nature\'s Bounty Vitamin C',
      slug: 'vitamin-c-1000mg',
      description: 'High-strength vitamin C supplement to support immune function and overall health.',
      indications: 'Immune support, antioxidant protection, skin health, iron absorption.',
      dosageGuidance: '1 tablet daily with a meal.',
      warnings: 'High doses may cause stomach upset. Consult pharmacist if on blood thinners.',
      storage: 'Store in a cool, dry place. Keep bottle tightly closed.',
      price: 3500,
      categoryId: vitamins.id,
      requiresPrescription: false,
      stockQty: 200,
      images: '[]',
      brand: "Nature's Bounty",
    },
    {
      nameGeneric: 'Multivitamin',
      nameBrand: 'Centrum Adults',
      slug: 'centrum-multivitamin',
      description: 'Complete multivitamin and mineral supplement for adults to support daily nutritional needs.',
      indications: 'General nutritional supplementation, energy metabolism, immune support.',
      dosageGuidance: '1 tablet daily with food.',
      warnings: 'Do not exceed recommended dose. Not a substitute for a balanced diet.',
      storage: 'Store below 25°C.',
      price: 5000,
      categoryId: vitamins.id,
      requiresPrescription: false,
      stockQty: 150,
      images: '[]',
      brand: 'Haleon',
    },
    {
      nameGeneric: 'Omega-3 Fish Oil',
      nameBrand: 'Seven Seas Omega-3',
      slug: 'omega-3-fish-oil',
      description: 'High-quality fish oil supplement rich in EPA and DHA for heart and brain health.',
      indications: 'Heart health, brain function, joint support, general wellbeing.',
      dosageGuidance: '1-2 capsules daily with meals.',
      warnings: 'Consult pharmacist if on blood-thinning medication. May cause fishy aftertaste.',
      storage: 'Store in a cool, dry place.',
      price: 4500,
      categoryId: vitamins.id,
      requiresPrescription: false,
      stockQty: 100,
      images: '[]',
      brand: 'Seven Seas',
    },

    // Personal Care
    {
      nameGeneric: 'Chlorhexidine Mouthwash',
      nameBrand: 'Oracure Mouthwash',
      slug: 'chlorhexidine-mouthwash',
      description: 'Antiseptic mouthwash for oral hygiene, gum disease prevention, and mouth ulcer treatment.',
      indications: 'Gingivitis, mouth ulcers, oral hygiene maintenance, post-dental procedure care.',
      dosageGuidance: 'Rinse with 10ml for 1 minute, twice daily. Do not swallow.',
      warnings: 'May cause temporary staining of teeth with prolonged use. Do not use for more than 2 weeks continuously.',
      storage: 'Store at room temperature.',
      price: 1500,
      categoryId: personalCare.id,
      requiresPrescription: false,
      stockQty: 200,
      images: '[]',
      brand: 'Oracure',
    },
    {
      nameGeneric: 'Sunscreen SPF 50',
      nameBrand: 'Neutrogena Ultra Sheer',
      slug: 'sunscreen-spf50',
      description: 'Broad spectrum sunscreen with SPF 50 protection against UVA and UVB rays.',
      indications: 'Sun protection, prevention of sunburn, anti-ageing skin care.',
      dosageGuidance: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
      warnings: 'For external use only. Avoid contact with eyes. Discontinue if irritation occurs.',
      storage: 'Store below 30°C. Keep away from direct sunlight.',
      price: 6500,
      categoryId: personalCare.id,
      requiresPrescription: false,
      stockQty: 80,
      images: '[]',
      brand: 'Neutrogena',
    },

    // Baby Care
    {
      nameGeneric: 'Infant Paracetamol Suspension',
      nameBrand: 'Calpol',
      slug: 'calpol-infant-suspension',
      description: 'Sugar-free paracetamol suspension for babies and children for pain and fever relief.',
      indications: 'Fever, teething pain, post-vaccination fever, earache, headache in infants.',
      dosageGuidance: '2.5ml for 3-6 months, 5ml for 6-24 months. Every 4-6 hours. Max 4 doses in 24 hours.',
      warnings: 'Do not give to babies under 2 months unless advised by doctor. Use the measuring syringe provided.',
      storage: 'Store below 25°C. Do not refrigerate.',
      price: 1200,
      categoryId: babyCare.id,
      requiresPrescription: false,
      stockQty: 250,
      images: '[]',
      brand: 'Johnson & Johnson',
    },
    {
      nameGeneric: 'Zinc Sulphate Oral Solution',
      nameBrand: 'Zinkid',
      slug: 'zinc-oral-solution-paediatric',
      description: 'Zinc supplement for children to support diarrhoea treatment and immune function.',
      indications: 'Adjunct treatment of acute diarrhoea in children, zinc deficiency.',
      dosageGuidance: 'Children under 6 months: 10mg daily. Over 6 months: 20mg daily for 10-14 days.',
      warnings: 'May cause nausea if taken on empty stomach. Give with food if needed.',
      storage: 'Store below 25°C. Protect from light.',
      price: 800,
      categoryId: babyCare.id,
      requiresPrescription: false,
      stockQty: 300,
      images: '[]',
      brand: 'Emzor Pharmaceuticals',
    },

    // Medical Devices
    {
      nameGeneric: 'Digital Blood Pressure Monitor',
      nameBrand: 'Omron M2 Basic',
      slug: 'omron-blood-pressure-monitor',
      description: 'Clinically validated automatic blood pressure monitor for home use. Easy to use with one-button operation.',
      indications: 'Home monitoring of blood pressure for hypertension management.',
      dosageGuidance: 'Wrap cuff on upper arm. Sit quietly for 5 minutes before measuring. Take 2-3 readings.',
      warnings: 'Not a substitute for regular medical check-ups. Consult your doctor about your readings.',
      storage: 'Store in a clean, dry place. Remove batteries if not in use for extended periods.',
      price: 18000,
      categoryId: devices.id,
      requiresPrescription: false,
      stockQty: 30,
      images: '[]',
      brand: 'Omron',
    },
    {
      nameGeneric: 'Blood Glucose Monitor',
      nameBrand: 'Accu-Chek Active',
      slug: 'accu-chek-glucose-monitor',
      description: 'Reliable blood glucose monitoring system for diabetes management at home.',
      indications: 'Self-monitoring of blood glucose levels in diabetes patients.',
      dosageGuidance: 'Follow the included instructions. Use test strips compatible with this device only.',
      warnings: 'For in vitro diagnostic use only. Results may vary with altitude, temperature, and humidity.',
      storage: 'Store monitor at room temperature. Keep test strips sealed until use.',
      price: 15000,
      categoryId: devices.id,
      requiresPrescription: false,
      stockQty: 25,
      images: '[]',
      brand: 'Roche',
    },
    {
      nameGeneric: 'Digital Thermometer',
      nameBrand: 'Braun ThermoScan',
      slug: 'digital-thermometer',
      description: 'Fast and accurate digital thermometer for measuring body temperature.',
      indications: 'Temperature measurement for fever detection.',
      dosageGuidance: 'Place under tongue or in armpit. Wait for beep. Read display.',
      warnings: 'Clean with alcohol wipe after each use. Replace battery when display dims.',
      storage: 'Store in protective case.',
      price: 3500,
      categoryId: devices.id,
      requiresPrescription: false,
      stockQty: 50,
      images: '[]',
      brand: 'Braun',
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${products.length} products`)

  // ========== ADMIN USER ==========
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.create({
    data: {
      email: 'admin@sebandbayor.com',
      fullName: 'Admin Pharmacist',
      phone: '+2348000000000',
      role: 'ADMIN',
      password: hashedPassword,
    },
  })
  console.log('Created admin user (admin@sebandbayor.com / admin123)')

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
