import { Patient } from '../components/PatientListItem';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    age: 45,
    gender: 'M',
    time: '9:00 am',
    status: 'Generated',
    initial: 'C',
    isSelected: true,
  },
  {
    id: '2',
    name: 'Linda Williams',
    age: 53,
    gender: 'M',
    time: '9:30 am',
    status: 'Generated',
    initial: 'L',
  },
  {
    id: '3',
    name: 'David Jones',
    age: 67,
    gender: 'M',
    time: '10:00 am',
    status: 'Generated',
    initial: 'D',
  },
  {
    id: '4',
    name: 'Richard Roe',
    age: 24,
    gender: 'M',
    time: '10:30 am',
    status: 'Generated',
    initial: 'R',
  },
  {
    id: '5',
    name: 'Robert Davis',
    age: 29,
    gender: 'M',
    time: '11:00 am',
    status: 'Generated',
    initial: 'R',
  },
  {
    id: '6',
    name: 'Michael Smith',
    age: 41,
    gender: 'M',
    time: '11:30 am',
    status: 'Generated',
    initial: 'M',
  },
  {
    id: '7',
    name: 'Barbara Brown',
    age: 19,
    gender: 'M',
    time: '12:00 am',
    status: 'Generated',
    duration: '18m 33s',
    initial: 'B',
  },
];

export const patientDetails = {
  name: 'John Doe',
  age: 45,
  gender: 'M',
  complaint: 'Chief Complaint',
  
  atAGlance: [
    'Recovering post-ADHF; good diuretic response; renal reserve adequate.',
    'Next step → complete GDMT and device evaluation; monitor for hypotension or renal shift.',
  ],
  
  details: [
    '2 wk post-HF hospitalization (10/03–10/07)',
    'HFrEF 30% / ischemic cardiomyopathy / AF / CKD 3b / T2DM',
  ],
  
  heartFunction: [
    'EF 30% ↓ (from 35 % 03/24); mild MR; LBBB 152 ms → meets CRT criteria.',
    'No device yet.',
  ],
  
  rhythm: [
    '80.3 kg → 78.2 kg (–2.1 kg); mild ankle edema; lungs clear → near dry weight.',
  ],
  
  volumeWeight: [
    'Cisplatin + Etoposide (curative intent, cycle 3)',
    'No holds for chemo',
    'Concomitant meds: Dexamethasone taper, Ondansetron PRN',
  ],
  
  renalLabs: [
    'Cr 1.9 mg/dL (eGFR 39); K 4.7, Na 138 → safe for MRA and SGLT2 start.',
    'NT-proBNP 2200 → 1350 ↓ (improving).',
    'A1c 7.4 (09/25); LDL 62 (05/25).',
  ],
  
  bloodPressure: [
    'Home BP ~108/68 (low-normal). Monitor closely during GDMT uptitration.',
  ],
  
  currentMeds: [
    'See details! 12.5 mg BID. Uptitrate! 10 mg qd. Bumped to 5 mg BID. Activate! 5 mg BID; slow titrate. 40 mg qd. Bumped to 5 mg BID. Metoprolol 40 mg',
  ],
  
  dataSources: [
    'Jan 7, Initial Eval, Athena signed note',
    'Jan 13, Follow Up, Ambient',
    'Jan 15, lab result, Athena',
    'Jan 16, imaging results, Athena',
  ],
};
