import { useState, useEffect } from 'react';
import { Button, IconButton } from './components/Button';
import { VisitStatus } from './components/Badge';
import { InlineIcon } from './components/InlineIcon';
import { ButtonGroup } from './components/ButtonGroup';
import { Tabs } from './components/Tabs';
import { ChatInput } from './components/Input';
import { Link } from './components/Link';

// Scribe List Item Component
const ScribeListItem = ({ 
  name, 
  age, 
  gender, 
  duration, 
  isSelected = false,
  onClick
}: { 
  name: string; 
  age: number; 
  gender: string; 
  duration: string; 
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
          <VisitStatus status="Generated" />
        </div>
        <div className="content-stretch flex font-['Lato',sans-serif] gap-[8px] items-start leading-[0] not-italic relative shrink-0 text-[13px] tracking-[0.065px] w-full whitespace-nowrap">
          <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative text-[color:var(--text-subheading,#666)]">
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{age}</p></div>
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
            <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{gender}</p></div>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[color:var(--text-placeholder,#808080)]">
            <p className="leading-[1.4]">{duration}</p>
          </div>
        </div>
      </button>
    </div>
  );
};

// Chat message type
type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
};

export default function Scribes({ 
  onNavigateToVisits,
  chatMessages,
  setChatMessages,
  rightTab,
  setRightTab
}: { 
  onNavigateToVisits?: () => void;
  chatMessages: Record<string, ChatMessage[]>;
  setChatMessages: (messages: Record<string, ChatMessage[]>) => void;
  rightTab: 'actions' | 'chat';
  setRightTab: (tab: 'actions' | 'chat') => void;
}) {
  const [chatInputValue, setChatInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'clinical' | 'summary' | 'codes' | 'transcript'>('clinical');
  const [selectedScribeIndex, setSelectedScribeIndex] = useState(0);
  const [selectedView, setSelectedView] = useState<'default' | 'abnormals' | 'citation'>('default');
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);
  const [isViewsHighlightsExpanded, setIsViewsHighlightsExpanded] = useState(true);
  const [isEditToolsExpanded, setIsEditToolsExpanded] = useState(true);
  const [isImproveScribeExpanded, setIsImproveScribeExpanded] = useState(true);
  const [isDataSourcesExpanded, setIsDataSourcesExpanded] = useState(true);
  const [editingSection, setEditingSection] = useState<'hpi' | 'ros' | 'pe' | null>(null);
  const [editedContent, setEditedContent] = useState<{hpi: string; ros: string; pe: string}>({
    hpi: '',
    ros: '',
    pe: ''
  });
  const [viewingDataSource, setViewingDataSource] = useState<string | null>(null);
  const [dismissedNudges, setDismissedNudges] = useState<Record<number, Set<number>>>({});
  const [hoveredNudge, setHoveredNudge] = useState<{scribeIndex: number, nudgeIndex: number} | null>(null);
  
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
  
  // Data source content for each scribe
  const dataSourceContent: Record<string, Record<string, {type: string, date: string, content: string}>> = {
    "Robert Chen": {
      "Echocardiogram report, 03/15/2024": {
        type: "Diagnostic Report",
        date: "March 15, 2024",
        content: "**ECHOCARDIOGRAM REPORT**\n\nPatient: Robert Chen, 68M\nMRN: 98765432\nDate: 03/15/2024\n\n**MEASUREMENTS**\nLV End-Diastolic Dimension: 6.2 cm\nLV End-Systolic Dimension: 5.4 cm\nLVEF: 30% (by visual estimation)\nPosterior Wall Thickness: 0.9 cm\nIVS Thickness: 1.0 cm\n\n**FINDINGS**\n• Moderate to severe LV systolic dysfunction\n• Global hypokinesis\n• Mild biatrial enlargement\n• Mild mitral regurgitation (functional)\n• Normal right ventricular size and function\n• No pericardial effusion\n\n**IMPRESSION**\nSevere LV systolic dysfunction with LVEF estimated at 30%"
      },
      "Hospital discharge summary, 10/07/2024": {
        type: "Hospital Discharge",
        date: "October 7, 2024",
        content: "**DISCHARGE SUMMARY**\n\nPatient: Robert Chen, 68M\nAdmission Date: 10/03/2024\nDischarge Date: 10/07/2024\n\n**CHIEF COMPLAINT**\nShortness of breath, lower extremity edema\n\n**HOSPITAL COURSE**\nAdmitted for acute decompensated heart failure with volume overload. Initial weight 80.3 kg. Started IV diuresis with bumetanide with good diuretic response. Patient had net negative 4.2L over 4 days.\n\nDischarge weight: 78.2 kg (down 2.1 kg from admission)\n\n**DISCHARGE MEDICATIONS**\n• Metoprolol succinate 25mg BID\n• Bumetanide 2mg daily (increased from 1mg)\n• Entresto 24/26mg BID\n• Spironolactone 12.5mg daily\n• Apixaban 5mg BID\n• Atorvastatin 40mg nightly\n\n**FOLLOW-UP**\nCardiology in 2 weeks"
      },
      "Visit transcript, 00:03:45": {
        type: "Visit Transcript",
        date: "Today",
        content: "**VISIT TRANSCRIPT**\nTime: 00:03:45\n\nDr.: \"How has your breathing been since you left the hospital?\"\n\nPatient: \"I can breathe much better now. I'm not getting winded just walking around the house anymore. Before I went to the hospital, I couldn't even make it to the kitchen without stopping. Now I can do pretty much everything I need to do at home without trouble.\"\n\nDr.: \"That's great to hear. Are you able to walk outside at all?\"\n\nPatient: \"Yeah, I can walk to the mailbox now without getting short of breath. That's about a block. I try to do that every day like you said.\""
      },
      "Home weight monitoring log": {
        type: "Home Monitoring",
        date: "10/07/2024 - Present",
        content: "**HOME WEIGHT LOG**\n\nPatient: Robert Chen\nTarget: <79 kg\n\n10/19: 78.2 kg ✓\n10/18: 78.3 kg ✓\n10/17: 78.5 kg ✓\n10/16: 78.7 kg\n10/15: 78.9 kg\n10/14: 79.1 kg\n10/13: 79.3 kg\n10/12: 79.5 kg\n10/11: 79.8 kg\n10/10: 79.9 kg\n10/09: 80.0 kg\n10/08: 80.2 kg\n10/07: 80.3 kg (discharge weight)\n\nTrend: Steadily decreasing ↓"
      },
      "Home BP monitoring log": {
        type: "Home Monitoring",
        date: "10/15/2024 - 10/19/2024",
        content: "**BLOOD PRESSURE LOG**\n\nPatient: Robert Chen\nTarget: <130/80 mmHg\n\n**RECENT READINGS**\n10/19: 106/65\n10/18: 110/70\n10/17: 105/68\n10/16: 108/66\n10/15: 108/66\n\nAverage: 107/67 mmHg ✓\nAll readings within target"
      },
      "Visit transcript, 00:04:12": {
        type: "Visit Transcript",
        date: "Today",
        content: "**VISIT TRANSCRIPT**\nTime: 00:04:12\n\nDr.: \"How about climbing stairs? Can you make it up a flight of stairs?\"\n\nPatient: \"I haven't really tried that much since I've been home. My bedroom is on the first floor now. But I did go up to get something from upstairs once, and I made it okay. I had to stop once in the middle, but I wasn't totally out of breath like before.\"\n\nDr.: \"That's good progress. And are you having any chest pain or discomfort?\"\n\nPatient: \"No, no chest pain at all.\""
      },
      "Visit transcript, 00:06:33": {
        type: "Visit Transcript",
        date: "Today",
        content: "**VISIT TRANSCRIPT**\nTime: 00:06:33\n\nDr.: \"How is your urination? The water pill can affect that.\"\n\nPatient: \"Urination is normal. Going about the same as usual, maybe a little more with the water pill. I don't have to get up at night as much anymore either, which is nice. Before the hospital I was up three or four times a night, now it's maybe once.\"\n\nDr.: \"That's a good sign that we're managing your fluid better.\""
      },
      "Visit transcript, 00:05:21": {
        type: "Visit Transcript",
        date: "Today",
        content: "**VISIT TRANSCRIPT**\nTime: 00:05:21\n\nDr.: \"Let me check your ankles. How do they look to you?\"\n\nPatient: \"My ankles look so much better. The swelling has really gone down a lot. Before the hospital they were really puffy and tight, like I couldn't see my ankle bones at all. Now you can see them again. My shoes fit normally now too.\"\n\nDr.: \"Yes, I can see that. There's still a little bit of swelling but much improved.\""
      },
      "Visit vitals, today": {
        type: "Visit Vitals",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Robert Chen\nDate: Today\n\n**MEASUREMENTS**\nBlood Pressure: 108/68 mmHg\nHeart Rate: 78 bpm\nRespiratory Rate: 16 breaths/min\nO2 Saturation: 97% (room air)\nTemperature: 98.4°F\nWeight: 78.2 kg (172.4 lbs)\n\n**COMPARISON**\nBP from hospital discharge (10/07): 112/70\nWeight from discharge: 78.2 kg (same)"
      },
      "Visit vitals and ECG, today": {
        type: "ECG Report",
        date: "Today",
        content: "**ELECTROCARDIOGRAM**\n\nPatient: Robert Chen\nDate: Today\n\n**RHYTHM**\nAtrial fibrillation with controlled ventricular response\nVentricular rate: 78 bpm\nIrregularly irregular rhythm\n\n**INTERVALS**\nPR: N/A (AFib)\nQRS: 102 ms\nQT: 420 ms\nQTc: 441 ms\n\n**INTERPRETATION**\nAtrial fibrillation, controlled rate\nNo acute ST-T changes"
      },
      "Physical examination, today": {
        type: "Physical Exam",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Robert Chen\nDate: Today\n\n**CARDIAC EXAMINATION**\n• Irregular rhythm, consistent with atrial fibrillation\n• S1 and S2 present\n• Grade 2/6 holosystolic murmur best heard at apex\n• Murmur radiates to axilla\n• Consistent with mitral regurgitation\n• No S3 or S4 gallop\n• JVP estimated at 8 cm (normal)\n\n**LUNG EXAMINATION**\n• Clear to auscultation bilaterally\n• No rales, wheezes, or rhonchi\n• Good air movement throughout\n\n**EXTREMITY EXAMINATION**\n• 1+ pitting edema bilateral ankles to mid-shin\n• Improved from 3+ at discharge 2 weeks ago\n• Pedal pulses 2+ bilaterally\n• Capillary refill <2 seconds"
      }
    },
    "Maria Garcia": {
      "Feb 12, Intake form, Ambient": {
        type: "Intake Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: Maria Garcia, 35F\nMRN: 45678901\nDate: 02/12/2024\n\n**CHIEF COMPLAINT**\nLower back pain x 4 days\n\n**HISTORY OF PRESENT ILLNESS**\nSharp pain localized to lower lumbar region (L4-L5 area)\nPain severity: 7/10 at worst, improves with rest\nOnset: Started after helping move furniture 4 days ago\nProgression: Gradual onset, worsened over first 24 hours\n\n**ASSOCIATED SYMPTOMS**\nNo radiation to legs\nNo numbness or tingling\nNo bowel/bladder dysfunction\n\n**RED FLAGS ASSESSMENT**\nNo fever\nNo trauma\nNo night pain\nNo history of cancer\nNo recent weight loss\n\n**CURRENT MEDICATIONS**\nNone (takes occasional ibuprofen OTC as needed)"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Maria Garcia, 35F\nDate: 02/12/2024\n\n**VITAL SIGNS**\nBP: 118/72 mmHg\nHR: 76 bpm\nRR: 14 breaths/min\nTemp: 98.4°F\nO2 Sat: 99% RA\n\n**PHYSICAL EXAMINATION**\nGeneral: Well-appearing, mild discomfort with position changes\n\nMusculoskeletal:\n• Normal gait\n• Negative straight leg raise test bilaterally\n• Tenderness over paraspinal muscles L3-L5\n• No midline spinal tenderness\n• Normal spinal curvature\n• Full range of motion with mild discomfort\n\nNeurological:\n• Strength 5/5 lower extremities bilaterally\n• Sensation intact to light touch\n• Reflexes 2+ and symmetric\n• No focal neurological deficits\n\n**ASSESSMENT**\nAcute mechanical low back pain\nNo red flags present\n\n**PLAN**\n• Conservative management with NSAIDs (ibuprofen 600mg TID with food)\n• Physical therapy referral for core strengthening and body mechanics\n• Return in 2 weeks if no improvement or if red flags develop"
      }
    },
    "Lisa Anderson": {
      "Jan 30, Follow-up visit, Ambient": {
        type: "Clinical Note",
        date: "Jan 30, 2024",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Lisa Anderson, 28F\nDate: 01/30/2024\n\n**CHIEF COMPLAINT**\nMigraine follow-up, worsening frequency\n\n**CURRENT STATUS**\nMigraine frequency: 4-6 days/month (increased from 3-4 at last visit)\nIntensity: Moderate to severe, typically unilateral, throbbing\nAssociated symptoms: Photophobia, nausea, occasional visual aura (zigzag lines)\n\n**CURRENT MEDICATIONS**\nPropranolol 80mg daily x 3 months - limited response to preventive therapy\nSumatriptan 100mg PRN - using 2-3x/week, partial relief\nSertraline 50mg daily - for comorbid anxiety\n\n**TRIGGERS IDENTIFIED**\nStress (increased at work)\nPoor sleep\nBright lights, strong odors\nHormonal changes (worse perimenstrually)\n\n**FUNCTIONAL IMPACT**\nMissing work 1-2 days per month due to migraines\nSignificant effect on quality of life\nPatient expresses strong interest in more effective prevention\n\n**ASSESSMENT**\nChronic migraine with aura, inadequate response to current preventive\nConcern for medication overuse headache (approaching threshold with triptan use)\nGeneralized anxiety disorder, stable\n\n**PLAN**\nConsider switching to CGRP inhibitor (erenumab, fremanezumab, or galcanezumab)\nDiscuss medication overuse headache risk\nContinue behavioral triggers management"
      },
      "Oct 15, 2023, Neurology consult, Athena": {
        type: "Specialist Report",
        date: "Oct 15, 2023",
        content: "**NEUROLOGY CONSULTATION**\n\nPatient: Lisa Anderson, 28F\nDate: 10/15/2023\n\n**REASON FOR CONSULTATION**\nChronic migraine management\n\n**HISTORY**\nLongstanding history of migraines since adolescence\nRecent increase in frequency to 3-4 days per month\nMigraines with visual aura (zigzag lines, scintillating scotoma)\nSignificant photophobia and nausea\nComorbid generalized anxiety disorder\n\n**EXAMINATION**\nNeurological exam: Normal\nCranial nerves II-XII: Intact\nMotor: 5/5 strength throughout\nSensory: Intact to all modalities\nReflexes: 2+ and symmetric\nGait: Normal\n\n**IMPRESSION**\n1. Chronic migraine with aura\n2. Generalized anxiety disorder\n\n**RECOMMENDATIONS**\nInitiate preventive therapy:\n• Propranolol 80mg daily (benefits both migraine and anxiety)\nContinue acute therapy:\n• Sumatriptan 100mg PRN (max 2 doses/week to avoid MOH)\nAddress comorbidity:\n• Sertraline 50mg daily for anxiety\n\n**FOLLOW-UP**\nReturn in 3 months to assess treatment response\nConsider CGRP inhibitor if inadequate response"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Lisa Anderson, 28F\nDate: 02/12/2024\n\n**VITAL SIGNS**\nBP: 108/70 mmHg (on beta-blocker)\nHR: 58 bpm (bradycardia secondary to propranolol)\nRR: 14 breaths/min\nTemp: 98.2°F\nWeight: 135 lbs (stable from previous visits)\n\n**PHYSICAL EXAMINATION**\nGeneral: Well-appearing, no acute distress\n\nNeurological:\n• Alert and oriented x 3\n• Cranial nerves II-XII intact\n• Motor strength 5/5 throughout\n• Sensation intact to light touch and pinprick\n• Reflexes 2+ and symmetric\n• Coordination: Finger-nose-finger intact\n• Gait: Normal\n• No focal neurological deficits\n\n**CURRENT MIGRAINE STATUS**\nNo active migraine at time of visit\nReports ongoing 4-6 migraine days per month despite preventive\n\n**ASSESSMENT**\nChronic migraine with aura, intractable to first-line preventive\nRisk for medication overuse headache\nGeneralized anxiety disorder, stable"
      }
    },
    "Sarah Johnson": {
      "Jan 15, Lab results, Athena": {
        type: "Lab Report",
        date: "Jan 15, 2024",
        content: "**LABORATORY REPORT**\n\nPatient: Sarah Johnson, 42F\nDOB: 03/15/1982\nMRN: 12345678\nDate: 01/15/2024\n\n**METABOLIC PANEL**\nGlucose, Fasting: 145 mg/dL [H] (Ref: 70-100)\nHemoglobin A1c: 7.8% [H] (Ref: <5.7%)\nPrevious A1c (10/15/2023): 7.2%\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL\nLDL Cholesterol: 95 mg/dL\nHDL Cholesterol: 48 mg/dL\nTriglycerides: 125 mg/dL\n\n**RENAL FUNCTION**\nCreatinine: 0.9 mg/dL\neGFR: 72 mL/min/1.73m²\n\n**INTERPRETATION**\nA1c trending upward despite reported medication compliance\nLipids at goal\nRenal function stable"
      },
      "Feb 11, Home monitoring, Uploaded": {
        type: "Home Monitoring",
        date: "Feb 11, 2024",
        content: "**HOME MONITORING DATA**\n\nPatient: Sarah Johnson\nDate Range: 01/28/2024 - 02/11/2024\n\n**BLOOD PRESSURE LOG**\nMorning Average: 135/85 mmHg\nEvening Average: 132/82 mmHg\nTotal Readings: 14\nGoal: <130/80 mmHg\n\nRecent Readings:\n02/11: 134/84\n02/10: 137/86\n02/09: 133/83\n02/08: 136/85\n02/07: 135/84\n\n**WEIGHT LOG**\nCurrent: 185 lbs\n2-week trend: Stable (185-186 lbs)\n\n**SUMMARY**\nBlood pressure trending slightly above goal\nWeight stable\nGood compliance with home monitoring"
      },
      "Oct 15, 2023, Follow-up visit note, Athena": {
        type: "Clinical Note",
        date: "Oct 15, 2023",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Sarah Johnson, 42F\nDate: 10/15/2023\n\n**CHIEF COMPLAINT**\nDiabetes follow-up\n\n**CURRENT MEDICATIONS**\n• Metformin 1000mg BID for diabetes\n• Atorvastatin 20mg daily for hyperlipidemia\n• Lisinopril 10mg daily for hypertension\n\n**RECENT LABS (from visit)**\nHemoglobin A1c: 7.2%\n\n**ASSESSMENT**\n1. Type 2 Diabetes Mellitus - A1c 7.2%, above goal but improved\n2. Essential Hypertension - controlled on current regimen\n3. Hyperlipidemia - at goal on statin therapy\n\n**HEALTH MAINTENANCE**\n• Annual diabetic foot exam: Completed today\n• Ophthalmology screening: Last done 06/2023, schedule for annual follow-up\n• Diabetic nephropathy screening: eGFR stable\n\n**PLAN**\n• Continue current medications\n• Schedule ophthalmology appointment\n• Return in 3 months with repeat A1c"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Sarah Johnson, 42F\nDate: 02/12/2024\n\n**VITAL SIGNS**\nBP: 132/84 mmHg\nHR: 76 bpm\nRR: 16 breaths/min\nTemp: 98.6°F\nWeight: 185 lbs (stable)\n\n**PHYSICAL EXAMINATION**\nGeneral: Well-appearing, comfortable, no acute distress\n\nCardiovascular:\n• Regular rate and rhythm\n• No murmurs, rubs, or gallops\n• Peripheral pulses 2+ bilaterally\n\nExtremities:\n• No edema\n• Pedal pulses 2+ bilaterally\n• Monofilament sensation intact (diabetic foot screening)\n• No skin breakdown or ulcerations\n\n**ASSESSMENT**\nType 2 Diabetes Mellitus - A1c rising to 7.8%, requires treatment intensification\nEssential Hypertension - BP slightly elevated\nHyperlipidemia - stable\n\n**CURRENT CONCERNS**\nOphthalmology screening overdue (last exam 8 months ago)"
      }
    },
    "James Wilson": {
      "Jan 20, 2024, Annual wellness visit, Athena": {
        type: "Clinical Note",
        date: "Jan 20, 2024",
        content: "**ANNUAL WELLNESS VISIT**\n\nPatient: James Wilson, 55M\nDate: 01/20/2024\n\n**REASON FOR VISIT**\nAnnual physical examination and health maintenance\n\n**HEALTH MAINTENANCE DUE**\n• Colonoscopy: Due (age 55, first-time screening per USPSTF guidelines)\n• PSA screening: Discuss shared decision-making (age 55, no documented family history)\n• Flu vaccine: Due this fall season\n• Tdap: 05/2021 (up to date)\n\n**CURRENT MEDICATIONS**\n• Lisinopril 20mg daily for hypertension\n• Aspirin 81mg daily for cardiovascular prevention\n\n**SOCIAL HISTORY**\nFormer smoker: Quit 2020 (30 pack-year history)\nExercise: Walking 2-3 times per week\nDiet: Could be improved\n\n**ASSESSMENT**\n1. Essential Hypertension - well controlled on current regimen\n2. History of nicotine dependence - quit 4 years ago\n3. Overweight (BMI 28.5) - discuss lifestyle modifications\n\n**PLAN**\n• Order screening colonoscopy\n• Discuss PSA screening (shared decision-making)\n• Continue current medications\n• Lifestyle counseling: Diet and exercise\n• Return for follow-up after colonoscopy"
      },
      "Jan 12, 2022, Lab results, Athena": {
        type: "Lab Report",
        date: "Jan 12, 2022",
        content: "**LABORATORY REPORT**\n\nPatient: James Wilson, 55M\nDate: 01/12/2022\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL (Ref: <200)\nLDL Cholesterol: 118 mg/dL (Ref: <100) [Slightly elevated]\nHDL Cholesterol: 52 mg/dL (Ref: >40)\nTriglycerides: 125 mg/dL (Ref: <150)\n\n**CALCULATION**\nTotal/HDL Ratio: 3.8 (Ref: <5.0)\nNon-HDL Cholesterol: 143 mg/dL\n\n**INTERPRETATION**\nLDL slightly above optimal\nHDL adequate\nTriglycerides normal\n\n**NOTE**\nRepeat lipid panel due (>2 years since last check)\nConsider statin therapy based on cardiovascular risk assessment"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Visit Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: James Wilson, 55M\nDate: 02/12/2024\n\n**VITAL SIGNS**\nBP: 128/78 mmHg (well controlled)\nHR: 68 bpm\nRR: 14 breaths/min\nTemp: 98.4°F\nWeight: 210 lbs\nHeight: 5'11\"\nBMI: 28.5 (Overweight)\n\n**PHYSICAL EXAMINATION**\nGeneral: Well-appearing, no acute distress\n\nCardiovascular:\n• Regular rate and rhythm\n• No murmurs, rubs, or gallops\n• No jugular venous distension\n• Peripheral pulses 2+ throughout\n\nRespiratory:\n• Lungs clear to auscultation bilaterally\n• No wheezes, rales, or rhonchi\n• Good air movement\n\nAbdomen:\n• Soft, non-tender, non-distended\n• No masses or organomegaly\n• Normal bowel sounds\n\n**ASSESSMENT**\nHere for annual wellness visit follow-up\nEssential hypertension - well controlled\nOverweight - BMI 28.5\nFormer smoker - tobacco cessation maintained"
      }
    }
  };
  
  // Auto-resize textarea
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };
  
  // Close tooltip on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside citation badge and tooltip
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
  
  const [scribesByDate, setScribesByDate] = useState([
    {
      date: "Thu, Dec 19 (Today)",
      scribes: [
        { 
          name: "Robert Chen", 
          age: 68, 
          gender: "M", 
          duration: "32m 18s",
          chiefComplaint: "Heart Failure",
          room: "Room 301",
          hpi: "68-year-old male with history of HFrEF (EF 30%){{1}} presents for 2-week post-hospitalization follow-up. Recent ADHF admission (10/03-10/07){{2}} with volume overload. Patient reports improved dyspnea{{3}} and decreased lower extremity edema since discharge. Weight down 2.1 kg{{4}} from discharge. Denies orthopnea, PND. Compliance with low-sodium diet and daily weights. Home BP readings 105-110/65-70{{5}}.",
          ros: "Cardiovascular: Reports resolution of dyspnea at rest; can now walk one block without SOB{{6}}. Denies chest pain, palpitations.\nRespiratory: Clear lungs; no cough.\nGI: Normal appetite; denies nausea.\nGU: Good urine output{{7}} on current diuretic dose.\nConstitutional: Denies fever, chills.\nMusculoskeletal: Mild residual ankle edema, much improved{{8}}.",
          pe: "General: NAD, comfortable.\nVitals: BP 108/68{{9}}, HR 78 (irregular){{10}}, RR 16, O2 sat 97% RA.\nCardiac: Irregular rhythm; S1, S2 present; 2/6 systolic murmur at apex{{11}}.\nLungs: Clear to auscultation bilaterally.\nExtremities: 1+ pitting edema{{12}} bilateral ankles, improved from prior.",
          citations: [
            { number: 1, citedText: "EF 30%", quote: "Left ventricular ejection fraction is 30% by visual estimation", source: "Echocardiogram report, 03/15/2024" },
            { number: 2, citedText: "10/03-10/07", quote: "Patient admitted 10/03/2024 for acute decompensated heart failure and discharged 10/07/2024", source: "Hospital discharge summary, 10/07/2024" },
            { number: 3, citedText: "improved dyspnea", quote: "I can breathe much better now. I'm not getting winded just walking around the house anymore.", source: "Visit transcript, 00:03:45" },
            { number: 4, citedText: "2.1 kg", quote: "Starting weight 80.3 kg on 10/07, current weight 78.2 kg", source: "Home weight monitoring log" },
            { number: 5, citedText: "105-110/65-70", quote: "Daily BP readings: 10/15: 108/66, 10/16: 105/68, 10/17: 110/70, 10/18: 106/65", source: "Home BP monitoring log" },
            { number: 6, citedText: "walk one block without SOB", quote: "I can walk to the mailbox now without getting short of breath. That's about a block.", source: "Visit transcript, 00:04:12" },
            { number: 7, citedText: "Good urine output", quote: "Urination is normal. Going about the same as usual, maybe a little more with the water pill.", source: "Visit transcript, 00:06:33" },
            { number: 8, citedText: "much improved", quote: "My ankles look so much better. The swelling has really gone down a lot.", source: "Visit transcript, 00:05:21" },
            { number: 9, citedText: "BP 108/68", quote: "Blood pressure 108/68 mmHg", source: "Visit vitals, today" },
            { number: 10, citedText: "HR 78 (irregular)", quote: "Heart rate 78 bpm, irregularly irregular rhythm consistent with atrial fibrillation", source: "Visit vitals and ECG, today" },
            { number: 11, citedText: "2/6 systolic murmur at apex", quote: "Grade 2/6 holosystolic murmur best heard at apex, consistent with mitral regurgitation", source: "Physical examination, today" },
            { number: 12, citedText: "1+ pitting edema", quote: "1+ pitting edema bilateral lower extremities to mid-shin, improved from 3+ at discharge", source: "Physical examination, today" }
          ],
          hccItems: [
            { condition: "Heart failure with reduced ejection fraction", meat: [true, false, true, true] },
            { condition: "Chronic atrial fibrillation", meat: [true, true, false, true] },
            { condition: "Chronic kidney disease, stage 3b", meat: [true, false, true, false] }
          ],
          nudges: [
            { type: "Documentation", description: "Document CRT-D referral indication in A&P - EF 30%, LBBB 152ms meets criteria.", highlightId: "robert-chen-note-header" },
            { type: "Billing Compliance", description: "Add severity specifier for HFrEF - consider 'acute on chronic' for higher specificity.", highlightId: "robert-chen-hpi-section" },
            { type: "Risk Assessment", description: "Document anticoagulation plan - AFib with CHA₂DS₂-VASc score 5, no anticoagulation noted.", highlightId: "robert-chen-note-header" }
          ],
          dataSources: [
            "Echocardiogram report, 03/15/2024",
            "Hospital discharge summary, 10/07/2024",
            "Visit transcript, 00:03:45",
            "Home weight monitoring log",
            "Home BP monitoring log",
            "Visit vitals, today",
            "Visit vitals and ECG, today",
            "Physical examination, today"
          ]
        },
        { 
          name: "Maria Garcia", 
          age: 35, 
          gender: "F", 
          duration: "18m 45s",
          chiefComplaint: "Lower Back Pain",
          room: "Room 215",
          hpi: "35-year-old female presenting with acute lower back pain x 4 days. Pain started after moving furniture, located in lower lumbar region. Describes sharp pain, 7/10 intensity, worse with bending and lifting. Pain improves with rest. Denies radiation to legs, no paresthesias. No bowel/bladder dysfunction. Takes ibuprofen with moderate relief. No prior history of back problems.",
          ros: "Musculoskeletal: Lower back pain as described; no other joint pain.\nNeurologic: No numbness, tingling, or weakness in legs.\nConstitutional: Denies fever, chills, or weight loss.\nGU: Normal bowel and bladder function.",
          pe: "General: Well-appearing, mild discomfort with position changes.\nVitals: BP 118/76, HR 72, RR 14.\nBack: Tenderness over paraspinal muscles L3-L5; no midline tenderness. Normal spinal curvature.\nNeuro: Strength 5/5 lower extremities bilaterally; sensation intact; negative straight leg raise bilaterally; reflexes 2+ and symmetric.",
          citations: [],
          hccItems: [],
          nudges: [
            { type: "Risk Assessment", description: "Document pain scale (1-10) for severity and track response to treatment.", highlightId: "maria-garcia-hpi-pain-severity" },
            { type: "Documentation", description: "Specify mechanism of injury timing and activity to support acute diagnosis.", highlightId: "maria-garcia-hpi-mechanism" },
            { type: "Safety", description: "Document absence of red flags: no fever, bowel/bladder changes, saddle anesthesia.", highlightId: "maria-garcia-ros-section" }
          ],
          dataSources: [
            "Feb 12, Intake form, Ambient",
            "Feb 12, Today's visit, Ambient"
          ]
        },
        { 
          name: "Lisa Anderson", 
          age: 28, 
          gender: "F", 
          duration: "24m 12s",
          chiefComplaint: "Migraine Headaches",
          room: "Room 408",
          hpi: "28-year-old female with history of chronic migraines presents for follow-up. Currently experiencing 4-6 migraine days per month, increased from 3-4 on last visit. Migraines typically unilateral, throbbing, moderate to severe. Associated with photophobia, nausea, occasional visual aura (zigzag lines). Current preventive (propranolol 80mg daily x 3 months) showing limited benefit. Uses sumatriptan 100mg for acute attacks, 2-3 times per week with partial relief. Identifies triggers: stress, poor sleep, bright lights, hormonal changes (worse perimenstrually). Missing work 1-2 days per month due to migraines.",
          ros: "Neurologic: Headaches as described; no seizures, weakness, or numbness.\nPsychiatric: Reports increased stress at work; some anxiety.\nConstitutional: Denies fever, weight changes.\nENT: No vision changes between attacks.\nGI: Nausea with migraines; otherwise normal.",
          pe: "General: Well-appearing, no acute distress.\nVitals: BP 118/72, HR 68, RR 14.\nNeuro: Alert and oriented x3; cranial nerves II-XII intact; normal strength and sensation; normal gait.",
          citations: [],
          hccItems: [
            { condition: "Migraine with aura, intractable", meat: [true, true, false, true] },
            { condition: "Generalized anxiety disorder", meat: [true, false, true, false] }
          ],
          nudges: [
            { type: "Documentation", description: "Specify 'intractable' in diagnosis - patient on preventive with limited response, supports higher complexity.", highlightId: "lisa-anderson-note-header" },
            { type: "Risk Assessment", description: "Document medication overuse headache screening - sumatriptan 2-3x/week approaching threshold.", highlightId: "lisa-anderson-hpi-sumatriptan" },
            { type: "Billing Compliance", description: "Link anxiety diagnosis to treatment plan - comorbid conditions affect coding.", highlightId: "lisa-anderson-ros-section" }
          ],
          dataSources: [
            "Jan 30, Follow-up visit, Ambient",
            "Oct 15, 2023, Neurology consult, Athena",
            "Feb 12, Today's visit, Ambient"
          ]
        },
      ]
    },
    {
      date: "Wed, Dec 18",
      scribes: [
        { 
          name: "Sarah Johnson", 
          age: 42, 
          gender: "F", 
          duration: "21m 33s",
          chiefComplaint: "Diabetes Follow-up",
          room: "Room 112",
          hpi: "42-year-old female with Type 2 diabetes mellitus presents for routine 3-month follow-up. Recent A1c 7.8%, up from 7.2% three months ago. Patient reports good medication compliance with metformin 1000mg BID. Admits to dietary indiscretions during holidays. No hypoglycemic episodes. Denies polyuria, polydipsia, or changes in vision. Checking blood sugars 2-3 times per week, fasting values range 130-150 mg/dL. No new symptoms. Co-morbid hypertension and hyperlipidemia well-controlled.",
          ros: "Endocrine: No polyuria, polydipsia, or polyphagia.\nCardiovascular: Denies chest pain, palpitations, or leg swelling.\nNeurologic: Denies numbness, tingling in feet.\nOphthalmic: No vision changes; last eye exam 8 months ago.\nConstitutional: Weight stable.",
          pe: "General: Well-appearing, comfortable.\nVitals: BP 132/84, HR 76, RR 16, Weight 185 lbs (stable).\nCardiac: RRR, no murmurs.\nExtremities: No edema; pedal pulses 2+ bilaterally; monofilament sensation intact.",
          citations: [],
          hccItems: [
            { condition: "Type 2 diabetes mellitus without complications", meat: [true, true, true, true] },
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "Hyperlipidemia", meat: [true, false, false, true] }
          ],
          nudges: [
            { type: "Billing Compliance", description: "Consider 'with complications' for diabetes - rising A1c and overdue screening warrant higher specificity.", highlightId: "sarah-johnson-note-header" },
            { type: "Documentation", description: "Document treatment intensification plan - A1c 7.8% above goal requires medication adjustment.", highlightId: "sarah-johnson-hpi-a1c" },
            { type: "Safety", description: "Document ophthalmology referral placed - overdue screening is quality measure.", highlightId: "sarah-johnson-note-header" }
          ],
          dataSources: [
            "Jan 15, Lab results, Athena",
            "Feb 11, Home monitoring, Uploaded",
            "Oct 15, 2023, Follow-up visit note, Athena",
            "Feb 12, Today's visit, Ambient"
          ]
        },
        { 
          name: "James Wilson", 
          age: 55, 
          gender: "M", 
          duration: "26m 08s",
          chiefComplaint: "Annual Check-up",
          room: "Room 203",
          hpi: "55-year-old male presents for annual wellness examination. No acute concerns. History of hypertension, well-controlled on lisinopril 20mg daily. Former smoker (quit 2020, 30 pack-year history). Exercises 2-3 times per week (walking). Diet could be improved. No new symptoms. Interested in age-appropriate health screenings. Last colonoscopy never done (now age-appropriate). Last lipid panel 2 years ago.",
          ros: "Cardiovascular: Denies chest pain, palpitations, or dyspnea.\nRespiratory: No cough or SOB; former smoker, quit 4 years ago.\nGI: Normal bowel habits; no rectal bleeding.\nGU: Normal urination; no nocturia.\nConstitutional: Feels well; weight stable.",
          pe: "General: Well-appearing, no acute distress.\nVitals: BP 128/78, HR 68, RR 14, BMI 28.5.\nCardiac: RRR, no murmurs.\nLungs: Clear to auscultation bilaterally.\nAbdomen: Soft, non-tender, no masses.",
          citations: [],
          hccItems: [
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "History of nicotine dependence", meat: [true, false, false, false] }
          ],
          nudges: [
            { type: "Documentation", description: "Document colonoscopy order and counseling - preventive care drives quality metrics.", highlightId: "james-wilson-note-header" },
            { type: "Billing Compliance", description: "Add BMI 28.5 (overweight) to problem list - supports lifestyle counseling billing.", highlightId: "james-wilson-pe-bmi" },
            { type: "Risk Assessment", description: "Document tobacco cessation counseling - former 30 pack-year smoker qualifies for continued screening.", highlightId: "james-wilson-hpi-smoker" }
          ],
          dataSources: [
            "Jan 20, 2024, Annual wellness visit, Athena",
            "Jan 12, 2022, Lab results, Athena",
            "Feb 12, Today's visit, Ambient"
          ]
        },
      ]
    }
  ]);
  
  // Flatten for easy access by index
  const allScribes = scribesByDate.flatMap(group => group.scribes);
  
  // Function to update scribe content
  const updateScribeContent = (section: 'hpi' | 'ros' | 'pe', content: string) => {
    const updatedScribesByDate = scribesByDate.map(dateGroup => ({
      ...dateGroup,
      scribes: dateGroup.scribes.map((scribe, idx) => {
        const globalIndex = scribesByDate
          .slice(0, scribesByDate.indexOf(dateGroup))
          .reduce((acc, g) => acc + g.scribes.length, 0) + idx;
        
        if (globalIndex === selectedScribeIndex) {
          return { ...scribe, [section]: content };
        }
        return scribe;
      })
    }));
    setScribesByDate(updatedScribesByDate);
  };

  // Safety check: ensure we have valid scribe data
  if (!allScribes || allScribes.length === 0) {
    return (
      <div className="bg-white content-stretch flex items-center justify-center relative w-full h-screen">
        <p>No scribes available</p>
      </div>
    );
  }

  if (!allScribes[selectedScribeIndex]) {
    return (
      <div className="bg-white content-stretch flex items-center justify-center relative w-full h-screen">
        <p>Selected scribe not found (Index: {selectedScribeIndex}, Total: {allScribes.length})</p>
      </div>
    );
  }

  const currentScribe = allScribes[selectedScribeIndex];

  // Helper to check if text should be highlighted for nudges
  const getHighlightMapping = () => {
    return {
      "maria-garcia-hpi-pain-severity": "7/10 intensity",
      "maria-garcia-hpi-mechanism": "Pain started after moving furniture",
      "lisa-anderson-hpi-sumatriptan": "Uses sumatriptan 100mg for acute attacks, 2-3 times per week with partial relief",
      "sarah-johnson-hpi-a1c": "Recent A1c 7.8%, up from 7.2% three months ago",
      "james-wilson-hpi-smoker": "Former smoker (quit 2020, 30 pack-year history)",
      "james-wilson-pe-bmi": "BMI 28.5"
    };
  };

  // Helper to find abnormal phrases in text
  const findAbnormalPhrases = (text: string): Array<{phrase: string, type: 'severe' | 'abnormal'}> => {
    const results: Array<{phrase: string, type: 'severe' | 'abnormal'}> = [];
    
    // Severe/alarming patterns - match the phrase that contains these keywords
    const severePatterns = [
      /\b(severe(?:ly)?)\b[^.!?]*/gi,
      /\b(critical(?:ly)?)\b[^.!?]*/gi,
      /\b(acute(?:ly)?)\b[^.!?]*/gi,
      /\b(emergency)\b[^.!?]*/gi,
      /\b(urgent(?:ly)?)\b[^.!?]*/gi,
      /\b(alarming)\b[^.!?]*/gi,
      /\b(life-threatening)\b[^.!?]*/gi,
      /\b(dangerous(?:ly)?)\b[^.!?]*/gi,
    ];
    
    severePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[0]) {
          results.push({ phrase: match[0].trim(), type: 'severe' });
        }
      }
    });
    
    // Abnormal findings patterns
    const abnormalPatterns = [
      /\b(abnormal(?:ly)?)\b[^.!?]*/gi,
      /\b(elevated)\b[^.!?]*/gi,
      /\b(high)\s+\w+/gi,
      /\b(low)\s+\w+/gi,
      /\b(decreased)\b[^.!?]*/gi,
      /\b(increased)\b[^.!?]*/gi,
      /\b(irregular(?:ly)?)\b[^.!?]*/gi,
      /\b(worse|worsening)\b[^.!?]*/gi,
      /\[H\][^.!?]*/gi,  // High lab values
      /\[L\][^.!?]*/gi,  // Low lab values
      /\d+\/\d+\s*mmHg/gi,  // Blood pressure values
      /above\s+(goal|target|normal|range)/gi,
      /below\s+(goal|target|normal|range)/gi,
      /\bup from\b[^.!?]*/gi,  // Trending up
      /\bdown from\b[^.!?]*/gi,  // Could be good or bad depending on context
    ];
    
    // Only add abnormal patterns if not already caught by severe patterns
    abnormalPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[0]) {
          const phrase = match[0].trim();
          // Don't add if already marked as severe
          if (!results.some(r => r.phrase === phrase)) {
            results.push({ phrase, type: 'abnormal' });
          }
        }
      }
    });
    
    return results;
  };

  // Helper to render text with citation numbers and nudge highlighting
  const renderTextWithCitations = (text: string, section: 'hpi' | 'ros' | 'pe') => {
    // Handle 'none' view - just plain text
    if (selectedView === 'none') {
      return text.replace(/\{\{(\d+)\}\}/g, '');
    }
    
    const shouldShowCitations = selectedView === 'citation' || selectedView === 'default';
    const shouldShowAbnormals = selectedView === 'abnormals' || selectedView === 'default';
    const textWithoutCitations = shouldShowCitations ? text : text.replace(/\{\{(\d+)\}\}/g, '');
    
    // Check if we need to highlight specific text for nudges
    const isNudgeHovered = hoveredNudge?.scribeIndex === selectedScribeIndex;
    const highlightMapping = getHighlightMapping();
    let highlightText: string | null = null;
    
    if (isNudgeHovered && hoveredNudge) {
      const nudge = currentScribe.nudges?.[hoveredNudge.nudgeIndex];
      if (nudge?.highlightId) {
        highlightText = highlightMapping[nudge.highlightId] || null;
      }
    }
    
    // If no special rendering needed, return plain text
    if (!shouldShowCitations && !highlightText && !shouldShowAbnormals) {
      return textWithoutCitations;
    }
    
    // Handle nudge highlighting only (no citations)
    if (!shouldShowCitations && !shouldShowAbnormals && highlightText) {
      const regex = new RegExp(`(${highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const parts = textWithoutCitations.split(regex);
      return parts.map((part, idx) => {
        if (part.toLowerCase() === highlightText!.toLowerCase()) {
          return (
            <mark 
              key={idx} 
              className="bg-[#f1f3fe] text-inherit" 
              style={{ padding: 0 }}
              data-highlight-id={currentScribe.nudges?.[hoveredNudge!.nudgeIndex]?.highlightId}
            >
              {part}
            </mark>
          );
        }
        return <span key={idx}>{part}</span>;
      });
    }
    
    // Get citation data for current scribe
    const citations = currentScribe.citations || [];
    
    // Split text by citation markers and render with inline citation badges
    const parts = text.split(/(\{\{\d+\}\})/);
    let textBeforeCitation = '';
    
    return parts.map((part, idx) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match && shouldShowCitations) {
        const citationNum = parseInt(match[1]);
        const citation = citations.find(c => c.number === citationNum);
        const isActive = activeCitation === citationNum;
        
        const badge = (
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
            {match[1]}
          </span>
        );
        
        textBeforeCitation = '';
        return badge;
      }
      
      // Skip citation markers if not showing citations
      if (match && !shouldShowCitations) {
        return null;
      }
      
      // Check if this text should be highlighted (without shifting layout)
      let shouldHighlight = false;
      let highlightTargetText = '';
      let highlightColor = '#f1f3fe';
      
      // Check for citation highlighting
      if (activeCitation && part && shouldShowCitations) {
        const citation = citations.find(c => c.number === activeCitation);
        if (citation && part.toLowerCase().includes(citation.citedText.toLowerCase())) {
          shouldHighlight = true;
          highlightTargetText = citation.citedText;
        }
      }
      
      // Check for nudge highlighting
      if (!shouldHighlight && highlightText && part && part.toLowerCase().includes(highlightText.toLowerCase())) {
        shouldHighlight = true;
        highlightTargetText = highlightText;
      }
      
      // Handle abnormal highlighting
      if (shouldShowAbnormals && part) {
        const abnormalPhrases = findAbnormalPhrases(part);
        if (abnormalPhrases.length > 0) {
          // Split the part by all abnormal phrases and highlight them
          let remainingText = part;
          const segments: JSX.Element[] = [];
          let segmentIdx = 0;
          
          // Sort phrases by position in text
          const sortedPhrases = abnormalPhrases.sort((a, b) => {
            return part.indexOf(a.phrase) - part.indexOf(b.phrase);
          });
          
          sortedPhrases.forEach(({ phrase, type }) => {
            const phraseIndex = remainingText.indexOf(phrase);
            if (phraseIndex >= 0) {
              // Add text before the phrase
              if (phraseIndex > 0) {
                segments.push(
                  <span key={`${idx}-${segmentIdx++}`}>
                    {remainingText.substring(0, phraseIndex)}
                  </span>
                );
              }
              
              // Add highlighted phrase
              const bgColor = type === 'severe' ? '#fee2e2' : '#fef3c7';
              segments.push(
                <mark 
                  key={`${idx}-${segmentIdx++}`} 
                  className="text-inherit" 
                  style={{ backgroundColor: bgColor, padding: 0 }}
                >
                  {phrase}
                </mark>
              );
              
              // Update remaining text
              remainingText = remainingText.substring(phraseIndex + phrase.length);
            }
          });
          
          // Add any remaining text
          if (remainingText) {
            segments.push(<span key={`${idx}-${segmentIdx++}`}>{remainingText}</span>);
          }
          
          textBeforeCitation += part;
          return <span key={idx}>{segments}</span>;
        }
      }
      
      // Handle citation and nudge highlighting
      if (shouldHighlight && highlightTargetText) {
        const regex = new RegExp(`(${highlightTargetText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlighted = part.split(regex).map((segment, segIdx) => {
          if (segment.toLowerCase() === highlightTargetText.toLowerCase()) {
            return (
              <mark key={`${idx}-${segIdx}`} className="text-inherit" style={{ backgroundColor: highlightColor, padding: 0 }}>
                {segment}
              </mark>
            );
          }
          return <span key={`${idx}-${segIdx}`}>{segment}</span>;
        });
        textBeforeCitation += part;
        return <span key={idx}>{highlighted}</span>;
      }
      
      textBeforeCitation += part;
      return <span key={idx}>{part}</span>;
    });
  };

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
              {/* Visits */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onClick={onNavigateToVisits}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="stethoscope" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Visits
                </p>
              </button>
              
              {/* Scribes - Selected */}
              <div className="content-stretch flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full">
                <div className="bg-[var(--nav-button,rgba(17,50,238,0.12))] content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] text-[color:var(--text-brand,#1132ee)]">
                  <InlineIcon name="magic_document" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-brand,#1132ee)] tracking-[-0.36px]">
                  Scribes
                </p>
              </div>
              
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
        
        {/* Scribe List */}
        <div className="bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip relative shrink-0 w-[220px] z-[1]">
          {/* Header */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex h-[48px] items-center min-h-[48px] px-[8px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[28px] items-center min-h-px min-w-px p-[4px] relative rounded-[6px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    My Scribes
                  </p>
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
          
          {/* Scribe List */}
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative w-full overflow-y-auto">
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              {scribesByDate.map((dateGroup, groupIndex) => {
                const startIndex = scribesByDate.slice(0, groupIndex).reduce((acc, g) => acc + g.scribes.length, 0);
                return (
                  <div key={groupIndex} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    {/* Date Header */}
                    <div className="content-stretch flex flex-col items-start px-[12px] py-[8px] relative shrink-0 w-full">
                      <p className="font-['Lato',sans-serif] leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                        {dateGroup.date}
                      </p>
                    </div>
                    {/* Scribes for this date */}
                    {dateGroup.scribes.map((scribe, index) => {
                      const globalIndex = startIndex + index;
                      return (
                        <ScribeListItem 
                          key={globalIndex} 
                          {...scribe} 
                          isSelected={globalIndex === selectedScribeIndex}
                          onClick={() => setSelectedScribeIndex(globalIndex)}
                        />
                      );
                    })}
                  </div>
                );
              })}
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
                {currentScribe.name}
              </p>
              <div className="flex flex-[1_0_0]" />
              {/* Menu Button */}
              <Button 
                variant="tertiary" 
                size="small"
                onClick={() => {}}
              >
                ··· Menu
              </Button>
            </div>
            
            {/* Scribe Info */}
            <div className="content-stretch flex font-['Lato',sans-serif] gap-[4px] items-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px] whitespace-nowrap">
              <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-ellipsis"><p className="leading-[1.4] overflow-hidden">{currentScribe.chiefComplaint}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">Age {currentScribe.age}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">Sex {currentScribe.gender}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{currentScribe.room}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{currentScribe.duration}</p></div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="content-stretch flex items-start max-w-[800px] relative shrink-0 w-full">
            <Tabs
              variant="primary"
              tabs={[
                { id: 'clinical', label: 'Clinical Note' },
                { id: 'summary', label: 'After Visit Summary' },
                { id: 'codes', label: 'ICD10/CPT Codes' },
                { id: 'transcript', label: 'Transcript' }
              ]}
              defaultTab={activeTab}
              onTabChange={(id) => setActiveTab(id as 'clinical' | 'summary' | 'codes' | 'transcript')}
            />
          </div>
          
          {/* Main Content - Clinical Note */}
          <div className="content-stretch flex flex-col items-start max-w-[800px] relative shrink-0 w-full overflow-y-auto flex-1 py-[12px]">
            {/* Template Name */}
            <div 
              className="content-stretch flex items-center relative shrink-0 w-full pb-[32px] pt-[8px]"
              data-highlight-id={`${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-note-header`}
            >
              <p 
                className={`font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] ${
                  hoveredNudge?.scribeIndex === selectedScribeIndex && 
                  currentScribe.nudges?.[hoveredNudge.nudgeIndex]?.highlightId === `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-note-header`
                    ? 'bg-[#f1f3fe]' 
                    : ''
                }`}
                style={{ fontFeatureSettings: "'ss07'" }}
              >
                Clinical Note
              </p>
            </div>
            
            {/* HPI Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p 
                  className={`flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px] ${
                    hoveredNudge?.scribeIndex === selectedScribeIndex && 
                    currentScribe.nudges?.[hoveredNudge.nudgeIndex]?.highlightId === `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-hpi-section`
                      ? 'bg-[#f1f3fe]' 
                      : ''
                  }`}
                  style={{ fontFeatureSettings: "'ss07'" }}
                  data-highlight-id={`${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-hpi-section`}
                >
                  HPI
                </p>
                <div className="flex gap-[4px] items-center shrink-0">
                  {editingSection === 'hpi' ? (
                    <>
                      <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                        <InlineIcon name="mic" size={16} />
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Dictate
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => {
                          updateScribeContent('hpi', editedContent.hpi);
                          setEditingSection(null);
                        }}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Save
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => setEditingSection(null)}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Cancel
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
                        setEditedContent({ ...editedContent, hpi: currentScribe.hpi.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingSection('hpi');
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
                    <Button
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="content_copy" size={16} />}
                      onClick={() => {}}
                    >
                      Copy
                    </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Section Content */}
              {editingSection === 'hpi' ? (
                <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                  <textarea
                    autoFocus
                    ref={(el) => adjustTextareaHeight(el)}
                    value={editedContent.hpi}
                    onChange={(e) => {
                      setEditedContent({ ...editedContent, hpi: e.target.value });
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
                    setEditedContent({ ...editedContent, hpi: currentScribe.hpi.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('hpi');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(currentScribe.hpi, 'hpi')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* ROS Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p 
                  className={`flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px] ${
                    hoveredNudge?.scribeIndex === selectedScribeIndex && 
                    currentScribe.nudges?.[hoveredNudge.nudgeIndex]?.highlightId === `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-ros-section`
                      ? 'bg-[#f1f3fe]' 
                      : ''
                  }`}
                  style={{ fontFeatureSettings: "'ss07'" }}
                  data-highlight-id={`${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-ros-section`}
                >
                  ROS
                </p>
                <div className="flex gap-[4px] items-center shrink-0">
                  {editingSection === 'ros' ? (
                    <>
                      <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                        <InlineIcon name="mic" size={16} />
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Dictate
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => {
                          updateScribeContent('ros', editedContent.ros);
                          setEditingSection(null);
                        }}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Save
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => setEditingSection(null)}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Cancel
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
                        setEditedContent({ ...editedContent, ros: currentScribe.ros.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingSection('ros');
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
                    <Button
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="content_copy" size={16} />}
                      onClick={() => {}}
                    >
                      Copy
                    </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Section Content */}
              {editingSection === 'ros' ? (
                <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                  <textarea
                    autoFocus
                    ref={(el) => adjustTextareaHeight(el)}
                    value={editedContent.ros}
                    onChange={(e) => {
                      setEditedContent({ ...editedContent, ros: e.target.value });
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
                    setEditedContent({ ...editedContent, ros: currentScribe.ros.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('ros');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(currentScribe.ros, 'ros')}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* PE Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p 
                  className={`flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px] ${
                    hoveredNudge?.scribeIndex === selectedScribeIndex && 
                    currentScribe.nudges?.[hoveredNudge.nudgeIndex]?.highlightId === `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-pe-section`
                      ? 'bg-[#f1f3fe]' 
                      : ''
                  }`}
                  style={{ fontFeatureSettings: "'ss07'" }}
                  data-highlight-id={`${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-pe-section`}
                >
                  PE
                </p>
                <div className="flex gap-[4px] items-center shrink-0">
                  {editingSection === 'pe' ? (
                    <>
                      <div className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]">
                        <InlineIcon name="mic" size={16} />
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Dictate
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => {
                          updateScribeContent('pe', editedContent.pe);
                          setEditingSection(null);
                        }}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Save
                        </p>
                      </div>
                      <div 
                        className="content-stretch flex gap-[4px] h-[28px] items-center justify-center px-[10px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]"
                        onClick={() => setEditingSection(null)}
                      >
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-brand,#1132ee)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          Cancel
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
                        setEditedContent({ ...editedContent, pe: currentScribe.pe.replace(/\{\{(\d+)\}\}/g, '') });
                        setEditingSection('pe');
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
                    <Button
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="content_copy" size={16} />}
                      onClick={() => {}}
                    >
                      Copy
                    </Button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Section Content */}
              {editingSection === 'pe' ? (
                <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                  <textarea
                    autoFocus
                    ref={(el) => adjustTextareaHeight(el)}
                    value={editedContent.pe}
                    onChange={(e) => {
                      setEditedContent({ ...editedContent, pe: e.target.value });
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
                    setEditedContent({ ...editedContent, pe: currentScribe.pe.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('pe');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(currentScribe.pe, 'pe')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex items-center gap-[8px] max-w-[800px] pb-[24px] pt-[8px] relative shrink-0 w-full">
            <Button 
              variant="secondary" 
              size="large"
              icon={<InlineIcon name="content_copy" size={24} />}
              onClick={() => {}}
            >
              Copy All
            </Button>
            <Button 
              variant="primary" 
              size="large"
              icon={<InlineIcon name="cloud_upload" size={24} />}
              onClick={() => {}}
            >
              Sync to EHR
            </Button>
          </div>
        </div>
      </div>
      
      {/* Right Sidebar - For this scribe */}
      <div className="bg-white border-l border-[var(--neutral-200,#ccc)] content-stretch flex flex-col h-full items-start overflow-hidden relative shrink-0 w-[375px]">
        {/* Header - hidden when viewing data source */}
        {!viewingDataSource && (
          <div className="content-stretch flex items-center px-[20px] pt-[20px] pb-[12px] relative shrink-0 w-full">
            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[17px] text-[color:var(--text-default,black)] tracking-[0.34px]">
              For this scribe
            </p>
          </div>
        )}
        
        {/* Tabs - hidden when viewing data source */}
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
            <div className="content-stretch flex flex-col gap-[16px] items-start px-[12px] py-[4px] relative w-full">
              {(chatMessages[currentScribe.name] || []).map((message, idx) => (
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
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <Button variant="tertiary-neutral" size="small" icon={<InlineIcon name="keyboard_arrow_left" size={16} />} onClick={() => setViewingDataSource(null)}>
                  Back
                </Button>
              </div>
              {dataSourceContent[currentScribe.name]?.[viewingDataSource] && (
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                  {/* Source Header */}
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                    <div 
                      className="inline-flex items-center px-[8px] py-[4px] rounded-[4px]"
                      style={{
                        backgroundColor: getDocumentTypeBadgeColor(dataSourceContent[currentScribe.name][viewingDataSource].type).bg
                      }}
                    >
                      <p 
                        className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px] uppercase"
                        style={{
                          color: getDocumentTypeBadgeColor(dataSourceContent[currentScribe.name][viewingDataSource].type).text
                        }}
                      >
                        {dataSourceContent[currentScribe.name][viewingDataSource].type}
                      </p>
                    </div>
                    <p className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                      {dataSourceContent[currentScribe.name][viewingDataSource].date}
                    </p>
                  </div>
                  
                  {/* Source Content */}
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <pre className="font-['Lato',sans-serif] leading-[1.6] text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] w-full whitespace-pre-wrap">
                      {dataSourceContent[currentScribe.name][viewingDataSource].content}
                    </pre>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Actions View */
            <>
              {/* Views & Highlights */}
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Views & Highlights
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isViewsHighlightsExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsViewsHighlightsExpanded(!isViewsHighlightsExpanded)}
                aria-label={isViewsHighlightsExpanded ? "Collapse views & highlights" : "Expand views & highlights"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isViewsHighlightsExpanded && (
              <ButtonGroup
                orientation="horizontal"
                size="small"
                options={[
                  { id: 'default', label: 'Default' },
                  { id: 'abnormals', label: 'Abnormals' },
                  { id: 'citation', label: 'Citation' },
                  { id: 'none', label: 'None' }
                ]}
                value={selectedView}
                onChange={(id) => setSelectedView(id as 'default' | 'abnormals' | 'citation')}
                className="w-full"
              />
            )}
          </div>
          
          {/* Edit Tools */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Edit Tools
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isEditToolsExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsEditToolsExpanded(!isEditToolsExpanded)}
                aria-label={isEditToolsExpanded ? "Collapse edit tools" : "Expand edit tools"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isEditToolsExpanded && (
              <div className="content-stretch flex gap-[8px] items-start py-[4px] relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    onClick={() => {}}
                  >
                    Change Template
                  </Button>
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    onClick={() => {}}
                  >
                    Regenerate
                  </Button>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    onClick={() => {}}
                  >
                    Archive
                  </Button>
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    onClick={() => {}}
                  >
                    New Documents
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Improve Scribe */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Improve Scribe
              </p>
              <IconButton 
                variant="tertiary" 
                size="small"
                icon={<InlineIcon name={isImproveScribeExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size={16} />}
                onClick={() => setIsImproveScribeExpanded(!isImproveScribeExpanded)}
                aria-label={isImproveScribeExpanded ? "Collapse improve scribe" : "Expand improve scribe"}
                className="text-[color:var(--text-subheading,#666)]"
              />
            </div>
            
            {isImproveScribeExpanded && (
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                {(currentScribe.nudges || []).map((nudge, idx) => {
                  if (dismissedNudges[selectedScribeIndex]?.has(idx)) {
                    return null;
                  }
                  
                  return (
                    <div 
                      key={idx} 
                      className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)] transition-colors"
                      onMouseEnter={() => setHoveredNudge({scribeIndex: selectedScribeIndex, nudgeIndex: idx})}
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
                            [selectedScribeIndex]: new Set([...(prev[selectedScribeIndex] || []), idx])
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
              {(currentScribe.dataSources || []).map((source, idx) => (
                <Link 
                  key={idx}
                  label={source}
                  size="xsmall"
                  intent="neutral"
                  showPrefix={false}
                  showSuffix={false}
                  onClick={() => {
                    setViewingDataSource(source);
                    setRightTab('actions');
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
                  setRightTab('chat');
                  setViewingDataSource(null);
                  console.log('Send message:', chatInputValue);
                  setChatInputValue('');
                }
              }}
              onVoice={() => console.log('Voice input')}
            />
          </div>
        </div>
      </div>
      
      {/* Citation Tooltip */}
      {activeCitation && tooltipPosition && (() => {
        const citation = currentScribe.citations?.find(c => c.number === activeCitation);
        if (!citation) return null;
        
        // Determine if tooltip should appear above or below
        const tooltipHeight = 120; // Approximate height
        const spaceBelow = window.innerHeight - tooltipPosition.y;
        const showBelow = spaceBelow > tooltipHeight + 50; // 50px buffer
        
        const topPosition = showBelow 
          ? tooltipPosition.y + 14 + 4 // badge height + gap
          : tooltipPosition.y - 4;
        
        const transformValue = showBelow
          ? 'translate(-50%, 0)'
          : 'translate(-50%, -100%)';
        
        const bridgeTop = showBelow
          ? tooltipPosition.y + 14
          : tooltipPosition.y - 4;
        
        return (
          <>
            {/* Invisible bridge between badge and tooltip to prevent flickering */}
            <div
              className="fixed z-50"
              style={{
                left: `${tooltipPosition.x - 20}px`,
                top: `${bridgeTop}px`,
                width: '40px',
                height: '4px',
                transform: showBelow ? 'translateY(0)' : 'translateY(-100%)'
              }}
              onMouseEnter={() => {
                setActiveCitation(activeCitation);
              }}
            />
            <div 
              data-citation-tooltip
              className="fixed bg-white shadow-lg rounded-[8px] p-[12px] w-[240px] z-50 border border-[var(--neutral-200,#ccc)]"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${topPosition}px`,
                transform: transformValue
              }}
              onMouseEnter={() => {
                // Keep tooltip open when hovering over it
                setActiveCitation(activeCitation);
              }}
              onMouseLeave={() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }}
            >
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-default,black)] italic">
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
            </div>
          </>
        );
      })()}
    </div>
  );
}
