// Format Indian Rupee currency
export const formatINR = (amount, compact = false) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = Number(amount);
  if (isNaN(num)) return '₹0';

  if (compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(0)}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

// Format date into readable Indian standard format (e.g., 15 Nov 2026)
export const formatDate = (dateString) => {
  if (!dateString) return 'Immediate';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Major Indian metropolitan cities for real estate
export const INDIAN_CITIES = [
  { name: 'Bengaluru', state: 'Karnataka', tag: 'Silicon Valley of India', icon: 'bi-building' },
  { name: 'Mumbai', state: 'Maharashtra', tag: 'Financial Capital', icon: 'bi-water' },
  { name: 'Delhi', state: 'Delhi', tag: 'National Capital Region', icon: 'bi-bank' },
  { name: 'Gurgaon', state: 'Haryana', tag: 'Millennium City', icon: 'bi-buildings' },
  { name: 'Hyderabad', state: 'Telangana', tag: 'Cyberabad Tech Hub', icon: 'bi-laptop' },
  { name: 'Pune', state: 'Maharashtra', tag: 'Oxford of the East', icon: 'bi-mortarboard' },
  { name: 'Chennai', state: 'Tamil Nadu', tag: 'Automobile & IT Hub', icon: 'bi-compass' },
  { name: 'Noida', state: 'Uttar Pradesh', tag: 'Expressway City', icon: 'bi-geo-alt' }
];

export const PROPERTY_TYPES = [
  'Apartment / Flat',
  'Independent House / Villa',
  'Builder Floor',
  'Studio / 1 RK',
  'Penthouse',
  'PG / Co-Living'
];

export const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

export const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

export const PREFERRED_TENANTS = [
  'Anyone',
  'Family Only',
  'Bachelors / Professionals',
  'Company Lease'
];

export const AMENITIES_LIST = [
  '24/7 Security & CCTV',
  '100% Power Backup',
  'Covered Car Parking',
  'Elevator / Lift',
  'Swimming Pool',
  'Gymnasium & Yoga Deck',
  'Clubhouse',
  'Childrens Play Area',
  'Modular Kitchen',
  'Piped Gas Connection',
  'Wi-Fi Ready',
  'Balcony with View',
  'Air Conditioning',
  'Rainwater Harvesting',
  'Vastu Compliant',
  'Private Garden / Lawn'
];
