import React, { useState, useEffect } from 'react';
import { Button, IconButton } from './components/Button';
import { VisitStatus } from './components/Badge';
import { InlineIcon } from './components/InlineIcon';
import { ButtonGroup } from './components/ButtonGroup';
import { Tabs } from './components/Tabs';
import { ChatInput } from './components/Input';
import { Link } from './components/Link';
import { TextField } from './components/TextField';
import Scribes from './Scribes';

// Patient List Item Component
const PatientListItem = ({ 
  name, 
  age, 
  gender, 
  time,
  status = "Generated",
  isSelected = false,
  onClick
}: { 
  name: string; 
  age: number; 
  gender: string; 
  time: string;
  status?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const buttonClass = isSelected 
    ? "bg-[var(--surface-semantic-info,#f1f3fe)] border-[var(--shape-brand,#1132ee)] border-r-2 border-solid"
    : "hover:bg-[var(--surface-1,#f7f7f7)]";
    
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[240px]">
      <button 
        className={`${buttonClass} content-stretch cursor-pointer flex flex-col gap-[6px] items-start pl-[12px] pr-[8px] py-[16px] relative shrink-0 w-[220px] transition-colors`}
        onClick={onClick}
      >
        <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
          <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
            <div className="flex flex-[1_0_0] flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[13px] text-[color:var(--text-default,black)] text-ellipsis text-left tracking-[0.13px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss07'" }}>
              <p className="leading-[1.2] overflow-hidden text-left">{name}</p>
            </div>
          </div>
          {status !== "In Queue" && <VisitStatus status={status as any} />}
        </div>
        <div className="content-stretch flex font-['Lato',sans-serif] gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[13px] tracking-[0.065px] w-full whitespace-nowrap">
          <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative text-[color:var(--text-subheading,#666)]">
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{age}</p></div>
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{gender}</p></div>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[color:var(--text-placeholder,#808080)]">
            <p className="leading-[1.4]">{time}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

// Shared chat messages type
type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

export default function App() {
  const [currentView, setCurrentView] = useState<'visits' | 'scribes'>('visits');
  const [chatInputValue, setChatInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'previsit' | 'note'>('previsit');
  const [rightTab, setRightTab] = useState<'actions' | 'chat'>('actions');
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [isVisitSettingsExpanded, setIsVisitSettingsExpanded] = useState(true);
  const [isCareNudgesExpanded, setIsCareNudgesExpanded] = useState(true);
  const [isDataSourcesExpanded, setIsDataSourcesExpanded] = useState(true);
  const [editingPrechartSection, setEditingPrechartSection] = useState<'subjective' | 'objective' | 'assessment' | 'plan' | null>(null);
  const [editedPrechartContent, setEditedPrechartContent] = useState<{subjective: string; objective: string; assessment: string; plan: string}>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [dismissedNudges, setDismissedNudges] = useState<Record<number, Set<number>>>({});
  const [hoveredNudge, setHoveredNudge] = useState<{patientIndex: number, nudgeIndex: number} | null>(null);
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [viewingDataSource, setViewingDataSource] = useState<string | null>(null);
  
  // Shared chat state - indexed by patient name
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    "Sarah Johnson": [
      { type: 'user', content: "What should I focus on during this diabetes follow-up visit?" },
      { type: 'assistant', content: "Key areas to address: (1) Review diet/exercise compliance given the rise in A1c from 7.2% to 7.8%, (2) Consider adjusting metformin dose or adding another agent, (3) Schedule ophthalmology referral as it's been 8 months since last eye exam, (4) Check for peripheral neuropathy symptoms." }
    ],
    "Robert Chen": [
      { type: 'user', content: "What were the patient's vital signs during the last visit?" },
      { type: 'assistant', content: "Based on the clinical note, the patient's vital signs were: BP 108/68, HR 78 (irregular), RR 16, O2 sat 97% on room air." },
      { type: 'user', content: "Summarize the cardiac exam findings" },
      { type: 'assistant', content: "The cardiac exam showed an irregular rhythm with S1 and S2 present, and a 2/6 systolic murmur at the apex. This is consistent with the patient's known atrial fibrillation." }
    ],
    "Maria Garcia": [
      { type: 'user', content: "Should I order imaging for this patient's back pain?" },
      { type: 'assistant', content: "Based on the previsit information, imaging is not indicated at this time. The patient has no red flags (no fever, no bowel/bladder dysfunction, no trauma, no night pain, no history of cancer). This appears to be acute mechanical lower back pain. Conservative management with NSAIDs and physical therapy is appropriate. Consider imaging if symptoms persist beyond 4-6 weeks or red flags develop." }
    ],
    "James Wilson": [
      { type: 'user', content: "What preventive screenings are due for this patient?" },
      { type: 'assistant', content: "This 55-year-old male is due for: (1) Colonoscopy - first screening (age-appropriate), (2) Lipid panel - last checked 2 years ago, (3) PSA screening discussion (shared decision-making). Also ensure flu vaccine is current." }
    ],
    "Lisa Anderson": [
      { type: 'user', content: "The current migraine preventive isn't working well. What are the next options?" },
      { type: 'assistant', content: "Given limited response to propranolol after 3 months and increasing frequency (4-6 migraine days/month), consider switching to a CGRP inhibitor (e.g., erenumab, fremanezumab, galcanezumab). These have shown superior efficacy for chronic migraines. Also assess for medication overuse headache (using sumatriptan 2-3x/week is approaching threshold). Review trigger management strategies." }
    ]
  });
  
  // Helper function to get badge color based on document type
  const getDocumentTypeBadgeColor = (type: string): {bg: string, text: string} => {
    const typeMap: Record<string, {bg: string, text: string}> = {
      'Clinical Note': { bg: '#f1f3fe', text: '#1132ee' }, // Info (blue brand)
      'Lab Report': { bg: '#ecf8fb', text: '#207384' }, // Cyan
      'Diagnostic Report': { bg: '#f0ecf7', text: '#7246b5' }, // Purple
      'Hospital Discharge': { bg: '#fff5e5', text: '#995c00' }, // Warning (orange)
      'Home Monitoring': { bg: '#edf7ee', text: '#2f6a32' }, // Success (green)
      'Visit Transcript': { bg: '#f0f3f4', text: '#576b75' }, // Blue Grey
      'Visit Vitals': { bg: '#edf7ee', text: '#2f6a32' }, // Success (green)
      'ECG Report': { bg: '#fcf1f7', text: '#ab2973' }, // Magenta
      'Physical Exam': { bg: '#f0f3f4', text: '#576b75' }, // Blue Grey
      'Specialist Report': { bg: '#f0ecf7', text: '#7246b5' }, // Purple
    };
    return typeMap[type] || { bg: '#f7f7f7', text: '#666' }; // Default grey
  };

  // Data source content for each patient
  const dataSourceContent: Record<string, Record<string, {type: string, date: string, content: string}>> = {
    "Sarah Johnson": {
      "Jan 15, Lab results, Athena": {
        type: "Lab Report",
        date: "Jan 15, 2024",
        content: "**LABORATORY REPORT**\n\nPatient: Sarah Johnson\nDOB: 03/15/1982\nMRN: 12345678\n\n**METABOLIC PANEL**\nGlucose, Fasting: 145 mg/dL [H] (Ref: 70-100)\nHemoglobin A1c: 7.8% [H] (Ref: <5.7%)\nPrevious A1c (10/15/2023): 7.2%\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL\nLDL Cholesterol: 95 mg/dL\nHDL Cholesterol: 48 mg/dL\nTriglycerides: 125 mg/dL\n\n**RENAL FUNCTION**\nCreatinine: 0.9 mg/dL\neGFR: 72 mL/min/1.73m²"
      },
      "Feb 11, Home BP monitor, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**BLOOD PRESSURE LOG**\n\nPatient: Sarah Johnson\nDate Range: 01/28/2024 - 02/11/2024\n\n**AVERAGE READINGS**\nMorning: 135/85 mmHg\nEvening: 132/82 mmHg\nTotal Readings: 14\nGoal: <130/80 mmHg\n\n02/11: 134/84\n02/10: 137/86\n02/09: 133/83\n02/08: 136/85\n02/07: 135/84"
      },
      "Feb 11, Home scale, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**WEIGHT LOG**\n\nPatient: Sarah Johnson\n\n02/11: 185 lbs\n02/04: 185 lbs\n01/28: 185 lbs\n01/21: 186 lbs\n01/14: 185 lbs\n\nTrend: Stable"
      },
      "Oct 15, 2023, Follow-up visit, Athena": {
        type: "Clinical Note",
        date: "Oct 15, 2023",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Sarah Johnson, 42F\nChief Complaint: Diabetes follow-up\n\n**CURRENT MEDICATIONS**\n• Metformin 1000mg BID\n• Atorvastatin 20mg daily\n• Lisinopril 10mg daily\n\n**ASSESSMENT**\nType 2 Diabetes - A1c 7.2%\nHypertension - controlled\nHyperlipidemia - at goal\n\n**PLAN**\n• Continue medications\n• Annual foot exam completed\n• Schedule ophthalmology\n• Return in 3 months"
      },
      "Jun 15, 2023, Eye exam, Athena": {
        type: "Specialist Report",
        date: "Jun 15, 2023",
        content: "**OPHTHALMOLOGY EXAM**\n\nPatient: Sarah Johnson\n\n**FINDINGS**\nVisual Acuity: 20/20 OU\nNo diabetic retinopathy\nNo macular edema\n\n**PLAN**\nReturn in 12 months for annual screening"
      },
      "Oct 15, 2023, Follow-up visit note, Athena": {
        type: "Clinical Note",
        date: "Oct 15, 2023",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Sarah Johnson, 42F\nChief Complaint: Diabetes follow-up\n\n**CURRENT MEDICATIONS**\n• Metformin 1000mg BID\n• Atorvastatin 20mg daily\n• Lisinopril 10mg daily\n\n**ASSESSMENT**\nType 2 Diabetes - A1c 7.2%\nHypertension - controlled\nHyperlipidemia - at goal\n\n**PLAN**\n• Continue medications\n• Annual foot exam completed\n• Schedule ophthalmology\n• Return in 3 months"
      },
      "Feb 11, Home monitoring, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**HOME MONITORING DATA**\n\nPatient: Sarah Johnson\nDate Range: 01/28/2024 - 02/11/2024\n\n**BLOOD PRESSURE LOG**\nMorning Average: 135/85 mmHg\nEvening Average: 132/82 mmHg\nTotal Readings: 14\nGoal: <130/80 mmHg\n\n**WEIGHT LOG**\nCurrent: 185 lbs\nTrend: Stable\n\n**SUMMARY**\nBlood pressure trending slightly above goal. Weight stable."
      },
      "Jun 15, 2023, Ophthalmology report, Athena": {
        type: "Specialist Report",
        date: "Jun 15, 2023",
        content: "**OPHTHALMOLOGY EXAM**\n\nPatient: Sarah Johnson\n\n**FINDINGS**\nVisual Acuity: 20/20 OU\nNo diabetic retinopathy\nNo macular edema\n\n**PLAN**\nReturn in 12 months for annual screening"
      }
    },
    "Robert Chen": {
      "Oct 20, Hospital discharge summary, Athena": {
        type: "Hospital Discharge",
        date: "Oct 20, 2024",
        content: "**DISCHARGE SUMMARY**\n\nPatient: Robert Chen, 68M\nAdmission: 10/03/2024\nDischarge: 10/20/2024\n\n**DIAGNOSIS**\nAcute decompensated heart failure\n\n**HOSPITAL COURSE**\nAdmitted with volume overload. IV diuresis initiated with good response. Weight decreased from 80.3kg to 78.2kg.\n\n**DISCHARGE MEDICATIONS**\n• Metoprolol succinate 25mg BID\n• Bumetanide 2mg daily\n• Entresto 24/26mg BID\n• Spironolactone 12.5mg daily\n\n**FOLLOW-UP**\n2 weeks with cardiology"
      },
      "Oct 15, Lab results, Athena": {
        type: "Lab Report",
        date: "Oct 15, 2024",
        content: "**LABORATORY REPORT**\n\nPatient: Robert Chen\n\n**RENAL FUNCTION**\nCreatinine: 1.9 mg/dL\neGFR: 39 mL/min/1.73m²\nPotassium: 4.7 mmol/L\nSodium: 138 mmol/L\n\n**CARDIAC MARKERS**\nNT-proBNP: 1350 pg/mL\n(Prior 10/03: 2200 pg/mL)"
      },
      "Oct 7, Echocardiogram, Athena": {
        type: "Diagnostic Report",
        date: "Oct 7, 2024",
        content: "**ECHOCARDIOGRAM**\n\nPatient: Robert Chen\n\n**FINDINGS**\nLVEF: 30% (visual estimate)\nPrior (03/24): 35%\nMild mitral regurgitation\nLBBB QRS duration: 152ms\n\n**IMPRESSION**\nSevere LV systolic dysfunction\nMeets criteria for CRT-D"
      },
      "Sep 25, Lab results, Athena": {
        type: "Lab Report",
        date: "Sep 25, 2024",
        content: "**LAB RESULTS**\n\nPatient: Robert Chen\n\n**METABOLIC**\nHemoglobin A1c: 7.4%"
      },
      "May 10, Lab results, Athena": {
        type: "Lab Report",
        date: "May 10, 2024",
        content: "**LAB RESULTS**\n\nPatient: Robert Chen\n\n**LIPID PANEL**\nLDL Cholesterol: 62 mg/dL"
      },
      "Feb 12, Today's exam, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Robert Chen\n\n**VITALS**\nO2 saturation: 96% on room air\n\n**EXAM**\nGeneral: NAD, comfortable\nLungs: Clear bilaterally\nExtremities: Trace-1+ edema"
      },
      "Feb 11, Home BP monitor, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**HOME BP LOG**\n\nPatient: Robert Chen\n\n**2-WEEK AVERAGE**\nBP: 108/68 mmHg\nHR: 65-72 bpm (irregular)\n\nREADINGS:\n02/11: 108/68, HR 68\n02/10: 106/65, HR 72\n02/09: 110/70, HR 65\n02/08: 105/68, HR 70"
      },
      "Feb 11, Home weight log, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**WEIGHT LOG**\n\nPatient: Robert Chen\n\nDischarge (10/20): 80.3kg\nCurrent: 78.2kg\nChange: -2.1kg\n\nDAILY WEIGHTS:\n02/11: 78.2kg\n02/10: 78.3kg\n02/09: 78.4kg"
      },
      "Feb 11, Home weight log + Today's exam, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024 - Today",
        content: "**HOME WEIGHT LOG & EXAM FINDINGS**\n\nPatient: Robert Chen\n\n**WEIGHT TREND**\nDischarge (10/20): 80.3 kg\nCurrent: 78.2 kg\nChange: -2.1 kg\n\n**WEIGHT LOG**\n02/11: 78.2 kg\n02/04: 78.3 kg\n01/28: 78.5 kg\n01/21: 78.7 kg\n\n**TODAY'S EXAM FINDINGS**\nExtremities: Trace to 1+ bilateral lower extremity edema (improved from 3+ at discharge)\nLungs: Clear to auscultation bilaterally\nCardiovascular: Irregular rhythm consistent with AFib"
      }
    },
    "Maria Garcia": {
      "Feb 12, Intake form, Ambient": {
        type: "Intake Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: Maria Garcia, 35F\n\n**CHIEF COMPLAINT**\nLower back pain x4 days\n\n**HPI**\nSharp pain in L4-L5 region, 7/10 severity, improves with rest. Started after moving furniture. No radiation, numbness, tingling.\n\n**RED FLAGS**\nNo fever, bowel/bladder dysfunction, trauma, night pain, or history of cancer.\n\n**CURRENT MEDS**\nNone (occasional ibuprofen OTC)"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Maria Garcia\n\n**VITALS**\nBP: 118/72\nHR: 76\nTemp: 98.4°F\n\n**EXAM**\nGeneral: Well-appearing\nMSK: Normal gait, negative SLR bilaterally, tenderness over paraspinal muscles L3-L5, full ROM with mild discomfort\nNeuro: No deficits\n\n**ASSESSMENT**\nAcute mechanical low back pain\n\n**PLAN**\nConservative management with NSAIDs, PT referral, follow-up PRN"
      }
    },
    "James Wilson": {
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: James Wilson, 55M\n\n**VITALS**\nBP: 128/78 mmHg\nWeight: 210 lbs\nHeight: 5'11\"\nBMI: 28.5\n\n**EXAM**\nGeneral: Well-appearing\nCardiac: RRR, no murmurs\nLungs: Clear bilaterally\nAbdomen: Soft, non-tender"
      },
      "Jan 20, 2024, Annual wellness visit, Athena": {
        type: "Clinical Note",
        date: "Jan 20, 2024",
        content: "**ANNUAL WELLNESS VISIT**\n\nPatient: James Wilson, 55M\n\n**HEALTH MAINTENANCE**\n• Colonoscopy due (age 55)\n• PSA screening discussion\n• Flu vaccine due this fall\n• Tdap: 05/2021 (up to date)\n\n**CURRENT MEDICATIONS**\n• Lisinopril 20mg daily\n• Aspirin 81mg daily\n\n**PLAN**\n• Order colonoscopy\n• Discuss PSA\n• Continue medications"
      },
      "Jan 12, 2022, Lab results, Athena": {
        type: "Lab Report",
        date: "Jan 12, 2022",
        content: "**LAB RESULTS**\n\nPatient: James Wilson\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL\nLDL: 118 mg/dL\nHDL: 52 mg/dL\nTriglycerides: 125 mg/dL\n\n**NOTE**\nRepeat due (>2 years)"
      }
    },
    "Lisa Anderson": {
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Lisa Anderson, 28F\n\n**VITALS**\nBP: 108/70 mmHg\nHR: 58 bpm (on beta-blocker)\nWeight: 135 lbs (stable)\n\n**EXAM**\nGeneral: Well-appearing\nNeuro: Alert, oriented x3, CN II-XII intact, normal strength and sensation"
      },
      "Jan 30, Follow-up visit, Ambient": {
        type: "Clinical Note",
        date: "Jan 30, 2024",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Lisa Anderson\n\n**MIGRAINES**\nFrequency: 4-6 days/month (up from 3-4)\nIntensity: Moderate-severe, unilateral\nSymptoms: Photophobia, nausea, occasional aura\n\n**TREATMENT**\nPropranolol 80mg daily x3 months - limited response\nSumatriptan 100mg PRN - using 2-3x/week\n\n**TRIGGERS**\nStress, poor sleep, hormonal changes\n\n**IMPACT**\nMissing work 1-2 days/month\n\n**PLAN**\nConsider switching to CGRP inhibitor"
      },
      "Oct 15, 2023, Neurology consult, Athena": {
        type: "Specialist Report",
        date: "Oct 15, 2023",
        content: "**NEUROLOGY CONSULTATION**\n\nPatient: Lisa Anderson\n\n**DIAGNOSIS**\nChronic migraine with aura\nGeneralized anxiety disorder\n\n**TREATMENT INITIATED**\n• Propranolol 80mg daily (preventive)\n• Sumatriptan 100mg PRN (acute)\n• Sertraline 50mg daily (anxiety)\n\n**FOLLOW-UP**\n3 months to assess response"
      }
    }
  };

  const patients = [
    { 
      name: "Sarah Johnson", 
      age: 42, 
      gender: "F", 
      time: "9:00 am", 
      status: "In Queue", 
      chiefComplaint: "Diabetes Follow-up",
      atAGlance: [
        "Type 2 Diabetes (diagnosed 2019); recent A1c 7.8% (above target); patient reports good medication adherence.",
        "Next step → review diet/exercise compliance; consider adjusting metformin dose; schedule ophthalmology referral."
      ],
      details: [
        "3-month diabetes follow-up",
        "Type 2 DM / Hyperlipidemia / HTN"
      ],
      sections: {
        "Labs (Recent)": [
          "A1c 7.8% ↑ (from 7.2% 3mo ago); FBG 145 mg/dL {{1}}",
          "LDL 95 mg/dL (on target); HDL 48 mg/dL {{2}}",
          "Creatinine 0.9 mg/dL (eGFR 72) - stable {{3}}"
        ],
        "Current Medications": [
          "Metformin 1000mg BID {{4}}",
          "Atorvastatin 20mg daily {{5}}",
          "Lisinopril 10mg daily {{6}}"
        ],
        "Vitals": [
          "BP trending 135/85 (slightly elevated) {{7}}",
          "Weight 185 lbs (stable from last visit) {{8}}"
        ],
        "Screening & Referrals": [
          "Last ophthalmology exam: 8 months ago (annual screening due) {{9}}",
          "Foot exam due today {{10}}",
          "eGFR stable - monitor annually {{11}}"
        ]
      },
      citations: [
        { number: 1, citedText: "A1c and FBG", quote: "Hemoglobin A1c: 7.8% (prior 7.2% three months ago), Fasting blood glucose: 145 mg/dL", source: "Jan 15, Lab results, Athena" },
        { number: 2, citedText: "lipids", quote: "LDL cholesterol: 95 mg/dL, HDL cholesterol: 48 mg/dL", source: "Jan 15, Lab results, Athena" },
        { number: 3, citedText: "renal function", quote: "Serum creatinine: 0.9 mg/dL, eGFR: 72 mL/min (stable)", source: "Jan 15, Lab results, Athena" },
        { number: 4, citedText: "metformin", quote: "Metformin 1000mg BID for diabetes management", source: "Oct 15, 2023, Follow-up visit note, Athena" },
        { number: 5, citedText: "atorvastatin", quote: "Atorvastatin 20mg daily for hyperlipidemia", source: "Oct 15, 2023, Follow-up visit note, Athena" },
        { number: 6, citedText: "lisinopril", quote: "Lisinopril 10mg daily for hypertension", source: "Oct 15, 2023, Follow-up visit note, Athena" },
        { number: 7, citedText: "blood pressure", quote: "Home BP average: 135/85 mmHg (last 2 weeks)", source: "Feb 11, Home monitoring, Uploaded" },
        { number: 8, citedText: "weight", quote: "Weight: 185 lbs (stable from last visit)", source: "Feb 11, Home monitoring, Uploaded" },
        { number: 9, citedText: "eye exam", quote: "Comprehensive diabetic eye examination completed 06/15/2023. No diabetic retinopathy noted. Annual screening due.", source: "Jun 15, 2023, Ophthalmology report, Athena" },
        { number: 10, citedText: "foot exam", quote: "Annual diabetic foot exam due per ADA guidelines", source: "Oct 15, 2023, Follow-up visit note, Athena" },
        { number: 11, citedText: "eGFR monitoring", quote: "Continue annual eGFR monitoring for diabetic nephropathy screening", source: "Oct 15, 2023, Follow-up visit note, Athena" }
      ],
      dataSources: [
        "Jan 15, Lab results, Athena",
        "Feb 11, Home BP monitor, Uploaded",
        "Feb 11, Home scale, Uploaded",
        "Oct 15, 2023, Follow-up visit, Athena",
        "Jun 15, 2023, Eye exam, Athena"
      ],
      careNudges: [
        {
          type: "Medication Adjustment",
          description: "Add GLP-1 agonist (Ozempic) - A1c rising despite metformin adherence.",
          highlightId: "sarah-labs-recent-0"
        },
        {
          type: "Screening Due",
          description: "Schedule ophthalmology referral - last eye exam 8 months ago.",
          highlightId: "sarah-screening-referrals-0"
        },
        {
          type: "Blood Pressure",
          description: "Uptitrate lisinopril to 20mg or add amlodipine - BP 135/85, above goal.",
          highlightId: "sarah-vitals-0"
        }
      ]
    },
    { 
      name: "Robert Chen", 
      age: 68, 
      gender: "M", 
      time: "9:30 am", 
      status: "Generated", 
      chiefComplaint: "Heart Failure",
      atAGlance: [
        "Recovering post-ADHF; good diuretic response; renal reserve adequate.",
        "Next step → complete GDMT and device evaluation; monitor for hypotension or renal shift."
      ],
      details: [
        "2 wk post-HF hospitalization (10/03–10/07)",
        "HFrEF 30% / ischemic cardiomyopathy / AF / CKD 3b / T2DM"
      ],
      sections: {
        "Heart Function": [
          "EF 30% ↓ (from 35% 03/24); mild MR; LBBB 152 ms → meets CRT criteria {{1}}",
          "No device yet {{2}}"
        ],
        "Volume & Weight": [
          "80.3 kg → 78.2 kg (–2.1 kg); mild ankle edema; lungs clear → near dry weight {{3}}"
        ],
        "Renal / Labs": [
          "Cr 1.9 mg/dL (eGFR 39); K 4.7, Na 138 → safe for MRA and SGLT2 start {{4}}",
          "NT-proBNP 2200 → 1350 ↓ (improving) {{5}}",
          "A1c 7.4 (09/25) {{6}}; LDL 62 (05/25) {{7}}"
        ],
        "Vitals": [
          "Home BP ~108/68 (low-normal). Monitor closely during GDMT uptitration {{8}}",
          "HR 65-72 (controlled AF on metoprolol) {{9}}",
          "O2 sat 96% on room air {{10}}"
        ],
        "Current Medications": [
          "Metoprolol 25mg BID; Bumex 2mg daily {{11}}",
          "Entresto 24/26mg BID; Spironolactone 12.5mg daily {{12}}",
          "Anticoagulation: Not documented (AFib present, CHA₂DS₂-VASc 5) {{13}}"
        ]
      },
      citations: [
        { number: 1, citedText: "cardiac function", quote: "LVEF 30% by visual estimation (prior 35% on 03/24), mild mitral regurgitation, LBBB QRS duration 152ms - meets CRT-D criteria", source: "Oct 7, Echocardiogram, Athena" },
        { number: 2, citedText: "device status", quote: "No ICD/CRT device at time of discharge", source: "Oct 20, Hospital discharge summary, Athena" },
        { number: 3, citedText: "weight and volume", quote: "Discharge weight 80.3kg (10/20), current weight 78.2kg (-2.1kg). Exam: trace-1+ bilateral lower extremity edema, lungs clear to auscultation", source: "Feb 11, Home weight log + Today's exam, Uploaded" },
        { number: 4, citedText: "renal and electrolytes", quote: "Creatinine 1.9 mg/dL (eGFR 39), Potassium 4.7 mmol/L, Sodium 138 mmol/L", source: "Oct 15, Lab results, Athena" },
        { number: 5, citedText: "NT-proBNP", quote: "NT-proBNP 1350 pg/mL (down from 2200 pg/mL on admission 10/03)", source: "Oct 15, Lab results, Athena" },
        { number: 6, citedText: "A1c", quote: "Hemoglobin A1c: 7.4%", source: "Sep 25, Lab results, Athena" },
        { number: 7, citedText: "lipids", quote: "LDL cholesterol: 62 mg/dL", source: "May 10, Lab results, Athena" },
        { number: 8, citedText: "blood pressure", quote: "Average home BP: 108/68 mmHg (last 2 weeks)", source: "Feb 11, Home BP monitor, Uploaded" },
        { number: 9, citedText: "heart rate", quote: "Average HR: 65-72 bpm (irregularly irregular rhythm consistent with atrial fibrillation)", source: "Feb 11, Home BP monitor, Uploaded" },
        { number: 10, citedText: "oxygen saturation", quote: "O2 saturation 96% on room air", source: "Feb 12, Today's exam, Ambient" },
        { number: 11, citedText: "metoprolol and bumex", quote: "Discharge medications: Metoprolol succinate 25mg BID for heart rate control, Bumetanide 2mg daily for diuresis", source: "Oct 20, Hospital discharge summary, Athena" },
        { number: 12, citedText: "entresto and spironolactone", quote: "Discharge medications: Entresto 24/26mg BID (ARNI for HFrEF), Spironolactone 12.5mg daily (MRA)", source: "Oct 20, Hospital discharge summary, Athena" },
        { number: 13, citedText: "anticoagulation", quote: "Anticoagulation status not documented in discharge summary. Patient has atrial fibrillation with CHA₂DS₂-VASc score of 5.", source: "Oct 20, Hospital discharge summary, Athena" }
      ],
      dataSources: [
        "Oct 20, Hospital discharge summary, Athena",
        "Oct 15, Lab results, Athena",
        "Oct 7, Echocardiogram, Athena",
        "Sep 25, Lab results, Athena",
        "May 10, Lab results, Athena",
        "Feb 12, Today's exam, Ambient",
        "Feb 11, Home BP monitor, Uploaded",
        "Feb 11, Home weight log, Uploaded"
      ],
      careNudges: [
        {
          type: "Device Referral",
          description: "Refer to EP for CRT-D - EF 30%, LBBB 152ms, meets criteria.",
          highlightId: "robert-heart-function-0"
        },
        {
          type: "GDMT Optimization",
          description: "Start dapagliflozin 10mg daily - eGFR 39, safe to initiate.",
          highlightId: "robert-renal-labs-0"
        },
        {
          type: "Medication Titration",
          description: "Uptitrate Entresto to 49/51mg BID - BP stable at 108/68.",
          highlightId: "robert-vitals-0"
        },
        {
          type: "Anticoagulation",
          description: "Verify anticoagulation for AFib - CHA₂DS₂-VASc 5.",
          highlightId: "robert-current-medications-2"
        }
      ]
    },
    { 
      name: "Maria Garcia", 
      age: 35, 
      gender: "F", 
      time: "10:00 am", 
      status: "Generated", 
      chiefComplaint: "Lower Back Pain",
      atAGlance: [
        "Acute lower back pain x 4 days; no red flags for serious pathology; likely musculoskeletal strain.",
        "Next step → conservative management with NSAIDs and PT; reassess in 2 weeks if not improving."
      ],
      details: [
        "New visit for acute back pain",
        "No chronic conditions; otherwise healthy"
      ],
      sections: {
        "Pain Characteristics": [
          "Sharp, localized to lower lumbar region (L4-L5 area) {{1}}",
          "Pain 7/10 at worst, improves with rest {{2}}",
          "No radiation to legs; no numbness or tingling {{3}}"
        ],
        "Mechanism": [
          "Started after helping move furniture 4 days ago {{4}}",
          "Gradual onset, worsened over 24 hours {{4}}"
        ],
        "Red Flags": [
          "No fever, no bowel/bladder dysfunction {{5}}",
          "No trauma, no night pain {{5}}",
          "No history of cancer or recent weight loss {{5}}"
        ],
        "Physical Exam": [
          "Normal gait; negative straight leg raise bilaterally {{6}}",
          "Tenderness over paraspinal muscles L3-L5 {{7}}",
          "Full ROM with mild discomfort; no neurological deficits {{8}}"
        ],
        "Vitals": [
          "BP 118/72; HR 76; Temp 98.4°F {{9}}",
          "No signs of systemic illness {{9}}"
        ],
        "Current Medications": [
          "None (takes occasional ibuprofen OTC) {{10}}"
        ],
        "Treatment Plan": [
          "Conservative management indicated - no red flags present {{11}}",
          "Physical therapy referral recommended for core strengthening {{11}}",
          "Follow-up in 2 weeks if no improvement {{11}}"
        ]
      },
      citations: [
        { number: 1, citedText: "pain location", quote: "Sharp pain localized to lower lumbar region, L4-L5 area", source: "Feb 12, Intake form, Ambient" },
        { number: 2, citedText: "pain severity", quote: "Pain severity 7/10 at worst, improves with rest", source: "Feb 12, Intake form, Ambient" },
        { number: 3, citedText: "radiation", quote: "No radiation to legs, no numbness or tingling", source: "Feb 12, Intake form, Ambient" },
        { number: 4, citedText: "mechanism", quote: "Started after helping move furniture 4 days ago, gradual onset, worsened over first 24 hours", source: "Feb 12, Intake form, Ambient" },
        { number: 5, citedText: "red flags", quote: "No fever, no bowel/bladder dysfunction, no trauma, no night pain, no history of cancer or recent weight loss", source: "Feb 12, Intake form, Ambient" },
        { number: 6, citedText: "gait and SLR", quote: "Normal gait, negative straight leg raise test bilaterally", source: "Feb 12, Today's visit, Ambient" },
        { number: 7, citedText: "tenderness", quote: "Tenderness over paraspinal muscles L3-L5", source: "Feb 12, Today's visit, Ambient" },
        { number: 8, citedText: "ROM and neuro", quote: "Full range of motion with mild discomfort, no neurological deficits", source: "Feb 12, Today's visit, Ambient" },
        { number: 9, citedText: "vitals", quote: "Vitals: BP 118/72, HR 76, Temp 98.4°F. General: Well-appearing, no acute distress, no signs of systemic illness", source: "Feb 12, Today's visit, Ambient" },
        { number: 10, citedText: "medications", quote: "Current medications: None. Takes occasional ibuprofen OTC as needed.", source: "Feb 12, Intake form, Ambient" },
        { number: 11, citedText: "assessment and plan", quote: "Assessment: Acute mechanical low back pain, no red flags present. Plan: Conservative management with NSAIDs, physical therapy referral for core strengthening, follow-up in 2 weeks if no improvement.", source: "Feb 12, Today's visit, Ambient" }
      ],
      dataSources: [
        "Feb 12, Intake form, Ambient",
        "Feb 12, Today's visit, Ambient"
      ],
      careNudges: [
        {
          type: "Treatment Plan",
          description: "Start ibuprofen 600mg TID with food for pain and inflammation.",
          highlightId: "maria-pain-characteristics-0"
        },
        {
          type: "Physical Therapy",
          description: "Refer to PT for core strengthening and body mechanics education.",
          highlightId: "maria-treatment-plan-1"
        }
      ]
    },
    { 
      name: "James Wilson", 
      age: 55, 
      gender: "M", 
      time: "10:30 am", 
      status: "In Queue", 
      chiefComplaint: "Annual Check-up",
      atAGlance: [
        "Annual wellness visit; HTN well-controlled on current regimen; due for age-appropriate screenings.",
        "Next step → order lipid panel and colonoscopy; discuss PSA screening; reinforce lifestyle modifications."
      ],
      details: [
        "Annual wellness examination",
        "HTN (well-controlled) / former smoker (quit 2020)"
      ],
      sections: {
        "Preventive Care Due": [
          "Colonoscopy (age 55 - first screening due) {{1}}",
          "Lipid panel (last checked 2 years ago) {{2}}",
          "Consider PSA discussion {{3}}"
        ],
        "Current Medications": [
          "Lisinopril 20mg daily {{4}}",
          "Aspirin 81mg daily {{5}}"
        ],
        "Vitals": [
          "BP 128/78 (well controlled) {{6}}",
          "BMI 28.5 (overweight) {{7}}",
          "Weight stable {{7}}"
        ],
        "Health Maintenance": [
          "Flu vaccine due (fall) {{8}}",
          "Tdap up to date {{9}}",
          "Continue current medications {{4}}"
        ]
      },
      citations: [
        { number: 1, citedText: "colonoscopy", quote: "55-year-old male, due for first-time colorectal cancer screening with colonoscopy per USPSTF guidelines", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 2, citedText: "lipid panel", quote: "Last lipid panel: 01/12/2022 (Total cholesterol 195, LDL 118, HDL 52, TG 125) - repeat due", source: "Jan 12, 2022, Lab results, Athena" },
        { number: 3, citedText: "PSA", quote: "Discuss prostate cancer screening (PSA) - patient age 55, no documented family history", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 4, citedText: "lisinopril", quote: "Current medications: Lisinopril 20mg daily for hypertension, continue current regimen", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 5, citedText: "aspirin", quote: "Aspirin 81mg daily for cardiovascular prevention", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 6, citedText: "blood pressure", quote: "BP 128/78 mmHg - well controlled on current antihypertensive", source: "Feb 12, Today's visit, Ambient" },
        { number: 7, citedText: "weight and BMI", quote: "Weight 210 lbs (stable), Height 5'11\", BMI 28.5 (overweight)", source: "Feb 12, Today's visit, Ambient" },
        { number: 8, citedText: "flu vaccine", quote: "Influenza vaccine due this fall season", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 9, citedText: "Tdap", quote: "Tdap administered 05/2021, up to date", source: "Jan 20, 2024, Annual wellness visit, Athena" }
      ],
      careNudges: [
        {
          type: "Screening Due",
          description: "Order colonoscopy - age 55, first screening due.",
          highlightId: "james-preventive-care-due-0"
        },
        {
          type: "Labs",
          description: "Order fasting lipid panel - last checked 2 years ago.",
          highlightId: "james-preventive-care-due-1"
        },
        {
          type: "Shared Decision",
          description: "Discuss PSA screening - age 55, no documented family history.",
          highlightId: "james-preventive-care-due-2"
        },
        {
          type: "Immunization",
          description: "Administer flu vaccine - fall season, annual due.",
          highlightId: "james-health-maintenance-0"
        }
      ],
      dataSources: [
        "Feb 12, Today's visit, Ambient",
        "Jan 20, 2024, Annual wellness visit, Athena",
        "Jan 12, 2022, Lab results, Athena"
      ]
    },
    { 
      name: "Lisa Anderson", 
      age: 28, 
      gender: "F", 
      time: "11:00 am", 
      status: "Generated", 
      chiefComplaint: "Migraine Headaches",
      atAGlance: [
        "Chronic migraines; current preventive therapy showing limited benefit; significant impact on daily function.",
        "Next step → consider switching to CGRP inhibitor; optimize acute treatment; rule out medication overuse."
      ],
      details: [
        "Follow-up for chronic migraines",
        "Migraines / Anxiety"
      ],
      sections: {
        "Headache Pattern": [
          "4-6 migraine days per month (up from 3-4) {{1}}",
          "Moderate to severe intensity; typically unilateral {{2}}",
          "Associated with photophobia, nausea, occasionally visual aura {{3}}"
        ],
        "Current Medications": [
          "Preventive: Propranolol 80mg daily x 3 months {{4}}",
          "Acute: Sumatriptan 100mg (using 2-3x/week) {{5}}",
          "Sertraline 50mg daily (for anxiety) {{6}}"
        ],
        "Treatment Response": [
          "Limited response to current preventive regimen {{7}}",
          "Frequency increasing despite propranolol {{1}}",
          "Sumatriptan effective but using frequently {{5}}"
        ],
        "Triggers": [
          "Stress, poor sleep, skipping meals {{8}}",
          "Hormonal fluctuation (perimenstrual) {{9}}",
          "Bright lights, strong odors {{8}}"
        ],
        "Vitals": [
          "BP 108/70; HR 58 (on beta-blocker) {{10}}",
          "Weight stable {{11}}"
        ],
        "Impact": [
          "Missing work 1-2 days per month {{12}}",
          "Significant effect on quality of life {{12}}",
          "Patient interested in more effective prevention {{12}}"
        ]
      },
      citations: [
        { number: 1, citedText: "frequency", quote: "Migraine frequency increased to 4-6 days/month (was 3-4 at last visit)", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 2, citedText: "intensity", quote: "Moderate to severe intensity, typically unilateral", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 3, citedText: "associated symptoms", quote: "Associated with photophobia, nausea, occasionally visual aura", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 4, citedText: "propranolol", quote: "Started preventive therapy: Propranolol 80mg daily. Follow up in 3 months to assess response.", source: "Oct 15, 2023, Neurology consult, Athena" },
        { number: 5, citedText: "sumatriptan", quote: "Continue acute therapy: Sumatriptan 100mg PRN. Patient using 2-3x/week, effective but frequent use approaching medication overuse threshold.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 6, citedText: "sertraline", quote: "Continue Sertraline 50mg daily for comorbid anxiety disorder", source: "Oct 15, 2023, Neurology consult, Athena" },
        { number: 7, citedText: "treatment response", quote: "Limited response to propranolol after 3 months of therapy", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 8, citedText: "lifestyle triggers", quote: "Triggers: stress, poor sleep, skipping meals, bright lights, strong odors", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 9, citedText: "hormonal triggers", quote: "Hormonal fluctuation (perimenstrual) noted as trigger", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 10, citedText: "vital signs", quote: "BP 108/70 mmHg, HR 58 bpm (bradycardia on beta-blocker)", source: "Feb 12, Today's visit, Ambient" },
        { number: 11, citedText: "weight", quote: "Weight 135 lbs (stable from previous visits)", source: "Feb 12, Today's visit, Ambient" },
        { number: 12, citedText: "functional impact", quote: "Missing work 1-2 days per month due to migraines. Significant effect on quality of life. Patient expresses strong interest in more effective prevention.", source: "Jan 30, Follow-up visit, Ambient" }
      ],
      careNudges: [
        {
          type: "Medication Switch",
          description: "Switch to erenumab 70mg monthly - propranolol ineffective after 3 months.",
          highlightId: "lisa-treatment-response-1"
        },
        {
          type: "Medication Overuse",
          description: "Assess for MOH - sumatriptan 2-3x/week approaching threshold.",
          highlightId: "lisa-current-medications-1"
        },
        {
          type: "Lifestyle Management",
          description: "Refer to behavioral health for stress and sleep hygiene.",
          highlightId: "lisa-triggers-0"
        }
      ],
      dataSources: [
        "Feb 12, Today's visit, Ambient",
        "Jan 30, Follow-up visit, Ambient",
        "Oct 15, 2023, Neurology consult, Athena"
      ]
    },
  ];

  // Helper function to auto-resize textarea
  const adjustTextareaHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  // Helper function to generate prechart content from previsit data with citations
  const generatePrechartContent = () => {
    const patient = patients[selectedPatientIndex];
    
    // Subjective: Chief complaint + context from previsit with citations
    let subjective = `Chief Complaint: ${patient.chiefComplaint}\n\n`;
    subjective += `History of Present Illness:\n[To be documented during visit: onset, duration, character, location, severity, aggravating/alleviating factors, associated symptoms, course since onset]\n\n`;
    
    // Add at a glance with citations
    subjective += `Context from chart review:\n`;
    patient.atAGlance.forEach((item, idx) => {
      // Find citation for this item from patient.citations
      const citationNumbers = patient.citations
        ?.filter(c => item.includes(c.citedText))
        .map(c => c.number)
        .sort((a, b) => a - b);
      
      if (citationNumbers && citationNumbers.length > 0) {
        subjective += `${item} {{${citationNumbers[0]}}}\n`;
      } else {
        subjective += `${item}\n`;
      }
    });
    
    // Add medical history with citations
    if (patient.sections['Medical History']) {
      subjective += `\n\nPast Medical History: `;
      const historyItems = patient.sections['Medical History'];
      historyItems.forEach((item, idx) => {
        const citationNumbers = patient.citations
          ?.filter(c => item.includes(c.citedText))
          .map(c => c.number)
          .sort((a, b) => a - b);
        
        if (citationNumbers && citationNumbers.length > 0) {
          subjective += `${item} {{${citationNumbers[0]}}}`;
        } else {
          subjective += item;
        }
        
        if (idx < historyItems.length - 1) {
          subjective += '; ';
        }
      });
    }
    
    // Add medications with citations
    if (patient.sections['Current Medications']) {
      subjective += `\n\nCurrent Medications: `;
      const medItems = patient.sections['Current Medications'];
      medItems.forEach((item, idx) => {
        const citationNumbers = patient.citations
          ?.filter(c => item.includes(c.citedText))
          .map(c => c.number)
          .sort((a, b) => a - b);
        
        if (citationNumbers && citationNumbers.length > 0) {
          subjective += `${item} {{${citationNumbers[0]}}}`;
        } else {
          subjective += item;
        }
        
        if (idx < medItems.length - 1) {
          subjective += '; ';
        }
      });
    }
    
    // Objective: Vitals + to be documented
    let objective = '';
    if (patient.sections['Vitals']) {
      objective += `Pre-visit Vitals:\n`;
      patient.sections['Vitals'].forEach((item, idx) => {
        const citationNumbers = patient.citations
          ?.filter(c => item.includes(c.citedText))
          .map(c => c.number)
          .sort((a, b) => a - b);
        
        if (citationNumbers && citationNumbers.length > 0) {
          objective += `${item} {{${citationNumbers[0]}}}\n`;
        } else {
          objective += `${item}\n`;
        }
      });
      objective += `\n`;
    }
    objective += `Review of Systems:\n[To be documented during visit: constitutional, HEENT, cardiovascular, respiratory, GI, GU, musculoskeletal, neurologic, psychiatric, skin]\n\n`;
    objective += `Physical Examination:\n[To be documented during visit: general appearance, vital signs, relevant system examination based on chief complaint]`;
    
    // Assessment: To be documented
    const assessment = `[To be documented during visit: primary diagnosis, differential diagnoses, clinical reasoning based on history and physical examination]`;
    
    // Plan: Can reference care nudges
    let plan = `[To be documented during visit:]\n`;
    plan += `- Diagnostic studies (labs, imaging, etc.)\n`;
    plan += `- Medications (new, adjusted, or continued)\n`;
    plan += `- Referrals or consultations\n`;
    plan += `- Patient education and counseling\n`;
    plan += `- Follow-up instructions and timeline`;
    
    return { subjective, objective, assessment, plan };
  };

  // Helper function to render prechart text with citations
  const renderPrechartTextWithCitations = (text: string) => {
    const patient = patients[selectedPatientIndex];
    const citations = patient.citations || [];
    
    // Split by both citation markers and placeholder brackets
    const parts = text.split(/(\{\{\d+\}\}|\[.*?\])/g);
    
    return parts.map((part, idx) => {
      // Check if it's a citation marker
      const citationMatch = part.match(/\{\{(\d+)\}\}/);
      if (citationMatch) {
        const citationNum = parseInt(citationMatch[1]);
        const citation = citations.find(c => c.number === citationNum);
        const isActive = activeCitation === citationNum;
        
        return (
          <span 
            key={idx}
            data-citation-badge
            className={`inline-flex items-center justify-center font-bold text-[10px] cursor-pointer transition-colors mx-[2px] ${
              isActive 
                ? 'bg-[var(--text-brand,#1132ee)] text-white' 
                : 'bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)]'
            }`}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '2px',
              verticalAlign: 'baseline'
            }}
            onMouseEnter={(e) => {
              setActiveCitation(citationNum);
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.top
              });
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (activeCitation === citationNum) {
                setActiveCitation(null);
                setTooltipPosition(null);
              } else {
                setActiveCitation(citationNum);
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top
                });
              }
            }}
          >
            {citationMatch[1]}
          </span>
        );
      }
      
      // Check if it's a placeholder bracket
      if (part.match(/^\[.*\]$/)) {
        return <span key={idx} style={{ color: '#999', fontStyle: 'italic' }}>{part}</span>;
      }
      
      // Check if this text should be highlighted for citations
      if (activeCitation && part) {
        const citation = citations.find(c => c.number === activeCitation);
        if (citation && part.toLowerCase().includes(citation.citedText.toLowerCase())) {
          const citedText = citation.citedText;
          const regex = new RegExp(`(${citedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
          const highlighted = part.split(regex).map((segment, segIdx) => {
            if (segment.toLowerCase() === citedText.toLowerCase()) {
              return (
                <mark key={`${idx}-${segIdx}`} className="bg-[#f1f3fe] text-inherit" style={{ padding: 0 }}>
                  {segment}
                </mark>
              );
            }
            return <span key={`${idx}-${segIdx}`}>{segment}</span>;
          });
          return <span key={idx}>{highlighted}</span>;
        }
      }
      
      return <span key={idx}>{part}</span>;
    });
  };

  // Helper function to render text with citation badges
  const renderTextWithCitations = (text: string, citationsData: any[]) => {
    // Parse text for {{number}} patterns and render citation badges
    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    const regex = /\{\{(\d+)\}\}/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) {
        parts.push(beforeText);
      }

      const citationNum = parseInt(match[1], 10);
      const citation = citationsData.find(c => c.number === citationNum);
      const isActive = activeCitation === citationNum;

      parts.push(
        <span
          key={`citation-${citationNum}-${match.index}`}
          data-citation-badge
          className={`inline-flex items-center justify-center rounded-[2px] text-[10px] font-bold leading-none transition-colors cursor-pointer ${
            isActive 
              ? 'bg-[var(--text-brand,#1132ee)] text-white' 
              : 'bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)]'
          }`}
          style={{
            width: '14px',
            height: '14px',
            verticalAlign: 'baseline',
            marginLeft: '2px',
            marginRight: '2px'
          }}
          onMouseEnter={(e) => {
            if (citation) {
              const rect = e.currentTarget.getBoundingClientRect();
              setActiveCitation(citationNum);
              setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.bottom });
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (citation) {
              const rect = e.currentTarget.getBoundingClientRect();
              setActiveCitation(activeCitation === citationNum ? null : citationNum);
              setTooltipPosition(activeCitation === citationNum ? null : { x: rect.left + rect.width / 2, y: rect.bottom });
            }
          }}
        >
          {citationNum}
        </span>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeCitation && 
          !target.closest('[data-citation-badge]') && 
          !target.closest('[data-citation-tooltip]')) {
        setActiveCitation(null);
        setTooltipPosition(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeCitation]);

  // If scribes view is selected, render the Scribes component
  if (currentView === 'scribes') {
    return <Scribes 
      onNavigateToVisits={() => setCurrentView('visits')} 
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
      rightTab={rightTab}
      setRightTab={setRightTab}
    />;
  }

  return (
    <div className="bg-white content-stretch flex items-start relative w-full h-screen">
      {/* Left Sidebar Navigation */}
      <div className="content-stretch flex h-full isolate items-center relative shrink-0">
        <div className="content-stretch flex h-full items-start justify-center relative shrink-0 w-[72px] z-[2]">
          <div className="bg-[var(--surface-1,#f7f7f7)] border-[var(--shape-outline,rgba(0,0,0,0.1))] border-r border-solid content-stretch flex flex-[1_0_0] flex-col h-full items-center min-h-px min-w-px relative">
            {/* Logo */}
            <div className="content-stretch flex h-[48px] items-center justify-center px-[8px] relative shrink-0 w-full">
              <button className="content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[36px] cursor-pointer hover:bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))] transition-colors">
                <InlineIcon name="hexagon" size={24} />
              </button>
            </div>
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
            
            {/* Nav Items */}
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center min-h-px min-w-px overflow-clip px-[4px] py-[16px] relative w-full">
              {/* Visits - Selected */}
              <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full">
                <div className="bg-[var(--nav-button,rgba(17,50,238,0.12))] content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] text-[color:var(--text-brand,#1132ee)]">
                  <InlineIcon name="stethoscope" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-brand,#1132ee)] tracking-[-0.36px]">
                  Visits
                </p>
              </div>
              
              {/* Scribes */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onClick={() => setCurrentView('scribes')}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="magic_document" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Scribes
                </p>
              </button>
              
              {/* Customize */}
              <button className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group">
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="magic_edit" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Customize
                </p>
              </button>
              
              {/* Assistant */}
              <button className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group">
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="sparkle" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Assistant
                </p>
              </button>
              
              {/* Admin */}
              <button className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group">
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="analytics" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Admin
                </p>
              </button>
            </div>
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
            
            {/* Footer */}
            <div className="content-stretch flex flex-col gap-[8px] items-center pb-[24px] pt-[16px] relative shrink-0 w-full">
              <button className="content-stretch flex flex-col gap-[4px] items-center justify-center relative rounded-[6px] shrink-0 size-[36px] cursor-pointer hover:bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))] transition-colors text-[color:var(--text-subheading,#666)]">
                <InlineIcon name="help" size={20} />
              </button>
              <button className="content-stretch cursor-pointer flex flex-col gap-[4px] items-center justify-center relative rounded-[6px] shrink-0 size-[36px] hover:bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))] transition-colors text-[color:var(--text-subheading,#666)]">
                <InlineIcon name="settings" size={20} />
              </button>
              {/* User Avatar */}
              <button className="content-stretch cursor-pointer flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 size-[40px] hover:bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))] transition-colors">
                <div className="bg-[var(--orange-200,#ffd699)] content-stretch flex items-center justify-center overflow-clip p-[8px] relative rounded-[64px] shrink-0 size-[36px]">
                  <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[17px] text-[color:var(--text-default,black)] text-center tracking-[0.34px] whitespace-nowrap">
                    <p className="leading-[1.2]">A</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Patient List */}
        <div className="bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[220px] z-[1]">
          {/* Date Header */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex h-[48px] items-center min-h-[48px] px-[8px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[28px] items-center min-h-px min-w-px p-[4px] relative rounded-[6px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Mar 20, Today
                  </p>
                </div>
                <div className="content-stretch flex gap-[2px] items-center relative shrink-0">
                  <IconButton 
                    variant="tertiary" 
                    size="small"
                    icon={<InlineIcon name="keyboard_arrow_left" size={16} />}
                    onClick={() => {}}
                    aria-label="Previous day"
                    className="text-[color:var(--text-subheading,#666)]"
                  />
                  <IconButton 
                    variant="tertiary" 
                    size="small"
                    icon={<InlineIcon name="keyboard_arrow_right" size={16} />}
                    onClick={() => {}}
                    aria-label="Next day"
                    className="text-[color:var(--text-subheading,#666)]"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Search/Filter Buttons */}
          <div className="content-stretch flex flex-col gap-[4px] items-start px-[4px] relative shrink-0 w-full">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
              <Button 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name="search" size={16} />}
                onClick={() => {}}
              >
                Search
              </Button>
              <Button 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name="filter_list" size={16} />}
                onClick={() => {}}
              >
                Filter
              </Button>
            </div>
          </div>
          
          {/* Patient List */}
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full overflow-y-auto">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                {patients.map((patient, index) => (
                  <PatientListItem 
                    key={index} 
                    {...patient} 
                    isSelected={index === selectedPatientIndex}
                    onClick={() => setSelectedPatientIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* New Instant Visit Button */}
          <div className="content-stretch flex flex-col items-start relative shrink-0">
            <div className="bg-[var(--surface-base,white)] content-stretch flex flex-col gap-[8px] items-end justify-center overflow-clip pb-[24px] pt-[8px] px-[12px] relative shrink-0 w-[220px]">
              <Button 
                variant="secondary" 
                size="large"
                icon={<InlineIcon name="mic" size={24} />}
                onClick={() => {}}
                className="w-full"
              >
                Instant Visit
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px relative">
        <div className="content-stretch flex flex-[1_0_0] flex-col items-center min-h-px min-w-px px-[20px] relative w-full">
          {/* Header */}
          <div className="content-stretch flex flex-col gap-[6px] max-w-[800px] py-[8px] relative shrink-0 w-full">
            <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[24px] text-[color:var(--text-default,black)]">
                {patients[selectedPatientIndex].name}
              </p>
              <div className="flex flex-[1_0_0]" />
              {/* Button Group */}
              <ButtonGroup
                orientation="horizontal"
                size="small"
                options={[
                  { id: 'previsit', label: 'Previsit' },
                  { id: 'note', label: 'Prechart' }
                ]}
                value={activeTab}
                onChange={(value) => setActiveTab(value as 'previsit' | 'note')}
              />
            </div>
            
            {/* Patient Info */}
            <div className="content-stretch flex font-['Lato',sans-serif] gap-[4px] items-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px] whitespace-nowrap">
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{patients[selectedPatientIndex].age}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{patients[selectedPatientIndex].gender}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-ellipsis"><p className="leading-[1.4] overflow-hidden">{patients[selectedPatientIndex].chiefComplaint}</p></div>
            </div>
          </div>
          
          {/* Main Content - Scrollable */}
          <div className="content-stretch flex flex-col items-start max-w-[800px] relative shrink-0 w-full overflow-y-auto flex-1">
            {activeTab === 'previsit' && (
              <>
            {/* At a Glance Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              <div className="content-stretch flex flex-col items-start relative shrink-0">
                <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] min-h-[21px] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                  <p className="leading-[1.2] whitespace-pre-wrap">At a Glance</p>
                </div>
              </div>
              <div className="content-stretch flex flex-col items-start justify-center relative rounded-[8px] shrink-0 w-full">
                <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                  <ul className="list-disc whitespace-pre-wrap">
                    {patients[selectedPatientIndex].atAGlance.map((item, idx) => (
                      <li key={idx} className={idx === 0 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}>
                        <span className="leading-[1.4]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Details Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                <p className="leading-[1.2]">Details</p>
              </div>
              <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                <ul className="list-disc whitespace-pre-wrap">
                  {patients[selectedPatientIndex].details.map((item, idx) => (
                    <li key={idx} className={idx === 0 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}>
                      <span className="leading-[1.4]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Dynamic Sections */}
            {Object.entries(patients[selectedPatientIndex].sections).map(([sectionTitle, items]) => {
              // Helper to generate highlight IDs for content
              const getHighlightId = (section: string, itemIdx: number) => {
                const patientFirstName = patients[selectedPatientIndex].name.split(' ')[0].toLowerCase();
                const sectionKey = section.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-+|-+$/g, '');
                return `${patientFirstName}-${sectionKey}-${itemIdx}`;
              };
              
              // Check if any item in this section should be highlighted
              const hoveredHighlightId = hoveredNudge && 
                patients[hoveredNudge.patientIndex]?.careNudges?.[hoveredNudge.nudgeIndex]?.highlightId;
              
              return (
                <div key={sectionTitle} className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    <p className="leading-[1.2]">{sectionTitle}</p>
                  </div>
                  <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                    <ul className="list-disc whitespace-pre-wrap">
                      {items.map((item, idx) => {
                        const highlightId = getHighlightId(sectionTitle, idx);
                        const isHighlighted = hoveredHighlightId === highlightId;
                        
                        return (
                          <li 
                            key={idx} 
                            className={idx === 0 && items.length > 1 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}
                            data-highlight-id={highlightId}
                          >
                            {isHighlighted ? (
                              <mark className="bg-[#f1f3fe] text-inherit leading-[1.4]" style={{ padding: 0 }}>
                                {renderTextWithCitations(item, patients[selectedPatientIndex].citations || [])}
                              </mark>
                            ) : (
                              <span className="leading-[1.4]">
                                {renderTextWithCitations(item, patients[selectedPatientIndex].citations || [])}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
              </>
            )}
            
            {activeTab === 'note' && (() => {
              const prechartContent = generatePrechartContent();
              
              return (
              <>
                {/* Prechart Note Header */}
                <div className="content-stretch flex items-center relative shrink-0 w-full pb-[32px] pt-[8px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Clinical Note (SOAP)
                  </p>
                </div>
                
                {/* Subjective Section */}
                <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  {/* Section Title & CTAs */}
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Subjective
                    </p>
                    <div className="flex gap-[4px] items-center shrink-0">
                      {editingPrechartSection === 'subjective' ? (
                        <>
                          <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                            <InlineIcon name="mic" size={16} />
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Dictate
                            </p>
                          </div>
                          <div 
                            className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                            onClick={() => setEditingPrechartSection(null)}
                          >
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Done
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="edit" size={16} />}
                          onClick={() => {
                            setEditedPrechartContent({ ...editedPrechartContent, subjective: prechartContent.subjective.replace(/\{\{(\d+)\}\}/g, '') });
                            setEditingPrechartSection('subjective');
                          }}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="mic" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {editingPrechartSection === 'subjective' ? (
                    <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                      <textarea
                        autoFocus
                        ref={(el) => adjustTextareaHeight(el)}
                        value={editedPrechartContent.subjective}
                        onChange={(e) => {
                          setEditedPrechartContent({ ...editedPrechartContent, subjective: e.target.value });
                          adjustTextareaHeight(e.target);
                        }}
                        className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[#111827] tracking-[0.15px] w-full p-[8px] rounded-[6px] resize-none overflow-hidden border-0 outline-none bg-transparent"
                        style={{ minHeight: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full cursor-pointer"
                      onClick={() => {
                        setEditedPrechartContent({ ...editedPrechartContent, subjective: prechartContent.subjective.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingPrechartSection('subjective');
                      }}
                    >
                      <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                          {renderPrechartTextWithCitations(editedPrechartContent.subjective || prechartContent.subjective)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                
                {/* Objective Section */}
                <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  {/* Section Title & CTAs */}
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Objective
                    </p>
                    <div className="flex gap-[4px] items-center shrink-0">
                      {editingPrechartSection === 'objective' ? (
                        <>
                          <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                            <InlineIcon name="mic" size={16} />
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Dictate
                            </p>
                          </div>
                          <div 
                            className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                            onClick={() => setEditingPrechartSection(null)}
                          >
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Done
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="edit" size={16} />}
                          onClick={() => {
                            setEditedPrechartContent({ ...editedPrechartContent, objective: prechartContent.objective.replace(/\{\{(\d+)\}\}/g, '') });
                            setEditingPrechartSection('objective');
                          }}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="mic" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {editingPrechartSection === 'objective' ? (
                    <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                      <textarea
                        autoFocus
                        ref={(el) => adjustTextareaHeight(el)}
                        value={editedPrechartContent.objective}
                        onChange={(e) => {
                          setEditedPrechartContent({ ...editedPrechartContent, objective: e.target.value });
                          adjustTextareaHeight(e.target);
                        }}
                        className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[#111827] tracking-[0.15px] w-full p-[8px] rounded-[6px] resize-none overflow-hidden border-0 outline-none bg-transparent"
                        style={{ minHeight: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full cursor-pointer"
                      onClick={() => {
                        setEditedPrechartContent({ ...editedPrechartContent, objective: prechartContent.objective.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingPrechartSection('objective');
                      }}
                    >
                      <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                          {renderPrechartTextWithCitations(editedPrechartContent.objective || prechartContent.objective)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Assessment Section */}
                <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  {/* Section Title & CTAs */}
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Assessment
                    </p>
                    <div className="flex gap-[4px] items-center shrink-0">
                      {editingPrechartSection === 'assessment' ? (
                        <>
                          <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                            <InlineIcon name="mic" size={16} />
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Dictate
                            </p>
                          </div>
                          <div 
                            className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                            onClick={() => setEditingPrechartSection(null)}
                          >
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Done
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="edit" size={16} />}
                          onClick={() => {
                            setEditedPrechartContent({ ...editedPrechartContent, assessment: prechartContent.assessment.replace(/\{\{(\d+)\}\}/g, '') });
                            setEditingPrechartSection('assessment');
                          }}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="mic" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {editingPrechartSection === 'assessment' ? (
                    <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                      <textarea
                        autoFocus
                        ref={(el) => adjustTextareaHeight(el)}
                        value={editedPrechartContent.assessment}
                        onChange={(e) => {
                          setEditedPrechartContent({ ...editedPrechartContent, assessment: e.target.value });
                          adjustTextareaHeight(e.target);
                        }}
                        className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[#111827] tracking-[0.15px] w-full p-[8px] rounded-[6px] resize-none overflow-hidden border-0 outline-none bg-transparent"
                        style={{ minHeight: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full cursor-pointer"
                      onClick={() => {
                        setEditedPrechartContent({ ...editedPrechartContent, assessment: prechartContent.assessment.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingPrechartSection('assessment');
                      }}
                    >
                      <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                          {renderPrechartTextWithCitations(editedPrechartContent.assessment || prechartContent.assessment)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Plan Section */}
                <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  {/* Section Title & CTAs */}
                  <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Plan
                    </p>
                    <div className="flex gap-[4px] items-center shrink-0">
                      {editingPrechartSection === 'plan' ? (
                        <>
                          <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                            <InlineIcon name="mic" size={16} />
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Dictate
                            </p>
                          </div>
                          <div 
                            className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                            onClick={() => setEditingPrechartSection(null)}
                          >
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              Done
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="edit" size={16} />}
                          onClick={() => {
                            setEditedPrechartContent({ ...editedPrechartContent, plan: prechartContent.plan.replace(/\{\{(\d+)\}\}/g, '') });
                            setEditingPrechartSection('plan');
                          }}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="mic" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  {editingPrechartSection === 'plan' ? (
                    <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                      <textarea
                        autoFocus
                        ref={(el) => adjustTextareaHeight(el)}
                        value={editedPrechartContent.plan}
                        onChange={(e) => {
                          setEditedPrechartContent({ ...editedPrechartContent, plan: e.target.value });
                          adjustTextareaHeight(e.target);
                        }}
                        className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[#111827] tracking-[0.15px] w-full p-[8px] rounded-[6px] resize-none overflow-hidden border-0 outline-none bg-transparent"
                        style={{ minHeight: 'auto' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full cursor-pointer"
                      onClick={() => {
                        setEditedPrechartContent({ ...editedPrechartContent, plan: prechartContent.plan.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingPrechartSection('plan');
                      }}
                    >
                      <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                          {renderPrechartTextWithCitations(editedPrechartContent.plan || prechartContent.plan)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
              );
            })()}
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex items-center max-w-[800px] pb-[24px] pt-[8px] px-[20px] relative shrink-0 w-full">
            <Button 
              variant="primary" 
              size="large"
              icon={<InlineIcon name="mic" size={24} />}
              onClick={() => {}}
            >
              Start Visit with {patients[selectedPatientIndex].name}
            </Button>
          </div>
        </div>
      </div>

      {/* Citation Tooltip */}
      {activeCitation !== null && tooltipPosition && (() => {
        const citation = (patients[selectedPatientIndex].citations || []).find(c => c.number === activeCitation);
        if (!citation) return null;

        const availableSpaceBelow = window.innerHeight - tooltipPosition.y;
        const tooltipHeight = 120;
        const showAbove = availableSpaceBelow < tooltipHeight + 20;
        
        let topPosition: number;
        let transformValue: string;
        
        if (showAbove) {
          topPosition = tooltipPosition.y - 8;
          transformValue = 'translate(-50%, -100%)';
        } else {
          topPosition = tooltipPosition.y + 8;
          transformValue = 'translate(-50%, 0)';
        }

        return (
          <>
            {/* Invisible bridge between badge and tooltip */}
            <div
              style={{
                position: 'fixed',
                left: `${tooltipPosition.x}px`,
                top: showAbove ? `${tooltipPosition.y - 16}px` : `${tooltipPosition.y}px`,
                width: '20px',
                height: '16px',
                transform: showAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                pointerEvents: 'auto',
                zIndex: 9998
              }}
              onMouseEnter={() => {
                setActiveCitation(activeCitation);
                setTooltipPosition(tooltipPosition);
              }}
            />
            
            {/* Tooltip */}
            <div
              data-citation-tooltip
              className="bg-white border border-[var(--neutral-200,#ccc)] rounded-[6px] shadow-lg p-[12px] w-[240px]"
              style={{
                position: 'fixed',
                left: `${tooltipPosition.x}px`,
                top: `${topPosition}px`,
                transform: transformValue,
                zIndex: 9999,
                pointerEvents: 'auto'
              }}
              onMouseEnter={() => {
                setActiveCitation(activeCitation);
                setTooltipPosition(tooltipPosition);
              }}
              onMouseLeave={() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }}
            >
              <p className="font-['Lato',sans-serif] text-[13px] text-[color:var(--text-subheading,#666)] leading-[1.4] italic mb-[8px]">
                "{citation.quote}"
              </p>
              <Link 
                label={citation.source}
                size="xsmall" 
                intent="neutral"
                showPrefix={false}
                showSuffix={false}
                onClick={() => {
                  setViewingDataSource(citation.source);
                  setRightTab('actions');
                  setActiveCitation(null);
                  setTooltipPosition(null);
                }}
              />
            </div>
          </>
        );
      })()}
      
      {/* Right Sidebar - For this visit */}
      <div className="bg-white border-l border-[var(--neutral-200,#ccc)] content-stretch flex flex-col h-full items-start overflow-hidden relative shrink-0 w-[375px]">
        {/* Header - hidden when viewing data source */}
        {!viewingDataSource && (
          <div className="content-stretch flex items-center px-[20px] pt-[20px] pb-[12px] relative shrink-0 w-full">
            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[17px] text-[color:var(--text-default,black)] tracking-[0.34px]">
              For this visit
            </p>
          </div>
        )}
        
        {/* Tabs with full width divider - hidden when viewing data source */}
        {!viewingDataSource && (
          <div className="w-full border-b border-[var(--neutral-200,#ccc)]">
            <div className="px-[20px]">
              <Tabs
                variant="primary"
                tabs={[
                  { id: 'actions', label: 'Actions' },
                  { id: 'chat', label: 'Chat' }
                ]}
                defaultTab={rightTab}
                onTabChange={(id) => setRightTab(id as 'actions' | 'chat')}
                hideBorder={true}
              />
            </div>
          </div>
        )}
        
        {/* Content Area - Scrollable */}
        <div className={`content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px overflow-y-auto px-[20px] relative w-full ${viewingDataSource ? 'pt-[20px] pb-[20px]' : 'py-[20px]'}`}>
          {rightTab === 'chat' ? (
            /* Chat View */
            <div className="content-stretch flex flex-col gap-[16px] items-start relative w-full">
              {(chatMessages[patients[selectedPatientIndex].name] || []).map((message, idx) => (
                message.type === 'user' ? (
                  /* User Message */
                  <div key={idx} className="content-stretch flex flex-col items-end pl-[44px] relative shrink-0 w-full">
                    <div className="bg-[var(--surface-1,#f7f7f7)] content-stretch flex flex-col items-center justify-center p-[12px] relative rounded-[8px] shrink-0">
                      <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Assistant Response */
                  <div key={idx} className="content-stretch flex flex-col gap-[12px] items-center justify-center py-[6px] relative shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[15px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                      <div className="content-stretch flex gap-[8px] h-[28px] items-center relative shrink-0">
                        <Button
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="content_copy" size={16} />}
                          onClick={() => {}}
                        >
                          Copy
                        </Button>
                      </div>
                      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="thumb_up" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                        <IconButton
                          variant="tertiary"
                          size="small"
                          icon={<InlineIcon name="thumb_down" size={16} />}
                          onClick={() => {}}
                          className="text-[color:var(--text-brand,#1132ee)]"
                        />
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : viewingDataSource ? (
            /* Data Source View */
            <>
              {/* Back Button */}
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <Button
                  variant="tertiary-neutral"
                  size="small"
                  icon={<InlineIcon name="keyboard_arrow_left" size={16} />}
                  onClick={() => setViewingDataSource(null)}
                >
                  Back
                </Button>
              </div>
              
              {/* Data Source Content */}
              {dataSourceContent[patients[selectedPatientIndex].name]?.[viewingDataSource] && (
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                  {/* Source Header */}
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <div 
                      className="inline-flex items-center px-[8px] py-[4px] rounded-[4px]"
                      style={{
                        backgroundColor: getDocumentTypeBadgeColor(dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].type).bg
                      }}
                    >
                      <p 
                        className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px] uppercase"
                        style={{
                          color: getDocumentTypeBadgeColor(dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].type).text
                        }}
                      >
                        {dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].type}
                      </p>
                    </div>
                    <p className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                      {dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].date}
                    </p>
                  </div>
                  
                  {/* Source Content */}
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <pre className="font-['Lato',sans-serif] leading-[1.6] text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] w-full whitespace-pre-wrap">
                      {dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].content}
                    </pre>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Actions View */
            <>
              {/* Visit Settings Card */}
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Visit Settings
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isVisitSettingsExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsVisitSettingsExpanded(!isVisitSettingsExpanded)}
                aria-label={isVisitSettingsExpanded ? "Collapse visit settings" : "Expand visit settings"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isVisitSettingsExpanded && (
            <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
              {/* Template Dropdown */}
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-default,black)] tracking-[0.24px] w-[56px]" style={{ fontFeatureSettings: "'ss07'" }}>
                  Template
                </p>
                <div className="flex-[1_0_0]">
                  <TextField
                    size="compact"
                    value="SOAP template"
                    readOnly
                    suffix={<InlineIcon name="arrow_drop_down" size={20} />}
                  />
                </div>
              </div>
              
              {/* Visit Type Toggle */}
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-default,black)] tracking-[0.24px] w-[56px]" style={{ fontFeatureSettings: "'ss07'" }}>
                  Visit Type
                </p>
                <ButtonGroup
                  orientation="horizontal"
                  size="small"
                  options={[
                    { id: 'inperson', label: 'In-Person' },
                    { id: 'virtual', label: 'Virtual' }
                  ]}
                  value="inperson"
                  onChange={() => {}}
                  className="flex-[1_0_0]"
                />
              </div>
            </div>
            )}
          </div>
          
          {/* Care Nudges Card */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Care Nudges
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isCareNudgesExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsCareNudgesExpanded(!isCareNudgesExpanded)}
                aria-label={isCareNudgesExpanded ? "Collapse care nudges" : "Expand care nudges"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isCareNudgesExpanded && (
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {(patients[selectedPatientIndex].careNudges || []).map((nudge, idx) => {
                if (dismissedNudges[selectedPatientIndex]?.has(idx)) {
                  return null;
                }
                
                return (
                  <div 
                    key={idx} 
                    className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)] transition-colors"
                    onMouseEnter={() => setHoveredNudge({patientIndex: selectedPatientIndex, nudgeIndex: idx})}
                    onMouseLeave={() => setHoveredNudge(null)}
                    onClick={() => {
                      if (nudge.highlightId) {
                        const element = document.querySelector(`[data-highlight-id="${nudge.highlightId}"]`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }
                    }}
                  >
                    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                      <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                        {nudge.type}
                      </p>
                      <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                        {nudge.description}
                      </p>
                    </div>
                    <IconButton 
                      variant="tertiary" 
                      size="small"
                      icon={<InlineIcon name="close_small" size={16} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDismissedNudges(prev => ({
                          ...prev,
                          [selectedPatientIndex]: new Set([...(prev[selectedPatientIndex] || []), idx])
                        }));
                      }}
                      aria-label={`Dismiss ${nudge.type}`}
                      className="shrink-0 text-[color:var(--text-subheading,#666)]"
                    />
                  </div>
                );
              })}
            </div>
            )}
          </div>
          
          {/* Data Sources Card */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Data Sources
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isDataSourcesExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsDataSourcesExpanded(!isDataSourcesExpanded)}
                aria-label={isDataSourcesExpanded ? "Collapse data sources" : "Expand data sources"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isDataSourcesExpanded && (
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {(patients[selectedPatientIndex].dataSources || []).map((source, idx) => (
                <Link 
                  key={idx}
                  label={source}
                  size="xsmall"
                  intent="neutral"
                  showPrefix={false}
                  showSuffix={false}
                  onClick={() => {
                    setViewingDataSource(source);
                    setRightTab('actions'); // Ensure we're in actions view
                  }}
                />
              ))}
            </div>
            )}
          </div>
            </>
          )}
        </div>
        
        {/* Chat Input at Bottom */}
        <div className="content-stretch flex gap-[8px] items-start pb-[20px] pl-[8px] pr-[16px] pt-[8px] relative shrink-0 w-full">
          <IconButton 
            variant="tertiary" 
            size="large"
            icon={<InlineIcon name="magic_edit" size={24} />}
            onClick={() => {}}
            aria-label="Magic edit"
            className="shrink-0 text-[color:var(--text-brand,#1132ee)]"
          />
          <div className="flex-[1_0_0] min-w-px">
            <ChatInput
              placeholder="Ask assistant"
              value={chatInputValue}
              onChange={setChatInputValue}
              onSend={() => {
                if (chatInputValue.trim()) {
                  // Switch to chat view and clear data source view
                  setRightTab('chat');
                  setViewingDataSource(null);
                  // Here you would normally add the message to chat
                  console.log('Send message:', chatInputValue);
                  setChatInputValue('');
                }
              }}
              onVoice={() => console.log('Voice input')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
