/**
 * Every piece of copy and configuration on the site.
 *
 * Components read from here and hardcode nothing, so content can be edited
 * without touching JSX. Anything marked CONFIRM BEFORE LAUNCH is a claim we
 * drafted from the brief and that Zealous should verify before going live.
 */

export const company = {
  name: 'Zealous Solutions',
  legalName: 'Zealous Solutions',
  tagline: 'People. Technology. Better Experiences.',
  description:
    'Zealous Solutions is a BPO and digital solutions partner delivering customer support, lead generation, insurance services and digital marketing for growing businesses.',
  url: 'https://zealoussolutions.us',
} as const;

export const contact = {
  email: 'Info@zealoussolutions.us',
  /** Digits only - used to build the wa.me link. */
  whatsapp: '13252024836',
  whatsappDisplay: '+1 325 202 4836',
  address: {
    street: '30N Gould St Ste R',
    city: 'Sheridan',
    region: 'WY',
    postalCode: '82801',
    country: 'US',
  },
  get addressLine() {
    const { street, city, region, postalCode } = this.address;
    return `${street}, ${city}, ${region} ${postalCode}`;
  },
} as const;

/**
 * Footer social icons render only for entries listed here, so the site never
 * ships dead links.
 *
 * The URLs are the canonical profile addresses. The links supplied for
 * Instagram and TikTok carried share tokens (`?stkn=`, `?_r=&_t=`) which are
 * tied to one session and expire, so they are stripped here.
 *
 * LinkedIn is intentionally absent: the address supplied was
 * linkedin.com/feed, which sends a visitor to their own LinkedIn feed rather
 * than to the company. Add the real company page URL here to enable it.
 */
