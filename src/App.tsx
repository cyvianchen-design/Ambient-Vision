import { useState } from 'react';
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
          <VisitStatus status={status as any} />
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
          "A1c 7.8% ↑ (from 7.2% 3mo ago); FBG 145 mg/dL",
          "LDL 95 mg/dL (on target); HDL 48 mg/dL",
          "Creatinine 0.9 mg/dL (eGFR 72) - stable"
        ],
        "Current Medications": [
          "Metformin 1000mg BID",
          "Atorvastatin 20mg daily",
          "Lisinopril 10mg daily"
        ],
        "Vitals": [
          "BP trending 135/85 (slightly elevated)",
          "Weight 185 lbs (stable from last visit)"
        ]
      }
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
          "EF 30% ↓ (from 35% 03/24); mild MR; LBBB 152 ms → meets CRT criteria.",
          "No device yet."
        ],
        "Volume & Weight": [
          "80.3 kg → 78.2 kg (–2.1 kg); mild ankle edema; lungs clear → near dry weight."
        ],
        "Renal / Labs": [
          "Cr 1.9 mg/dL (eGFR 39); K 4.7, Na 138 → safe for MRA and SGLT2 start.",
          "NT-proBNP 2200 → 1350 ↓ (improving).",
          "A1c 7.4 (09/25); LDL 62 (05/25)."
        ],
        "Blood Pressure": [
          "Home BP ~108/68 (low-normal). Monitor closely during GDMT uptitration."
        ],
        "Current Meds": [
          "Metoprolol 25mg BID; Bumex 2mg daily",
          "Entresto 24/26mg BID; Spironolactone 12.5mg daily"
        ]
      }
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
          "Sharp, localized to lower lumbar region (L4-L5 area)",
          "Pain 7/10 at worst, improves with rest",
          "No radiation to legs; no numbness or tingling"
        ],
        "Mechanism": [
          "Started after helping move furniture 4 days ago",
          "Gradual onset, worsened over 24 hours"
        ],
        "Red Flags": [
          "No fever, no bowel/bladder dysfunction",
          "No trauma, no night pain",
          "No history of cancer or recent weight loss"
        ],
        "Physical Exam": [
          "Normal gait; negative straight leg raise bilaterally",
          "Tenderness over paraspinal muscles L3-L5",
          "Full ROM with mild discomfort; no neurological deficits"
        ]
      }
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
          "Colonoscopy (age 55 - first screening due)",
          "Lipid panel (last checked 2 years ago)",
          "Consider PSA discussion"
        ],
        "Current Medications": [
          "Lisinopril 20mg daily",
          "Aspirin 81mg daily"
        ],
        "Vitals (Last Visit)": [
          "BP 128/78 (well controlled)",
          "BMI 28.5 (overweight)",
          "Weight stable"
        ],
        "Health Maintenance": [
          "Flu vaccine due (fall)",
          "Tdap up to date",
          "Continue current medications"
        ]
      }
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
          "4-6 migraine days per month (up from 3-4)",
          "Moderate to severe intensity; typically unilateral",
          "Associated with photophobia, nausea, occasionally visual aura"
        ],
        "Current Treatment": [
          "Preventive: Propranolol 80mg daily x 3 months",
          "Acute: Sumatriptan 100mg (using 2-3x/week)",
          "Limited response to current preventive regimen"
        ],
        "Triggers": [
          "Stress, poor sleep, skipping meals",
          "Hormonal fluctuation (perimenstrual)",
          "Bright lights, strong odors"
        ],
        "Impact": [
          "Missing work 1-2 days per month",
          "Significant effect on quality of life",
          "Patient interested in more effective prevention"
        ]
      }
    },
  ];

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
                  { id: 'previsit', label: 'Previsit Insights' },
                  { id: 'note', label: 'Note Preview' }
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
            {Object.entries(patients[selectedPatientIndex].sections).map(([sectionTitle, items]) => (
              <div key={sectionTitle} className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                  <p className="leading-[1.2]">{sectionTitle}</p>
                </div>
                <div className="flex flex-col font-['Lato',sans-serif] justify-center leading-[0] relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px] w-full">
                  <ul className="list-disc whitespace-pre-wrap">
                    {items.map((item, idx) => (
                      <li key={idx} className={idx === 0 && items.length > 1 ? "mb-0 ms-[22.5px]" : "ms-[22.5px]"}>
                        <span className="leading-[1.4]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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
      
      {/* Right Sidebar - For this visit */}
      <div className="bg-white border-l border-[var(--neutral-200,#ccc)] content-stretch flex flex-col h-full items-start overflow-hidden relative shrink-0 w-[375px]">
        {/* Header */}
        <div className="content-stretch flex items-center px-[20px] pt-[20px] pb-[12px] relative shrink-0 w-full">
          <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[17px] text-[color:var(--text-default,black)] tracking-[0.34px]">
            For this visit
          </p>
        </div>
        
        {/* Tabs with full width divider */}
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
        
        {/* Content Area - Scrollable */}
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px overflow-y-auto px-[20px] py-[20px] relative w-full">
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
              {/* Orders */}
              <div className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Orders
                  </p>
                  <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                    Order [lab / imaging name] to rule out [condition]).
                  </p>
                </div>
                <IconButton 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="close_small" size={16} />}
                  onClick={() => {}}
                  aria-label="Dismiss order"
                  className="shrink-0 text-[color:var(--text-subheading,#666)]"
                />
              </div>
              
              {/* Treatment Options */}
              <div className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Treatment Options
                  </p>
                  <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                    Medication name, dosage, and side effects to note.
                  </p>
                </div>
                <IconButton 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="close_small" size={16} />}
                  onClick={() => {}}
                  aria-label="Dismiss treatment option"
                  className="shrink-0 text-[color:var(--text-subheading,#666)]"
                />
              </div>
              
              {/* Follow Up */}
              <div className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Follow Up
                  </p>
                  <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                    Patient's value is alarming / trending worse, suggestion on what provider should ask / do in this visit.
                  </p>
                </div>
                <IconButton 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="close_small" size={16} />}
                  onClick={() => {}}
                  aria-label="Dismiss follow up"
                  className="shrink-0 text-[color:var(--text-subheading,#666)]"
                />
              </div>
              
              {/* Follow Up 2 */}
              <div className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[6px] shrink-0 w-full">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    Follow Up
                  </p>
                  <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                    Progress on symptoms - and what different progress might mean based on patient conditions and test results.
                  </p>
                </div>
                <IconButton 
                  variant="tertiary" 
                  size="small"
                  icon={<InlineIcon name="close_small" size={16} />}
                  onClick={() => {}}
                  aria-label="Dismiss follow up"
                  className="shrink-0 text-[color:var(--text-subheading,#666)]"
                />
              </div>
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
              <Link 
                label="Jan 7, Initial Eval, Athena signed note"
                size="xsmall"
                intent="neutral"
                showPrefix={false}
                showSuffix={false}
              />
              <Link 
                label="Jan 13, Follow Up, Ambient"
                size="xsmall"
                intent="neutral"
                showPrefix={false}
                showSuffix={false}
              />
              <Link 
                label="Jan 15, lab result, Athena"
                size="xsmall"
                intent="neutral"
                showPrefix={false}
                showSuffix={false}
              />
              <Link 
                label="Jan 16, imaging results, Athena"
                size="xsmall"
                intent="neutral"
                showPrefix={false}
                showSuffix={false}
              />
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
              onSend={() => console.log('Send message:', chatInputValue)}
              onVoice={() => console.log('Voice input')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
