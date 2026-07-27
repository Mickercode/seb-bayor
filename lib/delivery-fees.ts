// Delivery fee structure by Nigerian state
const DELIVERY_FEES: Record<string, number> = {
  'Lagos': 1500,
  'Ogun': 2500,
  'Oyo': 3000,
  'Rivers': 3500,
  'Abuja (FCT)': 3000,
  'Kano': 4000,
  'Kaduna': 4000,
  'Enugu': 3500,
  'Delta': 3500,
  'Edo': 3500,
  'Anambra': 3500,
  'Imo': 3500,
  'Abia': 3500,
  'Kwara': 3000,
  'Osun': 3000,
  'Ondo': 3000,
  'Ekiti': 3000,
  'Plateau': 4000,
  'Benue': 4000,
  'Cross River': 4000,
  'Akwa Ibom': 4000,
  'Bayelsa': 4500,
  'Nassarawa': 3500,
  'Niger': 3500,
  'Kogi': 3500,
  'Taraba': 4500,
  'Adamawa': 4500,
  'Bauchi': 4500,
  'Borno': 5000,
  'Gombe': 4500,
  'Yobe': 5000,
  'Jigawa': 4500,
  'Katsina': 4500,
  'Kebbi': 4500,
  'Sokoto': 5000,
  'Zamfara': 5000,
  'Ebonyi': 4000,
}

export const NIGERIAN_STATES = Object.keys(DELIVERY_FEES).sort()

export function getDeliveryFee(state: string): number {
  return DELIVERY_FEES[state] || 4000
}

export function getDeliveryEstimate(state: string): string {
  if (state === 'Lagos') return '2-4 hours (same day)'
  if (['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti'].includes(state)) return '1-2 business days'
  return '2-5 business days'
}
