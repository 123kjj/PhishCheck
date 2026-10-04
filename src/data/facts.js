// Real statistics shown on the home page, with their sources.
// FBI figures: Internet Crime Complaint Center (IC3) 2025 Annual Report.
// Verizon figure: 2025 Data Breach Investigations Report.

export const SOURCES = {
  ic3: {
    name: 'FBI Internet Crime Report 2025',
    url: 'https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf',
  },
  dbir: {
    name: 'Verizon 2025 Data Breach Investigations Report',
    url: 'https://www.verizon.com/business/resources/reports/2025-dbir-data-breach-investigations-report.pdf',
  },
}

export const HEADLINE_STATS = [
  {
    value: '#1',
    label: 'Phishing was the most reported type of internet crime to the FBI in 2025',
    detail: '191,561 complaints',
    source: 'ic3',
  },
  {
    value: '143,000+',
    label: 'Complaints came from people under 30, including 31,254 from people under 20',
    detail: 'Young people are targets too',
    source: 'ic3',
  },
  {
    value: '$7.7B',
    label: 'Lost by people 60 and older, the age group hit hardest',
    detail: '201,266 complaints',
    source: 'ic3',
  },
  {
    value: '60%',
    label: 'Of data breaches involved a person being tricked or making a mistake',
    detail: 'Not just “hacking”',
    source: 'dbir',
  },
]

// Internet crime complaints to the FBI by age group, 2025
export const COMPLAINTS_BY_AGE = [
  { age: 'Under 20', complaints: 31254 },
  { age: '20–29', complaints: 112069 },
  { age: '30–39', complaints: 153293 },
  { age: '40–49', complaints: 167066 },
  { age: '50–59', complaints: 124820 },
  { age: '60+', complaints: 201266 },
]

export const WHO_IT_HELPS = [
  {
    title: 'Students',
    text: 'You’re getting your first school email, social accounts and job offers. Learn the tricks before someone uses them on you.',
  },
  {
    title: 'Teachers',
    text: 'The challenge takes about five minutes and works as a ready-made class activity. No sign-ups, nothing to install.',
  },
  {
    title: 'Parents and grandparents',
    text: 'People 60 and older lose the most money to online scams. Try the challenge together and talk through each message.',
  },
  {
    title: 'Anyone new to being online',
    text: 'A first phone, a first work email, a first online bank account. Everyone starts somewhere, and the warning signs are the same.',
  },
]
