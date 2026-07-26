export const BUSINESS = {
  name: 'OM Technical and Management Education',
  shortName: 'OM Technical',
  owner: 'Balram Singh',
  foundedYear: 2006,
  yearsOfExperience: new Date().getFullYear() - 2006,
  phone: '9711206843',
  phoneIntl: '+919711206843',
  email: 'ommtechmgtofficial@gmail.com',
  address: {
    line1: 'NM-21, Basement, Old DLF Colony',
    line2: 'Sector 14, Gurugram, Haryana',
    landmark: 'Near Shri Krishna Mandir',
    city: 'Gurugram',
    state: 'Haryana',
    postalCode: '122001',
    country: 'IN',
  },
  mapEmbedSrc:
    'https://www.google.com/maps?q=Old+DLF+Colony+Sector+14+Gurugram+Haryana&output=embed',
  mapLink: 'https://www.google.com/maps/search/?api=1&query=Old+DLF+Colony+Sector+14+Gurugram+Haryana',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://omtechmgt.com',
  areaServed: ['Gurugram', 'Delhi', 'New Delhi', 'Delhi NCR', 'Noida', 'Faridabad', 'Haryana'],
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message || `Hello, I would like to know more about admission guidance from ${BUSINESS.name}.`
  );
  return `https://wa.me/${BUSINESS.phoneIntl.replace('+', '')}?text=${text}`;
}

export const COURSE_CATEGORIES = [
  'Distance Degree',
  'Regular Degree',
  'Technical',
  'Management',
] as const;

export const COURSE_MODES = ['Distance', 'Regular'] as const;

export const LEAD_STATUSES = ['New', 'Contacted', 'Converted', 'Lost'] as const;