export const socials: { label: string; icon: string; href: string }[] = [
  { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/zealousdial/' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/zealoussolutions30' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@zealoussolutions30' },
];

/**
 * Homepage anchors plus the one real route. `route` entries navigate; the rest
 * scroll within the one-pager.
 */
export const nav = [
  { label: 'Who We Are', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Process', href: '/#process' },
  { label: 'Careers', href: '/careers', route: true },
] as const;

export const hero = {
  eyebrowRail: ['People', 'Technology', 'Better Experiences'],
  label: 'Welcome to Zealous Solutions',
  headline: { lead: 'Smarter Conversations', accent: 'Stronger Business' },
  subline:
    'Next-generation contact centre and digital solutions that connect, support and grow your business.',
  cta: { label: 'Get Started', href: '#book' },
  strip: [
    { icon: 'headset', label: 'Exceptional\nCustomer Support' },
    { icon: 'chart', label: 'Higher\nEfficiency' },
    { icon: 'users', label: 'Happier\nCustomers' },
    { icon: 'globe', label: 'Global\nReach' },
  ],
} as const;

export const about = {
  eyebrow: 'Who We Are',
  heading: 'Built around the people your customers actually talk to.',
  /** One line, not two paragraphs: this panel is read while scrolling past. */
  lead: 'We connect people, data and technology so every conversation moves your business forward.',
  /**
   * The three pillars restate the company tagline, so the section earns its
   * place visually rather than repeating the services list in prose.
   */
  pillars: [
    {
      icon: 'users',
      title: 'People',
      body: 'Agents trained on your brand, not a rotating pool.',
    },
    {
      icon: 'cpu',
      title: 'Technology',
      body: 'Tooling and reporting that make every conversation measurable.',
    },
    {
      icon: 'sparkles',
      title: 'Better experiences',
      body: 'Outsourcing that does not feel outsourced.',
    },
  ],
} as const;

export const services = [
  {
    id: 'customer-support',
    icon: 'headset',
    title: 'Customer Support',
    summary:
      'Omnichannel inbound and outbound support teams that handle volume without losing the human touch.',
    points: [
      'Inbound voice, email, live chat and social',
      'Outbound follow-up and retention campaigns',
      'Dedicated agents trained on your product and tone',
      'Escalation paths and QA scoring built in',
    ],
  },
  {
    id: 'lead-generation',
    icon: 'target',
    title: 'Lead Generation',
    summary:
      'Qualified, compliant leads and live transfers that reach your closers ready to buy.',
    points: [
      'Medicare and Final Expense live transfers',
      'Pre-qualified appointment setting',
      'Real-time lead verification and filtering',
      'Transparent reporting on every campaign',
    ],
  },
  {
    id: 'insurance-services',
    icon: 'shield',
    title: 'Insurance Services',
    summary:
      'Back-office and front-line support purpose-built for carriers, agencies and brokers.',
    points: [
      'Policy administration and data entry',
      'Claims intake and status follow-up',
      'Licensed agent support and overflow handling',
      'Process documentation that survives staff turnover',
    ],
  },
  {
    id: 'digital-marketing',
    icon: 'megaphone',
    title: 'Digital Marketing',
    summary:
      'Demand generation that feeds the pipeline your support and sales teams depend on.',
    points: [
      'Paid search and paid social management',
      'Landing pages built to convert, not to win awards',
      'SEO and content that compounds over time',
      'Attribution reporting tied to closed revenue',
    ],
  },
] as const;

export const industries = [
  {
    icon: 'shield',
    title: 'Insurance',
    body: 'Compliant, carrier-ready support for agencies and brokers, from first contact to policy servicing.',
  },
  {
    icon: 'heart-pulse',
    title: 'Medicare',
    body: 'Targeted Medicare lead generation and live transfer programmes built around enrolment cycles.',
  },
  {
    icon: 'file-text',
    title: 'Final Expense',
    body: 'Specialist Final Expense lead generation and transfers, qualified before they reach your agents.',
  },
  {
    icon: 'stethoscope',
    title: 'Healthcare',
    body: 'Patient scheduling, intake and follow-up handled with the discretion the sector demands.',
  },
  {
    icon: 'home',
    title: 'Real Estate',
    body: 'Enquiry response and appointment setting fast enough to matter in a market that moves hourly.',
  },
  {
    icon: 'shopping-bag',
    title: 'E-commerce',
    body: 'Order, returns and pre-sale support that holds up through seasonal spikes.',
  },
] as const;

export const whyUs = {
  eyebrow: 'Why Zealous',
  heading: 'Outsourcing that earns its place in your business.',
  body: 'Most providers sell you seats. We build a function that fits how your business already works, then keep improving it once the contract is signed.',
  points: [
    {
      title: 'Teams, not headcount',
      body: 'Dedicated agents who learn your product and stay on your account, rather than a rotating pool.',
    },
    {
      // Describes how the work is run rather than asserting a certification.
      // If Zealous holds HIPAA, TCPA, SOC 2 or PCI DSS accreditation, naming it
      // here would be far stronger than this.
      title: 'Documented and monitored',
      body: 'Agreed scripts, recorded escalation paths and quality scoring on every campaign.',
    },
    {
      title: 'Reporting you can act on',
      body: 'Plain reporting on volume, resolution and conversion: the numbers that change decisions.',
    },
    {
      title: 'Scales both directions',
      body: 'Ramp up for a launch or a season, and scale back down without renegotiating everything.',
    },
  ],
} as const;

export const process = {
  eyebrow: 'How We Work',
  heading: 'From first call to steady state.',
  steps: [
    {
      title: 'Discover',
      body: 'We map your current process, volumes and failure points before proposing anything.',
    },
    {
      title: 'Design',
      body: 'Scripts, escalation paths, tooling and QA criteria are agreed and documented with you.',
    },
    {
      title: 'Deploy',
      body: 'Your team is recruited, trained on your product, and goes live against a pilot target.',
    },
    {
      title: 'Optimise',
      body: 'Weekly reporting drives changes to scripts, staffing and targeting as the account matures.',
    },
  ],
} as const;

export const booking = {
  eyebrow: 'Book an Appointment',
  heading: 'Tell us what you need. We will tell you if we can help.',
  body: 'Pick a time that suits you and a member of the team will confirm by email. No obligation, and no pitch if we are not the right fit.',
  // serviceOptions, timeSlots and timezones are also allowlisted in
  // public/send.php, which rejects any other value. Change both together.
  serviceOptions: [
    'Customer Support',
    'Lead Generation',
    'Insurance Services',
    'Digital Marketing',
    'Something else',
  ],
  timeSlots: [
    '09:00 to 11:00',
    '11:00 to 13:00',
    '13:00 to 15:00',
    '15:00 to 17:00',
    '17:00 to 19:00',
  ],
  timezones: [
    'US Eastern (ET)',
    'US Central (CT)',
    'US Mountain (MT)',
    'US Pacific (PT)',
    'UK (GMT/BST)',
    'Other / I will confirm',
  ],
} as const;

export const careers = {
  eyebrow: 'Careers',
  heading: { lead: 'Build a career', accent: 'worth staying for' },
  subline:
    'We hire for attitude and train for skill. If you can hold a conversation and care about getting it right, there is a seat here.',
  intro: {
    heading: 'Why work at Zealous',
    body: 'A contact centre lives or dies on whether its people want to be there. We invest in training, promote from within, and pay attention to the things that make a shift bearable.',
  },
  benefits: [
    {
      icon: 'trending-up',
      title: 'Real progression',
      body: 'Team leads and trainers are promoted from the floor. We tell you what the next step needs before you ask.',
    },
    {
      icon: 'graduation-cap',
      title: 'Paid training',
      body: 'Full product and process training before you take a single live conversation.',
    },
    {
      icon: 'users',
      title: 'Teams that stay',
      body: 'You work with the same people on the same account, not a different queue every week.',
    },
    {
      icon: 'globe',
      title: 'International exposure',
      body: 'Work with US and UK clients and the standards that come with them.',
    },
  ],
  /**
   * Live vacancies. `code` feeds the email subject line, so changing it changes
   * what lands in the recruitment inbox.
   *
   * CONFIRM BEFORE LAUNCH - the requirements below were drafted from the brief.
   * Adjust them to the actual expectations for each role.
   */
  openRoles: [
    {
      id: 'verification-officer',
      code: 'Verification',
      title: 'Verification Officer',
      location: 'On-site',
      type: 'Full time',
      summary:
        'Verify customer and policy information on recorded lines, confirm consent, and make sure every lead we pass on holds up to scrutiny.',
      requirements: [
        'Clear, neutral spoken English',
        'Close attention to detail. This role is about catching what others miss',
        'Comfortable working to scripts and compliance rules',
        'Willing to work US business hours',
        'Fresh candidates welcome; training is provided',
      ],
    },
    {
      id: 'customer-sales-representative',
      code: 'CSR',
      title: 'Customer Sales Representative',
      location: 'On-site',
      type: 'Full time',
      summary:
        'Handle inbound and outbound calls for US campaigns, answer questions properly, and convert genuine interest into qualified appointments.',
      requirements: [
        'Confident spoken English and a calm phone manner',
        'Resilience on outbound calls, because you will hear no often',
        'Basic computer literacy and CRM familiarity',
        'Willing to work US business hours',
        'Sales or contact-centre experience preferred, not required',
      ],
    },
  ],

  generalApplication: 'General application',

  /** Matches the experience options on the supplied form design. Also
      allowlisted in public/send.php (EXPERIENCE); change both together. */
  experienceOptions: ['Fresh', '1 Year', '2 Years', '3 Years', '4+ Years'] as string[],
} as const;

/**
 * Left empty on purpose. The reference site advertises "1200+ clients" and a
 * "4.99 star" rating; we will not publish equivalent figures for Zealous until
 * real ones are supplied. The stats section does not render while this is empty.
 */
export const stats: { value: string; label: string }[] = [];

/** Same policy as `stats` - no invented testimonials. */
export const testimonials: { quote: string; name: string; role: string }[] = [];
