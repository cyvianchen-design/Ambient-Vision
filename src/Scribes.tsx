import React, { useState, useEffect, useMemo } from 'react';
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

// Chat message type
type ChatMessage = {
  type: 'user' | 'assistant';
  content: string;
  citations?: {
    number: number;
    source: string;
    quote?: string;
    isExternal?: boolean;
    externalUrl?: string;
  }[];
};

export default function Scribes({ 
  onNavigateToVisits,
  chatMessages,
  setChatMessages,
  rightTab,
  setRightTab,
  patients,
  selectedPatientName,
  isSecondaryNavCollapsed,
  setIsSecondaryNavCollapsed,
  isLogoHovered,
  setIsLogoHovered,
  logoTooltipPosition,
  setLogoTooltipPosition
}: { 
  onNavigateToVisits?: () => void;
  chatMessages: Record<string, ChatMessage[]>;
  setChatMessages: (messages: Record<string, ChatMessage[]>) => void;
  rightTab: 'actions' | 'assistant' | 'sources';
  setRightTab: (tab: 'actions' | 'assistant' | 'sources') => void;
  patients: any[];
  selectedPatientName: string | null;
  isSecondaryNavCollapsed: boolean;
  setIsSecondaryNavCollapsed: (collapsed: boolean) => void;
  isLogoHovered: boolean;
  setIsLogoHovered: (hovered: boolean) => void;
  logoTooltipPosition: { x: number; y: number } | null;
  setLogoTooltipPosition: (position: { x: number; y: number } | null) => void;
}) {
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<'visits' | 'scribes' | 'customize' | 'assistant' | 'admin' | null>(null);
  const navHoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [chatInputValue, setChatInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'clinical' | 'transcript' | 'previsit'>('clinical');
  const [selectedScribeIndex, setSelectedScribeIndex] = useState(0);
  const [selectedView, setSelectedView] = useState<'default' | 'highlights' | 'citation'>('default');
  const [activeCitation, setActiveCitation] = useState<{ id: string; number: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; alignLeft?: boolean } | null>(null);
  const citationCloseTimeoutRef = React.useRef<number | null>(null);
  const [isViewsHighlightsExpanded, setIsViewsHighlightsExpanded] = useState(true);
  const [isEditToolsExpanded, setIsEditToolsExpanded] = useState(true);
  const [isImproveScribeExpanded, setIsImproveScribeExpanded] = useState(true);
  const [editingSection, setEditingSection] = useState<'hpi' | 'ros' | 'pe' | 'mdm' | null>(null);
  const [editedContent, setEditedContent] = useState<{hpi: string; ros: string; pe: string; mdm: string}>({
    hpi: '',
    ros: '',
    pe: '',
    mdm: ''
  });
  const [viewingDataSource, setViewingDataSource] = useState<string | null>(null);
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<'actions' | 'assistant' | 'sources'>('actions');
  const [expandedChatSources, setExpandedChatSources] = useState<Set<string>>(new Set());
  
  // Reset document view when switching scribes
  useEffect(() => {
    setViewingDataSource(null);
    setHighlightedQuote(null);
    setRightTab('actions');
  }, [selectedScribeIndex]);

  // Handle responsive secondary nav collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSecondaryNavCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper functions for delayed nav switching
  const setHoveredNavWithDelay = (nav: 'visits' | 'scribes' | 'customize' | 'assistant' | 'admin' | null) => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
    }
    navHoverTimeoutRef.current = setTimeout(() => {
      setHoveredPrimaryNav(nav);
    }, 100);
  };

  const clearNavHoverDelay = () => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
      navHoverTimeoutRef.current = null;
    }
  };
  
  const [dismissedNudges, setDismissedNudges] = useState<Record<number, Set<number>>>({});
  const [appliedNudges, setAppliedNudges] = useState<Record<number, Record<number, {selectedOptions: string[], appliedText: string}>>>({});
  const [hoveredNudge, setHoveredNudge] = useState<{scribeIndex: number, nudgeIndex: number} | null>(null);
  const [hoveredHighlight, setHoveredHighlight] = useState<{scribeIndex: number, nudgeIndex: number} | null>(null);
  const [showDismissedNudges, setShowDismissedNudges] = useState(false);
  const [showAppliedNudges, setShowAppliedNudges] = useState(false);
  const [nudgeSelections, setNudgeSelections] = useState<Record<string, string[]>>({});
  const [nudgePreviews, setNudgePreviews] = useState<Record<string, {text: string, location: string, after: string}>>({});
  
  // Helper function to get badge color based on document type
  const getDocumentTypeBadgeColor = (type: string, date?: string): {bg: string, text: string, label: string} => {
    // Check if Clinical Note and if it's from today
    if (type === 'Clinical Note' && date) {
      const isToday = date.toLowerCase().includes('today');
      if (isToday) {
        return { 
          bg: '#f1f3fe', 
          text: '#1132ee', 
          label: "Today's Note" 
        };
      } else {
        return { 
          bg: '#ecf8fb', 
          text: '#207384', 
          label: 'Past Note' 
        };
      }
    }
    
    const typeMap: Record<string, {bg: string, text: string, label: string}> = {
      // Consolidated Document Types (matching App.tsx)
      'Clinical Note': { bg: '#f1f3fe', text: '#1132ee', label: 'Clinical Note' }, // Info (blue brand)
      'Imaging': { bg: '#f0ecf7', text: '#7246b5', label: 'Imaging' }, // Purple
      'Lab Results': { bg: '#ecf8fb', text: '#207384', label: 'Lab Results' }, // Cyan
      'Procedure Note': { bg: '#f1f7fd', text: '#1566b7', label: 'Procedure Note' }, // Blue
      'Specialist Report': { bg: '#fcf1f7', text: '#ab2973', label: 'Specialist Report' }, // Magenta
      'Form': { bg: '#f0f3f4', text: '#576b75', label: 'Form' }, // Blue Grey
    };
    return typeMap[type] || { bg: '#f2f2f2', text: '#666', label: type }; // Default grey (History)
  };
  
  // Data source content for each scribe
  const dataSourceContent: Record<string, Record<string, {type: string, date: string, content: string}>> = {
    "Cem": {
      "Previsit summary, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PREVISIT SUMMARY**\n\nPatient: Cem, 45M\nDate: Today\nVisit Type: Follow-up / Evaluation of Elevated Blood Pressure\n\n**CHIEF COMPLAINTS**\n• Recurrent headaches\n• Occasional dizziness\n• \"Feels heartbeat in head\" (pulsatile headaches)\n\n**RECENT VITALS (Past 2 weeks)**\n• Urgent Care (2 weeks ago): BP 152/92 mmHg\n• Pharmacy screening (1 week ago): BP 148/88 mmHg\n• Pharmacy screening (3 days ago): BP 155/90 mmHg\n• Today at check-in: BP 150/92 mmHg, HR 76 bpm\n\n**RELEVANT HISTORY**\n• Had high blood pressure noted once as a teenager (not fully worked up)\n• Reports intermittent exercise intolerance (legs get tired quickly)\n• No obesity (BMI 25.5), no diabetes\n• No family history of early hypertension or cardiovascular disease\n\n**ACTIVE PROBLEMS**\n• Elevated blood pressure (persistent, needs diagnostic confirmation)\n• Recurrent headaches (under evaluation)\n\n**ALLERGIES**\nNo known drug allergies\n\n**PAST MEDICAL HISTORY**\n• Elevated BP as teenager (not investigated)\n• No chronic conditions\n• No prior cardiovascular workup\n\n**FAMILY HISTORY**\n• No family history of early hypertension\n• No diabetes or hereditary conditions\n\n**SOCIAL HISTORY**\n• Non-smoker (never)\n• Alcohol: Social (1-2 drinks per week)\n• Employment: Office-based\n• Exercise: Moderate activity, notes leg fatigue with exertion\n\n**CURRENT MEDICATIONS**\nNo regular medications\n\n**CLINICAL REASONING (AMBIENT-GENERATED)**\n**Most likely diagnoses:**\n1. Essential hypertension\n2. Stress-related / lifestyle-related BP elevation\n3. Secondary hypertension (renal/endocrine causes)\n\n**Low probability consideration (kept in background):**\n• Congenital structural cause (e.g., coarctation of the aorta)\n\n**PRE-VISIT NUDGES TO PROVIDER**\n• Elevated BP → confirm diagnosis with repeat measurements or home BP monitoring\n• Hypertension without clear risk factors → consider secondary causes if persistent\n• Preventive care gap: Colorectal cancer screening due (age 45, no prior screening on file)\n\n**AMBIENT ORDERS (AUTO-PREPARED, NOT YET SIGNED)**\n• Colonoscopy (screening)\n• Echocardiogram\n\n**INSURANCE & LOGISTICS (AUTO-VERIFIED)**\n• Insurance eligibility confirmed\n• Colonoscopy covered under preventive screening\n• Echo and CT angiography pathways pre-checked\n• In-network cardiology and GI options identified\n\n**CARE TEAM NOTES**\nProvider enters room with admin work done, differential appropriately weighted toward common causes, and preventive care already surfaced."
      },
      "Intake form, today": {
        type: "Form",
        date: "Today",
        content: "**PATIENT INTAKE FORM**\n\nPatient Name: Cem\nDate: Today\nVisit Type: Follow-up\n\n**CHIEF COMPLAINT**\nHeadaches and high blood pressure\n\n**HISTORY OF PRESENT ILLNESS**\nOnset: Headaches started about 6 months ago\nFrequency: 2-3 times per week\nDuration: A few hours each time\nCharacter: Pounding headaches, sometimes feel heartbeat in head\n\n**BLOOD PRESSURE HISTORY**\nWent to urgent care 2 weeks ago for dizziness - blood pressure was 152/92. Checked at pharmacy twice since then - still high (148/88 and 155/90). Someone told me when I was a teenager that my blood pressure was high but no one ever followed up on it.\n\n**OTHER SYMPTOMS**\nOccasional dizziness\nLegs get tired pretty quickly when I exercise or climb stairs - always thought I was just out of shape\n\n**MEDICATIONS**\nNone\n\n**ALLERGIES**\nNo known drug allergies\n\n**PAST MEDICAL HISTORY**\n• High blood pressure noted as teenager (not fully worked up)\n\n**FAMILY HISTORY**\n• No family history of early hypertension\n• No diabetes\n\n**SOCIAL HISTORY**\n• Non-smoker (never smoked)\n• Alcohol: Social (1-2 drinks per week)\n• Exercise: Moderate activity\n• Occupation: Office-based\n\n**PREVENTIVE CARE**\n• No prior colonoscopy"
      },
      "Urgent care visit, 2 weeks ago": {
        type: "Clinical Note",
        date: "2 weeks ago",
        content: "**URGENT CARE VISIT NOTE**\n\nPatient: Cem, 45M\nDate: 2 weeks ago\nChief Complaint: Dizziness\n\n**VITAL SIGNS**\nBP: 152/92 mmHg (elevated)\nHR: 78 bpm\nTemp: 98.4°F\nO2 Sat: 99%\n\n**HISTORY**\nPatient presents with episode of dizziness while at work. No syncope. Reports recent headaches. No chest pain, shortness of breath, or neurologic deficits.\n\n**EXAMINATION**\nGeneral: Well-appearing\nNeuro: Alert, oriented, no focal deficits\nCardiac: RRR\n\n**ASSESSMENT**\nDizziness, likely related to elevated blood pressure\nHypertension, uncontrolled\n\n**PLAN**\nAdvised to follow up with PCP for BP management\nNo immediate intervention needed\nReturn precautions given"
      },
      "Visit transcript, 00:01:30": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Good to see you. I understand your blood pressure has been elevated — can you tell me more about how you've been feeling?" Patient: "I've been getting these headaches… kind of pounding sometimes."`
      },
      "Visit transcript, 00:03:15": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "When were you first told your blood pressure might be elevated?" Patient: "Maybe once when I was younger, but no one really followed up."`
      },
      "Visit transcript, 00:05:45": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Do you notice any symptoms with physical activity?" Patient: "Now that you mention it, my legs get tired pretty quickly… I always thought I was just out of shape."`
      },
      "Visit transcript, 00:09:20": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Any cramping pain in your legs when you walk?" Patient: "No, not cramping exactly. Just fatigue. My legs get tired, but it's not pain that makes me stop. More like they feel heavy."`
      },
      "Visit transcript, 00:12:40": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "I'm going to conduct an additional blood pressure examination. I want to check your blood pressure in your arms and legs." Patient: "Oh, okay. Is something wrong?"`
      },
      "Visit transcript, 00:16:50": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "That is notable — your blood pressure is significantly lower in your legs compared to your arms, which is not typical. This finding raises concern for a structural vascular cause." Patient: "What does that mean?"`
      },
      "Visit transcript, 00:21:15": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "I would like to obtain imaging to evaluate your blood vessels more closely. An echocardiogram and CT angiography of your chest will help us see what's going on." Patient: "Is this serious?" Provider: "It's something we need to investigate promptly. The good news is that if we confirm what I suspect, there are effective treatments available."`
      },
      "Visit transcript, 00:24:30": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Also, since you're 45, you're due for colorectal cancer screening. Have you had a colonoscopy previously?" Patient: "No, I haven't." Provider: "We'll arrange that as well, as it's recommended starting at age 45. We can schedule both the imaging and the colonoscopy."`
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Cem, 45M\nDate: Today\n\n**CARDIOVASCULAR**\n• Pulsatile headaches (feels heartbeat in head)\n• Elevated blood pressure readings (multiple measurements)\n• No chest pain or pressure\n• No history of angina or MI\n• No palpitations\n• No orthopnea or PND\n\n**NEUROLOGIC**\n• Occasional dizziness (non-positional)\n• No syncope or near-syncope\n• No vision changes\n• No focal weakness or numbness\n• No seizures or loss of consciousness\n\n**MUSCULOSKELETAL**\n• Leg fatigue with exertion (walking, stairs)\n• No calf pain or claudication\n• No joint pain or swelling\n\n**CONSTITUTIONAL**\n• Denies fever, chills, or night sweats\n• No unintentional weight loss or weight gain\n• Energy level generally good\n\n**RESPIRATORY**\n• No shortness of breath at rest\n• Mild dyspnea with heavy exertion (climbing multiple flights)\n• No cough or wheeze\n\n**GASTROINTESTINAL**\n• Normal bowel habits\n• No abdominal pain or discomfort\n\n**GENITOURINARY**\n• Normal urination, no nocturia"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Cem, 45M\nDate: Today\n\n**INITIAL MEASUREMENTS (Check-in)**\nBlood Pressure: 150/92 mmHg (right arm, seated)\nHeart Rate: 76 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.6°F\nO2 Saturation: 98% (room air)\nWeight: 178 lbs\nHeight: 5'10\"\nBMI: 25.5 (overweight)\n\n**NOTES**\nBlood pressure elevated, consistent with recent readings\nHeart rate normal\nNo fever"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION (Initial)**\n\nPatient: Cem, 45M\nDate: Today\nVisit Type: Evaluation of elevated blood pressure and headaches\n\n**GENERAL**\n• Well-appearing, no acute distress\n• Alert and oriented x3\n• Normal body habitus\n\n**HEENT**\n• Normocephalic, atraumatic\n• Pupils equal, round, reactive to light\n• No papilledema on fundoscopic exam\n• No carotid bruits bilaterally\n\n**CARDIOVASCULAR (Initial Examination)**\n• Regular rate and rhythm\n• Normal S1 S2\n• No murmurs appreciated on initial auscultation\n• No chest wall tenderness\n• Radial pulses 2+ bilaterally, symmetric\n\n**RESPIRATORY**\n• Lungs clear to auscultation bilaterally\n• No wheezes, rales, or rhonchi\n• No respiratory distress\n\n**ABDOMINAL**\n• Soft, non-tender, non-distended\n• No masses or organomegaly\n• Bowel sounds present and normal\n• No abdominal bruits\n\n**EXTREMITIES**\n• No edema\n• No cyanosis or clubbing\n\n**PERIPHERAL VASCULAR (Initial)**\n• Radial pulses: 2+ bilaterally, symmetric\n• Femoral pulses: Palpable but slightly diminished bilaterally compared to radial pulses\n• No femoral bruits initially noted\n\n**NEUROLOGIC**\n• Alert and oriented x3\n• Cranial nerves II-XII intact\n• Motor strength 5/5 upper and lower extremities\n• Sensation intact\n• No focal neurologic deficits\n\n**ASSESSMENT**\nWell-appearing patient with elevated blood pressure and diminished femoral pulses - warrants further vascular assessment"
      },
      "Physical examination (additional BP exam), today": {
        type: "Clinical Note",
        date: "Today",
        content: "**ADDITIONAL BLOOD PRESSURE EXAMINATION**\n\nPatient: Cem, 45M\nDate: Today\nTime: During visit (after initial exam)\nIndication: Diminished femoral pulses noted on initial exam; elevated BP without clear risk factors\n\n**AMBIENT CLINICAL NUDGE (Triggered)**\n\"Mismatch between upper body symptoms (hypertension, pulsatile headaches) and lower extremity fatigue → recommend checking femoral pulses and comparing upper vs lower extremity blood pressure\"\n\n**BLOOD PRESSURE MEASUREMENTS**\n\n**Upper Extremity (Right Arm):**\n• Patient seated, arm at heart level\n• Appropriate cuff size used\n• Reading: 150/90 mmHg\n• Repeat reading: 150/92 mmHg (consistent)\n\n**Lower Extremity (Right Leg):**\n• Patient positioned prone\n• Large cuff applied to thigh\n• Popliteal artery auscultated\n• Reading: 110/70 mmHg\n\n**FINDINGS**\n• Arm-leg blood pressure gradient: 40 mmHg systolic difference (150 mmHg arm vs 110 mmHg leg)\n• **This finding is pathognomonic for coarctation of the aorta**\n• Normal physiologic state: leg BP should be equal to or slightly higher than arm BP\n• Significant gradient confirms vascular obstruction between upper and lower body\n\n**CLINICAL SIGNIFICANCE**\nSignificant arm-leg BP gradient detected. This is a critical finding that narrows the differential diagnosis significantly. Pattern highly suggestive of structural vascular abnormality, specifically coarctation of the aorta."
      },
      "Physical examination (focused re-exam), today": {
        type: "Clinical Note",
        date: "Today",
        content: "**FOCUSED CARDIOVASCULAR RE-EXAMINATION**\n\nPatient: Cem, 45M\nDate: Today\nTime: Following BP gradient discovery\nIndication: Re-examine for findings consistent with coarctation of aorta\n\n**AUSCULTATION (Targeted)**\n\n**Cardiac:**\n• Auscultation in supine position with patient breath-held\n• Left infraclavicular area: Grade 1-2/6 systolic ejection murmur appreciated\n• Posterior thorax (between scapulae): Faint systolic murmur heard over thoracic spine\n• These murmurs were subtle and not appreciated on initial routine examination\n\n**Vascular:**\n• Carotid arteries: No bruits\n• Abdominal aorta: No bruits\n• Femoral arteries: Faint continuous murmur appreciated bilaterally (collateral flow)\n\n**PALPATION (Re-assessment)**\n• Radial pulses: 2+ bilaterally, brisk and bounding\n• Brachial pulses: 2+ bilaterally, strong\n• Femoral pulses: 1+ bilaterally, diminished amplitude and delayed compared to radial (\"radial-femoral delay\")\n• Dorsalis pedis: 1+ bilaterally\n• Posterior tibial: 1+ bilaterally\n\n**CLINICAL CORRELATION**\nPhysical examination findings now consistent with coarctation of aorta:\n1. Arm-leg BP gradient (40 mmHg)\n2. Diminished and delayed femoral pulses\n3. Systolic murmur over left infraclavicular area and back (turbulent flow through narrowed aorta)\n4. Bounding upper extremity pulses (pre-stenotic hypertension)\n5. Weak lower extremity pulses (post-stenotic hypoperfusion)\n\nDiagnosis elevated from low probability to high probability based on examination findings."
      },
      "Visit transcript, 00:01:30": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Good to see you. I understand your blood pressure has been elevated — can you tell me more about how you've been feeling?" Patient: "I've been getting these headaches… kind of pounding sometimes."`
      },
      "Visit transcript, 00:03:15": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "When were you first told your blood pressure might be elevated?" Patient: "Maybe once when I was younger, but no one really followed up."`
      },
      "Visit transcript, 00:05:45": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Do you notice any symptoms with physical activity?" Patient: "Now that you mention it, my legs get tired pretty quickly… I always thought I was just out of shape."`
      },
      "Visit transcript, 00:09:20": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Any cramping pain in your legs when you walk?" Patient: "No, not cramping exactly. Just fatigue. My legs get tired, but it's not pain that makes me stop. More like they feel heavy."`
      },
      "Visit transcript, 00:12:40": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "I'm going to conduct an additional blood pressure examination. I want to check your blood pressure in your arms and legs." Patient: "Oh, okay. Is something wrong?" Provider: "I want to be thorough. I noticed your pulses feel a bit different between your arms and legs."`
      },
      "Visit transcript, 00:16:50": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "That is notable — your blood pressure is significantly lower in your legs compared to your arms, which is not typical. This finding raises concern for a structural vascular cause." Patient: "What does that mean?" Provider: "It suggests there may be a narrowing in one of your major blood vessels. It's called coarctation of the aorta - a congenital condition where there's a narrowing of the main artery from your heart."`
      },
      "Visit transcript, 00:21:15": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "I would like to obtain imaging to evaluate your blood vessels more closely. An echocardiogram and CT angiography of your chest will help us see the exact location and severity." Patient: "Is this serious?" Provider: "It's something we need to investigate promptly. The good news is that if we confirm what I suspect, there are effective treatments available - either surgical repair or a catheter-based procedure with a stent. Many people with this condition do very well after treatment."`
      },
      "Visit transcript, 00:24:30": {
        type: "Transcript",
        date: "Today",
        content: `Provider: "Also, since you're 45, you're due for colorectal cancer screening. Have you had a colonoscopy previously?" Patient: "No, I haven't." Provider: "We'll arrange that as well, as it's recommended starting at age 45. We can coordinate the scheduling for you."`
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Cem, 45M\nDate: Today\n\n**CARDIOVASCULAR**\n• Pulsatile headaches (feels heartbeat in head)\n• Elevated blood pressure readings (multiple measurements)\n• No chest pain or pressure\n• No history of angina or MI\n• No palpitations\n• No orthopnea or PND\n\n**NEUROLOGIC**\n• Occasional dizziness (non-positional)\n• No syncope or near-syncope\n• No vision changes\n• No focal weakness or numbness\n• No seizures or loss of consciousness\n\n**MUSCULOSKELETAL**\n• Leg fatigue with exertion (walking, stairs)\n• No calf pain or claudication\n• No joint pain or swelling\n\n**CONSTITUTIONAL**\n• Denies fever, chills, or night sweats\n• No unintentional weight loss or weight gain\n• Energy level generally good\n\n**RESPIRATORY**\n• No shortness of breath at rest\n• Mild dyspnea with heavy exertion (climbing multiple flights)\n• No cough or wheeze\n\n**GASTROINTESTINAL**\n• Normal bowel habits\n• No abdominal pain or discomfort\n\n**GENITOURINARY**\n• Normal urination, no nocturia"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Cem, 45M\nDate: Today\n\n**INITIAL MEASUREMENTS (Check-in)**\nBlood Pressure: 150/92 mmHg (right arm, seated)\nHeart Rate: 76 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.6°F\nO2 Saturation: 98% (room air)\nWeight: 178 lbs\nHeight: 5'10\"\nBMI: 25.5 (overweight)\n\n**NOTES**\nBlood pressure elevated, consistent with recent readings\nHeart rate normal\nNo fever"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION (Initial)**\n\nPatient: Cem, 45M\nDate: Today\nVisit Type: Evaluation of elevated blood pressure and headaches\n\n**GENERAL**\n• Well-appearing, no acute distress\n• Alert and oriented x3\n• Normal body habitus\n\n**HEENT**\n• Normocephalic, atraumatic\n• Pupils equal, round, reactive to light\n• No papilledema on fundoscopic exam\n• No carotid bruits bilaterally\n\n**CARDIOVASCULAR (Initial Examination)**\n• Regular rate and rhythm\n• Normal S1 S2\n• No murmurs appreciated on initial auscultation\n• No chest wall tenderness\n• Radial pulses 2+ bilaterally, symmetric\n\n**RESPIRATORY**\n• Lungs clear to auscultation bilaterally\n• No wheezes, rales, or rhonchi\n• No respiratory distress\n\n**ABDOMINAL**\n• Soft, non-tender, non-distended\n• No masses or organomegaly\n• Bowel sounds present and normal\n• No abdominal bruits\n\n**EXTREMITIES**\n• No edema\n• No cyanosis or clubbing\n\n**PERIPHERAL VASCULAR (Initial)**\n• Radial pulses: 2+ bilaterally, symmetric\n• Femoral pulses: Palpable but slightly diminished bilaterally compared to radial pulses\n• No femoral bruits initially noted\n\n**NEUROLOGIC**\n• Alert and oriented x3\n• Cranial nerves II-XII intact\n• Motor strength 5/5 upper and lower extremities\n• Sensation intact\n• No focal neurologic deficits\n\n**ASSESSMENT**\nWell-appearing patient with elevated blood pressure and diminished femoral pulses - warrants further vascular assessment"
      },
      "CT angiography chest (results), 2 days post-visit": {
        type: "Imaging",
        date: "2 days after visit",
        content: "**CT ANGIOGRAPHY CHEST - PRELIMINARY REPORT**\n\nPatient: Cem, 45M\nMRN: CM-445821\nExam Date: 2 days after office visit\nStudy: CT angiography chest with IV contrast\n\n**CLINICAL INDICATION**\nElevated blood pressure, arm-leg BP gradient, suspected coarctation of aorta\n\n**TECHNIQUE**\nAxial images obtained through chest with IV contrast during arterial phase. Multiplanar reconstructions performed.\n\n**FINDINGS**\n\nAORTA:\n• **Coarctation of descending thoracic aorta identified**\n• Location: Just distal to left subclavian artery origin (typical location)\n• Narrowing: Focal stenosis with luminal diameter reduced to approximately 6-7mm (normal ~20-25mm at this level)\n• Severity: Severe stenosis (>70% diameter reduction)\n• Pre-stenotic dilatation: Ascending aorta mildly dilated (38mm)\n• Post-stenotic dilatation: Descending aorta mildly dilated distal to coarctation\n• Extensive collateral circulation visible via internal mammary and intercostal arteries\n\nCARDIAC:\n• Left ventricular wall thickness: Mildly increased (concentric hypertrophy secondary to longstanding hypertension)\n• Chamber size: Normal\n• Aortic valve: Appears bicuspid (common associated anomaly with coarctation)\n\nVASCULATURE:\n• Prominent intercostal arteries (collateral circulation)\n• Dilated internal mammary arteries bilaterally\n• Subclavian arteries normal\n\nLUNGS:\n• Clear, no consolidation or nodules\n\nOTHER:\n• No significant chest wall or mediastinal abnormalities\n\n**IMPRESSION**\n1. **Severe coarctation of descending thoracic aorta** (just distal to left subclavian artery), with >70% luminal narrowing\n2. Extensive collateral circulation via internal mammary and intercostal arteries\n3. Left ventricular hypertrophy (secondary to longstanding pressure overload)\n4. Bicuspid aortic valve (associated congenital anomaly)\n5. Pre- and post-stenotic aortic dilatation\n\n**RECOMMENDATION**\nUrgent cardiothoracic surgery consultation for surgical repair vs. catheter-based intervention (stenting). Findings consistent with longstanding coarctation, likely present since birth but previously undiagnosed.\n\n---\n*Report electronically signed by Dr. Radiologist*"
      },
      "Echocardiogram (results), 1 day post-visit": {
        type: "Imaging",
        date: "1 day after visit",
        content: "**ECHOCARDIOGRAM REPORT**\n\nPatient: Cem, 45M\nMRN: CM-445821\nExam Date: 1 day after office visit\nStudy: Transthoracic echocardiogram\n\n**CLINICAL INDICATION**\nHypertension, suspected coarctation of aorta, evaluate cardiac function\n\n**MEASUREMENTS**\nLV end-diastolic dimension: 52mm (normal)\nLV end-systolic dimension: 34mm (normal)\nEjection fraction: 60% (normal)\nLeft ventricular wall thickness:\n  - Septum: 13mm (mildly increased, upper limit normal 11mm)\n  - Posterior wall: 12mm (mildly increased)\nLeft atrial size: 38mm (normal)\n\n**FINDINGS**\n\n**Left Ventricle:**\n• Normal chamber size\n• Mild concentric left ventricular hypertrophy (wall thickness 12-13mm)\n• Ejection fraction preserved at 60%\n• No regional wall motion abnormalities\n• Diastolic function: Grade I diastolic dysfunction (impaired relaxation)\n\n**Aortic Valve:**\n• **Bicuspid aortic valve identified** (fusion of right and left coronary cusps)\n• Mild aortic valve thickening\n• No significant aortic stenosis (peak velocity 1.8 m/s)\n• Trace aortic regurgitation\n\n**Aorta:**\n• Ascending aorta: Mildly dilated (38mm, upper limit normal 37mm)\n• Aortic arch: Not well visualized (limited acoustic window)\n• Descending aorta: Turbulent flow noted in descending aorta, consistent with stenosis (seen on color Doppler)\n• **Coarctation suspected** but complete anatomy better defined by CT angiography\n\n**Other Valves:**\n• Mitral valve: Structurally normal, no stenosis or regurgitation\n• Tricuspid valve: Normal\n• Pulmonic valve: Normal\n\n**Right Ventricle:**\n• Normal size and function\n• No pulmonary hypertension\n\n**Pericardium:**\n• No effusion\n\n**IMPRESSION**\n1. **Bicuspid aortic valve** with trace regurgitation, no stenosis\n2. **Mild concentric left ventricular hypertrophy** (secondary to longstanding hypertension)\n3. Preserved left ventricular systolic function (EF 60%)\n4. Grade I diastolic dysfunction\n5. Findings suggestive of **coarctation of descending aorta** (turbulent flow on Doppler) - CT angiography recommended for definitive anatomic assessment\n6. Ascending aortic dilatation (mild, 38mm)\n\n**RECOMMENDATIONS**\n• Cardiothoracic surgery referral for coarctation repair\n• Serial imaging surveillance of ascending aortic dilatation\n• Consider endocarditis prophylaxis given bicuspid aortic valve\n\n---\n*Report electronically signed by Dr. Cardiologist*"
      }
    },
    "Robert Chen": {
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Robert Chen\nDate: Today\n6 weeks post-op right shoulder rotator cuff repair\n\n**INSPECTION**\n• Surgical portals: All portal sites well-healed with minimal scarring. No erythema, no drainage, no warmth\n• Very mild glenohumeral effusion (expected at this timepoint)\n\n**PALPATION**\n• No tenderness over surgical sites\n• No warmth or signs of infection\n• Minimal effusion\n\n**RANGE OF MOTION (PASSIVE)**\n• Forward flexion: 110°\n• Abduction: 80°\n• External rotation: 30°\n• Internal rotation: To sacrum\n• All measurements limited by guarding, not pain\n\n**STRENGTH**\n• Deferred at this timepoint to protect repair integrity\n\n**NEUROVASCULAR EXAMINATION**\n• Axillary nerve: Deltoid sensation intact (critical finding)\n• Radial/median/ulnar nerves: Intact distally\n• Radial pulse: 2+ bilaterally\n• Capillary refill: <2 seconds\n\n**SPECIAL TESTS**\n• Not performed at 6 weeks (too early)\n\n**ASSESSMENT**\nExcellent healing progress, ready to advance to active-assisted ROM phase"
      },
      "Operative report, 01/03/2024": {
        type: "Procedure Note",
        date: "Jan 3, 2024",
        content: "**OPERATIVE REPORT**\n\nPatient: Robert Chen, 58M\nDate: 01/03/2024\nSurgeon: Dr. Anderson\nProcedure: Arthroscopic rotator cuff repair, right shoulder\n\n**PREOPERATIVE DIAGNOSIS**\nFull-thickness rotator cuff tear, right shoulder\n\n**INTRAOPERATIVE FINDINGS**\n• Large full-thickness tear of supraspinatus tendon measuring 2.5cm in anteroposterior dimension\n• High-grade partial-thickness articular-side tear of infraspinatus (>50% thickness)\n• Biceps tendon intact\n• No labral pathology\n• Moderate glenohumeral arthritis\n• Excellent tissue quality\n\n**PROCEDURE**\nArthroscopic examination performed. Rotator cuff repaired using double-row technique:\n• Medial row: Two 4.75mm anchors\n• Lateral row: Two 4.75mm anchors\n• Repair under minimal tension with good tissue approximation\n• Excellent fixation achieved\n\n**POSTOPERATIVE PLAN**\n• Sling immobilization with abduction pillow x 6 weeks\n• Pendulum exercises only for first 2 weeks\n• Physical therapy to begin week 2 for passive ROM\n• No active ROM until cleared by surgeon (typically 6-8 weeks)\n• Follow-up in 6 weeks"
      },
      "PT progress note, 02/05/2024": {
        type: "Clinical Note",
        date: "Feb 5, 2024",
        content: "**PHYSICAL THERAPY PROGRESS NOTE**\n\nPatient: Robert Chen, 58M\nDate: 02/05/2024\nPost-op day: 33 (4.5 weeks)\n\n**CURRENT PHASE**\nPassive range of motion exercises\n\n**INTERVENTIONS**\n• Therapist-assisted passive stretching\n• Pulley exercises for forward flexion and abduction\n• Wand exercises for external rotation\n• Scapular stabilization exercises (gentle)\n• Ice after therapy session\n\n**RANGE OF MOTION (PASSIVE)**\nForward flexion: 110 degrees\nAbduction: 80 degrees\nExternal rotation (at side): 30 degrees\nInternal rotation: To sacrum\n*Measurements taken with patient supine to ensure true passive motion*\n\n**PAIN**\n3/10 during therapy, well-tolerated\n\n**PLAN**\nContinue passive ROM protocol\nAttending 3x per week\nNo active ROM until surgeon clearance at 6-week visit\nGoal: 120° flexion, 90° abduction by 6 weeks"
      },
      "Visit transcript, 00:02:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How's the pain been since surgery?" Patient: "Pain is much better now. Just 2 out of 10 at rest, maybe 4 out of 10 during PT. Way better than before the surgery."`
      },
      "Visit transcript, 00:03:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How are the incisions healing?" Patient: "All the incisions are healed up really well. No redness or anything."`
      },
      "Visit transcript, 00:04:00": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "When did you stop wearing the sling?" Patient: "PT had me stop wearing the sling about 2 weeks ago."`
      },
      "Visit transcript, 00:05:20": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How's your sleep now?" Patient: "I'm sleeping much better now. I can sleep on my left side without waking up."`
      },
      "Visit transcript, 00:06:00": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any numbness or tingling in your hand?" Patient: "No numbness or tingling in my right arm or hand. Everything feels normal."`
      },
      "Visit transcript, 00:06:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "When do you think you can return to work?" Patient: "I'd really like to know when I can go back to work. I'm on medical leave right now."`
      },
      "Visit transcript, 00:07:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any other joints bothering you?" Patient: "Just my shoulder. Everything else - knees, back, other shoulder - all fine."`
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Robert Chen\nDate: Today\n\n**MUSCULOSKELETAL**\n• Right shoulder pain improving post-operatively\n• No other joint pain or swelling\n• No myalgias\n\n**NEUROLOGIC**\n• No paresthesias or motor deficits in right upper extremity\n• No headaches, dizziness, or balance issues\n\n**CONSTITUTIONAL**\n• Denies fever, chills, or other constitutional symptoms\n• Energy level good\n• Sleep improved since surgery\n\n**CARDIOVASCULAR**\n• No chest pain or palpitations\n\n**RESPIRATORY**\n• No shortness of breath or cough"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Robert Chen, 58M\nDate: Today (6 weeks post-op)\n\n**MEASUREMENTS**\nBlood Pressure: 128/82 mmHg\nHeart Rate: 74 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.2°F\nO2 Saturation: 99% (room air)\nWeight: 185 lbs\n\n**NOTES**\nVitals stable\nNo fever - good sign for healing"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Robert Chen, 58M\nDate: Today (6 weeks post-op)\n\n**RIGHT SHOULDER EXAMINATION**\n\n*Inspection:*\n• All portal sites well-healed with minimal scarring\n• No erythema, no drainage, no warmth\n• Very mild effusion of glenohumeral joint (expected at this timepoint)\n\n*Palpation:*\n• No tenderness at surgical sites\n• Minimal tenderness over subacromial space\n\n*Range of Motion (Passive):*\n• Forward flexion: 110 degrees\n• Abduction: 80 degrees  \n• External rotation (at side): 30 degrees\n• Internal rotation: To sacrum\n*Measurements taken with patient supine to ensure true passive motion*\n\n*Strength:*\n• Deferred at this early timepoint to protect repair\n\n*Neurovascular:*\n• Axillary nerve function intact (deltoid sensation preserved)\n• Radial, median, and ulnar nerves intact\n• Capillary refill <2 seconds\n• Radial pulse 2+\n\n**IMPRESSION**\nExcellent early healing, ROM progressing per protocol"
      }
    },
    "Maria Garcia": {
      "Aug 10, 2023, Annual wellness visit, Athena": {
        type: "Clinical Note",
        date: "Aug 10, 2023",
        content: "**ANNUAL WELLNESS VISIT**\n\nPatient: Maria Garcia, 35F\nDate: 08/10/2023\nVisit Type: Annual wellness examination\n\n**CHIEF COMPLAINT**\nRoutine health maintenance\n\n**HISTORY OF PRESENT ILLNESS**\nPatient presents for annual wellness visit. Reports feeling well overall. No acute concerns or complaints. Maintaining active lifestyle with regular exercise (running 3x/week). Healthy diet, no tobacco use, occasional alcohol.\n\n**PHYSICAL EXAMINATION**\nGeneral: Well-appearing, no acute distress. No chronic medical conditions identified.\nVitals: BP 120/75, HR 72, Temp 98.6°F, Weight 145 lbs, BMI 23.5\nHEENT: Normocephalic, atraumatic. PERRLA. TMs clear bilaterally.\nCardiac: Regular rate and rhythm, no murmurs.\nLungs: Clear to auscultation bilaterally.\nAbdomen: Soft, non-tender, no masses.\nExtremities: No edema, full range of motion.\n\n**ASSESSMENT**\n35-year-old healthy female, here for preventive care. No concerning findings on examination.\n\n**PLAN**\n• Age-appropriate screening labs ordered (CBC, CMP, lipid panel)\n• Counseled on healthy lifestyle maintenance\n• Discussed contraception options (patient currently using OCPs)\n• Return for annual exam in 12 months\n• Call with any concerns in interim\n\n**Counseled on preventive care and scheduled follow-up in 12 months.**\n\n---\nDr. Sarah Martinez, MD\nFamily Medicine"
      },
      "June 15, 2023, Lumbar spine X-ray, Athena": {
        type: "Imaging",
        date: "June 15, 2023",
        content: "**RADIOLOGY REPORT - LUMBAR SPINE X-RAY**\n\nPatient: Maria Garcia\nDOB: 03/15/1989\nMRN: MG-334567\nExam Date: 06/15/2023\nStudy: Lumbar spine radiographs (AP and lateral views)\n\n**CLINICAL INDICATION**\nLower back pain\n\n**TECHNIQUE**\nStanding AP and lateral views of the lumbar spine obtained.\n\n**FINDINGS**\n\nAlignment:\n• Normal thoracic kyphosis and lumbar lordosis\n• No scoliosis\n• No spondylolisthesis\n\nVertebral Bodies:\n• Normal height and alignment\n• No compression fractures\n• No lytic or blastic lesions\n\nDisc Spaces:\n• Mild degenerative disc disease at L4-L5 and L5-S1\n• Disc heights preserved\n• No severe disc space narrowing\n\nFacet Joints:\n• Mild facet arthropathy at L4-L5 and L5-S1\n• No significant hypertrophy\n\nSoft Tissues:\n• No significant abnormality\n\n**IMPRESSION**\n1. Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights\n2. Mild facet arthropathy at L4-L5 and L5-S1\n3. No acute fracture, listhesis, or significant stenosis\n4. No concerning findings\n\n**RECOMMENDATION**\nClinical correlation recommended. Follow-up imaging as clinically indicated."
      },
      "Visit transcript, 00:01:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Tell me about your back pain. When did it start?" Patient: "The pain started about 4 days ago, on Saturday morning."`
      },
      "Visit transcript, 00:01:32": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "What were you doing when it started?" Patient: "I was helping my husband move our couch and I felt something pull in my lower back."`
      },
      "Visit transcript, 00:02:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "What makes the pain worse?" Patient: "It hurts really bad when I bend forward or try to pick anything up."`
      },
      "Visit transcript, 00:03:10": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Does anything make it better?" Patient: "When I lie down flat it feels a bit better."`
      },
      "Visit transcript, 00:03:58": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Does the pain go down your legs?" Patient: "No, the pain stays in my back. It doesn't go down my legs at all."`
      },
      "Visit transcript, 00:04:22": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any issues with bladder or bowel control?" Patient: "Bathroom habits are completely normal."`
      },
      "Visit transcript, 00:05:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Have you taken anything for the pain?" Patient: "I've been taking ibuprofen 600mg three times a day. It helps a little but doesn't take it away completely."`
      },
      "Visit transcript, 00:06:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any other joints giving you trouble?" Patient: "Just my back. My knees, hips, everything else feels fine."`
      },
      "Feb 12, Intake form, Ambient": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM - AMBIENT DOCUMENTATION**\n\nPatient: Maria Garcia, 35F\nDate: 02/12/2024\n\n**CHIEF COMPLAINT**\nLower back pain\n\n**PAIN ASSESSMENT**\n• Location: Sharp pain localized to lower lumbar region, L4-L5 area\n• Onset: Started after helping son move furniture 4 days ago\n• Character: Sharp, aching\n• Severity: Pain severity 7/10 at worst, improves with rest\n• Duration: 4 days, gradual onset, pain worsened over first 24 hours\n• Aggravating factors: Bending, lifting, prolonged standing\n• Relieving factors: Rest, lying flat\n• Radiation: No radiation to legs, no numbness or tingling\n\n**RED FLAGS ASSESSMENT**\n• Fever: No fever\n• Bowel/bladder dysfunction: No bowel/bladder dysfunction\n• Trauma: No trauma\n• Night pain: No night pain\n• Constitutional symptoms: No history of cancer or recent weight loss\n\n**CURRENT MEDICATIONS**\n• Current medications: None. Takes occasional ibuprofen OTC as needed.\n\n**PAST MEDICAL HISTORY**\n• No prior back problems\n• No chronic conditions"
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**TODAY'S VISIT - AMBIENT DOCUMENTATION**\n\nPatient: Maria Garcia, 35F\nDate: 02/12/2024\n\n**PHYSICAL EXAMINATION**\n• General: Well-appearing, no acute distress, no signs of systemic illness\n• Vitals: BP 118/72, HR 76, Temp 98.4°F\n• Gait: Normal gait, negative straight leg raise test bilaterally\n• Back: Tenderness over paraspinal muscles L3-L5\n• Range of Motion: Full range of motion with mild discomfort, no neurological deficits\n\n**ASSESSMENT**\n• Acute mechanical low back pain, no red flags present\n\n**PLAN**\n• Conservative management indicated - no red flags present\n• Physical therapy referral for core strengthening and body mechanics education\n• NSAIDs for pain management\n• Follow-up in 2 weeks if no improvement or if symptoms worsen\n\n**COUNSELING**\n• Discussed nature of mechanical back pain\n• Importance of staying active within pain limits\n• Proper body mechanics and lifting techniques\n• Return precautions reviewed"
      },
      "Intake form, 02/12/2024": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: Maria Garcia, 35F\nDate: 02/12/2024\n\n**CHIEF COMPLAINT**\nLower back pain x 4 days\n\n**PAIN ASSESSMENT**\nLocation: Lower lumbar region (L4-L5 area)\nOnset: Saturday 02/08/2024, while moving furniture\nCharacter: Sharp\nSeverity: 7/10 at worst\nAggravating factors: Bending, lifting, twisting\nRelieving factors: Rest, lying flat\n\n**ASSOCIATED SYMPTOMS**\n☐ Radiation to legs - NO\n☐ Numbness/tingling - NO\n☐ Bowel dysfunction - NO\n☐ Bladder dysfunction - NO\n☐ Fever - NO\n☐ Weight loss - NO\n\n**PAST MEDICAL HISTORY**\nNo prior back problems or injuries\nNo chronic conditions\n\n**CURRENT MEDICATIONS**\nIbuprofen 600mg TID (started 2 days ago, OTC)"
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Maria Garcia\nDate: Today\n\n**MUSCULOSKELETAL**\n• Lower back pain as documented in HPI\n• No other joint pain, stiffness, or swelling\n• No chronic arthritis\n\n**NEUROLOGIC**\n• No numbness, tingling, or weakness in lower extremities\n• No paresthesias\n• No focal neurological symptoms\n• No headaches\n\n**CONSTITUTIONAL**\n• Denies fever, chills, or other constitutional symptoms\n• No recent weight loss\n• Energy level normal when not limited by pain\n\n**GENITOURINARY**\n• Bowel and bladder function normal\n• No incontinence or retention\n• No dysuria"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Maria Garcia, 35F\nDate: Today\n\n**MEASUREMENTS**\nBlood Pressure: 118/76 mmHg\nHeart Rate: 72 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.4°F\nO2 Saturation: 99% (room air)\nWeight: 145 lbs\nHeight: 5'6\"\nBMI: 23.4 (normal)\n\n**NOTES**\nAll vital signs within normal limits"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Maria Garcia, 35F\nDate: Today\n\n**GENERAL**\nWell-appearing female, mild discomfort with position changes\n\n**BACK EXAMINATION**\n*Inspection:*\n• Normal thoracic kyphosis and lumbar lordosis\n• No scoliosis\n• No visible deformity or asymmetry\n\n*Palpation:*\n• Moderate tenderness to palpation over bilateral paraspinal musculature from L3 to L5 level\n• No midline spinous process tenderness\n• No step-off deformity\n\n*Range of Motion:*\n• Flexion: Limited to 60 degrees by pain\n• Extension: Full, minimal discomfort\n• Lateral bending: Symmetric, mild discomfort\n• Rotation: Full bilaterally\n\n**NEUROLOGICAL EXAMINATION**\n*Motor:*\n• Lower extremity strength 5/5 bilaterally (hip flexors, knee extensors/flexors, ankle dorsiflexors/plantarflexors)\n\n*Sensory:*\n• Sensation intact to light touch in all dermatomes L2-S1\n\n*Reflexes:*\n• Patellar reflexes: 2+ bilaterally\n• Achilles reflexes: 2+ bilaterally\n• Symmetric\n\n*Special Tests:*\n• Straight leg raise: Negative bilaterally at 70 degrees (no radicular symptoms provoked)\n• FABER test: Negative bilaterally\n• No saddle anesthesia"
      }
    },
    "Lisa Anderson": {
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Lisa Anderson, 28F\nDate: Today\n\n**GENERAL**\n• Well-appearing, no acute distress\n• Vitals: BP 118/74, HR 68, BMI 22.1\n\n**LEFT KNEE EXAMINATION**\n\nInspection:\n• No effusion or erythema\n• Normal alignment\n• Full weight-bearing without antalgic gait\n\nPalpation:\n• Point tenderness at medial joint line\n• No warmth or effusion\n• No popliteal cyst\n\nRange of Motion:\n• Full extension (0 degrees)\n• Flexion to 135 degrees\n• No pain at extremes of motion\n• Mild pain mid-range with loaded flexion\n\nSpecial Tests:\n• McMurray test: **POSITIVE** for medial meniscus - reproduces medial joint line pain and palpable click with valgus stress and external rotation\n• Thessaly test: **POSITIVE** - reproduction of medial joint line pain with internal rotation at 20 degrees of knee flexion\n• Lachman test: Negative (ACL intact)\n• Posterior drawer: Negative (PCL intact)\n• Valgus/varus stress: Negative (collateral ligaments intact)\n\n**ASSESSMENT**\nClinical examination highly suggestive of medial meniscus tear. Positive provocative tests with mechanical symptoms warrant MRI for definitive diagnosis and treatment planning."
      },
      "Visit transcript, 00:01:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "What brings you in today?" Patient: "I've been having pain in my left knee for about 3 weeks now. The pain started about 3 weeks ago."`
      },
      "Visit transcript, 00:02:10": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Tell me how this started." Patient: "I was training for a half marathon, increasing my mileage. That's when the pain started."`
      },
      "Visit transcript, 00:02:50": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Show me exactly where it hurts." Patient: "The pain is right here on the inside of my knee, along the joint."`
      },
      "Visit transcript, 00:03:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Does it feel better with rest?" Patient: "It feels better when I rest. Almost goes away completely if I don't do anything for a few days."`
      },
      "Visit transcript, 00:04:00": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Do you notice any clicking or popping?" Patient: "Sometimes I feel a click or pop when I bend and straighten my knee."`
      },
      "Visit transcript, 00:04:40": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Has your knee ever felt unstable?" Patient: "A couple times my knee has felt like it was going to give out, but it hasn't fully."`
      },
      "Visit transcript, 00:05:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "What makes it worse?" Patient: "Stairs are really painful, especially going down. Squatting and twisting motions hurt too."`
      },
      "Visit transcript, 00:06:00": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How far can you run now?" Patient: "I can barely run a mile now before the pain gets too bad and I have to stop."`
      },
      "Visit transcript, 00:06:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "What have you tried for treatment?" Patient: "I've been icing it after activity and taking ibuprofen 600mg three times a day. Helps a little but not much."`
      },
      "Visit transcript, 00:07:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any other joints bothering you?" Patient: "Just my left knee. Everything else feels fine."`
      },
      "Intake form, 02/12/2024": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: Lisa Anderson, 28F\nDate: 02/12/2024\n\n**CHIEF COMPLAINT**\nLeft knee pain x 3 weeks\n\n**HISTORY OF PRESENT ILLNESS**\nOnset: Gradual onset 3 weeks ago during half-marathon training\nLocation: Medial joint line, left knee\nCharacter: Aching, occasional sharp pain\nSeverity: 5-6/10 with activity, 2/10 at rest\nDuration: Constant when active\n\n**AGGRAVATING FACTORS**\n• Running (can only run ~1 mile before forced to stop)\n• Stairs (especially descending)\n• Squatting\n• Twisting motions\n\n**RELIEVING FACTORS**\n• Rest (pain almost resolves with 2-3 days rest)\n• Ice\n\n**ASSOCIATED SYMPTOMS**\n• Clicking/popping sensation with movement\n• Occasional feeling of \"giving way\" but no true instability\n• No locking\n• No swelling noted by patient\n\n**TREATMENTS TRIED**\n• Ice after activity\n• Ibuprofen 600mg TID - minimal relief\n• Rest from running\n\n**PAST MEDICAL HISTORY**\nNo prior knee injuries or problems\nNo prior surgeries\n\n**ACTIVITY LEVEL**\nRecreational runner, typically 20-25 miles/week\nCurrently unable to maintain training"
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Lisa Anderson\nDate: Today\n\n**MUSCULOSKELETAL**\n• Left knee pain as documented in HPI\n• No other joint pain, stiffness, or swelling\n• No back pain\n• No myalgias\n\n**NEUROLOGIC**\n• No paresthesias or motor deficits in lower extremities\n• No numbness or tingling\n• No weakness\n• No balance issues\n\n**CONSTITUTIONAL**\n• Denies fever, chills, or night sweats\n• No recent weight changes\n• Energy level good\n\n**CARDIOVASCULAR**\n• No chest pain or palpitations with exercise\n• No exercise intolerance (other than knee pain limiting)\n\n**RESPIRATORY**\n• No shortness of breath\n• No cough"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Lisa Anderson, 28F\nDate: Today\n\n**MEASUREMENTS**\nBlood Pressure: 118/72 mmHg\nHeart Rate: 68 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.3°F\nO2 Saturation: 99% (room air)\nWeight: 135 lbs\nHeight: 5'6\"\nBMI: 21.8 (normal)\n\n**NOTES**\nAll vital signs within normal limits\nAthletic, healthy-appearing patient"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Lisa Anderson, 28F\nDate: Today\n\n**GENERAL**\nWell-appearing, athletic build, no acute distress\n\n**LEFT KNEE EXAMINATION**\n\n*Inspection:*\n• No visible effusion\n• No ecchymosis or erythema\n• No deformity\n• Normal alignment\n\n*Palpation:*\n• Point tenderness over medial joint line, specifically posterior horn of medial meniscus region\n• No lateral joint line tenderness\n• No patellar tenderness\n\n*Range of Motion:*\n• Extension: 0 degrees (full)\n• Flexion: 135 degrees (full)\n• No pain at end ranges\n\n*Ligamentous Examination:*\n• Lachman test: Negative (firm endpoint, <3mm translation)\n• Anterior drawer: Negative\n• Posterior drawer: Negative\n• Valgus stress (0° and 30°): Stable, no pain\n• Varus stress (0° and 30°): Stable, no pain\n\n*Meniscal Tests:*\n• McMurray test: **POSITIVE** for medial meniscus - reproduces medial joint line pain and palpable click with valgus stress and external rotation at approximately 90 degrees flexion\n• Thessaly test (20°): **POSITIVE** - reproduces medial joint line pain with internal rotation\n• Apley compression: Positive\n\n*Patellofemoral:*\n• No apprehension\n• No crepitus\n• Normal tracking\n\n**GAIT**\nNormal, no antalgic gait\n\n**RIGHT KNEE**\nNormal examination, no tenderness or effusion"
      }
    },
    "Sarah Johnson": {
      "Previous visit note, 11/10/2025": {
        type: "Clinical Note",
        date: "Nov 10, 2025",
        content: "**FOLLOW-UP VISIT**\n\nPatient: Sarah Johnson, 42F\nDate: 11/10/2025\n\n**CHIEF COMPLAINT**\nDiabetes 3-month follow-up\n\n**LABORATORY REVIEW**\nA1c: 7.2% (improved from 7.5% at previous visit)\nFasting glucose range: 120-140 mg/dL per home monitoring\n\n**CURRENT MEDICATIONS**\n• Metformin 1000mg BID for diabetes\n• Lisinopril 20mg daily for hypertension  \n• Atorvastatin 40mg nightly for hyperlipidemia\n\n**PHYSICAL EXAMINATION**\nBP: 134/82 mmHg\nWeight: 184 lbs (BMI 31.6)\nFoot exam: Monofilament sensation intact bilaterally, no ulcers\n\n**DIABETIC SCREENING STATUS**\nLast eye exam: June 2025 (no diabetic retinopathy)\nNext due: June 2026\nRenal function: eGFR 72 (stable)\n\n**ASSESSMENT & PLAN**\n1. Type 2 diabetes mellitus without complications - improved control\n2. Essential hypertension - controlled\n3. Hyperlipidemia - at goal\n\nContinue current medications\nDietary counseling reinforced\nFollow-up in 3 months with repeat A1c"
      },
      "Lab results, 02/05/2024": {
        type: "Lab Results",
        date: "Feb 5, 2024",
        content: "**LABORATORY REPORT**\n\nPatient: Sarah Johnson, 42F\nDate: 02/05/2024\n\n**METABOLIC PANEL**\nGlucose, Fasting: 145 mg/dL [H] (Ref: 70-100)\nHemoglobin A1c: 7.8% [H] (Ref: <5.7% non-diabetic, <7.0% diabetic target)\n\n**COMPARISON**\nPrevious A1c (11/08/2025): 7.2%\nTrend: Increasing ↑\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL\nLDL Cholesterol: 95 mg/dL (at goal)\nHDL Cholesterol: 48 mg/dL\nTriglycerides: 125 mg/dL\n\n**RENAL FUNCTION**\nCreatinine: 0.9 mg/dL\neGFR: 72 mL/min/1.73m²\nUrine microalbumin: Negative\n\n**INTERPRETATION**\nA1c trending upward from 7.2% to 7.8% despite reported medication compliance\nSuggests need for treatment intensification\nRenal function stable, no evidence of diabetic nephropathy"
      },
      "Lab results, 11/08/2025": {
        type: "Lab Results",
        date: "Nov 8, 2025",
        content: "**LABORATORY REPORT**\n\nPatient: Sarah Johnson, 42F\nDate: 11/08/2025\n\n**METABOLIC PANEL**\nGlucose, Fasting: 135 mg/dL [H] (Ref: 70-100)\nHemoglobin A1c: 7.2% [H] (Ref: <5.7% non-diabetic, <7.0% diabetic target)\n\n**RENAL FUNCTION**\nCreatinine: 0.9 mg/dL  \neGFR: 72 mL/min/1.73m²\nUrine microalbumin: Negative\n\n**INTERPRETATION**\nA1c 7.2%, slightly above diabetic target of <7.0%\nRenal function normal"
      },
      "Visit transcript, 00:02:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How have you been doing with your diabetes medications?" Patient: "I take my metformin twice a day, 1000 milligrams each time. I don't miss doses. I'm really good about taking it with my meals."`
      },
      "Visit transcript, 00:03:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "And how about your diet?" Patient: "I'll admit, I ate more sweets than I should have over the holidays. It's hard during family gatherings, you know? But I'm trying to get back on track now."`
      },
      "Visit transcript, 00:04:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Have you had any low blood sugar episodes?" Patient: "No low blood sugar episodes. Haven't felt shaky or sweaty."`
      },
      "Visit transcript, 00:05:00": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Any increased thirst or urination? How's your vision?" Patient: "No increased thirst or urination. Vision is fine."`
      },
      "Visit transcript, 00:05:45": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "How often are you checking your blood sugar?" Patient: "I check my blood sugar a few times a week, usually in the morning."`
      },
      "Home glucose monitoring log": {
        type: "Form",
        date: "Feb 2024",
        content: "**HOME GLUCOSE LOG**\n\nPatient: Sarah Johnson\nTarget: Fasting <130 mg/dL\n\n**RECENT FASTING VALUES**\n02/12: 145 mg/dL\n02/10: 132 mg/dL ✓\n02/08: 148 mg/dL\n02/06: 135 mg/dL\n02/04: 142 mg/dL\n02/02: 138 mg/dL\n01/31: 136 mg/dL\n01/29: 143 mg/dL\n01/27: 150 mg/dL\n\n**AVERAGE**\nMean fasting glucose: 141 mg/dL\nRange: 132-150 mg/dL\n\n**TESTING FREQUENCY**\n2-3 times per week\nMostly fasting values\n\n**NOTES**\nPatient reports checking primarily in mornings before breakfast\nCompliance with testing adequate"
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Sarah Johnson\nDate: Today\n\n**ENDOCRINE**\n• Denies excessive thirst, urination, or hunger\n• No hypoglycemic episodes\n\n**CARDIOVASCULAR**\n• No cardiovascular symptoms\n• No chest pain, palpitations, orthopnea, PND, or lower extremity edema\n\n**NEUROLOGIC**\n• No peripheral neuropathy symptoms\n• No numbness, tingling, or burning sensation in feet\n• No visual changes\n\n**OPHTHALMOLOGIC**\n• No changes in vision\n• Last eye exam: June 2025\n• Due for annual diabetic eye exam\n\n**CONSTITUTIONAL**\n• No fever, chills, or night sweats\n• Weight stable over past few months"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: Sarah Johnson, 42F\nDate: Today\n\n**MEASUREMENTS**\nBlood Pressure: 132/84 mmHg\nHeart Rate: 76 bpm\nRespiratory Rate: 16 breaths/min\nTemperature: 98.6°F\nWeight: 185 lbs\nHeight: 5'5\"\nBMI: 30.8 (obese class I)\n\n**COMPARISON**\nPrevious visit (11/10/2025): 184 lbs\nChange: +1 lb (stable)"
      },
      "Visit vitals comparison": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS COMPARISON**\n\nPatient: Sarah Johnson\n\n**WEIGHT TREND**\nToday: 185 lbs\n11/10/2025: 184 lbs\n08/10/2025: 183 lbs\n05/10/2025: 186 lbs\n02/10/2025: 185 lbs\n\nTrend: Stable (183-186 lbs over past year)\n\n**BLOOD PRESSURE TREND**\nToday: 132/84 mmHg\n11/10/2025: 134/82 mmHg\n08/10/2025: 128/80 mmHg\n05/10/2025: 136/84 mmHg\n\nTrend: Generally well-controlled on lisinopril\nTarget: <130/80 mmHg for diabetic patients"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: Sarah Johnson, 42F\nDate: Today\n\n**GENERAL**\nWell-appearing, comfortable, no acute distress\n\n**CARDIOVASCULAR**\n• Regular rate and rhythm\n• S1 S2 normal\n• No murmurs, rubs, or gallops\n• No jugular venous distension\n\n**EXTREMITIES**\n• No edema\n• Dorsalis pedis and posterior tibial pulses 2+ bilaterally\n• No diminution of pulses\n• Capillary refill <2 seconds\n\n**DIABETIC FOOT EXAMINATION**\n*Inspection:*\n• Skin intact bilaterally\n• No ulcerations, calluses, or blisters\n• No erythema or warmth\n• No deformities (no Charcot, no hammer toes)\n• Nails normal, trimmed appropriately\n\n*Monofilament Testing:*\n• 10/10 sites intact bilaterally\n• Protective sensation present\n• No areas of sensory loss\n\n*Vascular:*\n• Pedal pulses palpable and strong\n• No dependent rubor\n• Normal capillary refill\n\n**IMPRESSION**\nDiabetic foot exam: Low risk\nNo evidence of peripheral neuropathy or vascular insufficiency"
      }
    },
    "James Wilson": {
      "Visit scheduling, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**APPOINTMENT DETAILS**\n\nPatient: James Wilson, 55M\nDate: 02/12/2024\n\n**APPOINTMENT TYPE**\nMedicare Annual Wellness Visit\n\n**REASON FOR VISIT**\nRoutine annual examination\nHealth maintenance review\nAge-appropriate cancer screening discussion\n\n**SCHEDULED TIME**\n60 minutes\n\n**NOTES**\nPatient due for colonoscopy (first screening)\nDiscuss PSA screening\nReview preventive care"
      },
      "Previous visit note, 02/15/2025": {
        type: "Clinical Note",
        date: "Feb 15, 2025",
        content: "**FOLLOW-UP VISIT**\n\nPatient: James Wilson, 55M\nDate: 02/15/2025\n\n**PAST MEDICAL HISTORY**\n• Essential hypertension (diagnosed 2018)\n• History of tobacco use (quit January 2020)\n\n**TOBACCO HISTORY**\nFormer smoker\nQuit date: January 2020 (4 years ago)\nPack-year history: 30 pack-years\n  - Smoked 1.5 packs per day for 20 years\n\n**CURRENT MEDICATIONS**\n• Lisinopril 20mg PO daily for hypertension\n• Aspirin 81mg PO daily for cardiovascular prevention\n\n**VITAL SIGNS**\nBP: 126/76 mmHg (well-controlled)\nWeight: 210 lbs\nBMI: 28.5 (overweight)\n\n**LIPID PANEL (January 2022)**\nLast checked: >2 years ago\nLDL: 118 mg/dL (slightly elevated)\nDue for repeat\n\n**ASSESSMENT**\n1. Essential hypertension - well controlled on lisinopril\n2. History of nicotine dependence - quit 4 years ago, doing well\n3. Overweight - BMI 28.5, lifestyle counseling provided"
      },
      "Visit transcript, 00:02:15": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Are you still taking your blood pressure medication every day?" Patient: "Yes, I take my blood pressure pill every morning, 20 milligrams of lisinopril. I take it right when I wake up, never miss it."`
      },
      "Visit transcript, 00:03:40": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Are you getting any exercise?" Patient: "I walk for exercise, usually 2 or 3 times a week, about 30 minutes each time."`
      },
      "Visit transcript, 00:04:50": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "Are there any screenings or tests you'd like to discuss?" Patient: "Yes, I want to make sure I'm up to date on everything. What screenings should I be getting at my age?"`
      },
      "Visit transcript, 00:05:30": {
        type: "Clinical Note",
        date: "Today",
        content: `Provider: "And you quit smoking a few years ago, right?" Patient: "I quit smoking 4 years ago. Haven't had a cigarette since then. It was tough at first but I'm glad I did it."`
      },
      "Intake form, 02/12/2024": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: James Wilson, 55M\nDate: 02/12/2024\n\n**REASON FOR VISIT**\nAnnual wellness examination\n\n**CURRENT HEALTH STATUS**\nFeels well overall\nNo acute concerns or new symptoms\n\n**EXERCISE HABITS**\nWalking for exercise 2-3 times per week\nDuration: Approximately 30 minutes per session\nIntensity: Moderate pace\n\n**DIET**\nAdmits to high sodium intake\nFrequent fast food consumption\nTrying to eat more vegetables\nCould benefit from dietary counseling\n\n**PREVENTIVE CARE INTEREST**\nPatient interested in discussing:\n• Age-appropriate cancer screenings\n• Colonoscopy (never done)\n• Any other recommended tests\n\n**SCREENING HISTORY**\nColonoscopy: Never performed\nLipid panel: Last checked 2022\n\n**CONCERNS**\nWants to make sure he's up to date on all health maintenance"
      },
      "Health maintenance review, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**HEALTH MAINTENANCE REVIEW**\n\nPatient: James Wilson, 55M\nDate: Today\n\n**CANCER SCREENING STATUS**\n\n*Colorectal Cancer Screening:*\n• Screening colonoscopy: **NEVER DONE**\n• Patient now 55 years old\n• Eligible for first-time screening per USPSTF guidelines (start age 45-50)\n• **OVERDUE** - should schedule colonoscopy\n\n*Prostate Cancer Screening:*\n• PSA: No prior screening documented\n• Age 55 - within shared decision-making window (age 55-69 per ACS)\n• No family history of prostate cancer documented\n• Discuss risks/benefits with patient\n\n*Lung Cancer Screening:*\n• Former smoker with 30 pack-year history\n• Quit 4 years ago (2020)\n• **ELIGIBLE** for low-dose CT screening per USPSTF\n  - Age 50-80\n  - 20+ pack-year history\n  - Quit within past 15 years\n\n**CARDIOVASCULAR SCREENING**\n• Lipid panel: Last 2022 (>2 years ago)\n• Due for repeat\n\n**IMMUNIZATIONS**\n• Flu vaccine: Due this fall season\n• Tdap: Up to date\n• Pneumococcal: Not yet due (recommended age 65+)\n\n**RECOMMENDATIONS**\n1. Schedule screening colonoscopy - PRIORITY\n2. Order lipid panel today\n3. Discuss PSA screening (shared decision-making)\n4. Consider lung cancer screening CT referral\n5. Flu vaccine when available"
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: James Wilson\nDate: Today\n\n**CARDIOVASCULAR**\n• No chest pain, palpitations, or shortness of breath\n• No orthopnea or PND\n• No lower extremity edema\n• No exercise intolerance\n\n**RESPIRATORY**\n• No chronic cough, wheezing, or shortness of breath\n• No hemoptysis\n• Former smoker, quit 4 years ago\n\n**GASTROINTESTINAL**\n• Bowel movements regular\n• No blood in stool\n• No change in bowel habits\n• No abdominal pain\n• No nausea or vomiting\n\n**GENITOURINARY**\n• Urinary function normal\n• No difficulty, frequency, urgency\n• No nighttime urination (nocturia)\n• No hematuria\n\n**CONSTITUTIONAL**\n• Feels well overall\n• No fever or chills\n• Weight stable over past year\n• Energy level good"
      },
      "Visit vitals, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS**\n\nPatient: James Wilson, 55M\nDate: Today\n\n**MEASUREMENTS**\nBlood Pressure: 128/78 mmHg\nHeart Rate: 68 bpm\nRespiratory Rate: 14 breaths/min\nTemperature: 98.4°F\nO2 Saturation: 99% (room air)\nWeight: 210 lbs\nHeight: 6'0\"\nBMI: 28.5 (overweight)\n\n**NOTES**\nBlood pressure well-controlled on lisinopril\nVital signs stable"
      },
      "Visit vitals comparison": {
        type: "Clinical Note",
        date: "Today",
        content: "**VITAL SIGNS TREND**\n\nPatient: James Wilson\n\n**WEIGHT HISTORY**\nToday: 210 lbs\n02/2025: 210 lbs\n11/2024: 208 lbs\n08/2024: 211 lbs\n02/2024: 209 lbs\n\nTrend: Stable (208-211 lbs over past year)\nBMI consistently 28-29 (overweight)\n\n**BLOOD PRESSURE HISTORY**\nToday: 128/78 mmHg ✓\n02/2025: 126/76 mmHg ✓\n11/2024: 132/80 mmHg ✓\n08/2024: 124/74 mmHg ✓\n\nTrend: Excellent control on lisinopril 20mg daily\nAll readings at target (<130/80)"
      },
      "Physical examination, today": {
        type: "Clinical Note",
        date: "Today",
        content: "**PHYSICAL EXAMINATION**\n\nPatient: James Wilson, 55M\nDate: Today\n\n**GENERAL**\nWell-appearing male, no acute distress\nOverweight habitus\n\n**CARDIOVASCULAR**\n• Regular rate and rhythm\n• S1 S2 normal\n• No murmurs, rubs, or gallops\n• No jugular venous distension\n• Carotid upstrokes normal, no bruits\n• Peripheral pulses 2+ throughout\n\n**RESPIRATORY**\n• Lungs clear to auscultation bilaterally\n• No wheezes, rales, or rhonchi\n• Good air movement throughout\n• No accessory muscle use\n\n**ABDOMEN**\n• Soft, non-tender, non-distended\n• Bowel sounds present and normal\n• No masses or organomegaly\n• No hernias\n\n**EXTREMITIES**\n• No edema\n• No cyanosis or clubbing\n• Full peripheral pulses\n• No varicosities\n\n**NEUROLOGICAL**\n• Alert and oriented x 3\n• Cranial nerves II-XII grossly intact\n• Motor strength 5/5 throughout\n• Sensation intact\n• Gait normal\n\n**SKIN**\n• No concerning lesions\n• No rashes\n\n**RECTAL EXAM**\n• Deferred for now\n• Will perform if patient consents to PSA screening"
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
          name: "Cem", 
          age: 45, 
          gender: "M", 
          duration: "28m 45s",
          chiefComplaint: "Headaches / Elevated Blood Pressure",
          room: "Room 215",
          templateName: "Complex Diagnostic Evaluation Note",
          hpi: "45-year-old male presenting with recurrent headaches{{1}} and persistently elevated blood pressure{{2}}. Headaches began 6 months ago, pulsatile in quality, patient describes sensation of \"feeling heartbeat in head\"{{3}}, occurring 2-3 times per week, lasting several hours. Also reports occasional dizziness{{4}}. BP persistently elevated: urgent care 152/92 mmHg two weeks ago{{5}}, pharmacy screenings 148/88 and 155/90{{6}}, today's check-in 150/92{{7}}. Patient reports high blood pressure noted once as teenager, never fully investigated{{8}}. No traditional cardiovascular risk factors: non-obese (BMI 25.5){{9}}, no diabetes, no family history of early hypertension{{10}}. Reports intermittent exercise intolerance with leg fatigue during exertion{{11}}, previously attributed to deconditioning. No current medications{{12}}.",
          ros: "Cardiovascular: Pulsatile headaches; elevated BP readings; no chest pain{{13}}.\nNeurologic: Occasional dizziness; no syncope, vision changes, or focal deficits{{14}}.\nMusculoskeletal: Leg fatigue with exertion; no claudication pain{{15}}.\nConstitutional: Denies fever, weight loss, or night sweats{{16}}.\nRespiratory: No shortness of breath at rest{{17}}.",
          pe: "General: Well-appearing, no acute distress.\nVitals (initial): BP 150/92 (right arm, seated), HR 76, RR 14, Temp 98.6°F{{18}}.\nHEENT: Normocephalic; no bruits over carotids{{19}}.\nCardiovascular: Regular rate and rhythm; no murmurs initially appreciated{{20}}.\nLungs: Clear to auscultation bilaterally{{21}}.\nExtremities: Femoral pulses slightly diminished bilaterally{{22}}.\n\n**Additional Blood Pressure Examination (Performed During Visit):**\nUpper extremity BP (right arm): 150/90 mmHg{{23}}\nLower extremity BP (right leg): 110/70 mmHg{{24}}\n**Significant arm-leg blood pressure gradient detected (40 mmHg systolic difference){{25}}**\n\nCardiovascular (re-examination): Faint systolic murmur appreciated over left infraclavicular area and posterior thorax{{26}}.",
          mdm: "Assessment: Coarctation of the aorta (congenital aortic narrowing). This is a rare but important diagnosis in an adult presenting with hypertension. Clinical presentation highly suspicious: persistent hypertension without traditional risk factors, pulsatile headaches (upper body hypertension), exercise-induced leg fatigue (lower body hypoperfusion), history of elevated BP as teenager (undiagnosed congenital lesion), and critical physical exam finding of significant arm-leg BP gradient with diminished femoral pulses.\n\nAmbient Clinical Reasoning Evolution:\n• Initial differential favored essential hypertension (most common)\n• Pattern recognition triggered by: young age + no risk factors + exertional leg symptoms\n• Ambient nudge prompted thorough vascular exam\n• Arm-leg BP gradient (40 mmHg) is pathognomonic for coarctation\n• Diagnosis transitioned from broad to targeted based on real-time findings\n\nComplexity: High. Rare congenital cardiovascular diagnosis in adult patient requiring immediate advanced imaging, specialty referral, and coordination of care. Diagnosis often missed in adults; carries significant morbidity if untreated (heart failure, stroke, aortic dissection). Requires expedited cardiology evaluation and surgical planning.\n\nData Reviewed: Previsit summary with BP trend, intake form, urgent care visit record, physical examination findings including specialized BP measurements, ambient clinical reasoning output.\n\nManagement Plan:\n• **Imaging (Stat Orders):**\n  - Echocardiogram (urgent) - assess cardiac function, aortic valve, and coarctation severity\n  - CT angiography chest (urgent) - definitive anatomic imaging of aortic narrowing location and severity\n• **Specialty Referral:** Cardiology referral (expedited) - discuss surgical vs. catheter-based intervention options\n• **Preventive Care:** Colonoscopy screening (age 45, no prior screening) - order placed, will coordinate scheduling\n  - GI referral for screening colonoscopy\n• **Patient Education:** Discussed diagnosis, explained congenital nature, treatment options (surgical repair vs. stent), prognosis with treatment\n• **Follow-up:** Cardiology appointment expedited (within 1 week); imaging to be completed within 48 hours; follow-up call after imaging results\n• **Activity:** No strenuous exercise until cardiology evaluation\n• **Monitoring:** Home BP monitoring not indicated (diagnosis established)\n\nPost-Visit Coordination (Ambient-Automated):\n• Insurance authorization for imaging completed in real-time\n• Colonoscopy eligibility verified and scheduling options sent\n• Cardiology referral placed with priority flagging\n• Cost estimates generated for procedures\n• Patient-friendly explanation of condition and next steps generated\n• Referral letters auto-generated for cardiology and GI",
          citations: [
            { number: 1, citedText: "recurrent headaches", quote: "I've been getting these headaches that feel like pounding in my head", source: "Intake form, today" },
            { number: 2, citedText: "persistently elevated blood pressure", quote: "Recent vitals: BP 152/92, 148/88, 155/90", source: "Previsit summary, today" },
            { number: 3, citedText: "feeling heartbeat in head", quote: "I've been getting these headaches... kind of pounding sometimes", source: "Visit transcript, 00:01:30" },
            { number: 4, citedText: "occasional dizziness", quote: "I went to urgent care because of dizziness and they said my blood pressure was really high", source: "Intake form, today" },
            { number: 5, citedText: "urgent care 152/92 mmHg", quote: "Urgent Care visit (2 weeks ago): BP 152/92 mmHg", source: "Previsit summary, today" },
            { number: 6, citedText: "pharmacy screenings 148/88 and 155/90", quote: "Pharmacy screening (1 week ago): BP 148/88 mmHg; Pharmacy screening (3 days ago): BP 155/90 mmHg", source: "Previsit summary, today" },
            { number: 7, citedText: "today's check-in 150/92", quote: "BP 150/92 mmHg, HR 76 bpm, Temp 98.6°F", source: "Visit vitals, today" },
            { number: 8, citedText: "high blood pressure noted once as teenager", quote: "Someone told me when I was a teenager that my blood pressure was high but no one ever followed up on it", source: "Intake form, today" },
            { number: 9, citedText: "BMI 25.5", quote: "Height: 5'10\" (177.8 cm), Weight: 178 lbs (80.7 kg), BMI: 25.5", source: "Visit vitals, today" },
            { number: 10, citedText: "no family history of early hypertension", quote: "Family History: No family history of early hypertension, no diabetes", source: "Previsit summary, today" },
            { number: 11, citedText: "leg fatigue during exertion", quote: "My legs get tired pretty quickly when I exercise or climb stairs - I always thought I was just out of shape", source: "Intake form, today" },
            { number: 12, citedText: "No current medications", quote: "Current Medications: None", source: "Intake form, today" },
            { number: 13, citedText: "no chest pain", quote: "No chest pain or pressure. No history of angina", source: "ROS documentation, today" },
            { number: 14, citedText: "no syncope, vision changes, or focal deficits", quote: "No loss of consciousness, no vision changes, no weakness or numbness", source: "ROS documentation, today" },
            { number: 15, citedText: "no claudication pain", quote: "Leg fatigue but no cramping pain with walking that forces me to stop", source: "Visit transcript, 00:09:20" },
            { number: 16, citedText: "Denies fever, weight loss, or night sweats", quote: "No constitutional symptoms: fever, chills, night sweats, or unintentional weight loss", source: "ROS documentation, today" },
            { number: 17, citedText: "No shortness of breath at rest", quote: "No dyspnea at rest. Some mild shortness of breath with heavy exertion", source: "ROS documentation, today" },
            { number: 18, citedText: "BP 150/92 (right arm, seated), HR 76, RR 14, Temp 98.6°F", quote: "Blood pressure 150/92 mmHg (right arm, seated), heart rate 76 bpm, respiratory rate 14, temperature 98.6°F", source: "Visit vitals, today" },
            { number: 19, citedText: "no bruits over carotids", quote: "HEENT examination: No carotid bruits bilaterally", source: "Physical examination, today" },
            { number: 20, citedText: "no murmurs initially appreciated", quote: "Cardiac auscultation (initial): Regular rate and rhythm, normal S1 S2, no murmurs appreciated", source: "Physical examination, today" },
            { number: 21, citedText: "Clear to auscultation bilaterally", quote: "Lungs: Clear breath sounds throughout all lung fields, no wheezes, rales, or rhonchi", source: "Physical examination, today" },
            { number: 22, citedText: "Femoral pulses slightly diminished bilaterally", quote: "Peripheral vascular examination: Femoral pulses palpable but slightly diminished bilaterally compared to radial pulses", source: "Physical examination, today" },
            { number: 23, citedText: "Upper extremity BP (right arm): 150/90 mmHg", quote: "Repeat blood pressure measurement, right arm, seated: 150/90 mmHg", source: "Physical examination (additional BP exam), today" },
            { number: 24, citedText: "Lower extremity BP (right leg): 110/70 mmHg", quote: "Blood pressure measurement, right lower extremity (popliteal artery, patient prone): 110/70 mmHg", source: "Physical examination (additional BP exam), today" },
            { number: 25, citedText: "Significant arm-leg blood pressure gradient detected (40 mmHg systolic difference)", quote: "Arm-leg BP gradient: 40 mmHg systolic difference (150 mmHg arm vs 110 mmHg leg)", source: "Physical examination (additional BP exam), today" },
            { number: 26, citedText: "Faint systolic murmur appreciated over left infraclavicular area and posterior thorax", quote: "Cardiac re-examination: Grade 1-2/6 systolic ejection murmur heard over left infraclavicular region and posteriorly over thoracic spine", source: "Physical examination (focused re-exam), today" }
          ],
          hccItems: [],
          nudges: [
            { 
              type: "Clinical Insight", 
              description: "Mismatch between upper body symptoms and lower extremity fatigue → recommend checking femoral pulses and comparing upper vs lower extremity blood pressure.",
              highlightId: "cem-ambient-nudge"
            }
          ],
          diagnosisAndCodes: {
            diagnoses: [
              { code: "Q25.1", description: "Coarctation of aorta" },
              { code: "I10", description: "Essential (primary) hypertension (secondary to coarctation)" },
              { code: "R51.9", description: "Headache, unspecified" }
            ],
            cptCodes: [
              { code: "99215", description: "Office visit, established patient, high complexity (40-54 minutes)" },
              { code: "93000", description: "Electrocardiogram, routine ECG with interpretation" }
            ]
          },
          postVisitWorkflows: [
            { 
              type: "Referral", 
              description: "Cardiology referral (expedited) - coarctation of aorta, discuss surgical vs catheter-based repair. Referral letter auto-generated.",
              status: "completed"
            },
            { 
              type: "Referral", 
              description: "GI referral for screening colonoscopy (age 45, no prior screening). Referral letter auto-generated.",
              status: "completed"
            },
            { 
              type: "Imaging Order", 
              description: "Echocardiogram (STAT) - assess cardiac function and coarctation severity. Insurance authorization completed.",
              status: "completed"
            },
            { 
              type: "Imaging Order", 
              description: "CT angiography chest (STAT) - definitive imaging of aortic narrowing. Insurance authorization completed.",
              status: "completed"
            },
            { 
              type: "Order", 
              description: "Colonoscopy screening order placed. Eligibility verified, scheduling options sent to patient.",
              status: "completed"
            },
            { 
              type: "Patient Education", 
              description: "Patient education document generated: Coarctation of aorta explanation, treatment options, next steps.",
              status: "completed"
            }
          ],
          dataSources: [
            "Previsit summary, today",
            "Intake form, today",
            "Urgent care visit, 2 weeks ago",
            "Visit transcript, 00:01:30",
            "Visit transcript, 00:03:15",
            "Visit transcript, 00:05:45",
            "Visit transcript, 00:09:20",
            "Visit transcript, 00:12:40",
            "Visit transcript, 00:16:50",
            "Visit transcript, 00:21:15",
            "Visit transcript, 00:24:30",
            "ROS documentation, today",
            "Visit vitals, today",
            "Physical examination, today",
            "Physical examination (additional BP exam), today",
            "Physical examination (focused re-exam), today"
          ]
        },
        { 
          name: "Robert Chen", 
          age: 58, 
          gender: "M", 
          duration: "22m 15s",
          chiefComplaint: "Right Shoulder Post-Op",
          room: "Room 301",
          templateName: "Post-Operative Follow-Up Note",
          hpi: "58-year-old male presenting for 6-week post-operative visit following shoulder arthroscopic rotator cuff repair{{1}}. Surgery performed January 3rd{{2}} for large full-thickness supraspinatus tear (2.5cm){{3}} and partial infraspinatus tear{{4}}. Repair with double-row technique{{5}}. Patient reports good pain control{{6}}, currently 2-4/10 with PT exercises. Incisions well-healed{{7}}, no signs of infection. Discontinued sling 2 weeks ago per PT{{8}}. Passive ROM improving: forward flexion 110°, abduction 80°{{9}}. Sleeping better, able to lie on opposite side{{10}}. No numbness or tingling in hand{{11}}. Currently out of work (software engineer), interested in return-to-work timeline{{12}}.",
          ros: "Musculoskeletal: Shoulder pain improving; no other joint pain{{13}}.\nNeurologic: No numbness, tingling, or weakness in arm/hand{{14}}.\nConstitutional: No fever, chills{{15}}.\nCardiovascular: Denies chest pain or palpitations.\nRespiratory: No shortness of breath.",
          pe: "General: Well-appearing, no acute distress.\nVitals: BP 128/82, HR 74, RR 14{{16}}.\nShoulder: Incisions well-healed, no erythema or drainage{{17}}; minimal effusion{{18}}. ROM (passive): Forward flexion 110°, abduction 80°, ER 30°{{19}}. Neurovascular: Axillary nerve intact (deltoid sensation present){{20}}; radial/median/ulnar intact distally{{21}}. Strength: Deferred at this early timepoint{{22}}.",
          mdm: "Assessment: 6 weeks status post arthroscopic rotator cuff repair (supraspinatus and infraspinatus), progressing well. Surgical healing excellent, ROM improving per expected protocol, pain well-controlled.\n\nComplexity: Moderate. Post-operative management of significant rotator cuff repair. Requires monitoring of healing, ROM progression, and complications. Return-to-work considerations with occupation-specific restrictions.\n\nData Reviewed: Operative report (1/3/24), PT progress notes, 2-week post-op visit, today's examination findings.\n\nManagement Plan:\n• Advance to active-assisted ROM exercises - cleared for PT progression\n• Continue passive ROM and scapular strengthening\n• Gradual weaning of sling use during day (discontinue at night already done)\n• Return to work: Cleared for modified duty - desk work with ergonomic setup, no overhead reaching, limit keyboard use to 30-minute intervals with breaks\n• Continue tramadol PRN and acetaminophen scheduled\n• Follow-up in 6 weeks (12 weeks post-op) to assess for active strengthening clearance\n• Discussed realistic timeline: full recovery 4-6 months, return to normal activities gradual",
          citations: [
            { number: 1, citedText: "arthroscopic rotator cuff repair", quote: "Procedure: Arthroscopic rotator cuff repair, right shoulder", source: "Operative report, 01/03/2024" },
            { number: 2, citedText: "January 3rd", quote: "Surgery date: January 3, 2024", source: "Operative report, 01/03/2024" },
            { number: 3, citedText: "supraspinatus tear (2.5cm)", quote: "Intraoperative findings: Large full-thickness tear of supraspinatus tendon measuring 2.5cm in anteroposterior dimension", source: "Operative report, 01/03/2024" },
            { number: 4, citedText: "partial infraspinatus tear", quote: "Infraspinatus with high-grade partial-thickness articular-side tear (>50% thickness)", source: "Operative report, 01/03/2024" },
            { number: 5, citedText: "double-row technique", quote: "Rotator cuff repaired using double-row technique with medial row of two anchors and lateral row of two anchors. Excellent tissue quality, repair under minimal tension.", source: "Operative report, 01/03/2024" },
            { number: 6, citedText: "good pain control", quote: "Pain is much better now. Just 2 out of 10 at rest, maybe 4 out of 10 during PT", source: "Visit transcript, 00:02:30" },
            { number: 7, citedText: "Incisions well-healed", quote: "All portal sites are healed up really well. No redness or anything", source: "Visit transcript, 00:03:15" },
            { number: 8, citedText: "Discontinued sling 2 weeks ago", quote: "PT had me stop wearing the sling about 2 weeks ago", source: "Visit transcript, 00:04:00" },
            { number: 9, citedText: "forward flexion 110°, abduction 80°", quote: "Range of motion assessment (passive): Forward flexion 110 degrees, abduction 80 degrees, external rotation 30 degrees, internal rotation limited to sacrum", source: "PT progress note, 02/05/2024" },
            { number: 10, citedText: "Sleeping better", quote: "I'm sleeping much better now. I can sleep on my left side without waking up", source: "Visit transcript, 00:05:20" },
            { number: 11, citedText: "No numbness or tingling", quote: "No numbness or tingling in my right arm or hand. Everything feels normal", source: "Visit transcript, 00:06:00" },
            { number: 12, citedText: "interested in return-to-work", quote: "I'd really like to know when I can go back to work. I'm on medical leave right now", source: "Visit transcript, 00:06:45" },
            { number: 13, citedText: "no other joint pain", quote: "Just my shoulder. Everything else - knees, back, other shoulder - all fine", source: "Visit transcript, 00:07:30" },
            { number: 14, citedText: "No numbness, tingling, or weakness", quote: "No paresthesias or motor deficits in right upper extremity", source: "ROS documentation, today" },
            { number: 15, citedText: "No fever, chills", quote: "Denies fever, chills, or other constitutional symptoms", source: "ROS documentation, today" },
            { number: 16, citedText: "BP 128/82, HR 74, RR 14", quote: "Blood pressure 128/82 mmHg, heart rate 74 bpm, respiratory rate 14", source: "Visit vitals, today" },
            { number: 17, citedText: "Incisions well-healed, no erythema or drainage", quote: "Inspection of surgical incisions: All portal sites well-healed with minimal scarring. No erythema, no drainage, no warmth", source: "Physical examination, today" },
            { number: 18, citedText: "minimal effusion", quote: "Very mild effusion of glenohumeral joint, expected at this timepoint", source: "Physical examination, today" },
            { number: 19, citedText: "Forward flexion 110°, abduction 80°, ER 30°", quote: "Passive ROM: Forward flexion 110 degrees, abduction 80 degrees, external rotation 30 degrees. Measurements taken with patient supine to ensure true passive motion", source: "Physical examination, today" },
            { number: 20, citedText: "Axillary nerve intact", quote: "Axillary nerve function intact, deltoid sensation preserved", source: "Physical examination, today" },
            { number: 21, citedText: "radial/median/ulnar intact distally", quote: "Neurovascular examination: Radial, median, and ulnar nerves intact. Capillary refill <2 seconds, radial pulse 2+", source: "Physical examination, today" },
            { number: 22, citedText: "Strength: Deferred", quote: "Strength testing deferred at this early timepoint to protect repair", source: "Physical examination, today" }
          ],
          hccItems: [
            { condition: "Rotator cuff tear with repair", meat: [true, false, true, true] },
            { condition: "Postoperative status", meat: [true, false, false, true] }
          ],
          nudges: [
            { 
              type: "Documentation", 
              description: "Missing shoulder laterality indication, please select to complete your note.",
              highlightId: "robert-chen-hpi-shoulder",
              options: [
                { id: 'left', label: 'Left', type: 'single-select' },
                { id: 'right', label: 'Right', type: 'single-select' }
              ],
              previewText: (selected: string[]) => selected.length > 0 ? `${selected[0]} ` : '',
              insertLocation: 'hpi',
              insertAfter: 'following '
            },
            { type: "Documentation", description: "Document clearance for active-assisted ROM progression - standard at 6-8 weeks post-op.", highlightId: "robert-chen-note-header" },
            { type: "Billing Compliance", description: "Document return-to-work restrictions for modified duty desk work.", highlightId: "robert-chen-hpi-work" }
          ],
          diagnosisAndCodes: {},
          postVisitWorkflows: [],
          dataSources: [
            "Operative report, 01/03/2024",
            "PT progress note, 02/05/2024",
            "Visit transcript, 00:02:30",
            "ROS documentation, today",
            "Visit vitals, today",
            "Physical examination, today"
          ]
        },
        { 
          name: "Lisa Anderson", 
          age: 28, 
          gender: "F", 
          duration: "19m 30s",
          chiefComplaint: "Left Knee Pain",
          room: "Room 408",
          templateName: "Sports Medicine / Orthopedic Note",
          hpi: "28-year-old female recreational runner presenting with 3-week history of knee pain{{1}}. Pain started during half-marathon training{{2}}, gradual onset without acute injury. Located medial joint line{{3}}, 5-6/10 intensity with activity{{4}}, improves with rest{{5}}. Describes clicking sensation{{6}} and occasional giving way{{7}}. Denies locking or true instability. Pain worse with stairs, squatting, twisting motions{{8}}. Running limited to 1 mile before pain forces stop{{9}}. Has been icing and taking ibuprofen with minimal relief{{10}}. No prior knee problems{{11}}.",
          ros: "Musculoskeletal: Knee pain as described; no other joint pain{{12}}.\nNeurologic: No numbness, tingling, or weakness in leg{{13}}.\nConstitutional: Denies fever, chills.\nCardiovascular: No chest pain or palpitations with exercise.",
          pe: "General: Well-appearing, athletic build.\nVitals: BP 118/72, HR 68, RR 14{{14}}.\nKnee: No effusion{{15}}; tenderness to palpation at medial joint line{{16}}. ROM: Full extension, flexion to 135°{{17}}. McMurray test positive for medial meniscus{{18}}. Thessaly test positive{{19}}. Lachman, anterior drawer negative{{20}}. Valgus/varus stress stable{{21}}. No patellar apprehension{{22}}.",
          mdm: "Assessment: Left medial meniscus tear, likely posterior horn, based on examination findings. Positive McMurray and Thessaly tests highly specific for meniscal pathology. Stable ligamentous examination rules out ACL or collateral ligament injury.\n\nComplexity: Moderate. Sports medicine injury requiring advanced imaging and possible surgical consultation. Young, active patient with functional limitations affecting quality of life and athletic goals.\n\nData Reviewed: Intake form, examination findings including specialized meniscal tests, current activity level and limitations.\n\nManagement Plan:\n• Order MRI left knee without contrast to confirm meniscal tear and assess for additional cartilage injury\n• Prescribe naproxen 500mg BID with food for anti-inflammatory effect\n• Activity modification: avoid running, squatting, twisting until imaging complete\n• May continue low-impact cardio (cycling, swimming) as tolerated\n• Referral to orthopedic sports medicine specialist pending MRI results\n• Discuss treatment options: conservative management vs. arthroscopic partial meniscectomy based on tear pattern\n• Physical therapy referral for quadriceps strengthening regardless of surgical decision\n• Follow-up in 2 weeks with MRI results or sooner if symptoms worsen",
          citations: [
            { number: 1, citedText: "3-week history of left knee pain", quote: "The pain started about 3 weeks ago", source: "Visit transcript, 00:01:45" },
            { number: 2, citedText: "during half-marathon training", quote: "I was training for a half marathon, increasing my mileage", source: "Visit transcript, 00:02:10" },
            { number: 3, citedText: "Located medial joint line", quote: "The pain is right here on the inside of my knee, along the joint", source: "Visit transcript, 00:02:50" },
            { number: 4, citedText: "5-6/10 intensity with activity", quote: "Pain severity: 5-6 out of 10 when running or going up stairs", source: "Intake form, 02/12/2024" },
            { number: 5, citedText: "improves with rest", quote: "It feels better when I rest. Almost goes away completely if I don't do anything for a few days", source: "Visit transcript, 00:03:30" },
            { number: 6, citedText: "clicking sensation", quote: "Sometimes I feel a click or pop when I bend and straighten my knee", source: "Visit transcript, 00:04:00" },
            { number: 7, citedText: "occasional giving way", quote: "A couple times my knee has felt like it was going to give out, but it hasn't fully", source: "Visit transcript, 00:04:40" },
            { number: 8, citedText: "worse with stairs, squatting, twisting", quote: "Stairs are really painful, especially going down. Squatting and twisting motions hurt too", source: "Visit transcript, 00:05:15" },
            { number: 9, citedText: "Running limited to 1 mile", quote: "I can barely run a mile now before the pain gets too bad and I have to stop", source: "Visit transcript, 00:06:00" },
            { number: 10, citedText: "icing and taking ibuprofen", quote: "I've been icing it after activity and taking ibuprofen 600mg three times a day. Helps a little but not much", source: "Visit transcript, 00:06:45" },
            { number: 11, citedText: "No prior knee problems", quote: "No prior knee injuries or problems. Never had surgery", source: "Intake form, 02/12/2024" },
            { number: 12, citedText: "no other joint pain", quote: "Just my left knee. Everything else feels fine", source: "Visit transcript, 00:07:30" },
            { number: 13, citedText: "No numbness, tingling, or weakness", quote: "No paresthesias or motor deficits in lower extremities", source: "ROS documentation, today" },
            { number: 14, citedText: "BP 118/72, HR 68, RR 14", quote: "Blood pressure 118/72 mmHg, heart rate 68 bpm, respiratory rate 14", source: "Visit vitals, today" },
            { number: 15, citedText: "No effusion", quote: "Inspection: No visible effusion, no ecchymosis, no erythema", source: "Physical examination, today" },
            { number: 16, citedText: "tenderness at medial joint line", quote: "Palpation: Point tenderness over medial joint line, posterior horn of medial meniscus region", source: "Physical examination, today" },
            { number: 17, citedText: "Full extension, flexion to 135°", quote: "Range of motion: Extension 0 degrees, flexion 135 degrees, no pain at end ranges", source: "Physical examination, today" },
            { number: 18, citedText: "McMurray test positive for medial meniscus", quote: "McMurray test: Positive for medial meniscus, reproduces medial joint line pain and palpable click with valgus stress and external rotation", source: "Physical examination, today" },
            { number: 19, citedText: "Thessaly test positive", quote: "Thessaly test at 20 degrees: Positive, reproduces medial joint line pain with internal rotation", source: "Physical examination, today" },
            { number: 20, citedText: "Lachman, anterior drawer negative", quote: "Ligamentous examination: Lachman test negative (firm endpoint, <3mm translation), anterior drawer negative", source: "Physical examination, today" },
            { number: 21, citedText: "Valgus/varus stress stable", quote: "Collateral ligaments: Valgus stress stable at 0 and 30 degrees, varus stress stable", source: "Physical examination, today" },
            { number: 22, citedText: "No patellar apprehension", quote: "Patellofemoral: No apprehension, no crepitus, normal tracking", source: "Physical examination, today" }
          ],
          hccItems: [],
          nudges: [
            { 
              type: "Documentation", 
              description: "Missing knee laterality indication, please select to complete your note.",
              highlightId: "lisa-anderson-hpi-knee",
              options: [
                { id: 'left', label: 'Left', type: 'single-select' },
                { id: 'right', label: 'Right', type: 'single-select' }
              ],
              previewText: (selected: string[]) => selected.length > 0 ? `${selected[0]} ` : '',
              insertLocation: 'hpi',
              insertAfter: 'history of '
            },
            {
              type: "Documentation",
              description: "Document mechanism and chronicity for meniscal tear diagnosis.",
              highlightId: "lisa-anderson-hpi-onset",
              options: [
                { id: 'degenerative', label: 'Degenerative (gradual onset)', type: 'single-select' },
                { id: 'traumatic', label: 'Traumatic (acute injury)', type: 'single-select' }
              ],
              previewText: (selected: string[]) => selected.length > 0 ? `Mechanism: ${selected[0] === 'degenerative' ? 'Gradual onset consistent with degenerative tear, overuse injury' : 'Acute traumatic mechanism'}.` : '',
              insertLocation: 'hpi',
              insertAfter: 'gradual onset without acute injury.'
            },
            { type: "Billing Compliance", description: "Document functional limitations for appropriate E/M level - inability to continue running training.", highlightId: "lisa-anderson-hpi-running" }
          ],
          diagnosisAndCodes: {},
          postVisitWorkflows: [],
          dataSources: [
            "Visit transcript, 00:01:45",
            "Intake form, 02/12/2024",
            "ROS documentation, today",
            "Visit vitals, today",
            "Physical examination, today"
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
          templateName: "Chronic Disease Management Note",
          hpi: "42-year-old female with Type 2 diabetes mellitus{{1}} presents for routine 3-month follow-up. Recent A1c 7.8%{{2}}, up from 7.2% three months ago{{3}}. Patient reports good medication compliance with metformin 1000mg BID{{4}}. Admits to dietary indiscretions during holidays{{5}}. No hypoglycemic episodes{{6}}. Denies polyuria, polydipsia, or changes in vision{{7}}. Checking blood sugars 2-3 times per week{{8}}, fasting values range 130-150 mg/dL{{9}}. No new symptoms. Co-morbid hypertension and hyperlipidemia well-controlled{{10}}.",
          ros: "Endocrine: No polyuria, polydipsia, or polyphagia{{11}}.\nCardiovascular: Denies chest pain, palpitations, or leg swelling{{12}}.\nNeurologic: Denies numbness, tingling in feet{{13}}.\nOphthalmic: No vision changes; last eye exam 8 months ago{{14}}.\nConstitutional: Weight stable{{15}}.",
          pe: "General: Well-appearing, comfortable.\nVitals: BP 132/84, HR 76, RR 16, Weight 185 lbs (stable){{16}}.\nCardiac: RRR, no murmurs{{17}}.\nExtremities: No edema; pedal pulses 2+ bilaterally{{18}}; monofilament sensation intact{{19}}.",
          mdm: "Assessment: Type 2 diabetes mellitus with suboptimal control. A1c rising from 7.2% to 7.8% despite metformin compliance, likely due to dietary factors. No evidence of microvascular complications at this time - neuropathy screening negative, good pedal pulses.\n\nComplexity: Moderate. Chronic disease management requiring medication adjustment and patient education. Multiple comorbidities (hypertension, hyperlipidemia) that compound cardiovascular risk.\n\nData Reviewed: Current A1c (7.8%), previous A1c trend (7.2% three months ago), home glucose log showing fasting values 130-150 mg/dL, medication list, previous visit notes, most recent lipid panel and creatinine.\n\nManagement Plan:\n• Add glipizide 5mg daily before breakfast to current metformin regimen to improve glycemic control\n• Discussed hypoglycemia symptoms and when to call\n• Referral to certified diabetes educator for dietary counseling and carbohydrate counting\n• Increase home glucose monitoring to daily fasting checks until A1c improves\n• Target fasting glucose <130 mg/dL\n• Order: Comprehensive metabolic panel, lipid panel, urine microalbumin/creatinine ratio\n• Recommend diabetic retinopathy screening (overdue - last exam 8 months ago, should be annual)\n• Pneumococcal vaccine update per ACIP guidelines\n• Follow-up in 3 months with repeat A1c; goal A1c <7.0%\n• Continue current BP and cholesterol medications",
          citations: [
            { number: 1, citedText: "Type 2 diabetes mellitus", quote: "Diagnosis: Type 2 diabetes mellitus without complications, diagnosed 2019", source: "Previous visit note, 11/10/2025" },
            { number: 2, citedText: "A1c 7.8%", quote: "Hemoglobin A1c: 7.8% (Reference range: <7.0% for diabetics)", source: "Lab results, 02/05/2024" },
            { number: 3, citedText: "7.2% three months ago", quote: "Hemoglobin A1c: 7.2% (Reference range: <7.0% for diabetics)", source: "Lab results, 11/08/2025" },
            { number: 4, citedText: "metformin 1000mg BID", quote: "I take my metformin twice a day, 1000 milligrams each time. I don't miss doses", source: "Visit transcript, 00:02:45" },
            { number: 5, citedText: "dietary indiscretions during holidays", quote: "I'll admit, I ate more sweets than I should have over the holidays. It's hard during family gatherings", source: "Visit transcript, 00:03:30" },
            { number: 6, citedText: "No hypoglycemic episodes", quote: "No low blood sugar episodes. Haven't felt shaky or sweaty", source: "Visit transcript, 00:04:15" },
            { number: 7, citedText: "Denies polyuria, polydipsia, or changes in vision", quote: "No increased thirst or urination. Vision is fine", source: "Visit transcript, 00:05:00" },
            { number: 8, citedText: "Checking blood sugars 2-3 times per week", quote: "I check my blood sugar a few times a week, usually in the morning", source: "Visit transcript, 00:05:45" },
            { number: 9, citedText: "fasting values range 130-150 mg/dL", quote: "Home glucose log: Fasting values 02/06: 135, 02/08: 148, 02/10: 132, 02/12: 145 mg/dL", source: "Home glucose monitoring log" },
            { number: 10, citedText: "hypertension and hyperlipidemia well-controlled", quote: "HTN on lisinopril 20mg daily, BP well-controlled. Hyperlipidemia on atorvastatin 40mg daily, most recent lipid panel within target", source: "Previous visit note, 11/10/2025" },
            { number: 11, citedText: "No polyuria, polydipsia, or polyphagia", quote: "Denies excessive thirst, urination, or hunger", source: "ROS documentation, today" },
            { number: 12, citedText: "Denies chest pain, palpitations, or leg swelling", quote: "No cardiovascular symptoms: chest pain, palpitations, orthopnea, PND, or lower extremity edema", source: "ROS documentation, today" },
            { number: 13, citedText: "Denies numbness, tingling in feet", quote: "No peripheral neuropathy symptoms: numbness, tingling, burning sensation in feet", source: "ROS documentation, today" },
            { number: 14, citedText: "last eye exam 8 months ago", quote: "Most recent ophthalmology exam: June 2025, no diabetic retinopathy", source: "Previous visit note, 11/10/2025" },
            { number: 15, citedText: "Weight stable", quote: "Weight 185 lbs today, 184 lbs at last visit (stable)", source: "Visit vitals comparison" },
            { number: 16, citedText: "BP 132/84, HR 76, RR 16, Weight 185 lbs", quote: "Blood pressure 132/84 mmHg, heart rate 76 bpm, respiratory rate 16, weight 185 lbs", source: "Visit vitals, today" },
            { number: 17, citedText: "RRR, no murmurs", quote: "Cardiac examination: Regular rate and rhythm, S1 S2 normal, no murmurs, rubs, or gallops", source: "Physical examination, today" },
            { number: 18, citedText: "pedal pulses 2+ bilaterally", quote: "Dorsalis pedis and posterior tibial pulses 2+ bilaterally, no diminution", source: "Physical examination, today" },
            { number: 19, citedText: "monofilament sensation intact", quote: "Monofilament testing: 10/10 sites intact bilaterally, protective sensation present", source: "Physical examination, today" }
          ],
          hccItems: [
            { condition: "Type 2 diabetes mellitus without complications", meat: [true, true, true, true] },
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "Hyperlipidemia", meat: [true, false, false, true] }
          ],
          nudges: [
            {
              type: "Safety",
              description: "Document diabetic complications screening status.",
              highlightId: "sarah-johnson-hpi-a1c",
              options: [
                { id: 'retinopathy', label: 'Retinopathy screening', type: 'multi-select' },
                { id: 'nephropathy', label: 'Nephropathy screening', type: 'multi-select' },
                { id: 'neuropathy', label: 'Neuropathy exam', type: 'multi-select' },
                { id: 'foot', label: 'Foot exam', type: 'multi-select' }
              ],
              previewText: (selected: string[]) => {
                if (selected.length === 0) return '';
                const labelMap: Record<string, string> = {
                  retinopathy: 'eye exam (last 8 months ago, overdue for annual)',
                  nephropathy: 'renal function (eGFR stable at 72)',
                  neuropathy: 'neuropathy screening (monofilament sensation intact)',
                  foot: 'diabetic foot exam (completed today, no ulcers or deformities)'
                };
                return `Diabetic complications screening: ${selected.map(s => labelMap[s]).join('; ')}.`;
              },
              insertLocation: 'pe',
              insertAfter: 'monofilament sensation intact.'
            },
            { type: "Billing Compliance", description: "Consider 'with complications' for diabetes - rising A1c and overdue screening warrant higher specificity.", highlightId: "sarah-johnson-note-header" }
          ],
          diagnosisAndCodes: {},
          postVisitWorkflows: [],
          dataSources: [
            "Previous visit note, 11/10/2025",
            "Lab results, 02/05/2024",
            "Lab results, 11/08/2025",
            "Visit transcript, 00:02:45",
            "Home glucose monitoring log",
            "ROS documentation, today",
            "Visit vitals, today",
            "Visit vitals comparison",
            "Physical examination, today"
          ]
        },
        { 
          name: "James Wilson", 
          age: 55, 
          gender: "M", 
          duration: "26m 08s",
          chiefComplaint: "Annual Check-up",
          room: "Room 203",
          templateName: "Annual Wellness Visit Note",
          hpi: "55-year-old male presents for annual wellness examination{{1}}. No acute concerns. History of hypertension{{2}}, well-controlled on lisinopril 20mg daily{{3}}. Former smoker (quit 2020, 30 pack-year history){{4}}. Exercises 2-3 times per week (walking){{5}}. Diet could be improved{{6}}. No new symptoms. Interested in age-appropriate health screenings{{7}}. Last colonoscopy never done (now age-appropriate){{8}}. Last lipid panel 2 years ago{{9}}.",
          ros: "Cardiovascular: Denies chest pain, palpitations, or dyspnea{{10}}.\nRespiratory: No cough or SOB{{11}}; former smoker, quit 4 years ago{{12}}.\nGI: Normal bowel habits; no rectal bleeding{{13}}.\nGU: Normal urination; no nocturia{{14}}.\nConstitutional: Feels well; weight stable{{15}}.",
          pe: "General: Well-appearing, no acute distress.\nVitals: BP 128/78, HR 68, RR 14, BMI 28.5{{16}}.\nCardiac: RRR, no murmurs{{17}}.\nLungs: Clear to auscultation bilaterally{{18}}.\nAbdomen: Soft, non-tender, no masses{{19}}.",
          citations: [
            { number: 1, citedText: "annual wellness examination", quote: "Appointment type: Medicare Annual Wellness Visit", source: "Visit scheduling, today" },
            { number: 2, citedText: "History of hypertension", quote: "Past medical history: Essential hypertension, diagnosed 2018", source: "Previous visit note, 02/15/2025" },
            { number: 3, citedText: "lisinopril 20mg daily", quote: "I take my blood pressure pill every morning, 20 milligrams of lisinopril", source: "Visit transcript, 00:02:15" },
            { number: 4, citedText: "quit 2020, 30 pack-year history", quote: "Tobacco: Former smoker, quit January 2020. Smoked 1.5 packs per day for 20 years (30 pack-years)", source: "Previous visit note, 02/15/2025" },
            { number: 5, citedText: "Exercises 2-3 times per week (walking)", quote: "I walk for exercise, usually 2 or 3 times a week, about 30 minutes each time", source: "Visit transcript, 00:03:40" },
            { number: 6, citedText: "Diet could be improved", quote: "Diet: Admits to high sodium intake, frequent fast food. Trying to eat more vegetables", source: "Intake form, 02/12/2024" },
            { number: 7, citedText: "age-appropriate health screenings", quote: "Patient interested in discussing preventive care and cancer screenings appropriate for age", source: "Visit transcript, 00:04:50" },
            { number: 8, citedText: "Last colonoscopy never done", quote: "Screening colonoscopy: Never done. Patient now 55, eligible for first screening", source: "Health maintenance review, today" },
            { number: 9, citedText: "Last lipid panel 2 years ago", quote: "Most recent lipid panel: January 2022 (LDL 118 mg/dL, slightly elevated)", source: "Previous visit note, 02/15/2025" },
            { number: 10, citedText: "Denies chest pain, palpitations, or dyspnea", quote: "No chest pain, palpitations, shortness of breath, or exercise intolerance", source: "ROS documentation, today" },
            { number: 11, citedText: "No cough or SOB", quote: "No chronic cough, wheezing, or shortness of breath", source: "ROS documentation, today" },
            { number: 12, citedText: "former smoker, quit 4 years ago", quote: "I quit smoking 4 years ago. Haven't had a cigarette since then", source: "Visit transcript, 00:05:30" },
            { number: 13, citedText: "Normal bowel habits; no rectal bleeding", quote: "Bowel movements regular, no blood in stool, no change in habits", source: "ROS documentation, today" },
            { number: 14, citedText: "Normal urination; no nocturia", quote: "Urinary function normal, no difficulty, frequency, or nighttime urination", source: "ROS documentation, today" },
            { number: 15, citedText: "weight stable", quote: "Weight stable at 210 lbs over past year", source: "Visit vitals comparison" },
            { number: 16, citedText: "BP 128/78, HR 68, RR 14, BMI 28.5", quote: "Blood pressure 128/78 mmHg, heart rate 68 bpm, respiratory rate 14, BMI 28.5 (overweight)", source: "Visit vitals, today" },
            { number: 17, citedText: "RRR, no murmurs", quote: "Cardiac examination: Regular rate and rhythm, normal S1 S2, no murmurs, rubs, or gallops", source: "Physical examination, today" },
            { number: 18, citedText: "Clear to auscultation bilaterally", quote: "Lung examination: Clear breath sounds bilaterally, no wheezes, rales, or rhonchi", source: "Physical examination, today" },
            { number: 19, citedText: "Soft, non-tender, no masses", quote: "Abdominal examination: Soft, non-distended, non-tender, no masses or organomegaly, normal bowel sounds", source: "Physical examination, today" }
          ],
          hccItems: [
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "History of nicotine dependence", meat: [true, false, false, false] }
          ],
          nudges: [
            {
              type: "Documentation",
              description: "Document shared decision-making for PSA screening.",
              highlightId: "james-wilson-note-header",
              options: [
                { id: 'yes', label: 'Patient opts for PSA', type: 'single-select' },
                { id: 'no', label: 'Patient declines PSA', type: 'single-select' },
                { id: 'defer', label: 'Defer decision', type: 'single-select' }
              ],
              previewText: (selected: string[]) => {
                if (selected.length === 0) return '';
                const textMap: Record<string, string> = {
                  yes: 'PSA Screening: Discussed risks and benefits with patient. Patient understands potential for false positives and downstream testing. Patient opts to proceed with PSA screening today.',
                  no: 'PSA Screening: Discussed risks and benefits with patient. Patient understands potential for false positives and overdiagnosis. Patient declines PSA screening at this time.',
                  defer: 'PSA Screening: Discussed risks and benefits with patient. Patient would like additional time to consider. Will revisit at next visit.'
                };
                return textMap[selected[0]] || '';
              },
              insertLocation: 'pe',
              insertAfter: 'Abdomen: Soft, non-tender, no masses.'
            },
            { type: "Billing Compliance", description: "Add BMI 28.5 (overweight) to problem list - supports lifestyle counseling billing.", highlightId: "james-wilson-pe-bmi" }
          ],
          diagnosisAndCodes: {},
          postVisitWorkflows: [],
          dataSources: [
            "Visit scheduling, today",
            "Previous visit note, 02/15/2025",
            "Visit transcript, 00:02:15",
            "Intake form, 02/12/2024",
            "Health maintenance review, today",
            "ROS documentation, today",
            "Visit vitals, today",
            "Visit vitals comparison",
            "Physical examination, today"
          ]
        },
      ]
    }
  ]);
  
  // Flatten for easy access by index
  const allScribes = useMemo(() => scribesByDate.flatMap(group => group.scribes), [scribesByDate]);
  
  // Set the correct scribe index when navigating from a patient
  useEffect(() => {
    if (selectedPatientName) {
      const scribeIndex = allScribes.findIndex(scribe => scribe.name === selectedPatientName);
      if (scribeIndex !== -1) {
        setSelectedScribeIndex(scribeIndex);
      }
    }
  }, [selectedPatientName, allScribes]);
  
  // Function to update scribe content
  const updateScribeContent = (section: 'hpi' | 'ros' | 'pe' | 'mdm', content: string) => {
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
      "cem-ambient-nudge": "intermittent exercise intolerance with leg fatigue",
      "maria-garcia-hpi-laterality": "lower lumbar region",
      "maria-garcia-hpi-mechanism": "Pain started after moving furniture",
      "maria-garcia-pe-exam": "Back: Tenderness over paraspinal muscles L3-L5",
      "robert-chen-hpi-shoulder": "shoulder arthroscopic rotator cuff repair",
      "robert-chen-note-header": "Passive ROM improving: forward flexion 110°, abduction 80°",
      "robert-chen-hpi-work": "Currently out of work (software engineer), interested in return-to-work timeline",
      "lisa-anderson-hpi-knee": "knee pain",
      "lisa-anderson-hpi-onset": "gradual onset without acute injury",
      "lisa-anderson-hpi-running": "Running limited to 1 mile before pain forces stop",
      "sarah-johnson-hpi-a1c": "monofilament sensation intact",
      "sarah-johnson-note-header": "Recent A1c 7.8%, up from 7.2% three months ago",
      "james-wilson-note-header": "Interested in age-appropriate health screenings",
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
    // Check if there's a preview for this section
    const activePreview = Object.entries(nudgePreviews).find(([_, preview]) => preview.location === section);
    let displayText = text;
    let insertionPoint = '';
    
    if (activePreview) {
      const [previewKey, preview] = activePreview;
      // Insert preview text at the appropriate location
      if (preview.after) {
        const insertIndex = text.indexOf(preview.after);
        if (insertIndex !== -1) {
          insertionPoint = preview.after;
          displayText = 
            text.substring(0, insertIndex + preview.after.length) +
            ' {{PREVIEW_START}}' + preview.text + '{{PREVIEW_END}}' +
            text.substring(insertIndex + preview.after.length);
        } else {
          // Fallback: append at the end
          displayText = text + '\n\n{{PREVIEW_START}}' + preview.text + '{{PREVIEW_END}}';
        }
      } else {
        displayText = text + '\n\n{{PREVIEW_START}}' + preview.text + '{{PREVIEW_END}}';
      }
    }
    
    // Handle 'none' view - just plain text
    if (selectedView === 'none') {
      return displayText.replace(/\{\{(\d+)\}\}/g, '').replace(/\{\{PREVIEW_START\}\}|\{\{PREVIEW_END\}\}/g, '');
    }
    
    const shouldShowCitations = selectedView === 'citation' || selectedView === 'default';
    const shouldShowAbnormals = selectedView === 'highlights' || selectedView === 'default';
    const shouldShowNudgeHighlights = selectedView === 'default' || selectedView === 'highlights';
    const textWithoutCitations = shouldShowCitations ? displayText : displayText.replace(/\{\{(\d+)\}\}/g, '');
    
    // Check if we need to highlight specific text for nudges
    const isNudgeHovered = hoveredNudge?.scribeIndex === selectedScribeIndex;
    const isHighlightHovered = hoveredHighlight?.scribeIndex === selectedScribeIndex;
    const highlightMapping = getHighlightMapping();
    let highlightText: string | null = null;
    let shouldHighlightInsertionPoint = false;
    let nudgeHighlights: Array<{text: string, nudgeIndex: number}> = [];
    
    // Collect nudge highlights for current section only
    if (shouldShowNudgeHighlights && currentScribe.nudges) {
      currentScribe.nudges.forEach((nudge, nudgeIndex) => {
        if (nudge.highlightId) {
          // Determine section from highlightId (e.g., "maria-garcia-hpi-laterality" -> hpi)
          // Always prioritize extracting from highlightId first for consistency
          let nudgeSection = null;
          
          // Look for known section abbreviations in the highlightId
          const sectionPatterns = ['hpi', 'ros', 'pe', 'mdm', 'note'];
          for (const pattern of sectionPatterns) {
            if (nudge.highlightId.includes(`-${pattern}-`)) {
              if (pattern === 'note') {
                // Special case: note-header nudges - show in HPI where the relevant content is
                nudgeSection = 'hpi';
              } else {
                nudgeSection = pattern;
              }
              break;
            }
          }
          
          // Fallback to insertLocation if we couldn't extract from highlightId
          if (!nudgeSection && nudge.insertLocation) {
            nudgeSection = nudge.insertLocation;
          }
          
          // Only include nudges that belong to current section
          if (nudgeSection === section) {
            const text = highlightMapping[nudge.highlightId];
            if (text) {
              nudgeHighlights.push({ text, nudgeIndex });
            }
          }
        }
      });
    }
    
    if (isNudgeHovered && hoveredNudge) {
      const nudge = currentScribe.nudges?.[hoveredNudge.nudgeIndex];
      // Use highlightId mapping for all nudges
      if (nudge?.highlightId) {
        highlightText = highlightMapping[nudge.highlightId] || null;
        // For option nudges, also mark as insertion point if they have insertAfter
        if (nudge.options && nudge.options.length > 0 && nudge.insertAfter) {
          shouldHighlightInsertionPoint = true;
        }
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
    
    // Split text by citation markers and preview markers
    const parts = displayText.split(/(\{\{\d+\}\}|\{\{PREVIEW_START\}\}|\{\{PREVIEW_END\}\})/);
    let textBeforeCitation = '';
    let inPreview = false;
    
    return parts.map((part, idx) => {
      // Handle preview markers
      if (part === '{{PREVIEW_START}}') {
        inPreview = true;
        return null;
      }
      if (part === '{{PREVIEW_END}}') {
        inPreview = false;
        return null;
      }
      
      // If we're in a preview section, render in green
      if (inPreview) {
        return (
          <span key={idx} style={{ color: '#479e4c' }}>
            {part}
          </span>
        );
      }
      
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match && shouldShowCitations) {
        const citationNum = parseInt(match[1]);
        const citation = citations.find(c => c.number === citationNum);
        const citationId = `scribe-${selectedScribeIndex}-${section}`;
        const isActive = activeCitation?.id === citationId && activeCitation?.number === citationNum;
        
        const badge = (
          <span 
            key={idx}
            data-citation-badge
            className={`inline-flex items-center justify-center rounded-[2px] text-[10px] font-bold leading-none transition-colors cursor-pointer mx-[2px] ${
              isActive 
                ? 'bg-[var(--text-brand,#1132ee)] text-white' 
                : 'bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)]'
            }`}
            style={{
              width: '14px',
              height: '14px',
              verticalAlign: 'baseline'
            }}
            onMouseEnter={(e) => {
              // Clear any pending close timeout
              if (citationCloseTimeoutRef.current) {
                clearTimeout(citationCloseTimeoutRef.current);
                citationCloseTimeoutRef.current = null;
              }
              
              setActiveCitation({ id: `scribe-${selectedScribeIndex}-${section}`, number: citationNum });
              const rect = e.currentTarget.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              const tooltipWidth = 240;
              const spaceOnRight = viewportWidth - rect.right;
              const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
              
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom,
                alignLeft
              });
            }}
            onMouseLeave={() => {
              // Delay closing to allow moving to tooltip
              citationCloseTimeoutRef.current = window.setTimeout(() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }, 100);
            }}
            onClick={(e) => {
              e.stopPropagation();
              
              // Check if citation references a visit transcript
              if (citation && citation.source.startsWith('Visit transcript')) {
                setRightTab('sources');
                setPreviousTab('sources');
                setViewingDataSource(citation.source);
                setHighlightedQuote(citation.quote);
                setActiveCitation(null);
                setTooltipPosition(null);
              } else if (activeCitation?.id === citationId) {
                setActiveCitation(null);
                setTooltipPosition(null);
              } else {
                setActiveCitation({ id: citationId, number: citationNum });
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const tooltipWidth = 240;
                const spaceOnRight = viewportWidth - rect.right;
                const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
                
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.bottom,
                  alignLeft
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
      if (activeCitation && part && shouldShowCitations && activeCitation.id.startsWith(`scribe-${selectedScribeIndex}-${section}`)) {
        const citation = citations.find(c => c.number === activeCitation.number);
        if (citation && part.toLowerCase().includes(citation.citedText.toLowerCase())) {
          shouldHighlight = true;
          highlightTargetText = citation.citedText;
        }
      }
      
      // Check for hovered nudge highlighting
      if (!shouldHighlight && highlightText && part && part.toLowerCase().includes(highlightText.toLowerCase())) {
        shouldHighlight = true;
        highlightTargetText = highlightText;
      }
      
      // Check for default view nudge highlights (insertion points)
      if (!shouldHighlight && nudgeHighlights.length > 0 && part) {
        for (const nudgeHighlight of nudgeHighlights) {
          if (part.toLowerCase().includes(nudgeHighlight.text.toLowerCase())) {
            shouldHighlight = true;
            highlightTargetText = nudgeHighlight.text;
            break;
          }
        }
      }
      
      // Collect all highlights for this part
      const allHighlights: Array<{start: number, end: number, color: string, priority: number, nudgeIndex?: number}> = [];
      
      // Add abnormal phrase highlights
      if (shouldShowAbnormals && part) {
        const abnormalPhrases = findAbnormalPhrases(part);
        abnormalPhrases.forEach(({ phrase, type }) => {
          let searchStart = 0;
          let foundIndex;
          // Find all occurrences of this phrase
          while ((foundIndex = part.toLowerCase().indexOf(phrase.toLowerCase(), searchStart)) !== -1) {
            allHighlights.push({
              start: foundIndex,
              end: foundIndex + phrase.length,
              color: type === 'severe' ? '#fee2e2' : '#fef3c7',
              priority: 1 // Highest priority for abnormals
            });
            searchStart = foundIndex + 1;
          }
        });
      }
      
      // Add citation/nudge highlight (for hovered nudge or active citation)
      if (shouldHighlight && highlightTargetText && part) {
        let searchStart = 0;
        let foundIndex;
        const searchLower = part.toLowerCase();
        const targetLower = highlightTargetText.toLowerCase();
        // Find all occurrences
        while ((foundIndex = searchLower.indexOf(targetLower, searchStart)) !== -1) {
          allHighlights.push({
            start: foundIndex,
            end: foundIndex + highlightTargetText.length,
            color: highlightColor,
            priority: 2,
            nudgeIndex: hoveredNudge?.nudgeIndex
          });
          searchStart = foundIndex + 1;
        }
      }
      
      // Add default view nudge highlights (insertion points)
      // Only highlight first occurrence of each nudge's text to maintain 1:1 relationship
      if (shouldShowNudgeHighlights && nudgeHighlights.length > 0 && part) {
        nudgeHighlights.forEach(({ text: nudgeText, nudgeIndex }) => {
          const searchLower = part.toLowerCase();
          const targetLower = nudgeText.toLowerCase();
          // Find only the FIRST occurrence to maintain 1:1 nudge-to-highlight relationship
          const foundIndex = searchLower.indexOf(targetLower);
          if (foundIndex !== -1) {
            allHighlights.push({
              start: foundIndex,
              end: foundIndex + nudgeText.length,
              color: '#f1f3fe',
              priority: 0, // Highest priority to ensure nudge highlights show above abnormals
              nudgeIndex: nudgeIndex
            });
          }
        });
      }
      
      // Apply all highlights
      if (allHighlights.length > 0) {
        // Sort by start position, then by priority (higher priority first for overlaps)
        const sortedHighlights = allHighlights.sort((a, b) => {
          if (a.start !== b.start) return a.start - b.start;
          return a.priority - b.priority;
        });
        
        // Merge overlapping highlights (keep higher priority)
        const mergedHighlights: typeof sortedHighlights = [];
        sortedHighlights.forEach(highlight => {
          const overlapping = mergedHighlights.find(h => 
            (highlight.start >= h.start && highlight.start < h.end) ||
            (highlight.end > h.start && highlight.end <= h.end) ||
            (highlight.start <= h.start && highlight.end >= h.end)
          );
          
          if (!overlapping) {
            mergedHighlights.push(highlight);
          } else if (highlight.priority < overlapping.priority) {
            // Replace with higher priority
            const index = mergedHighlights.indexOf(overlapping);
            mergedHighlights[index] = highlight;
          }
        });
        
        // Re-sort by start position
        mergedHighlights.sort((a, b) => a.start - b.start);
        
        // Build segments
        const segments: JSX.Element[] = [];
        let currentPos = 0;
        let segmentIdx = 0;
        
        mergedHighlights.forEach(({ start, end, color, nudgeIndex }) => {
          // Add text before highlight
          if (start > currentPos) {
            segments.push(
              <span key={`${idx}-${segmentIdx++}`}>
                {part.substring(currentPos, start)}
              </span>
            );
          }
          
          // Check if this highlight's nudge is being hovered
          const isThisNudgeHovered = nudgeIndex !== undefined && (
            (hoveredNudge?.scribeIndex === selectedScribeIndex && hoveredNudge?.nudgeIndex === nudgeIndex) ||
            (hoveredHighlight?.scribeIndex === selectedScribeIndex && hoveredHighlight?.nudgeIndex === nudgeIndex)
          );
          
          // Darken the color if the nudge is hovered
          const finalColor = isThisNudgeHovered && color === '#f1f3fe' ? '#d9e0fc' : color;
          
          // Add highlighted text with hover handlers
          const nudge = nudgeIndex !== undefined ? currentScribe.nudges?.[nudgeIndex] : null;
          segments.push(
            <mark 
              key={`${idx}-${segmentIdx++}`} 
              className="text-inherit cursor-pointer" 
              style={{ backgroundColor: finalColor, padding: 0, transition: 'background-color 0.15s' }}
              data-highlight-id={nudge?.highlightId}
              onMouseEnter={() => {
                if (nudgeIndex !== undefined) {
                  setHoveredHighlight({ scribeIndex: selectedScribeIndex, nudgeIndex });
                }
              }}
              onMouseLeave={(e) => {
                // Only clear if we're actually leaving the highlight
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                  setHoveredHighlight(null);
                }
              }}
            >
              {part.substring(start, end)}
            </mark>
          );
          
          currentPos = end;
        });
        
        // Add remaining text
        if (currentPos < part.length) {
          segments.push(<span key={`${idx}-${segmentIdx++}`}>{part.substring(currentPos)}</span>);
        }
        
        textBeforeCitation += part;
        return <span key={idx}>{segments}</span>;
      }
      
      textBeforeCitation += part;
      return <span key={idx}>{part}</span>;
    });
  };

  // Helper to render previsit text with citation badges (simpler version for previsit tab)
  const renderPrevisitTextWithCitations = (text: string, citationsData: any[]) => {
    const citationRegex = /\{\{(\d+)\}\}/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = citationRegex.exec(text)) !== null) {
      // Add text before citation
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add citation badge
      const citationNum = parseInt(match[1], 10);
      const citation = citationsData.find(c => c.number === citationNum);
      const citationId = `previsit-${citationNum}`;
      const isActive = activeCitation?.id === citationId;
      
      parts.push(
        <span
          key={`citation-${match.index}-${citationNum}`}
          data-citation-badge
          data-citation-id={citationId}
          className={`inline-flex items-center justify-center rounded-[2px] text-[10px] font-bold leading-none transition-colors cursor-pointer mx-[2px] ${
            isActive 
              ? 'bg-[var(--text-brand,#1132ee)] text-white' 
              : 'bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)]'
          }`}
          style={{
            width: '14px',
            height: '14px',
            verticalAlign: 'baseline'
          }}
          onClick={(e) => {
            e.stopPropagation();
            
            // Check if citation references a visit transcript
            if (citation && citation.source.startsWith('Visit transcript')) {
              setRightTab('sources');
              setPreviousTab('sources');
              setViewingDataSource(citation.source);
              setHighlightedQuote(citation.quote);
              setActiveCitation(null);
              setTooltipPosition(null);
            } else if (citation) {
              const rect = e.currentTarget.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              const tooltipWidth = 240;
              const spaceOnRight = viewportWidth - rect.right;
              const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
              
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom,
                alignLeft
              });
              setActiveCitation({ id: citationId, number: citationNum });
            }
          }}
          onMouseEnter={(e) => {
            if (citation) {
              // Clear any pending close timeout
              if (citationCloseTimeoutRef.current) {
                clearTimeout(citationCloseTimeoutRef.current);
                citationCloseTimeoutRef.current = null;
              }
              
              const rect = e.currentTarget.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              const tooltipWidth = 240;
              const spaceOnRight = viewportWidth - rect.right;
              const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
              
              setTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.bottom,
                alignLeft
              });
              const isSame = activeCitation?.id === citationId;
              setActiveCitation(isSame ? null : { id: citationId, number: citationNum });
            }
          }}
          onMouseLeave={() => {
            // Delay closing to allow moving to tooltip
            citationCloseTimeoutRef.current = window.setTimeout(() => {
              setActiveCitation(null);
              setTooltipPosition(null);
            }, 100);
          }}
        >
          {citationNum}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts;
  };

  // Helper to render chat text with citation badges and sentence highlighting
  const renderChatTextWithCitations = (text: string, citationsData: any[], contextId: string) => {
    // Split into sentences (basic split on . ! ? followed by space or newline)
    const sentences: Array<{text: string, start: number, end: number}> = [];
    const sentenceRegex = /[^.!?\n]+[.!?\n]+|\n+/g;
    let match;
    let lastEnd = 0;
    
    while ((match = sentenceRegex.exec(text)) !== null) {
      sentences.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
      lastEnd = match.index + match[0].length;
    }
    
    // Add any remaining text as a sentence
    if (lastEnd < text.length) {
      sentences.push({
        text: text.slice(lastEnd),
        start: lastEnd,
        end: text.length
      });
    }
    
    // Find which sentence each citation belongs to
    const citationRegex = /\{\{(\d+)\}\}/g;
    const citationPositions: Array<{number: number, position: number, sentenceIdx: number}> = [];
    let citMatch;
    
    while ((citMatch = citationRegex.exec(text)) !== null) {
      const citNum = parseInt(citMatch[1], 10);
      const position = citMatch.index;
      
      // Find the sentence this citation belongs to
      // Citations should highlight the sentence containing the text BEFORE the marker
      let sentenceIdx = -1;
      
      // Look at the character right before the citation marker to determine which sentence it belongs to
      const charBeforeCitation = position > 0 ? position - 1 : position;
      
      // Check which sentence contains the position just before the citation
      for (let i = 0; i < sentences.length; i++) {
        if (charBeforeCitation >= sentences[i].start && charBeforeCitation < sentences[i].end) {
          sentenceIdx = i;
          break;
        }
      }
      
      // Fallback: if still not found, find the closest previous sentence
      if (sentenceIdx === -1) {
        for (let i = sentences.length - 1; i >= 0; i--) {
          if (position >= sentences[i].end) {
            sentenceIdx = i;
            break;
          }
        }
      }
      
      citationPositions.push({ number: citNum, position, sentenceIdx });
    }
    
    // Render sentences with highlighting
    return sentences.map((sentence, idx) => {
      const sentenceCitations = citationPositions.filter(c => c.sentenceIdx === idx);
      const isHighlighted = sentenceCitations.some(c => 
        activeCitation?.id === `${contextId}-${c.number}`
      );
      
      // Render the sentence with citation badges
      const parts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      const regex = /\{\{(\d+)\}\}/g;
      let match;
      const sentenceText = sentence.text;
      
      while ((match = regex.exec(sentenceText)) !== null) {
        const beforeText = sentenceText.slice(lastIndex, match.index);
        if (beforeText) {
          parts.push(beforeText);
        }
        
        const citationNum = parseInt(match[1], 10);
        const citation = citationsData.find(c => c.number === citationNum);
        const citationId = `${contextId}-${citationNum}`;
        const isActive = activeCitation?.id === citationId;
        
        parts.push(
          <span
            key={`citation-${idx}-${citationNum}-${match.index}`}
            data-citation-badge
            data-citation-id={citationId}
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
                // Clear any pending close timeout
                if (citationCloseTimeoutRef.current) {
                  clearTimeout(citationCloseTimeoutRef.current);
                  citationCloseTimeoutRef.current = null;
                }
                
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const tooltipWidth = 240;
                const spaceOnRight = viewportWidth - rect.right;
                const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
                
                setActiveCitation({ id: citationId, number: citationNum });
                setTooltipPosition({ 
                  x: rect.left + rect.width / 2, 
                  y: rect.bottom,
                  alignLeft 
                });
              }
            }}
            onMouseLeave={() => {
              // Delay closing to allow moving to tooltip
              citationCloseTimeoutRef.current = window.setTimeout(() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }, 100);
            }}
            onClick={(e) => {
              e.stopPropagation();
              
              // Check if citation document exists in dataSourceContent
              if (citation && dataSourceContent[currentScribe.name]?.[citation.source]) {
                setRightTab('sources');
                setPreviousTab('sources');
                setViewingDataSource(citation.source);
                setHighlightedQuote(citation.quote);
                setActiveCitation(null);
                setTooltipPosition(null);
              } else if (citation && citation.isExternal && citation.externalUrl) {
                window.open(citation.externalUrl, '_blank');
              } else if (citation) {
                const rect = e.currentTarget.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const tooltipWidth = 240;
                const spaceOnRight = viewportWidth - rect.right;
                const alignLeft = spaceOnRight < tooltipWidth / 2 + 20;
                
                const isSame = activeCitation?.id === citationId;
                setActiveCitation(isSame ? null : { id: citationId, number: citationNum });
                setTooltipPosition(isSame ? null : { 
                  x: rect.left + rect.width / 2, 
                  y: rect.bottom,
                  alignLeft 
                });
              }
            }}
          >
            {citationNum}
          </span>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < sentenceText.length) {
        parts.push(sentenceText.slice(lastIndex));
      }
      
      const content = parts.length > 0 ? parts : sentenceText;
      
      if (isHighlighted) {
        return (
          <mark 
            key={`sentence-${idx}`} 
            className="bg-[#f1f3fe] text-inherit" 
            style={{ padding: 0 }}
          >
            {content}
          </mark>
        );
      }
      
      return <span key={`sentence-${idx}`}>{content}</span>;
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
              <button 
                className={`content-stretch flex items-center justify-center relative rounded-[6px] shrink-0 size-[36px] cursor-pointer transition-colors ${
                  isLogoHovered 
                    ? 'bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))] text-[color:var(--text-subheading,#666)]' 
                    : 'hover:bg-[var(--surface-transparent-dark-3,rgba(0,0,0,0.03))]'
                }`}
                onMouseEnter={(e) => {
                  setIsLogoHovered(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setLogoTooltipPosition({
                    x: rect.right,
                    y: rect.top + rect.height / 2
                  });
                  // On medium screens, show current tab's secondary nav as overlay
                  if (isSecondaryNavCollapsed && window.innerWidth >= 768 && window.innerWidth < 1024) {
                    setHoveredPrimaryNav('scribes');
                  }
                }}
                onMouseLeave={() => {
                  setIsLogoHovered(false);
                  setLogoTooltipPosition(null);
                }}
                onClick={() => {
                  // Only allow expanding secondary nav if screen width >= 1024px
                  if (window.innerWidth >= 1024) {
                    setIsSecondaryNavCollapsed(!isSecondaryNavCollapsed);
                  } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                    // On medium screens, toggle the current tab's overlay
                    setHoveredPrimaryNav(hoveredPrimaryNav === 'scribes' ? null : 'scribes');
                  }
                }}
              >
                <InlineIcon name={isLogoHovered ? "side_navigation" : "hexagon"} size={isLogoHovered ? 20 : 24} />
              </button>
            </div>
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
            
            {/* Nav Items */}
            <div 
              className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center min-h-px min-w-px overflow-clip py-[16px] relative w-full"
            >
              {/* Visits */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onClick={() => {
                  onNavigateToVisits?.();
                  if (isSecondaryNavCollapsed) {
                    clearNavHoverDelay();
                    setHoveredPrimaryNav('visits');
                  }
                }}
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="stethoscope" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Visits
                </p>
              </button>
              
              {/* Scribes - Selected */}
              <button 
                className="content-stretch flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
              >
                <div className="bg-[var(--nav-button,rgba(17,50,238,0.12))] content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] text-[color:var(--text-brand,#1132ee)]">
                  <InlineIcon name="magic_document" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-brand,#1132ee)] tracking-[-0.36px]">
                  Scribes
                </p>
              </button>
              
              {/* Customize */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('customize')}
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="magic_edit" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Customize
                </p>
              </button>
              
              {/* Assistant */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('assistant')}
                onMouseLeave={() => {
                  if (isSecondaryNavCollapsed) {
                    clearNavHoverDelay();
                    setHoveredPrimaryNav('scribes');
                  }
                }}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="sparkle" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Assistant
                </p>
              </button>
              
              {/* Admin */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('admin')}
                onMouseLeave={() => {
                  if (isSecondaryNavCollapsed) {
                    clearNavHoverDelay();
                    setHoveredPrimaryNav('scribes');
                  }
                }}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="analytics" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Admin
                </p>
              </button>
            </div>
            
            <div 
              className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" 
              onMouseEnter={() => {
                if (isSecondaryNavCollapsed) {
                  clearNavHoverDelay();
                  setHoveredPrimaryNav('scribes');
                }
              }}
            />
            
            {/* Footer */}
            <div 
              className="content-stretch flex flex-col gap-[8px] items-center pb-[24px] pt-[16px] relative shrink-0 w-full"
              onMouseEnter={() => {
                if (isSecondaryNavCollapsed) {
                  clearNavHoverDelay();
                  setHoveredPrimaryNav('scribes');
                }
              }}
            >
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
        {!isSecondaryNavCollapsed && (
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
        )}
      </div>
      
      {/* Overlay Secondary Nav when collapsed - Visits */}
      {isSecondaryNavCollapsed && hoveredPrimaryNav === 'visits' && (
        <div 
          className="absolute left-[72px] top-0 bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip shrink-0 w-[220px] z-[100] shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          onMouseEnter={() => {
            clearNavHoverDelay();
            setHoveredPrimaryNav('visits');
          }}
          onMouseLeave={() => setHoveredPrimaryNav(null)}
        >
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
                    className="text-[color:var(--text-subheading,#666)]"
                  />
                  <IconButton 
                    variant="tertiary" 
                    size="small"
                    icon={<InlineIcon name="keyboard_arrow_right" size={16} />}
                    onClick={() => {}}
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
              {patients.map((patient, index) => (
                <PatientListItem
                  key={index}
                  name={patient.name}
                  age={patient.age}
                  gender={patient.gender}
                  time={patient.time}
                  status={patient.status}
                  isSelected={patient.name === selectedPatientName}
                  onClick={() => {
                    onNavigateToVisits?.();
                    if (isSecondaryNavCollapsed) {
                      clearNavHoverDelay();
                      setHoveredPrimaryNav('visits');
                    }
                  }}
                />
              ))}
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
      )}
      
      {/* Overlay Secondary Nav when collapsed - Scribes */}
      {isSecondaryNavCollapsed && hoveredPrimaryNav === 'scribes' && (
        <div 
          className="absolute left-[72px] top-0 bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip shrink-0 w-[220px] z-[100] shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          onMouseEnter={() => {
            clearNavHoverDelay();
            setHoveredPrimaryNav('scribes');
          }}
          onMouseLeave={() => setHoveredPrimaryNav(null)}
        >
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
                    {dateGroup.scribes.map((scribe, idx) => {
                      const absoluteIndex = startIndex + idx;
                      return (
                        <ScribeListItem
                          key={absoluteIndex}
                          name={scribe.name}
                          age={scribe.age}
                          gender={scribe.gender}
                          duration={scribe.duration}
                          isSelected={absoluteIndex === selectedScribeIndex}
                          onClick={() => setSelectedScribeIndex(absoluteIndex)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay Secondary Nav when collapsed - Customize */}
      {isSecondaryNavCollapsed && hoveredPrimaryNav === 'customize' && (
        <div 
          className="absolute left-[72px] top-0 bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip shrink-0 w-[220px] z-[100] shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          onMouseEnter={() => {
            clearNavHoverDelay();
            setHoveredPrimaryNav('customize');
          }}
          onMouseLeave={() => setHoveredPrimaryNav(null)}
        >
          {/* Header */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex h-[48px] items-center min-h-[48px] px-[8px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[28px] items-center min-h-px min-w-px p-[4px] relative rounded-[6px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Customize
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay Secondary Nav when collapsed - Assistant */}
      {isSecondaryNavCollapsed && hoveredPrimaryNav === 'assistant' && (
        <div 
          className="absolute left-[72px] top-0 bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip shrink-0 w-[220px] z-[100] shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          onMouseEnter={() => {
            clearNavHoverDelay();
            setHoveredPrimaryNav('assistant');
          }}
          onMouseLeave={() => setHoveredPrimaryNav(null)}
        >
          {/* Header */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex h-[48px] items-center min-h-[48px] px-[8px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[28px] items-center min-h-px min-w-px p-[4px] relative rounded-[6px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Assistant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Overlay Secondary Nav when collapsed - Admin */}
      {isSecondaryNavCollapsed && hoveredPrimaryNav === 'admin' && (
        <div 
          className="absolute left-[72px] top-0 bg-[var(--surface-base,white)] border-[var(--neutral-200,#ccc)] border-r border-solid content-stretch flex flex-col h-full items-start overflow-clip shrink-0 w-[220px] z-[100] shadow-[4px_0_12px_rgba(0,0,0,0.1)]"
          onMouseEnter={() => {
            clearNavHoverDelay();
            setHoveredPrimaryNav('admin');
          }}
          onMouseLeave={() => setHoveredPrimaryNav(null)}
        >
          {/* Header */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex h-[48px] items-center min-h-[48px] px-[8px] py-[12px] relative shrink-0 w-full">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] h-[28px] items-center min-h-px min-w-px p-[4px] relative rounded-[6px]">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{currentScribe.age}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{currentScribe.gender}</p></div>
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
                { id: 'transcript', label: 'Transcript' },
                { id: 'previsit', label: 'Previsit' }
              ]}
              defaultTab={activeTab}
              onTabChange={(id) => setActiveTab(id as 'clinical' | 'transcript' | 'previsit')}
              className="w-full"
            />
          </div>
          
          {/* Main Content */}
          <div className="content-stretch flex flex-col items-start max-w-[800px] relative shrink-0 w-full overflow-y-auto flex-1 py-[12px]">
            {activeTab === 'previsit' ? (
              /* Previsit Content */
              (() => {
                // Find the matching patient
                const matchingPatient = patients.find(p => p.name === currentScribe.name);
                if (!matchingPatient) {
                  return <p className="text-[color:var(--text-subheading,#666)]">No previsit information available</p>;
                }
                
                return (
                  <>
                    {/* At a Glance Section */}
                    <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                      <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                        <p className="leading-[1.2]">At a Glance</p>
                      </div>
                      <div className="content-stretch flex flex-col items-start justify-center relative rounded-[8px] shrink-0 w-full">
                        <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                          <ul className="list-disc whitespace-pre-wrap">
                            {matchingPatient.atAGlance.map((item: string, idx: number) => (
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
                          {matchingPatient.details.map((item: string, idx: number) => (
                            <li key={idx} className={idx === 0 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}>
                              <span className="leading-[1.4]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Dynamic Sections */}
                    {Object.entries(matchingPatient.sections).map(([sectionTitle, items]: [string, any]) => (
                      <div key={sectionTitle} className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                        <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          <p className="leading-[1.2]">{sectionTitle}</p>
                        </div>
                        <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                          <ul className="list-disc whitespace-pre-wrap">
                            {items.map((item: string, idx: number) => (
                              <li key={idx} className={idx === 0 && items.length > 1 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}>
                                <span className="leading-[1.4]">
                                  {renderPrevisitTextWithCitations(item, matchingPatient.citations || [])}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()
            ) : activeTab === 'transcript' ? (
              /* Transcript Content */
              (() => {
                // Get all visit transcript entries for this scribe
                const transcriptEntries = Object.entries(dataSourceContent[currentScribe.name] || {})
                  .filter(([key, data]) => key.startsWith('Visit transcript'))
                  .sort((a, b) => {
                    // Sort by timestamp in the key (e.g., "Visit transcript, 00:02:30")
                    const timeA = a[0].match(/(\d+):(\d+):(\d+)/);
                    const timeB = b[0].match(/(\d+):(\d+):(\d+)/);
                    if (timeA && timeB) {
                      const secondsA = parseInt(timeA[1]) * 3600 + parseInt(timeA[2]) * 60 + parseInt(timeA[3]);
                      const secondsB = parseInt(timeB[1]) * 3600 + parseInt(timeB[2]) * 60 + parseInt(timeB[3]);
                      return secondsA - secondsB;
                    }
                    return 0;
                  });
                
                if (transcriptEntries.length === 0) {
                  return <p className="text-[color:var(--text-subheading,#666)] px-[20px]">No transcript available</p>;
                }
                
                // Combine all transcripts into a single text
                const fullTranscript = transcriptEntries
                  .map(([key, data]) => data.content)
                  .join('\n\n');
                
                return (
                  <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full px-[20px]">
                    {/* Audio Player Placeholder */}
                    <div className="bg-[var(--surface-1,#f7f7f7)] content-stretch flex items-center justify-center px-[16px] py-[20px] relative rounded-[8px] shrink-0 w-full">
                      <p className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[color:var(--text-subheading,#666)] tracking-[0.15px]">
                        Audio Player (Duration: {transcriptEntries.length > 0 ? transcriptEntries[transcriptEntries.length - 1][0].match(/(\d+:\d+:\d+)/)?.[1] : '00:00:00'})
                      </p>
                    </div>
                    
                    {/* Transcript Text */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      {fullTranscript.split(/(Provider:|Patient:)/).reduce((acc: any[], part, idx, arr) => {
                        if (part === 'Provider:' || part === 'Patient:') {
                          // This is a speaker label, combine with the next part (the dialogue)
                          const dialogue = arr[idx + 1]?.trim() || '';
                          if (dialogue) {
                            acc.push(
                              <p key={idx} className="font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.15px]">
                                <strong>{part}</strong> {dialogue}
                              </p>
                            );
                          }
                        }
                        return acc;
                      }, [])}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Clinical Note & Codes Content */
              <>
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
                {currentScribe.templateName || 'Clinical Note'}
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
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="school" size={16} />}
                      onClick={() => {}}
                      className="text-[color:var(--text-brand,#1132ee)]"
                    />
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="docs_add_on" size={16} />}
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
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="school" size={16} />}
                      onClick={() => {}}
                      className="text-[color:var(--text-brand,#1132ee)]"
                    />
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="docs_add_on" size={16} />}
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
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="school" size={16} />}
                      onClick={() => {}}
                      className="text-[color:var(--text-brand,#1132ee)]"
                    />
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="docs_add_on" size={16} />}
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
            
            {/* MDM Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p 
                  className={`flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px] ${
                    hoveredNudge?.scribeIndex === selectedScribeIndex && 
                    currentScribe.nudges?.[hoveredNudge.nudgeIndex]?.highlightId === `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-mdm-section`
                      ? 'bg-[#f1f3fe]' 
                      : ''
                  }`}
                  style={{ fontFeatureSettings: "'ss07'" }}
                  data-highlight-id={`${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-mdm-section`}
                >
                  MDM
                </p>
                <div className="flex gap-[4px] items-center shrink-0">
                  {editingSection === 'mdm' ? (
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
                          updateScribeContent('mdm', editedContent.mdm);
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
                        setEditedContent({ ...editedContent, mdm: currentScribe.mdm?.replace(/\{\{(\d+)\}\}/g, '') || '' });
                        setEditingSection('mdm');
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
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="school" size={16} />}
                      onClick={() => {}}
                      className="text-[color:var(--text-brand,#1132ee)]"
                    />
                    <IconButton
                      variant="tertiary"
                      size="small"
                      icon={<InlineIcon name="docs_add_on" size={16} />}
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
              {editingSection === 'mdm' ? (
                <div className="border border-[var(--shape-brand,#1132ee)] border-solid content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-full">
                  <textarea
                    autoFocus
                    ref={(el) => adjustTextareaHeight(el)}
                    value={editedContent.mdm}
                    onChange={(e) => {
                      setEditedContent({ ...editedContent, mdm: e.target.value });
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
                    setEditedContent({ ...editedContent, mdm: currentScribe.mdm?.replace(/\{\{(\d+)\}\}/g, '') || '' });
                    setEditingSection('mdm');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {currentScribe.mdm ? renderTextWithCitations(currentScribe.mdm, 'mdm') : 'No MDM content'}
                    </p>
                  </div>
                </div>
              )}
            </div>
              </>
            )}
          </div>
          
          {/* Floating Toolbar - only show for clinical note */}
          {activeTab !== 'previsit' && (
          <div className="sticky bottom-[20px] z-10 flex justify-center w-full max-w-[800px] pointer-events-none">
            <div className="bg-[var(--surface-base,white)] border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid flex gap-[16px] items-center px-[8px] py-[4px] rounded-[12px] shadow-[0px_4px_16px_2px_rgba(0,0,0,0.07)] pointer-events-auto">
              {/* Button Group with "All Markdowns" - only selected shows label */}
              <div className="flex items-center shrink-0">
                <div className="bg-[var(--surface-2,#f2f2f2)] flex items-center overflow-clip p-[2px] rounded-[8px] shrink-0">
                  {[
                    { id: 'all', label: 'All Markdowns', icon: null },
                    { id: 'icon1', label: '', icon: <InlineIcon name="sparkle" size={16} /> },
                    { id: 'icon2', label: '', icon: <InlineIcon name="stethoscope" size={16} /> },
                    { id: 'icon3', label: '', icon: <InlineIcon name="school" size={16} /> },
                    { id: 'icon4', label: '', icon: <InlineIcon name="close_small" size={16} /> },
                  ].map((option) => {
                    const isSelected = selectedView === 'default' && option.id === 'all';
                    const showLabel = isSelected && option.label;
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => {}}
                        className={`flex items-center justify-center min-h-[28px] px-[6px] py-[4px] rounded-[6px] shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[var(--surface-base,white)] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]'
                            : 'bg-transparent'
                        } ${showLabel ? 'gap-[4px]' : ''} ${!showLabel && option.icon ? 'w-[28px]' : ''}`}
                      >
                        {option.icon && (
                          <div className="overflow-clip shrink-0 size-[16px]">
                            {option.icon}
                          </div>
                        )}
                        {showLabel && (
                          <p
                            className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] whitespace-nowrap"
                            style={{ fontFeatureSettings: "'ss07'" }}
                          >
                            {option.label}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Smart Edit Button */}
              <div className="flex items-center py-[4px] shrink-0">
                <Button 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="magic_edit" size={16} />}
                  showPrefix={true}
                  onClick={() => {}}
                >
                  Smart Edit
                </Button>
              </div>
              
              {/* Dictate Button */}
              <div className="flex items-center py-[4px] shrink-0">
                <Button 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="mic" size={16} />}
                  showPrefix={true}
                  onClick={() => {}}
                >
                  Dictate
                </Button>
              </div>
              
              {/* New Letter / Docs Button */}
              <div className="flex items-center py-[4px] shrink-0">
                <Button 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="description" size={16} />}
                  showPrefix={true}
                  onClick={() => {}}
                >
                  New Letter / Docs
                </Button>
              </div>
              
              {/* Divider */}
              <div className="flex items-center self-stretch shrink-0">
                <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-full w-px" />
              </div>
              
              {/* Sync to EHR Button */}
              <Button 
                variant="primary" 
                size="small"
                icon={<InlineIcon name="cloud_upload" size={16} />}
                showPrefix={true}
                onClick={() => {}}
              >
                Sync to EHR
              </Button>
            </div>
          </div>
          )}
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
                  { id: 'assistant', label: 'Assistant' },
                  { id: 'sources', label: 'Sources' }
                ]}
                defaultTab={rightTab}
                onTabChange={(id) => setRightTab(id as 'actions' | 'assistant' | 'sources')}
                hideBorder={true}
              />
            </div>
          </div>
        )}
        
        {/* Content Area - Scrollable */}
        <div className={`content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px overflow-y-auto relative w-full ${viewingDataSource ? '' : 'py-[20px] px-[20px]'}`}>
          {viewingDataSource ? (
            /* Data Source View */
            <>
              {/* Back Button - Sticky */}
              <div className="sticky top-0 z-10 bg-white content-stretch flex items-center shrink-0 w-full px-[20px] pt-[20px] pb-[12px]">
                <Button
                  variant="tertiary-neutral"
                  size="small"
                  icon={<InlineIcon name="keyboard_arrow_left" size={16} />}
                  onClick={() => {
                    setViewingDataSource(null);
                    setHighlightedQuote(null);
                    setRightTab(previousTab);
                  }}
                >
                  Back
                </Button>
              </div>
              
              {/* Data Source Content */}
              {dataSourceContent[currentScribe.name]?.[viewingDataSource] && (() => {
                const sourceData = dataSourceContent[currentScribe.name][viewingDataSource];
                const badgeInfo = getDocumentTypeBadgeColor(sourceData.type, sourceData.date);
                
                // Format document title - remove date/timestamp from the key
                const formatDocumentTitle = (key: string) => {
                  // Remove timestamps like ", 00:02:30"
                  let title = key.replace(/, \d{2}:\d{2}:\d{2}/, '');
                  // Remove dates like ", 01/03/2024" or ", 02/12/2024"
                  title = title.replace(/, \d{2}\/\d{2}\/\d{4}/, '');
                  // Capitalize first letter of each word
                  return title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                };
                
                return (
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full px-[20px] pb-[20px]">
                    {/* Source Header */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <div 
                        className="inline-flex items-center px-[8px] py-[4px] rounded-[4px]"
                        style={{
                          backgroundColor: badgeInfo.bg
                        }}
                      >
                        <p 
                          className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px]"
                          style={{
                            color: badgeInfo.text
                          }}
                        >
                          {badgeInfo.label}
                        </p>
                      </div>
                      <p className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                        {formatDocumentTitle(viewingDataSource)}
                      </p>
                    </div>
                  
                  {/* Source Content */}
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    {viewingDataSource.startsWith('Visit transcript') ? (
                      // Render full transcript with highlighting and auto-scroll
                      (() => {
                        // Collect ALL visit transcript entries for this scribe
                        const allTranscriptEntries = Object.entries(dataSourceContent[currentScribe.name] || {})
                          .filter(([key]) => key.startsWith('Visit transcript'))
                          .sort((a, b) => {
                            // Sort by timestamp
                            const timeA = a[0].match(/(\d+):(\d+):(\d+)/);
                            const timeB = b[0].match(/(\d+):(\d+):(\d+)/);
                            if (timeA && timeB) {
                              const secondsA = parseInt(timeA[1]) * 3600 + parseInt(timeA[2]) * 60 + parseInt(timeA[3]);
                              const secondsB = parseInt(timeB[1]) * 3600 + parseInt(timeB[2]) * 60 + parseInt(timeB[3]);
                              return secondsA - secondsB;
                            }
                            return 0;
                          });
                        
                        // Combine all transcripts
                        const fullTranscript = allTranscriptEntries
                          .map(([_, data]) => data.content)
                          .join(' ');
                        
                        return (
                          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                            {fullTranscript
                              .split(/(Provider:|Patient:)/)
                              .reduce((acc: any[], part, idx, arr) => {
                                if (part === 'Provider:' || part === 'Patient:') {
                                  const dialogue = arr[idx + 1]?.trim() || '';
                                  if (dialogue) {
                                    const isHighlighted = highlightedQuote && dialogue.includes(highlightedQuote);
                                    acc.push(
                                      <p 
                                        key={idx} 
                                        ref={(el) => {
                                          if (isHighlighted && el) {
                                            // Auto-scroll to highlighted element
                                            setTimeout(() => {
                                              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }, 100);
                                          }
                                        }}
                                        className={`font-['Lato',sans-serif] leading-[1.4] text-[15px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.15px] ${
                                          isHighlighted ? 'bg-[var(--surface-accent,#f1f3fe)]' : ''
                                        }`}
                                      >
                                        <strong>{part}</strong> {dialogue}
                                      </p>
                                    );
                                  }
                                }
                                return acc;
                              }, [])}
                          </div>
                        );
                      })()
                    ) : (
                      // Regular content rendering
                      <pre className="font-['Lato',sans-serif] leading-[1.6] text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] w-full whitespace-pre-wrap">
                        {sourceData.content}
                      </pre>
                    )}
                  </div>
                </div>
                );
              })()}
            </>
          ) : rightTab === 'sources' ? (
            /* Sources View */
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              {(() => {
                // Always show all sources from scribe's dataSources, regardless of active tab
                const sourcesToShow = currentScribe.dataSources || [];
                
                // Group sources by type (and date for Clinical Notes)
                const sourcesByType: Record<string, string[]> = {};
                sourcesToShow.forEach((source) => {
                  const sourceData = dataSourceContent[currentScribe.name]?.[source];
                  if (sourceData) {
                    const badgeInfo = getDocumentTypeBadgeColor(sourceData.type, sourceData.date);
                    // Group all Visit transcript entries together
                    let groupKey = badgeInfo.label;
                    if (source.startsWith('Visit transcript')) {
                      groupKey = 'Transcript';
                    }
                    
                    if (!sourcesByType[groupKey]) {
                      sourcesByType[groupKey] = [];
                    }
                    sourcesByType[groupKey].push(source);
                  }
                });
                
                return Object.entries(sourcesByType).map(([groupLabel, sources]) => {
                  // Get badge info from first source in group
                  const firstSource = sources[0];
                  const firstSourceData = dataSourceContent[currentScribe.name]?.[firstSource];
                  const badgeInfo = firstSourceData ? getDocumentTypeBadgeColor(firstSourceData.type, firstSourceData.date) : { bg: '#f2f2f2', text: '#666', label: groupLabel };
                  
                  // For Visit transcript group, show as single entry
                  const isTranscriptGroup = groupLabel === 'Transcript';
                  
                  return (
                    <div key={groupLabel} className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      {/* Type Badge */}
                      <div 
                        className="inline-flex items-center px-[8px] py-[4px] rounded-[4px]"
                        style={{
                          backgroundColor: badgeInfo.bg
                        }}
                      >
                        <p 
                          className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px]"
                          style={{
                            color: badgeInfo.text,
                            textTransform: 'capitalize'
                          }}
                        >
                          {badgeInfo.label}
                        </p>
                      </div>
                    
                    {/* Sources for this type */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full pl-[12px]">
                      {isTranscriptGroup ? (
                        // Show single "Visit transcript" entry
                        <Link 
                          key="visit-transcript"
                          label="Visit transcript"
                          size="medium"
                          intent="neutral"
                          showPrefix={false}
                          showSuffix={false}
                          onClick={() => {
                            setPreviousTab(rightTab);
                            // Show the first transcript entry when clicked
                            setViewingDataSource(sources[0]);
                          }}
                        />
                      ) : (
                        sources.map((source, idx) => (
                        <Link 
                          key={idx}
                          label={source}
                          size="medium"
                          intent="neutral"
                          showPrefix={false}
                          showSuffix={false}
                          onClick={() => {
                            setPreviousTab(rightTab);
                            setViewingDataSource(source);
                            setHighlightedQuote(null);
                          }}
                        />
                      ))
                      )}
                    </div>
                  </div>
                  );
                });
              })()}
            </div>
          ) : rightTab === 'assistant' ? (
            /* Assistant View */
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
                      {message.citations ? renderChatTextWithCitations(message.content, message.citations, `chat-${idx}`) : message.content}
                    </p>
                    
                    {/* Collapsible Sources */}
                    {message.citations && message.citations.length > 0 && (() => {
                      // Count unique sources
                      const uniqueSources = new Set(message.citations.map((c: any) => c.source));
                      const sourceCount = uniqueSources.size;
                      
                      return (
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        <button
                          onClick={() => {
                            const key = `${currentScribe.name}-chat-${idx}`;
                            setExpandedChatSources(prev => {
                              const newSet = new Set(prev);
                              if (newSet.has(key)) {
                                newSet.delete(key);
                              } else {
                                newSet.add(key);
                              }
                              return newSet;
                            });
                          }}
                          className="flex items-center gap-[4px] text-[color:var(--text-subheading,#666)] hover:text-[color:var(--text-default,black)] transition-colors"
                        >
                          <p className="font-['Lato',sans-serif] text-[13px] leading-[1.2] tracking-[0.065px]">
                            {sourceCount} source{sourceCount !== 1 ? 's' : ''}
                          </p>
                          <InlineIcon 
                            name={expandedChatSources.has(`${currentScribe.name}-chat-${idx}`) ? "keyboard_arrow_up" : "keyboard_arrow_down"} 
                            size={16} 
                          />
                        </button>
                        
                        {expandedChatSources.has(`${currentScribe.name}-chat-${idx}`) && (() => {
                          // Group citations by source
                          const groupedCitations = new Map<string, {citation: any, numbers: number[]}>();
                          message.citations.forEach((citation: any) => {
                            const key = citation.source;
                            if (groupedCitations.has(key)) {
                              groupedCitations.get(key)!.numbers.push(citation.number);
                            } else {
                              groupedCitations.set(key, { citation, numbers: [citation.number] });
                            }
                          });
                          
                          return (
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                            {Array.from(groupedCitations.values()).map((group, groupIdx) => {
                              const { citation, numbers } = group;
                              // Format numbers as range or list
                              const numbersDisplay = numbers.length === 1 
                                ? numbers[0].toString()
                                : numbers.length > 1 && numbers[numbers.length - 1] - numbers[0] === numbers.length - 1
                                  ? `${numbers[0]}-${numbers[numbers.length - 1]}`
                                  : numbers.join(', ');
                              
                              return (
                              <div key={groupIdx} className="flex items-start gap-[6px] w-full">
                                <span className="inline-flex items-center justify-center rounded-[2px] text-[10px] font-bold leading-none bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)] shrink-0" style={{ minWidth: '14px', height: '14px', marginTop: '3px', padding: '0 2px' }}>
                                  {numbersDisplay}
                                </span>
                                {citation.isExternal ? (
                                  <a
                                    href={citation.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-['Lato',sans-serif] text-[13px] leading-[1.4] text-[color:var(--text-link,#1132ee)] hover:underline tracking-[0.065px] flex items-center gap-[4px]"
                                  >
                                    {citation.source}
                                    <InlineIcon name="open_in_new" size={12} />
                                  </a>
                                ) : dataSourceContent[currentScribe.name]?.[citation.source] ? (
                                  <button
                                    onClick={() => {
                                      setPreviousTab(rightTab);
                                      setViewingDataSource(citation.source);
                                      setHighlightedQuote(citation.quote || null);
                                    }}
                                    className="font-['Lato',sans-serif] text-[13px] leading-[1.4] text-[color:var(--text-link,#1132ee)] hover:underline tracking-[0.065px] text-left"
                                  >
                                    {citation.source}
                                  </button>
                                ) : (
                                  <span className="font-['Lato',sans-serif] text-[13px] leading-[1.4] text-[color:var(--text-subheading,#666)] tracking-[0.065px] text-left">
                                    {citation.source}
                                  </span>
                                )}
                              </div>
                              );
                            })}
                          </div>
                          );
                        })()}
                      </div>
                      );
                    })()}
                    
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
          ) : (
            /* Actions View */
            <>
          {/* Improve Scribe */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
                  if (dismissedNudges[selectedScribeIndex]?.has(idx) || appliedNudges[selectedScribeIndex]?.[idx]) {
                    return null;
                  }
                  
                  const nudgeKey = `${selectedScribeIndex}-${idx}`;
                  const selectedOptions = nudgeSelections[nudgeKey] || [];
                  const hasOptions = nudge.options && nudge.options.length > 0;
                  const isSingleSelect = hasOptions && nudge.options[0].type === 'single-select';
                  const previewText = hasOptions && nudge.previewText ? nudge.previewText(selectedOptions) : '';
                  
                  // Check if this nudge is hovered (from nudge or from highlight)
                  const isThisNudgeHovered = 
                    (hoveredNudge?.scribeIndex === selectedScribeIndex && hoveredNudge?.nudgeIndex === idx) ||
                    (hoveredHighlight?.scribeIndex === selectedScribeIndex && hoveredHighlight?.nudgeIndex === idx);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`border border-[var(--neutral-200,#ccc)] flex flex-col gap-[8px] items-start p-[12px] pr-[40px] relative rounded-[6px] w-full transition-colors ${
                        hasOptions ? 'hover:bg-[var(--surface-1,#f7f7f7)]' : 'cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)]'
                      } ${
                        isThisNudgeHovered ? 'bg-[var(--surface-1,#f7f7f7)]' : ''
                      }`}
                      onMouseEnter={() => setHoveredNudge({scribeIndex: selectedScribeIndex, nudgeIndex: idx})}
                      onMouseLeave={(e) => {
                        // Only clear if we're actually leaving the card (not entering a child)
                        const relatedTarget = e.relatedTarget as HTMLElement;
                        if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
                          setHoveredNudge(null);
                        }
                      }}
                      onClick={(e) => {
                        // Only handle click on the card itself, not on buttons/options
                        if ((e.target as HTMLElement).closest('button')) {
                          return;
                        }
                        
                        // Scroll to highlight if available
                        if (nudge.highlightId) {
                          const element = document.querySelector(`[data-highlight-id="${nudge.highlightId}"]`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        } else if (nudge.insertLocation) {
                          // Fallback: scroll to section
                          const sectionId = `${currentScribe.name.toLowerCase().replace(/\s+/g, '-')}-${nudge.insertLocation}-section`;
                          const element = document.querySelector(`[data-highlight-id="${sectionId}"]`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }
                      }}
                    >
                      <div className="flex flex-col gap-[4px] items-start w-full">
                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                          {nudge.type}
                        </p>
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                          {nudge.description}
                        </p>
                      </div>
                      
                      {/* Options and Actions */}
                      {hasOptions && (
                        <div className="flex flex-col gap-[12px] items-start w-full">
                          {/* Instruction text */}
                          <p className="font-['Lato',sans-serif] leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                            {isSingleSelect ? 'Select option to update this note:' : 'Select all applicable options to update this note:'}
                          </p>
                          
                          {/* Options */}
                          <div className="flex flex-wrap gap-[8px] w-full">
                            {nudge.options.map((option) => {
                              const isSelected = selectedOptions.includes(option.id);
                              return (
                                <button
                                  key={option.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    let newSelections: string[];
                                    if (isSingleSelect) {
                                      newSelections = [option.id];
                                      setNudgeSelections(prev => ({
                                        ...prev,
                                        [nudgeKey]: newSelections
                                      }));
                                    } else {
                                      newSelections = isSelected
                                        ? selectedOptions.filter(id => id !== option.id)
                                        : [...selectedOptions, option.id];
                                      setNudgeSelections(prev => ({
                                        ...prev,
                                        [nudgeKey]: newSelections
                                      }));
                                    }
                                    
                                    // Update preview in the note
                                    if (newSelections.length > 0 && nudge.previewText && nudge.insertLocation) {
                                      const previewText = nudge.previewText(newSelections);
                                      setNudgePreviews(prev => ({
                                        ...prev,
                                        [nudgeKey]: {
                                          text: previewText,
                                          location: nudge.insertLocation!,
                                          after: nudge.insertAfter || ''
                                        }
                                      }));
                                    } else {
                                      // Clear preview if no selections
                                      setNudgePreviews(prev => {
                                        const newPreviews = { ...prev };
                                        delete newPreviews[nudgeKey];
                                        return newPreviews;
                                      });
                                    }
                                  }}
                                  className={`flex items-center justify-center px-[10px] py-[6px] rounded-[6px] transition-colors ${
                                    isSelected
                                      ? 'bg-[var(--surface-semantic-info,#f1f3fe)] border border-[var(--shape-brand,#1132ee)] border-solid'
                                      : 'border border-[var(--neutral-200,#ccc)] border-solid hover:bg-[var(--surface-1,#f7f7f7)]'
                                  }`}
                                >
                                  <p className={`font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] tracking-[0.13px] ${
                                    isSelected ? 'text-[color:var(--text-brand,#1132ee)]' : 'text-[color:var(--text-subheading,#666)]'
                                  }`} style={{ fontFeatureSettings: "'ss07'" }}>
                                    {option.label}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Action Buttons */}
                          {selectedOptions.length > 0 && (
                            <div className="flex gap-[8px] items-center">
                              <Button
                                variant="tertiary"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNudgeSelections(prev => {
                                    const newSelections = { ...prev };
                                    delete newSelections[nudgeKey];
                                    return newSelections;
                                  });
                                  setNudgePreviews(prev => {
                                    const newPreviews = { ...prev };
                                    delete newPreviews[nudgeKey];
                                    return newPreviews;
                                  });
                                }}
                              >
                                Reset
                              </Button>
                              <Button
                                variant="primary"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Apply the change to the note
                                  const preview = nudgePreviews[nudgeKey];
                                  if (preview && nudge.insertLocation) {
                                    const section = nudge.insertLocation;
                                    let currentContent = currentScribe[section];
                                    
                                    if (preview.after) {
                                      const insertIndex = currentContent.indexOf(preview.after);
                                      if (insertIndex !== -1) {
                                        currentContent = 
                                          currentContent.substring(0, insertIndex + preview.after.length) +
                                          ' ' + preview.text +
                                          currentContent.substring(insertIndex + preview.after.length);
                                      } else {
                                        currentContent += '\n\n' + preview.text;
                                      }
                                    } else {
                                      currentContent += '\n\n' + preview.text;
                                    }
                                    
                                    updateScribeContent(section, currentContent);
                                    
                                    // Mark as applied with selected options
                                    setAppliedNudges(prev => ({
                                      ...prev,
                                      [selectedScribeIndex]: {
                                        ...(prev[selectedScribeIndex] || {}),
                                        [idx]: {
                                          selectedOptions: selectedOptions,
                                          appliedText: preview.text
                                        }
                                      }
                                    }));
                                    
                                    // Clear selection and preview
                                    setNudgeSelections(prev => {
                                      const newSelections = { ...prev };
                                      delete newSelections[nudgeKey];
                                      return newSelections;
                                    });
                                    setNudgePreviews(prev => {
                                      const newPreviews = { ...prev };
                                      delete newPreviews[nudgeKey];
                                      return newPreviews;
                                    });
                                  }
                                }}
                              >
                                Apply
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="absolute top-[4px] right-[4px]">
                        <IconButton 
                          variant="tertiary-neutral" 
                          size="small"
                          icon={<InlineIcon name="close_small" size={16} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Clear preview and selections when dismissing
                            setNudgeSelections(prev => {
                              const newSelections = { ...prev };
                              delete newSelections[nudgeKey];
                              return newSelections;
                            });
                            setNudgePreviews(prev => {
                              const newPreviews = { ...prev };
                              delete newPreviews[nudgeKey];
                              return newPreviews;
                            });
                            setDismissedNudges(prev => ({
                              ...prev,
                              [selectedScribeIndex]: new Set([...(prev[selectedScribeIndex] || []), idx])
                            }));
                          }}
                          aria-label={`Dismiss ${nudge.type}`}
                          className="text-[#666666] hover:bg-[rgba(0,0,0,0.03)]"
                        />
                      </div>
                    </div>
                  );
                })}
                
                {/* Applied Nudges */}
                {appliedNudges[selectedScribeIndex] && Object.keys(appliedNudges[selectedScribeIndex]).length > 0 && (
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                    <div className="flex items-center justify-between w-full">
                      <p className="font-['Lato',sans-serif] leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                        {Object.keys(appliedNudges[selectedScribeIndex]).length} nudge{Object.keys(appliedNudges[selectedScribeIndex]).length !== 1 ? 's' : ''} applied
                      </p>
                      <Button
                        variant="tertiary"
                        size="small"
                        onClick={() => setShowAppliedNudges(!showAppliedNudges)}
                      >
                        {showAppliedNudges ? 'Hide' : 'View'}
                      </Button>
                    </div>
                    
                    {showAppliedNudges && (
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        {(currentScribe.nudges || []).map((nudge, idx) => {
                          const appliedData = appliedNudges[selectedScribeIndex]?.[idx];
                          if (!appliedData) {
                            return null;
                          }
                          
                          // Get the labels for selected options
                          const selectedLabels = appliedData.selectedOptions
                            .map(optionId => nudge.options?.find(opt => opt.id === optionId)?.label)
                            .filter(Boolean);
                          
                          return (
                            <div 
                              key={idx} 
                              className="border border-[var(--neutral-200,#ccc)] flex flex-col gap-[8px] items-start p-[12px] pr-[40px] relative rounded-[6px] w-full opacity-60"
                            >
                              <div className="flex flex-col gap-[4px] items-start w-full">
                                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                                  {nudge.type}
                                </p>
                                <p className="font-['Lato',sans-serif] leading-[1.4] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                                  {nudge.description}
                                </p>
                                {/* Show selected options */}
                                {selectedLabels.length > 0 && (
                                  <div className="flex flex-wrap gap-[8px] mt-[4px]">
                                    {selectedLabels.map((label, labelIdx) => (
                                      <div
                                        key={labelIdx}
                                        className="flex items-center justify-center px-[10px] py-[6px] rounded-[6px] bg-[var(--surface-semantic-info,#f1f3fe)] border border-[var(--shape-brand,#1132ee)] border-solid"
                                      >
                                        <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] tracking-[0.13px] text-[color:var(--text-brand,#1132ee)]" style={{ fontFeatureSettings: "'ss07'" }}>
                                          {label}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="absolute top-[4px] right-[4px]">
                                <Button
                                  variant="tertiary"
                                  size="small"
                                  onClick={() => {
                                    // Remove the applied text from the note
                                    if (nudge.insertLocation && appliedData.appliedText) {
                                      const section = nudge.insertLocation;
                                      let currentContent = currentScribe[section];
                                      // Remove the applied text (with leading space if present)
                                      currentContent = currentContent.replace(' ' + appliedData.appliedText, '');
                                      currentContent = currentContent.replace('\n\n' + appliedData.appliedText, '');
                                      updateScribeContent(section, currentContent);
                                    }
                                    
                                    // Remove from applied nudges
                                    setAppliedNudges(prev => {
                                      const newApplied = { ...prev };
                                      if (newApplied[selectedScribeIndex]) {
                                        const updated = { ...newApplied[selectedScribeIndex] };
                                        delete updated[idx];
                                        newApplied[selectedScribeIndex] = updated;
                                      }
                                      return newApplied;
                                    });
                                  }}
                                >
                                  Reset
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Dismissed Nudges */}
                {dismissedNudges[selectedScribeIndex] && dismissedNudges[selectedScribeIndex].size > 0 && (
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                      {dismissedNudges[selectedScribeIndex].size} nudge{dismissedNudges[selectedScribeIndex].size !== 1 ? 's' : ''} dismissed
                    </p>
                    <Button
                      variant="tertiary"
                      size="small"
                      onClick={() => setShowDismissedNudges(!showDismissedNudges)}
                    >
                      {showDismissedNudges ? 'Hide' : 'View'}
                    </Button>
                  </div>
                    
                    {showDismissedNudges && (
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        {(currentScribe.nudges || []).map((nudge, idx) => {
                          if (!dismissedNudges[selectedScribeIndex]?.has(idx)) {
                            return null;
                          }
                          
                          return (
                            <div 
                              key={idx} 
                              className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] pr-[40px] relative rounded-[6px] shrink-0 w-full opacity-60"
                            >
                              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                                  {nudge.type}
                                </p>
                                <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                                  {nudge.description}
                                </p>
                              </div>
                              <div className="absolute top-[4px] right-[4px]">
                                <Button
                                  variant="tertiary"
                                  size="small"
                                  onClick={() => {
                                    setDismissedNudges(prev => {
                                      const newSet = new Set(prev[selectedScribeIndex]);
                                      newSet.delete(idx);
                                      return {
                                        ...prev,
                                        [selectedScribeIndex]: newSet
                                      };
                                    });
                                  }}
                                >
                                  Restore
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Diagnosis and Codes */}
                {currentScribe.diagnosisAndCodes && (
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[12px] pt-[12px] border-t border-[var(--neutral-200,#e0e0e0)]">
                    <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Diagnosis and Codes
                    </p>
                    
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      {/* ICD-10 Diagnoses */}
                      {currentScribe.diagnosisAndCodes.diagnoses && currentScribe.diagnosisAndCodes.diagnoses.length > 0 && (
                        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                          <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                            ICD-10 Diagnoses
                          </p>
                          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                            {currentScribe.diagnosisAndCodes.diagnoses.map((diagnosis: any, idx: number) => (
                              <div key={idx} className="flex gap-[8px] items-start w-full">
                                <span className="font-['Lato',sans-serif] font-bold leading-[1.4] text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] shrink-0" style={{ fontFeatureSettings: "'ss07'" }}>
                                  {diagnosis.code}
                                </span>
                                <span className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px] flex-1">
                                  {diagnosis.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* CPT Codes */}
                      {currentScribe.diagnosisAndCodes.cptCodes && currentScribe.diagnosisAndCodes.cptCodes.length > 0 && (
                        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                          <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                            CPT Codes
                          </p>
                          <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                            {currentScribe.diagnosisAndCodes.cptCodes.map((cpt: any, idx: number) => (
                              <div key={idx} className="flex gap-[8px] items-start w-full">
                                <span className="font-['Lato',sans-serif] font-bold leading-[1.4] text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] shrink-0" style={{ fontFeatureSettings: "'ss07'" }}>
                                  {cpt.code}
                                </span>
                                <span className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px] flex-1">
                                  {cpt.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Post-Visit Workflows */}
                {currentScribe.postVisitWorkflows && currentScribe.postVisitWorkflows.length > 0 && (
                  <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full mt-[12px] pt-[12px] border-t border-[var(--neutral-200,#e0e0e0)]">
                    <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                      Post-Visit Workflows
                    </p>
                    
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      {currentScribe.postVisitWorkflows.map((workflow: any, idx: number) => (
                        <div 
                          key={idx}
                          className="border border-[var(--neutral-200,#ccc)] flex items-center gap-[8px] p-[12px] relative rounded-[6px] w-full"
                        >
                          <input 
                            type="checkbox" 
                            className="shrink-0 w-[16px] h-[16px] cursor-pointer"
                            checked={workflow.status === 'completed'}
                            onChange={() => {
                              // Handle checkbox change if needed
                            }}
                          />
                          <div className="flex flex-col gap-[4px] items-start flex-1">
                            <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                              {workflow.type}
                            </p>
                            <p className="font-['Lato',sans-serif] leading-[1.4] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                              {workflow.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
            </>
          )}
        </div>
        
        {/* Chat Input at Bottom */}
        <div className="content-stretch flex gap-[8px] items-start pb-[20px] px-[16px] pt-[8px] relative shrink-0 w-full">
          <div className="flex-[1_0_0] min-w-px">
            <ChatInput
              placeholder="Ask assistant"
              value={chatInputValue}
              onChange={setChatInputValue}
              onSend={() => {
                if (chatInputValue.trim()) {
                  setRightTab('assistant');
                  setViewingDataSource(null);
                  setHighlightedQuote(null);
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
        // Find citation from appropriate context
        let citation = null;
        const contextId = activeCitation.id;
        
        if (contextId.startsWith('scribe-')) {
          citation = currentScribe.citations?.find(c => c.number === activeCitation.number);
        } else if (contextId.startsWith('previsit-')) {
          // Find in patient citations
          const matchingPatient = patients.find(p => p.name === currentScribe.name);
          if (matchingPatient && matchingPatient.citations) {
            citation = matchingPatient.citations.find(c => c.number === activeCitation.number);
          }
        } else if (contextId.startsWith('chat-')) {
          // Find in chat messages
          const messages = chatMessages[currentScribe.name] || [];
          for (const msg of messages) {
            if (msg.citations) {
              const found = msg.citations.find(c => c.number === activeCitation.number);
              if (found) {
                citation = found;
                break;
              }
            }
          }
        }
        
        if (!citation) return null;
        
        // Determine if tooltip should appear above or below
        const tooltipHeight = 120; // Approximate height
        const spaceBelow = window.innerHeight - tooltipPosition.y;
        const showBelow = spaceBelow > tooltipHeight + 50; // 50px buffer
        
        let topPosition: number;
        let transformValue: string;
        
        if (tooltipPosition.alignLeft) {
          // Position to the left of the badge
          topPosition = showBelow 
            ? tooltipPosition.y + 4 
            : tooltipPosition.y - 4;
          transformValue = showBelow
            ? 'translate(-100%, 0)'
            : 'translate(-100%, -100%)';
        } else {
          // Default center positioning
          topPosition = showBelow 
            ? tooltipPosition.y + 4 
            : tooltipPosition.y - 4;
          transformValue = showBelow
            ? 'translate(-50%, 0)'
            : 'translate(-50%, -100%)';
        }
        
        const bridgeTop = showBelow
          ? tooltipPosition.y
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
                // Clear any pending close timeout
                if (citationCloseTimeoutRef.current) {
                  clearTimeout(citationCloseTimeoutRef.current);
                  citationCloseTimeoutRef.current = null;
                }
                // Keep tooltip open when hovering over it
                setActiveCitation(activeCitation);
              }}
              onMouseLeave={() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }}
            >
              <div className="flex flex-col gap-[8px]">
                <p className="font-['Lato',sans-serif] leading-[1.4] text-[13px] text-[color:var(--text-default,black)] italic" style={{ wordBreak: 'break-word' }}>
                  "{citation.quote}"
                </p>
                <Link 
                  label={citation.source}
                  size="xsmall"
                  intent="neutral"
                  showPrefix={false}
                  showSuffix={citation.isExternal || false}
                  onClick={() => {
                    if (citation.isExternal && citation.externalUrl) {
                      window.open(citation.externalUrl, '_blank');
                    } else if (dataSourceContent[currentScribe.name]?.[citation.source]) {
                      // Document exists in dataSourceContent
                      setPreviousTab(rightTab);
                      setViewingDataSource(citation.source);
                      setHighlightedQuote(citation.quote);
                      setActiveCitation(null);
                      setTooltipPosition(null);
                    }
                    // If document doesn't exist, do nothing (don't open empty document)
                  }}
                />
              </div>
            </div>
          </>
        );
      })()}
      
      {/* Logo Sidebar Toggle Tooltip */}
      {isLogoHovered && logoTooltipPosition && (window.innerWidth < 768 || window.innerWidth >= 1024) && (
        <div 
          className="fixed z-[9999] flex items-center pointer-events-none"
          style={{
            left: `${logoTooltipPosition.x + 10}px`,
            top: `${logoTooltipPosition.y}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <svg width="6" height="12" viewBox="0 0 6 12" fill="none" className="shrink-0" style={{ filter: 'drop-shadow(0px 0px 24px rgba(0,0,0,0.15))' }}>
            <path d="M0 6L6 0.803847L6 11.1962L0 6Z" fill="white"/>
          </svg>
          <div className="bg-[var(--surface-base,white)] flex items-center px-[12px] py-[8px] rounded-[4px]" style={{ boxShadow: '0px 0px 24px rgba(0,0,0,0.15)' }}>
            <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss07'" }}>
              <p className="leading-[1.2]">{isSecondaryNavCollapsed ? 'Open Sidebar' : 'Hide Sidebar'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
