import React, { useState, useEffect } from 'react';
import { Button, IconButton } from './components/Button';
import { VisitStatus } from './components/Badge';
import { InlineIcon } from './components/InlineIcon';
import { ButtonGroup } from './components/ButtonGroup';
import { Tabs } from './components/Tabs';
import { ChatInput } from './components/Input';
import { Link } from './components/Link';
import { TextField } from './components/TextField';
import { TrendChart } from './components/TrendChart';
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

// Shared chat messages type
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

export default function App() {
  const [currentView, setCurrentView] = useState<'visits' | 'scribes'>('visits');
  const [chatInputValue, setChatInputValue] = useState('');
  const [activeTab, setActiveTab] = useState<'previsit' | 'note'>('previsit');
  const [rightTab, setRightTab] = useState<'actions' | 'assistant' | 'sources'>('actions');
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [selectedPatientForScribe, setSelectedPatientForScribe] = useState<string | null>(null);
  const [isVisitSettingsExpanded, setIsVisitSettingsExpanded] = useState(true);
  const [isCareNudgesExpanded, setIsCareNudgesExpanded] = useState(true);
  const [editingPrechartSection, setEditingPrechartSection] = useState<'subjective' | 'objective' | 'assessment' | 'plan' | null>(null);
  const [editedPrechartContent, setEditedPrechartContent] = useState<{subjective: string; objective: string; assessment: string; plan: string}>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [showSmartEditTooltip, setShowSmartEditTooltip] = useState(false);
  const [smartEditTooltipPosition, setSmartEditTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [dismissedNudges, setDismissedNudges] = useState<Record<number, Set<number>>>({});
  const [hoveredNudge, setHoveredNudge] = useState<{patientIndex: number, nudgeIndex: number} | null>(null);
  const [showDismissedCareNudges, setShowDismissedCareNudges] = useState(false);
  const [isSecondaryNavCollapsed, setIsSecondaryNavCollapsed] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [logoTooltipPosition, setLogoTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPrimaryNav, setHoveredPrimaryNav] = useState<'visits' | 'scribes' | 'customize' | 'assistant' | 'admin' | null>(null);
  const navHoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [activeCitation, setActiveCitation] = useState<{ id: string; number: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; alignLeft?: boolean } | null>(null);
  const citationCloseTimeoutRef = React.useRef<number | null>(null);
  const [viewingDataSource, setViewingDataSource] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<'actions' | 'assistant' | 'sources'>('actions');
  const [expandedChatSources, setExpandedChatSources] = useState<Set<string>>(new Set());
  
  // Reset document view when switching patients
  useEffect(() => {
    setViewingDataSource(null);
    setRightTab('actions');
  }, [selectedPatientIndex]);

  // Reset document view when switching scribes
  useEffect(() => {
    setViewingDataSource(null);
    setRightTab('actions');
  }, [selectedPatientForScribe]);

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
  
  // Shared chat state - indexed by patient name
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    "Sarah Johnson": [
      { type: 'user', content: "When was the patient's most recent knee imaging?" },
      { 
        type: 'assistant', 
        content: "The patient had **bilateral knee X-rays on January 10, 2024** (about 5 weeks ago){{1}}. Key findings:\n\n**Right knee (symptomatic):**\n• Kellgren-Lawrence Grade 4 osteoarthritis{{2}} - severe\n• Severe joint space narrowing (medial compartment completely lost){{3}}\n• Large marginal osteophytes{{4}}\n• Subchondral sclerosis and cyst formation{{5}}\n• Varus malalignment: 8 degrees{{6}}\n\n**Left knee:**\n• Grade 2 osteoarthritis - mild to moderate{{7}}\n• Minimal joint space narrowing{{8}}\n\nThis imaging, combined with failed conservative management{{9}} (PT minimal benefit, injection only 6 weeks relief), supports the need for surgical discussion at today's visit.",
        citations: [
          { number: 1, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 2, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 3, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 4, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 5, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 6, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 7, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 8, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing with complete loss of medial compartment, large marginal osteophytes, subchondral sclerosis and cyst formation, varus alignment 8 degrees. Left knee: Grade 2, minimal joint space narrowing." },
          { number: 9, source: "Oct 20, 2023, Office visit, Athena", quote: "PT: 8 weeks minimal benefit. Intra-articular corticosteroid injection with 6 weeks relief before return to baseline" }
        ]
      },
      { type: 'user', content: "What should I focus on during this knee follow-up visit?" },
      { 
        type: 'assistant', 
        content: "Key areas to address:\n\n1. Assess current pain level and functional status - last visit pain was 6-8/10{{1}}, current intake shows 7-9/10{{2}}\n2. Review imaging showing severe right knee OA (Kellgren-Lawrence Grade 4){{3}} with varus malalignment{{3}}\n3. Discuss surgical candidacy - conservative management has failed (PT minimal benefit, injection only 6 weeks relief){{4}}\n4. Address pre-operative optimization - weight loss goal BMI <35 before TKA{{5}} (current BMI 34.2)\n5. Set realistic expectations for total knee arthroplasty outcomes and recovery timeline{{6}}",
        citations: [
          { number: 1, source: "Oct 20, 2023, Office visit, Athena", quote: "Progressive pain over 2 years, pain 6-8/10 with activity, worse with stairs and prolonged standing" },
          { number: 2, source: "Feb 12, Intake form, Ambient", quote: "Right knee pain 7/10 at rest, increases to 9/10 with activity. Night pain wakes her from sleep 3-4x/week" },
          { number: 3, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee: Kellgren-Lawrence Grade 4, severe joint space narrowing, large marginal osteophytes, varus alignment 8 degrees" },
          { number: 4, source: "Oct 20, 2023, Office visit, Athena", quote: "PT: 8 weeks minimal benefit. Intra-articular corticosteroid injection with 6 weeks relief before return to baseline" },
          { number: 5, source: "AAHKS Guidelines on Obesity and TKA", quote: "BMI >35 associated with increased complications. Weight optimization recommended before elective total knee arthroplasty.", isExternal: true, externalUrl: "https://www.aaos.org/quality/quality-programs/obesity/" },
          { number: 6, source: "AAOS Patient Guide - Total Knee Replacement", quote: "Most patients achieve 90-110 degrees of flexion and can return to low-impact activities. Recovery typically 3-6 months.", isExternal: true, externalUrl: "https://orthoinfo.aaos.org/en/treatment/total-knee-replacement/" }
        ]
      },
      { type: 'user', content: "Should I consider another injection or proceed with surgery discussion?" },
      {
        type: 'assistant',
        content: "Given the clinical picture, I'd recommend proceeding with surgical discussion:\n\n**Why surgery now:**\n• Severe radiographic OA (KL Grade 4){{1}} with significant functional impairment{{2}}\n• Failed conservative management: PT 8 weeks, injection only 6 weeks relief{{3}}\n• Progressive symptoms despite optimal medical management{{4}}\n\n**Repeat injection considerations:**\nAnother injection may provide temporary relief{{5}}, but given only 6-week benefit last time{{3}}, it's unlikely to change the long-term trajectory. Most guidelines suggest proceeding to arthroplasty when pain is refractory{{6}}.\n\n**Pre-op optimization:**\nPatient is close to goal BMI (34.2, target <35){{7}} and has well-controlled HTN{{8}}, making her a good surgical candidate now.",
        citations: [
          { number: 1, source: "Jan 10, X-ray bilateral knees, Athena", quote: "Right knee Kellgren-Lawrence Grade 4 with severe joint space narrowing, subchondral sclerosis and cyst formation" },
          { number: 2, source: "Feb 12, Intake form, Ambient", quote: "Difficulty walking >1 block, requires handrail for stairs, stopped recreational walking. Night pain interfering with sleep." },
          { number: 3, source: "Oct 20, 2023, Office visit, Athena", quote: "Intra-articular corticosteroid injection performed with approximately 6 weeks pain relief before return to baseline" },
          { number: 4, source: "Feb 12, Intake form, Ambient", quote: "Current meloxicam 15mg daily with limited benefit, glucosamine no clear benefit" },
          { number: 5, source: "Arthritis & Rheumatology - Corticosteroid Injections", quote: "Intra-articular corticosteroid injections provide short-term pain relief (typically 4-12 weeks) but do not alter disease progression.", isExternal: true, externalUrl: "https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/art.40398" },
          { number: 6, source: "AAOS Clinical Practice Guideline - Knee OA", quote: "Total knee arthroplasty is indicated for patients with symptomatic knee OA who have failed nonoperative management.", isExternal: true, externalUrl: "https://www.aaos.org/quality/quality-programs/lower-extremity-programs/osteoarthritis-of-the-knee/" },
          { number: 7, source: "Feb 12, Today's exam, Ambient", quote: "BMI 34.2. Patient actively working on weight loss through dietary modification." },
          { number: 8, source: "Jan 8, PCP visit, Athena", quote: "Hypertension well-controlled on lisinopril 20mg daily, most recent BP 128/78" }
        ]
      }
    ],
    "Robert Chen": [
      { type: 'user', content: "Is the patient ready to progress to active ROM exercises?" },
      { 
        type: 'assistant', 
        content: "Yes, at 6 weeks post-op the patient is ready to advance. Current status:\n\n• Excellent healing - incisions well-healed, no complications{{1}}\n• Good passive ROM: Forward flexion 110°, abduction 80°{{2}}\n• Minimal pain (2-4/10) with exercises{{3}}\n• Completed passive ROM phase per protocol{{4}}\n\nStandard rotator cuff repair protocols{{5}} support advancing to active-assisted ROM at 6-8 weeks. His double-row repair{{6}} was reported as stable with good tissue quality{{6}}, which supports progression.",
        citations: [
          { number: 1, source: "Physical examination, today", quote: "All portal sites well-healed with minimal scarring. No erythema, no drainage, no warmth" },
          { number: 2, source: "PT progress note, 02/05/2024", quote: "Range of motion (passive): Forward flexion 110 degrees, abduction 80 degrees, external rotation 30 degrees. Measurements taken with patient supine to ensure true passive motion" },
          { number: 3, source: "Visit transcript, 00:02:30", quote: "Pain is much better now. Just 2 out of 10 at rest, maybe 4 out of 10 during PT" },
          { number: 4, source: "PT progress note, 02/05/2024", quote: "Current phase: Passive range of motion exercises. Attending 3x per week. No active ROM until surgeon clearance at 6-week visit" },
          { number: 5, source: "AAOS Rotator Cuff Repair Rehabilitation", quote: "Active-assisted ROM typically begins at 6-8 weeks post-operatively, progressing to active ROM by 8-10 weeks.", isExternal: true, externalUrl: "https://orthoinfo.aaos.org/en/recovery/rotator-cuff-tears-surgical-treatment-options/" },
          { number: 6, source: "Operative report, 01/03/2024", quote: "Double-row technique with 4 anchors. Excellent tissue quality, repair under minimal tension. Stable repair with good tissue approximation." }
        ]
      },
      { type: 'user', content: "Can I clear him to return to work?" },
      {
        type: 'assistant',
        content: "Yes, he can return to modified duty desk work. Here's my assessment:\n\n**Occupation:** Software engineer (desk job){{1}} - primarily typing/computer work\n\n**Current status:**\n• 6 weeks post-op with good healing{{2}}\n• Minimal pain{{3}}\n\n**Return to work restrictions:**\n• Modified duty appropriate now per typical post-op guidelines{{4}}\n• No lifting >5 lbs with right arm\n• No reaching overhead or behind back\n• Frequent position changes/breaks recommended\n• Continue PT 3x/week\n• Full duty clearance: ~12 weeks post-op or when strength returns{{4}}",
        citations: [
          { number: 1, source: "Visit transcript, 00:06:45", quote: "I'd really like to know when I can go back to work. I'm on medical leave right now" },
          { number: 2, source: "Physical examination, today", quote: "All portal sites well-healed with minimal scarring. No erythema, no drainage, no warmth" },
          { number: 3, source: "Visit transcript, 00:02:30", quote: "Pain is much better now. Just 2 out of 10 at rest, maybe 4 out of 10 during PT" },
          { number: 4, source: "AAOS - Returning to Work After Shoulder Surgery", quote: "Desk work can typically resume 4-6 weeks after rotator cuff repair with restrictions. Full duty return depends on strength recovery, typically 3-4 months.", isExternal: true, externalUrl: "https://orthoinfo.aaos.org/en/recovery/activities-after-rotator-cuff-repair/" }
        ]
      }
    ],
    "Maria Garcia": [
      { type: 'user', content: "When was the patient's last lumbar X-ray?" },
      { 
        type: 'assistant', 
        content: "The patient had a lumbar spine X-ray on **June 15, 2023** (approximately 8 months ago){{1}}. The findings were:\n\n**Imaging results:**\n• Mild degenerative disc disease at L4-L5 and L5-S1{{2}}\n• Preserved disc heights{{3}}\n• No acute fracture, listhesis, or significant stenosis{{4}}\n• Mild facet arthropathy{{5}}\n\n**Current presentation:**\nGiven this is **acute** onset lower back pain (started 4 days ago{{6}}) with no red flags{{7}}, the previous imaging from 8 months ago showing only mild degenerative changes suggests this is likely an acute mechanical strain rather than progressive structural pathology. New imaging is not indicated unless symptoms fail to improve with conservative management{{8}}.",
        citations: [
          { number: 1, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis. Mild facet arthropathy. No significant stenosis." },
          { number: 2, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis. Mild facet arthropathy. No significant stenosis." },
          { number: 3, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis. Mild facet arthropathy. No significant stenosis." },
          { number: 4, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis. Mild facet arthropathy. No significant stenosis." },
          { number: 5, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis. Mild facet arthropathy. No significant stenosis." },
          { number: 6, source: "Visit transcript, 00:01:15", quote: "The pain started about 4 days ago, on Saturday morning" },
          { number: 7, source: "ROS documentation, today", quote: "Constitutional: Denies fever, chills, night sweats. Neurologic: No numbness, no tingling, no weakness. GU: Normal bowel and bladder function" },
          { number: 8, source: "ACR Appropriateness Criteria - Low Back Pain", quote: "Imaging is usually not appropriate for patients with nonspecific low back pain and no red flags.", isExternal: true, externalUrl: "https://acsearch.acr.org/docs/69483/Narrative/" }
        ]
      },
      { type: 'user', content: "Should I order new imaging for this current episode?" },
      { 
        type: 'assistant', 
        content: "No, new imaging is not indicated at this time. Here's why:\n\n**Recent baseline imaging:**\n• Prior X-ray from 8 months ago{{1}} showed only mild degenerative changes\n• No significant structural abnormalities that would predispose to acute issues{{1}}\n\n**Clinical picture:**\n• Acute onset (4 days ago{{2}}) - mechanical injury pattern\n• No red flags{{3}} (no fever, no bowel/bladder dysfunction, no trauma, no night pain, no history of cancer)\n• Likely acute muscular strain from moving furniture{{4}}\n\n**Evidence-based approach:**\nPer ACR Appropriateness Criteria{{5}}, imaging is not appropriate for nonspecific acute low back pain without red flags. Conservative management with NSAIDs and physical therapy is first-line{{6}}. Consider imaging only if symptoms persist beyond 4-6 weeks or red flags develop.",
        citations: [
          { number: 1, source: "June 15, 2023, Lumbar spine X-ray, Athena", quote: "Mild degenerative disc disease at L4-L5 and L5-S1 with preserved disc heights. No acute fracture or listhesis." },
          { number: 2, source: "Visit transcript, 00:01:15", quote: "The pain started about 4 days ago, on Saturday morning" },
          { number: 3, source: "ROS documentation, today", quote: "Constitutional: Denies fever, chills, night sweats. Neurologic: No numbness, no tingling, no weakness. GU: Normal bowel and bladder function" },
          { number: 4, source: "Visit transcript, 00:01:30", quote: "I was helping my daughter move some furniture when I felt this sharp pain in my lower back" },
          { number: 5, source: "ACR Appropriateness Criteria - Low Back Pain", quote: "Imaging is usually not appropriate for patients with nonspecific low back pain and no red flags.", isExternal: true, externalUrl: "https://acsearch.acr.org/docs/69483/Narrative/" },
          { number: 6, source: "NEJM - Low Back Pain Review", quote: "First-line treatment for acute low back pain includes NSAIDs, acetaminophen, and continued activity as tolerated.", isExternal: true, externalUrl: "https://www.nejm.org/doi/full/10.1056/NEJMra1614337" }
        ]
      }
    ],
    "James Wilson": [
      { type: 'user', content: "What preventive screenings are due for this patient?" },
      { 
        type: 'assistant', 
        content: "This 55-year-old male is due for:\n\n1. Colonoscopy{{1}} - first screening (age-appropriate per USPSTF guidelines{{2}})\n2. Lipid panel{{3}} - last checked 2 years ago{{4}}\n3. PSA screening discussion (shared decision-making per ACS guidelines{{5}})\n4. Flu vaccine - due this fall season{{1}}\n\nGiven his former smoking history{{6}}, also consider discussing lung cancer screening with low-dose CT if he quit within the last 15 years{{7}}.",
        citations: [
          { number: 1, source: "Jan 20, 2024, Annual wellness visit, Athena", quote: "Colonoscopy: Due (age 55, first-time screening per USPSTF guidelines). Flu vaccine: Due this fall season" },
          { number: 2, source: "USPSTF Colorectal Cancer Screening", quote: "The USPSTF recommends screening for colorectal cancer in all adults aged 45 to 75 years.", isExternal: true, externalUrl: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening" },
          { number: 3, source: "Jan 12, 2022, Lab results, Athena", quote: "LDL Cholesterol: 118 mg/dL (Ref: <100) [Slightly elevated]" },
          { number: 4, source: "Jan 20, 2024, Annual wellness visit, Athena", quote: "Repeat lipid panel due (>2 years since last check)" },
          { number: 5, source: "ACS PSA Screening Guidelines", quote: "Men aged 55-69 should make an individual decision about PSA screening with their health care provider.", isExternal: true, externalUrl: "https://www.cancer.org/cancer/types/prostate-cancer/detection-diagnosis-staging/acs-recommendations.html" },
          { number: 6, source: "Jan 20, 2024, Annual wellness visit, Athena", quote: "Former smoker: Quit 2020 (30 pack-year history)" },
          { number: 7, source: "USPSTF Lung Cancer Screening", quote: "Screen adults aged 50-80 who have a 20 pack-year smoking history and currently smoke or have quit within the past 15 years.", isExternal: true, externalUrl: "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening" }
        ]
      }
    ],
    "Lisa Anderson": [
      { type: 'user', content: "Is an MRI necessary for this meniscal tear?" },
      { 
        type: 'assistant', 
        content: "Based on the clinical examination, an MRI is appropriate to confirm the diagnosis before planning treatment:\n\n**Strong clinical indicators:**\n• Classic history for meniscal injury{{1}} - gradual onset during running, medial joint line pain\n• Positive McMurray test{{2}} and positive Thessaly test{{3}} - high specificity for medial meniscus tear\n• Mechanical symptoms: clicking{{4}} and occasional giving way{{5}}\n\n**MRI utility:**\nWhile clinical diagnosis is highly suggestive{{6}}, MRI will:\n• Confirm tear location and morphology (horizontal vs vertical, displaced vs non-displaced){{7}}\n• Assess for associated pathology (cartilage damage, bone marrow edema)\n• Guide treatment decision (repair vs meniscectomy candidacy){{7}}\n• Important for young, active patient where repair is preferred if tear pattern is suitable{{8}}",
        citations: [
          { number: 1, source: "Visit transcript, 00:01:45", quote: "I've been having pain in my left knee for about 3 weeks now. The pain started about 3 weeks ago." },
          { number: 2, source: "Physical examination, today", quote: "McMurray test: **POSITIVE** for medial meniscus - reproduces medial joint line pain and palpable click with valgus stress and external rotation" },
          { number: 3, source: "Physical examination, today", quote: "Thessaly test: **POSITIVE** - reproduction of medial joint line pain with internal rotation at 20 degrees of knee flexion" },
          { number: 4, source: "Visit transcript, 00:04:00", quote: "Sometimes I feel a click or pop when I bend and straighten my knee." },
          { number: 5, source: "Visit transcript, 00:04:40", quote: "A couple times my knee has felt like it was going to give out, but it hasn't fully." },
          { number: 6, source: "AAOS Clinical Practice Guideline - Meniscal Injury", quote: "Clinical examination combined with patient history can suggest meniscal pathology, but MRI is recommended for definitive diagnosis.", isExternal: true, externalUrl: "https://www.aaos.org/quality/quality-programs/lower-extremity-programs/meniscus/" },
          { number: 7, source: "JBJS - MRI for Meniscal Tears", quote: "MRI is highly accurate (sensitivity 93%, specificity 88%) for detecting meniscal tears and characterizing tear patterns critical for surgical planning.", isExternal: true, externalUrl: "https://journals.lww.com/jbjsjournal/Abstract/2003/07000/The_Accuracy_of_MRI_in_the_Diagnosis_of_Meniscal.1.aspx" },
          { number: 8, source: "Arthroscopy Journal - Meniscal Repair", quote: "Young patients (<30) with traumatic tears are ideal repair candidates if tear morphology is appropriate (vertical, peripheral location).", isExternal: true, externalUrl: "https://www.arthroscopyjournal.org/article/S0749-8063(18)30001-5/fulltext" }
        ]
      }
    ]
  });
  
  // Helper function to get badge color based on document type
  const getDocumentTypeBadgeColor = (type: string): {bg: string, text: string} => {
    const typeMap: Record<string, {bg: string, text: string}> = {
      // Consolidated Document Types
      'Clinical Note': { bg: '#f1f3fe', text: '#1132ee' }, // Info (blue brand)
      'Imaging': { bg: '#f0ecf7', text: '#7246b5' }, // Purple
      'Lab Results': { bg: '#ecf8fb', text: '#207384' }, // Cyan
      'Procedure Note': { bg: '#f1f7fd', text: '#1566b7' }, // Blue
      'Specialist Report': { bg: '#fcf1f7', text: '#ab2973' }, // Magenta
      'Form': { bg: '#f0f3f4', text: '#576b75' }, // Blue Grey
    };
    return typeMap[type] || { bg: '#f2f2f2', text: '#666' }; // Default grey (History)
  };

  // Data source content for each patient
  const dataSourceContent: Record<string, Record<string, {type: string, date: string, content: string}>> = {
    "Sarah Johnson": {
      "Feb 12, Today's exam, Ambient": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**OFFICE VISIT - ORTHOPEDIC SURGERY**\n\nPatient: Sarah Johnson, 62F\nDate: 02/12/2024\nChief Complaint: Right knee pain follow-up\n\n**VITAL SIGNS**\nBP: 132/78 mmHg\nHR: 74 bpm\nWeight: 210 lbs\nHeight: 5'4\"\nBMI: 34.2\n\n**PHYSICAL EXAMINATION**\n\nRight Knee:\n• Inspection: Moderate effusion, varus alignment (approximately 8 degrees)\n• Palpation: Tenderness to palpation at medial joint line and medial femoral condyle\n• Range of Motion: 5-110 degrees (limited by pain at terminal flexion)\n• Crepitus: Significant crepitus throughout ROM\n• Ligamentous: Stable to varus/valgus stress\n• Neurovascular: Intact\n\nLeft Knee:\n• Inspection: No effusion, neutral alignment\n• ROM: 0-125 degrees\n• Mild crepitus present\n\n**GAIT**\nAntalgic gait favoring right lower extremity"
      },
      "Feb 12, Intake form, Ambient": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**PATIENT INTAKE FORM**\n\nPatient: Sarah Johnson\nDate: 02/12/2024\n\n**CHIEF COMPLAINT**\nRight knee pain and stiffness, progressively worsening\n\n**PAIN ASSESSMENT**\n• Right knee: 7/10 at rest, 9/10 with activity\n• Left knee: 4/10, manageable\n• Night pain: Yes, interferes with sleep\n• Location: Medial > lateral right knee\n\n**FUNCTIONAL LIMITATIONS**\n• Difficulty walking more than 1 block\n• Stairs very painful, requires handrail\n• Unable to kneel or squat\n• Difficulty with prolonged standing\n• Has stopped recreational walking\n\n**PREVIOUS TREATMENTS TRIED**\n• Physical therapy: 8 weeks, minimal benefit\n• Cortisone injection (October 2023): 6 weeks relief\n• NSAIDs (meloxicam): daily use, limited benefit\n• Glucosamine/chondroitin: no clear benefit\n• Weight loss attempts: ongoing\n\n**GOALS**\n• Improve pain and function\n• Return to walking for exercise\n• Able to play with grandchildren"
      },
      "Jan 10, X-ray bilateral knees, Athena": {
        type: "Imaging",
        date: "Jan 10, 2024",
        content: "**RADIOLOGY REPORT - BILATERAL KNEE X-RAYS**\n\nPatient: Sarah Johnson\nDOB: 05/22/1962\nMRN: SJ-445678\nExam Date: 01/10/2024\nStudy: Bilateral knee radiographs (AP, lateral, sunrise views)\n\n**TECHNIQUE**\nStanding AP, lateral, and sunrise views of both knees obtained.\n\n**FINDINGS**\n\nRIGHT KNEE:\n• Joint space: Severe narrowing of medial compartment (<2mm)\n• Osteophytes: Large marginal osteophytes at medial and lateral tibiofemoral joint\n• Subchondral changes: Severe sclerosis of medial tibial plateau and femoral condyle\n• Cysts: Subchondral cyst formation noted in medial tibial plateau\n• Alignment: Varus alignment approximately 8 degrees\n• Patellofemoral: Moderate degenerative changes\n• Kellgren-Lawrence Grade: 4\n\nLEFT KNEE:\n• Joint space: Moderate narrowing of medial and lateral compartments\n• Osteophytes: Moderate marginal osteophytes\n• Subchondral changes: Mild-moderate sclerosis\n• Alignment: Neutral\n• Kellgren-Lawrence Grade: 2-3\n\n**IMPRESSION**\n1. Severe tricompartmental osteoarthritis of right knee (Kellgren-Lawrence Grade 4) with varus malalignment\n2. Moderate osteoarthritis of left knee (Kellgren-Lawrence Grade 2-3)\n\nRecommendation: Clinical correlation advised. Severe degenerative changes right knee consistent with end-stage osteoarthritis."
      },
      "Jan 8, PCP visit, Athena": {
        type: "Clinical Note",
        date: "Jan 8, 2024",
        content: "**PRIMARY CARE VISIT**\n\nPatient: Sarah Johnson, 62F\nDate: 01/08/2024\nChief Complaint: Routine follow-up, medication refills\n\n**CURRENT MEDICATIONS**\n• Lisinopril 20mg daily (Hypertension)\n• Meloxicam 15mg daily (Osteoarthritis)\n\n**VITAL SIGNS**\nBP: 128/78 mmHg\nWeight: 210 lbs\n\n**ASSESSMENT & PLAN**\n1. Hypertension - well-controlled on current regimen\n   - Continue lisinopril 20mg daily\n   - Home BP monitoring\n\n2. Obesity (BMI 34.2)\n   - Discussed weight loss importance, especially with upcoming knee surgery consideration\n   - Referred to nutritionist\n   - Goal: Lose 10-15 lbs before surgery\n\n3. Osteoarthritis - severe right knee\n   - Continue meloxicam\n   - Following with orthopedics\n   - Clearance given for elective surgery if indicated"
      },
      "Oct 20, 2023, Office visit, Athena": {
        type: "Clinical Note",
        date: "Oct 20, 2023",
        content: "**ORTHOPEDIC OFFICE VISIT**\n\nPatient: Sarah Johnson, 62F\nDate: 10/20/2023\nChief Complaint: Bilateral knee pain, worse on right\n\n**HISTORY OF PRESENT ILLNESS**\nPatient presents with progressive bilateral knee pain over past 2 years, significantly worse on the right. Reports pain 6/10 at rest, 8-9/10 with activity. Difficulty with stairs, prolonged standing, and walking >2 blocks. Night pain present. Has tried PT, NSAIDs with limited benefit. Previous cortisone injection to right knee (6 months ago) provided only 2-3 weeks relief.\n\n**PHYSICAL EXAMINATION**\n• Right knee: Moderate effusion, palpable osteophytes, ROM 5-110° with crepitus and pain, varus alignment\n• Left knee: Mild crepitus, ROM 0-125°\n\n**IMAGING**\nX-ray bilateral knees (10/20/2023):\n• Right: Kellgren-Lawrence Grade 3-4 osteoarthritis\n• Left: Kellgren-Lawrence Grade 2-3 osteoarthritis\n\n**PROCEDURE PERFORMED**\nIntra-articular corticosteroid injection, right knee\n• Kenalog 40mg + 1% lidocaine 3mL\n• Medial approach, superolateral portal\n• Aspiration: 5mL straw-colored fluid (sent for analysis - non-inflammatory)\n• Injection performed under sterile technique\n• No complications\n\n**ASSESSMENT**\n1. Severe right knee osteoarthritis (Kellgren-Lawrence Grade 3-4)\n2. Moderate left knee osteoarthritis (Grade 2-3)\n\n**PLAN**\n• Continue NSAIDs (meloxicam 15mg daily)\n• Continue PT for strengthening\n• Discussed surgical options including total knee arthroplasty\n• Patient wishes to defer surgery at this time\n• Follow up in 3 months to reassess\n• If injection benefit <3 months, consider surgery\n\n**SURGICAL DISCUSSION**\nDiscussed risks, benefits, and alternatives of total knee arthroplasty including:\n• Expected outcomes and recovery timeline\n• Risks: infection, blood clots, stiffness, persistent pain\n• Importance of weight optimization (current BMI 35)\n• Realistic expectations\nPatient expressed understanding but wants to try conservative management first."
      }
    },
    "Robert Chen": {
      "Feb 12, Today's visit, Ambient": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**6-WEEK POST-OPERATIVE VISIT**\n\nPatient: Robert Chen, 58M\nDate: 02/12/2024\nProcedure: Right shoulder arthroscopic rotator cuff repair (01/03/2024)\n\n**SUBJECTIVE**\nPatient reports doing well overall. Pain well-controlled, 2/10 at rest, 4/10 with PT. Sleeping better, able to lie on left side. Sling discontinued 2 weeks ago per PT. No numbness, tingling, or signs of infection. Attending PT 3x/week.\n\n**PHYSICAL EXAMINATION**\n\nInspection:\n• Surgical portals: Well-healed, no erythema, warmth, or drainage\n• Minimal scarring\n• Very mild glenohumeral effusion (expected)\n\nPalpation:\n• No tenderness over surgical sites\n• No warmth or signs of infection\n\nRange of Motion (Passive):\n• Forward flexion: 110°\n• Abduction: 80°\n• External rotation: 30°\n• Internal rotation: To sacrum\n• All measurements limited by guarding, not pain\n\nStrength:\n• Deferred at this timepoint to protect repair\n\nNeurovascular:\n• Axillary nerve: Deltoid sensation intact\n• Radial/median/ulnar nerves: Intact\n• Capillary refill <2 seconds\n• Radial pulse 2+\n\n**ASSESSMENT**\n6 weeks status post arthroscopic rotator cuff repair, progressing well per protocol\n\n**PLAN**\n1. Advance to active-assisted ROM exercises\n2. Continue PT 3x/week\n3. Wean off tramadol, continue acetaminophen PRN\n4. Clear for modified duty work (desk work, no lifting >5 lbs, no reaching overhead)\n5. Return to clinic in 6 weeks\n6. Formal strength testing at 12 weeks post-op"
      },
      "Feb 12, Intake form, Ambient": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**POST-OPERATIVE INTAKE FORM**\n\nPatient: Robert Chen\nDate: 02/12/2024\nSurgery Date: 01/03/2024 (6 weeks ago)\nProcedure: Right shoulder arthroscopic rotator cuff repair\n\n**CURRENT SYMPTOMS**\n• Pain: 2/10 at rest, 4/10 with PT exercises\n• Sleep: Improved, can lie on left side\n• Sling use: Discontinued 2 weeks ago\n\n**COMPLICATIONS SCREENING**\n• No numbness or tingling in arm/hand\n• No signs of infection (no fever, redness, drainage)\n• No new swelling\n• No concerning symptoms\n\n**PHYSICAL THERAPY**\n• Started: 2 weeks post-op\n• Frequency: 3x per week\n• Current phase: Passive ROM\n• Compliance: Excellent, doing home exercises daily\n• Therapist notes good progress\n\n**MEDICATIONS**\n• Tramadol 50mg: 1-2 tablets/day (mainly before PT)\n• Acetaminophen 1000mg TID: Regular use\n• Lisinopril 10mg daily: Continuing\n\n**WORK STATUS**\n• Occupation: Software engineer (desk job)\n• Currently: On medical leave\n• Concerns: Ready to return but needs clearance\n• Employer: Requesting return-to-work note with restrictions\n\n**GOALS**\n• Return to work soon\n• Continue improving ROM\n• Reduce pain medication use"
      },
      "Feb 5, PT progress note, Athena": {
        type: "Clinical Note",
        date: "Feb 5, 2024",
        content: "**PHYSICAL THERAPY PROGRESS NOTE**\n\nPatient: Robert Chen\nDOB: 08/15/1966\nDiagnosis: S/P right rotator cuff repair (01/03/2024)\nSession: Week 5 post-op, Session #9\n\n**SUBJECTIVE**\nPatient reports pain 3-4/10 during exercises, manageable. Sleeping better. Discontinued sling use at home per last visit. Compliant with home exercise program.\n\n**OBJECTIVE**\n\nRange of Motion (Passive):\n• Forward flexion: 110° (goal 140° by 8 weeks)\n• Abduction: 80° (goal 120° by 8 weeks)\n• External rotation (arm at side): 30° (goal 45° by 8 weeks)\n• Internal rotation: To sacrum\n\nMeasurements performed supine to ensure true passive motion. Patient demonstrates good relaxation during stretching.\n\n**INTERVENTIONS**\n• Passive ROM exercises: Pulleys, wand exercises, therapist-assisted stretching\n• Scapular stabilization: Isometric exercises initiated\n• Gentle pendulum exercises\n• Modalities: Ice post-treatment\n• Education: Sleeping positions, activity modifications\n\n**ASSESSMENT**\nPatient progressing well within expected timeline for 5 weeks post-op. Good compliance with protocol. No active ROM permitted until cleared by surgeon (typically 6-8 weeks).\n\n**PLAN**\n• Continue 3x/week therapy\n• Progress passive ROM as tolerated\n• Add gentle active-assisted ROM pending surgeon clearance at 6-week visit\n• Prepare for strengthening phase (weeks 8-12)\n\nNext visit: 02/08/2024"
      },
      "Jan 17, 2-week post-op visit, Athena": {
        type: "Clinical Note",
        date: "Jan 17, 2024",
        content: "**2-WEEK POST-OPERATIVE VISIT**\n\nPatient: Robert Chen, 58M\nDate: 01/17/2024\nSurgery Date: 01/03/2024\nProcedure: Arthroscopic rotator cuff repair, right shoulder\n\n**SUBJECTIVE**\nPatient reports pain 4-5/10, improved from immediate post-op. Using narcotics 3-4x/day. Sleeping in recliner. Compliant with sling use and pendulum exercises only.\n\n**OBJECTIVE**\n\nInspection:\n• Incisions: All portal sites clean, dry, intact\n• Mild steri-strip residue, no erythema\n• Mild glenohumeral effusion (expected)\n\nPalpation:\n• No warmth, no drainage\n• Minimal tenderness over surgical sites\n\nNeurovascular:\n• Axillary nerve function: Deltoid sensation intact (critical finding)\n• Radial/median/ulnar nerves: Intact\n• Vascular: Radial pulse 2+, capillary refill <2 seconds\n\nRange of Motion:\n• Not formally assessed (too early, protecting repair)\n• Patient able to perform gentle pendulum exercises without difficulty\n\n**ASSESSMENT**\n2 weeks status post arthroscopic rotator cuff repair, healing well without complications\n\n**PLAN**\n1. Continue sling immobilization for 4 more weeks (total 6 weeks)\n2. Start formal physical therapy this week - passive ROM protocol\n3. Continue pain medications as prescribed\n4. Cleared to remove steri-strips\n5. Return to clinic in 4 weeks (6-week post-op visit)\n6. Call immediately for: fever, increased redness/drainage, new numbness\n\n**RESTRICTIONS**\n• No active ROM until 6 weeks\n• No lifting with right arm\n• No reaching behind back\n• Continue sling use except for hygiene and PT"
      },
      "Jan 3, Operative report, Athena": {
        type: "Procedure Note",
        date: "Jan 3, 2024",
        content: "**OPERATIVE REPORT**\n\nPatient: Robert Chen\nDOB: 08/15/1966\nMRN: RC-887654\nDate of Surgery: 01/03/2024\nSurgeon: Dr. [Attending Orthopedic Surgeon]\n\nPREOPERATIVE DIAGNOSIS:\nFull-thickness rotator cuff tear, right shoulder\n\nPOSTOPERATIVE DIAGNOSIS:\n1. Large full-thickness tear of supraspinatus tendon (2.5cm)\n2. High-grade partial-thickness tear of infraspinatus tendon (>50%)\n\nPROCEDURE PERFORMED:\nArthroscopic rotator cuff repair, right shoulder with double-row suture anchor technique\n\nANESTHESIA:\nGeneral anesthesia with interscalene block\n\nCOMPLICATIONS:\nNone\n\nEBL: <50mL\n\nINDICATIONS:\n58-year-old male with chronic right shoulder pain and MRI-confirmed full-thickness rotator cuff tear failing conservative management for 6 months. Patient presents for arthroscopic repair.\n\nFINDINGS:\n• Supraspinatus tendon: Full-thickness tear measuring approximately 2.5cm in anteroposterior dimension, retracted to glenoid rim\n• Infraspinatus tendon: High-grade partial-thickness articular-side tear (>50% thickness)\n• Subscapularis: Intact\n• Long head biceps tendon: Intact, no significant fraying\n• Labrum: Intact\n• Articular cartilage: Grade 2 changes (superficial fibrillation)\n• Subacromial space: Moderate bursitis\n\nPROCEDURE DESCRIPTION:\nPatient positioned in beach chair. Standard posterior, lateral, and anterior portals established. Diagnostic arthroscopy performed confirming rotator cuff tear as above.\n\nSubacromial bursectomy performed for visualization. Rotator cuff tear identified and mobilized. Footprint on greater tuberosity prepared with shaver and burr.\n\nDouble-row rotator cuff repair technique:\n• Medial row: Two 5.5mm PEEK anchors placed at medial aspect of footprint\n• Sutures passed through tendon in mattress configuration\n• Tendon reduced to footprint with good tissue quality\n• Lateral row: Two 4.75mm knotless anchors placed at lateral footprint\n• Repair under minimal tension with excellent coverage\n\nFinal inspection showed stable repair with good tissue approximation. No neurovascular complications.\n\nPOSTOPERATIVE PLAN:\n• Sling immobilization with abduction pillow x 6 weeks\n• Pendulum exercises only for first 2 weeks\n• Physical therapy to begin week 2 - passive ROM protocol\n• Pain management: Tramadol, acetaminophen\n• Follow-up: 2 weeks for wound check, 6 weeks for ROM progression\n• No active ROM until 6-8 weeks post-op\n• Anticipated return to full activities: 4-6 months"
      },
      "Dec 20, 2023, Pre-operative visit, Athena": {
        type: "Clinical Note",
        date: "Dec 20, 2023",
        content: "**PRE-OPERATIVE EVALUATION**\n\nPatient: Robert Chen, 58M\nDate: 12/20/2023\nScheduled Procedure: Right shoulder arthroscopic rotator cuff repair (01/03/2024)\n\n**HISTORY**\nPatient with chronic right shoulder pain x 18 months, initially treated conservatively with PT and cortisone injection with temporary relief. MRI confirms full-thickness supraspinatus tear. Patient desires surgical repair to return to activities.\n\n**OCCUPATION**\nSoftware engineer - desk work, significant computer use\n\n**MEDICAL CLEARANCE**\n• PCP clearance obtained\n• EKG: Normal sinus rhythm\n• Labs: Within normal limits\n• Hypertension: Well-controlled on lisinopril\n\n**SURGICAL PLAN DISCUSSED**\n• Arthroscopic rotator cuff repair\n• Expected hospital stay: Outpatient/same-day discharge\n• Anesthesia: General with interscalene nerve block\n• Estimated surgical time: 90-120 minutes\n\n**POST-OPERATIVE EXPECTATIONS**\n• Sling immobilization: 6 weeks\n• Physical therapy: Starting week 2\n• Return to desk work: 4-6 weeks (modified duty)\n• Return to full activities: 4-6 months\n\n**RISKS DISCUSSED**\n• Infection (<1%)\n• Stiffness (10-15%)\n• Re-tear (10-30% depending on size)\n• Nerve injury (<1%)\n• Persistent pain\n• Need for revision surgery\n\nPatient verbalized understanding and provided informed consent."
      },
      "Dec 15, 2023, PCP visit, Athena": {
        type: "Clinical Note",
        date: "Dec 15, 2023",
        content: "**PRE-OPERATIVE CLEARANCE**\n\nPatient: Robert Chen, 58M\nDate: 12/15/2023\nReason: Surgical clearance for right shoulder rotator cuff repair\n\n**CURRENT MEDICATIONS**\n• Lisinopril 10mg daily\n\n**MEDICAL HISTORY**\n• Hypertension - well-controlled\n• No diabetes, no cardiac disease\n• No prior surgeries\n\n**PHYSICAL EXAMINATION**\nVitals: BP 128/76, HR 72, RR 14\nCardiac: RRR, no murmurs\nLungs: Clear bilaterally\nGeneral: Good surgical candidate\n\n**ASSESSMENT**\n58-year-old male with well-controlled hypertension, good general health\n\n**CLEARANCE**\nMedically cleared for elective orthopedic surgery under general anesthesia\n\n**RECOMMENDATIONS**\n• Continue lisinopril through surgery\n• No additional testing needed\n• Follow up post-operatively PRN"
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
      "Feb 12, Intake form, Ambient": {
        type: "Form",
        date: "Feb 12, 2024",
        content: "**INTAKE FORM**\n\nPatient: Maria Garcia, 35F\n\n**CHIEF COMPLAINT**\nLower back pain x4 days\n\n**HPI**\nSharp pain in L4-L5 region, 7/10 severity, improves with rest. Started after moving furniture. No radiation, numbness, tingling.\n\n**RED FLAGS**\nNo fever, bowel/bladder dysfunction, trauma, night pain, or history of cancer.\n\n**CURRENT MEDS**\nNone (occasional ibuprofen OTC)"
      },
      "Visit transcript, 00:01:15": {
        type: "Transcript",
        date: "Feb 12, 2024",
        content: "**VISIT TRANSCRIPT EXCERPT**\n\n[00:01:15]\nDoctor: So tell me, when did this back pain start?\n\nPatient: The pain started about 4 days ago, on Saturday morning."
      },
      "Visit transcript, 00:01:30": {
        type: "Transcript",
        date: "Feb 12, 2024",
        content: "**VISIT TRANSCRIPT EXCERPT**\n\n[00:01:30]\nDoctor: What were you doing when it started?\n\nPatient: I was helping my daughter move some furniture when I felt this sharp pain in my lower back. It was like something pulled or tweaked."
      },
      "ROS documentation, today": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**REVIEW OF SYSTEMS**\n\nPatient: Maria Garcia\nDate: 02/12/2024\n\n**Constitutional:**\nDenies fever, chills, night sweats. No unintentional weight loss or gain.\n\n**Musculoskeletal:**\nLower back pain as described in HPI. No other joint pain, swelling, or stiffness.\n\n**Neurologic:**\nNo numbness, no tingling, no weakness in lower extremities. No loss of coordination or balance.\n\n**Genitourinary:**\nNormal bowel and bladder function. No incontinence, retention, or changes in habits.\n\n**All Other Systems:**\nNegative per template."
      },
      "Feb 12, Today's visit, Ambient": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: Maria Garcia\n\n**VITALS**\nBP: 118/72\nHR: 76\nTemp: 98.4°F\n\n**EXAM**\nGeneral: Well-appearing\nMSK: Normal gait, negative SLR bilaterally, tenderness over paraspinal muscles L3-L5, full ROM with mild discomfort\nNeuro: No deficits\n\n**ASSESSMENT**\nAcute mechanical low back pain\n\n**PLAN**\nConservative management with NSAIDs, PT referral, follow-up PRN"
      }
    },
    "James Wilson": {
      "Feb 12, Today's visit, Ambient": {
        type: "Clinical Note",
        date: "Feb 12, 2024",
        content: "**VISIT NOTE**\n\nPatient: James Wilson, 55M\n\n**VITALS**\nBP: 128/78 mmHg\nWeight: 210 lbs\nHeight: 5'11\"\nBMI: 28.5\n\n**EXAM**\nGeneral: Well-appearing\nCardiac: RRR, no murmurs\nLungs: Clear bilaterally\nAbdomen: Soft, non-tender"
      },
      "Jan 20, 2024, Annual wellness visit, Athena": {
        type: "Clinical Note",
        date: "Jan 20, 2024",
        content: "**ANNUAL WELLNESS VISIT**\n\nPatient: James Wilson, 55M\n\n**HEALTH MAINTENANCE**\n• Colonoscopy due (age 55)\n• PSA screening discussion\n• Flu vaccine due this fall\n• Tdap: 05/2021 (up to date)\n\n**CURRENT MEDICATIONS**\n• Lisinopril 20mg daily\n• Aspirin 81mg daily\n\n**PLAN**\n• Order colonoscopy\n• Discuss PSA\n• Continue medications"
      },
      "Jan 12, 2022, Lab results, Athena": {
        type: "Lab Results",
        date: "Jan 12, 2022",
        content: "**LAB RESULTS**\n\nPatient: James Wilson\n\n**LIPID PANEL**\nTotal Cholesterol: 195 mg/dL\nLDL: 118 mg/dL\nHDL: 52 mg/dL\nTriglycerides: 125 mg/dL\n\n**NOTE**\nRepeat due (>2 years)"
      }
    },
    "Lisa Anderson": {
      "Feb 12, Today's visit, Ambient": {
        type: "Clinical Note",
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
      age: 62, 
      gender: "F", 
      time: "9:00 am", 
      status: "In Queue", 
      chiefComplaint: "Right Knee Pain",
      atAGlance: [
        "Bilateral knee OA (R>L); progressive pain and stiffness; conservative management failing; significant functional limitation.",
        "Next step → review recent imaging; discuss total knee arthroplasty options; assess readiness for surgery."
      ],
      details: [
        "Follow-up for knee osteoarthritis",
        "Bilateral knee OA (R>L) / HTN / Obesity"
      ],
      sections: {
        "Last Visit Summary": [
          "Patient presented 3 months ago for bilateral knee pain. {{1}}",
          "X-rays showed advanced osteoarthritis (Kellgren-Lawrence Grade 3-4) worse on right. {{2}}",
          "Tried cortisone injection to right knee with temporary relief (6 weeks). {{3}}",
          "Discussed surgical options but patient wanted to try more conservative management first. {{4}}",
          "Started on PT and oral NSAIDs. Plan was to follow up in 3 months to reassess. {{5}}"
        ],
        "Pain & Function": [
          "Right knee pain 7/10 at rest, 9/10 with activity {{6}}",
          "Difficulty walking >1 block; stairs very painful {{7}}",
          "Night pain interfering with sleep {{8}}",
          "Left knee mild pain (4/10) - manageable for now {{9}}"
        ],
        "Imaging": [
          "X-ray (Jan 10): Right knee - severe joint space narrowing, large osteophytes, subchondral sclerosis {{10}}",
          "Left knee - moderate OA changes (KL Grade 2-3) {{11}}"
        ],
        "Physical Exam (Last Visit)": [
          "Right knee: Moderate effusion, crepitus with ROM, ROM 5-110° {{12}}",
          "Varus alignment, tenderness at medial joint line {{13}}",
          "Left knee: Mild crepitus, ROM 0-125° {{14}}"
        ],
        "Prior Treatments": [
          "PT x 8 weeks - minimal benefit {{15}}",
          "Cortisone injection (Oct 2023) - 6 weeks relief {{16}}",
          "NSAIDs (meloxicam 15mg daily), glucosamine - ongoing {{17}}"
        ],
        "Current Medications": [
          "Meloxicam 15mg daily {{18}}",
          "Lisinopril 20mg daily (HTN) {{19}}",
          "Tylenol PRN {{20}}"
        ],
        "Comorbidities": [
          "HTN - well controlled on lisinopril {{21}}",
          "BMI 34 (obesity) - weight loss attempts ongoing {{22}}",
          "No diabetes, no cardiac disease {{23}}"
        ]
      },
      citations: [
        { number: 1, citedText: "visit reason", quote: "Follow-up Visit - October 20, 2023. Chief Complaint: Bilateral knee pain, worse on right.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 2, citedText: "imaging findings", quote: "X-ray bilateral knees (10/20/2023) showing Kellgren-Lawrence Grade 3-4 osteoarthritis right knee, Grade 2-3 left knee.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 3, citedText: "injection performed", quote: "Intra-articular corticosteroid injection to right knee performed. Patient experienced approximately 6 weeks of pain relief.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 4, citedText: "treatment plan", quote: "Discussed surgical options including total knee arthroplasty but patient wishes to defer surgery at this time.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 5, citedText: "treatment plan continued", quote: "Continue NSAIDs and PT for strengthening. Follow up in 3 months to reassess symptoms and functional status.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 6, citedText: "pain severity", quote: "Right knee pain 7/10 at rest, increases to 9/10 with activity such as walking or climbing stairs.", source: "Feb 12, Intake form, Ambient" },
        { number: 7, citedText: "functional limitation", quote: "Difficulty walking more than one block, requires handrail for stairs, has stopped recreational walking.", source: "Feb 12, Intake form, Ambient" },
        { number: 8, citedText: "night pain", quote: "Reports night pain that wakes her from sleep approximately 3-4 times per week.", source: "Feb 12, Intake form, Ambient" },
        { number: 9, citedText: "left knee pain", quote: "Left knee pain 4/10, managed with current medications, not limiting function at this time", source: "Feb 12, Intake form, Ambient" },
        { number: 10, citedText: "right knee imaging", quote: "Right knee: Severe joint space narrowing of medial compartment, large marginal osteophytes, subchondral sclerosis and cysts. Kellgren-Lawrence Grade 4. Varus alignment 8 degrees.", source: "Jan 10, X-ray bilateral knees, Athena" },
        { number: 11, citedText: "left knee imaging", quote: "Left knee: Moderate joint space narrowing, moderate osteophyte formation, mild subchondral sclerosis. Kellgren-Lawrence Grade 2-3.", source: "Jan 10, X-ray bilateral knees, Athena" },
        { number: 12, citedText: "right knee exam", quote: "Right knee examination: Moderate effusion present, crepitus with passive range of motion, ROM 5-110 degrees (limited by pain)", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 13, citedText: "right knee alignment", quote: "Right knee examination: varus alignment, tenderness to palpation at medial joint line and medial femoral condyle", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 14, citedText: "left knee exam", quote: "Left knee examination: Mild crepitus with range of motion, ROM 0-125 degrees, no effusion, minimal tenderness", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 15, citedText: "prior PT", quote: "Physical therapy: 8 weeks of strengthening and ROM exercises completed, minimal pain relief noted.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 16, citedText: "injection relief", quote: "Intra-articular corticosteroid injection performed with approximately 6 weeks of pain relief before symptoms returned to baseline.", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 17, citedText: "NSAIDs", quote: "Current medications: Meloxicam 15mg daily for osteoarthritis pain, glucosamine/chondroitin supplement", source: "Oct 20, 2023, Office visit, Athena" },
        { number: 18, citedText: "meloxicam", quote: "Meloxicam 15mg daily for osteoarthritis pain", source: "Feb 12, Today's exam, Ambient" },
        { number: 19, citedText: "lisinopril", quote: "Lisinopril 20mg daily for hypertension, most recent BP 128/78", source: "Jan 8, PCP visit, Athena" },
        { number: 20, citedText: "acetaminophen", quote: "Acetaminophen 1000mg taken as needed for breakthrough pain", source: "Feb 12, Intake form, Ambient" },
        { number: 21, citedText: "BP control", quote: "Hypertension well-controlled on lisinopril 20mg daily, most recent BP 128/78", source: "Jan 8, PCP visit, Athena" },
        { number: 22, citedText: "BMI", quote: "Height 5'4\", Weight 210 lbs, BMI 34.2. Patient actively working on weight loss through dietary modification.", source: "Feb 12, Today's exam, Ambient" },
        { number: 23, citedText: "medical history", quote: "Past medical history: Hypertension (controlled). No diabetes mellitus, no coronary artery disease, no prior surgeries.", source: "Oct 20, 2023, Office visit, Athena" }
      ],
      dataSources: [
        "Feb 12, Today's exam, Ambient",
        "Feb 12, Intake form, Ambient",
        "Jan 10, X-ray bilateral knees, Athena",
        "Jan 8, PCP visit, Athena",
        "Oct 20, 2023, Office visit, Athena"
      ],
      careNudges: [
        {
          type: "Surgical Consultation",
          description: "Discuss total knee arthroplasty - conservative management failing, severe OA on imaging.",
          highlightId: "sarah-pain-function-0"
        },
        {
          type: "Pre-operative Optimization",
          description: "Weight loss goal BMI <35 before TKA - currently BMI 34.2, discuss timeline.",
          highlightId: "sarah-comorbidities-1"
        },
        {
          type: "Repeat Injection",
          description: "Consider repeat cortisone injection if patient wants to defer surgery further.",
          highlightId: "sarah-prior-treatments-1"
        }
      ],
      trends: [
        {
          title: "Right Knee Pain Score (0-10)",
          section: "Current Symptoms",
          data: [
            { date: "11/20", value: 5, label: "Nov 20, 2023" },
            { date: "11/27", value: 5, label: "Nov 27, 2023" },
            { date: "12/4", value: 6, label: "Dec 4, 2023" },
            { date: "12/11", value: 6, label: "Dec 11, 2023" },
            { date: "12/18", value: 7, label: "Dec 18, 2023" },
            { date: "12/26", value: 7, label: "Dec 26, 2023" },
            { date: "1/2", value: 6, label: "Jan 2, 2024" },
            { date: "1/9", value: 7, label: "Jan 9, 2024" },
            { date: "1/16", value: 7, label: "Jan 16, 2024" },
            { date: "1/23", value: 8, label: "Jan 23, 2024" },
            { date: "1/30", value: 7, label: "Jan 30, 2024" },
            { date: "2/6", value: 8, label: "Feb 6, 2024" },
            { date: "2/13", value: 8, label: "Feb 13, 2024" },
            { date: "2/18", value: 8, label: "Feb 18, 2024 (Today)" }
          ],
          unit: "/10",
          color: "#ab2973",
          yAxisDomain: [0, 10] as [number, number],
          xAxisTicks: ["11/20", "12/4", "12/18", "1/2", "1/16", "1/30", "2/13"]
        },
        {
          title: "Right Knee Range of Motion (Flexion)",
          section: "Physical Exam (Last Visit)",
          data: [
            { date: "11/20", value: 120, label: "Nov 20, 2023" },
            { date: "11/27", value: 118, label: "Nov 27, 2023" },
            { date: "12/4", value: 117, label: "Dec 4, 2023" },
            { date: "12/11", value: 116, label: "Dec 11, 2023" },
            { date: "12/18", value: 115, label: "Dec 18, 2023" },
            { date: "12/26", value: 114, label: "Dec 26, 2023" },
            { date: "1/2", value: 113, label: "Jan 2, 2024" },
            { date: "1/9", value: 112, label: "Jan 9, 2024" },
            { date: "1/16", value: 110, label: "Jan 16, 2024" },
            { date: "1/23", value: 109, label: "Jan 23, 2024" },
            { date: "1/30", value: 108, label: "Jan 30, 2024" },
            { date: "2/6", value: 107, label: "Feb 6, 2024" },
            { date: "2/13", value: 106, label: "Feb 13, 2024" },
            { date: "2/18", value: 105, label: "Feb 18, 2024 (Today)" }
          ],
          unit: "°",
          color: "#1132ee",
          yAxisDomain: [0, 140] as [number, number],
          referenceRange: { min: 130, max: 140, label: "Normal", color: "#2f6a32" },
          xAxisTicks: ["11/20", "12/4", "12/18", "1/2", "1/16", "1/30", "2/13"]
        }
      ]
    },
    { 
      name: "Robert Chen", 
      age: 58, 
      gender: "M", 
      time: "9:30 am", 
      status: "In Queue", 
      chiefComplaint: "Right Shoulder Post-Op",
      atAGlance: [
        "6 weeks post-op right rotator cuff repair; good early healing; ROM progressing per protocol; minimal pain.",
        "Next step → advance PT to active ROM; discuss return to work timeline; confirm healing on exam."
      ],
      details: [
        "6-week post-op visit - rotator cuff repair",
        "S/P R shoulder RC repair (supraspinatus, infraspinatus) / HTN"
      ],
      sections: {
        "Last Visit Summary": [
          "Patient underwent arthroscopic rotator cuff repair on January 3rd. {{1}}",
          "Intraoperative findings showed large full-thickness tear of supraspinatus (2.5cm) and partial-thickness tear of infraspinatus. {{2}}",
          "Repaired with double-row technique using 4 anchors. {{3}}",
          "Surgery uncomplicated, placed in sling with abduction pillow. {{17}}",
          "Started on pain medications and instructed on pendulum exercises only for first 2 weeks. {{4}}",
          "PT to begin at 2 weeks post-op, follow-up scheduled for 6 weeks. {{18}}"
        ],
        "Surgical Details": [
          "Procedure: Arthroscopic rotator cuff repair (1/3/24) {{19}}",
          "Tears: Supraspinatus (2.5cm full-thickness), infraspinatus (partial) {{20}}",
          "Repair: Double-row technique, 4 suture anchors {{21}}",
          "No complications intraoperatively {{22}}"
        ],
        "Current Symptoms": [
          "Pain 2/10 at rest, 4/10 with PT exercises {{5}}",
          "Sleeping better - able to lie on left side {{23}}",
          "Sling discontinued 2 weeks ago per PT {{6}}",
          "No numbness, tingling, or signs of infection {{7}}"
        ],
        "Physical Therapy Progress": [
          "PT started week 2 - passive ROM protocol {{8}}",
          "Current ROM: Forward flexion 110°, abduction 80° (passive) {{9}}",
          "No active ROM yet - per protocol {{24}}",
          "Scapular strengthening exercises initiated {{25}}"
        ],
        "Physical Exam (Last Visit)": [
          "Incisions well-healed, no erythema or drainage {{10}}",
          "Minimal shoulder effusion {{26}}",
          "Supraspinatus strength: not tested (too early) {{11}}",
          "Neurovascular intact - axillary nerve function preserved {{27}}"
        ],
        "Current Medications": [
          "Tramadol 50mg Q6H PRN (rarely using now) {{12}}",
          "Lisinopril 10mg daily (HTN) {{13}}",
          "Tylenol 1000mg TID with PT {{14}}"
        ],
        "Return to Work": [
          "Occupation: Software engineer (desk job) {{15}}",
          "Currently out of work - can type but limited by positioning {{28}}",
          "Interested in return to work timeline {{16}}"
        ]
      },
      citations: [
        { number: 1, citedText: "procedure and outcome", quote: "Operative Report - January 3, 2024. Procedure: Arthroscopic rotator cuff repair, right shoulder. Surgery uncomplicated. No complications noted intraoperatively.", source: "Jan 3, Operative report, Athena" },
        { number: 2, citedText: "tear characteristics", quote: "Intraoperative findings: Large full-thickness tear of supraspinatus tendon measuring 2.5cm in anteroposterior dimension. Infraspinatus with high-grade partial-thickness articular-side tear (>50% thickness).", source: "Jan 3, Operative report, Athena" },
        { number: 3, citedText: "repair technique", quote: "Rotator cuff repaired using double-row technique with medial row of two anchors and lateral row of two anchors. Excellent tissue quality, repair under minimal tension.", source: "Jan 3, Operative report, Athena" },
        { number: 4, citedText: "post-op plan", quote: "Postoperative Plan: Sling immobilization with abduction pillow x 6 weeks. Pendulum exercises only for first 2 weeks. Physical therapy to begin week 2 for passive ROM. Follow-up in 6 weeks.", source: "Jan 3, Operative report, Athena" },
        { number: 5, citedText: "current pain", quote: "Pain level: 2/10 at rest, increases to 4/10 during physical therapy exercises. Reports significant improvement from immediate post-operative period. Sleep quality improved, able to lie on contralateral side without waking.", source: "Feb 12, Intake form, Ambient" },
        { number: 6, citedText: "sling use", quote: "Sling discontinued approximately 2 weeks ago per physical therapy recommendations. Patient reports feeling more comfortable without sling at this point.", source: "Feb 12, Intake form, Ambient" },
        { number: 7, citedText: "complications screening", quote: "No numbness or tingling in right arm or hand. No signs of infection - incisions well-healed without erythema, warmth, or drainage. No fever or chills.", source: "Feb 12, Intake form, Ambient" },
        { number: 8, citedText: "PT protocol", quote: "Physical therapy initiated at 2 weeks post-operative per protocol. Current phase: Passive range of motion exercises including pulleys, wand exercises, and therapist-assisted stretching. Scapular stabilization exercises initiated. No active ROM permitted until cleared by surgeon. Attending PT 3x per week.", source: "Feb 5, PT progress note, Athena" },
        { number: 9, citedText: "ROM measurements", quote: "Range of motion assessment (passive): Forward flexion 110 degrees, abduction 80 degrees, external rotation 30 degrees, internal rotation limited to sacrum. Measurements taken with patient supine to ensure true passive motion.", source: "Feb 5, PT progress note, Athena" },
        { number: 10, citedText: "incision healing", quote: "Inspection of surgical incisions: All portal sites well-healed with minimal scarring. No erythema, no drainage, no warmth. Very mild effusion of glenohumeral joint, expected at this timepoint.", source: "Jan 17, 2-week post-op visit, Athena" },
        { number: 11, citedText: "strength and neuro", quote: "Strength testing deferred at this early timepoint to protect repair. Neurovascular examination: Axillary nerve function intact (deltoid sensation preserved), radial/median/ulnar nerves intact. Capillary refill <2 seconds, radial pulse 2+.", source: "Jan 17, 2-week post-op visit, Athena" },
        { number: 12, citedText: "tramadol use", quote: "Current pain management: Tramadol 50mg every 6 hours as needed. Patient reports using only 1-2 tablets per day, primarily before physical therapy sessions.", source: "Feb 12, Intake form, Ambient" },
        { number: 13, citedText: "blood pressure medication", quote: "Hypertension managed with lisinopril 10mg daily, blood pressure well-controlled", source: "Dec 15, 2023, PCP visit, Athena" },
        { number: 14, citedText: "acetaminophen", quote: "Acetaminophen 1000mg three times daily, taken regularly with physical therapy sessions for pain control", source: "Feb 12, Intake form, Ambient" },
        { number: 15, citedText: "occupation", quote: "Occupation: Software engineer, primarily desk work involving computer use. Currently on medical leave.", source: "Dec 20, 2023, Pre-operative visit, Athena" },
        { number: 16, citedText: "work concerns", quote: "Patient inquiring about timeline for return to work. Reports he can type with right hand but positioning at desk is uncomfortable. Employer requesting return-to-work note with restrictions if applicable.", source: "Feb 12, Intake form, Ambient" },
        { number: 17, citedText: "Surgery uncomplicated", quote: "Surgery uncomplicated. No complications noted intraoperatively.", source: "Jan 3, Operative report, Athena" },
        { number: 18, citedText: "PT to begin at 2 weeks", quote: "Physical therapy to begin week 2 for passive ROM. Follow-up in 6 weeks.", source: "Jan 3, Operative report, Athena" },
        { number: 19, citedText: "Arthroscopic rotator cuff repair", quote: "Procedure: Arthroscopic rotator cuff repair, right shoulder. Date: January 3, 2024", source: "Jan 3, Operative report, Athena" },
        { number: 20, citedText: "Tears details", quote: "Supraspinatus (2.5cm full-thickness tear), infraspinatus (high-grade partial-thickness tear >50%)", source: "Jan 3, Operative report, Athena" },
        { number: 21, citedText: "Double-row technique", quote: "Repair: Double-row technique, 4 suture anchors (2 medial row, 2 lateral row)", source: "Jan 3, Operative report, Athena" },
        { number: 22, citedText: "No complications", quote: "No complications intraoperatively", source: "Jan 3, Operative report, Athena" },
        { number: 23, citedText: "Sleeping better", quote: "Sleep quality improved, able to lie on contralateral side without waking", source: "Feb 12, Intake form, Ambient" },
        { number: 24, citedText: "No active ROM yet", quote: "No active ROM permitted until cleared by surgeon", source: "Feb 5, PT progress note, Athena" },
        { number: 25, citedText: "Scapular strengthening", quote: "Scapular stabilization exercises initiated", source: "Feb 5, PT progress note, Athena" },
        { number: 26, citedText: "Minimal effusion", quote: "Very mild effusion of glenohumeral joint, expected at this timepoint", source: "Jan 17, 2-week post-op visit, Athena" },
        { number: 27, citedText: "Neurovascular intact", quote: "Axillary nerve function intact (deltoid sensation preserved), radial/median/ulnar nerves intact", source: "Jan 17, 2-week post-op visit, Athena" },
        { number: 28, citedText: "limited by positioning", quote: "Can type with right hand but positioning at desk is uncomfortable", source: "Feb 12, Intake form, Ambient" }
      ],
      dataSources: [
        "Feb 12, Today's visit, Ambient",
        "Feb 12, Intake form, Ambient",
        "Feb 5, PT progress note, Athena",
        "Jan 17, 2-week post-op visit, Athena",
        "Jan 3, Operative report, Athena",
        "Dec 20, 2023, Pre-operative visit, Athena",
        "Dec 15, 2023, PCP visit, Athena"
      ],
      careNudges: [
        {
          type: "PT Progression",
          description: "Advance to active-assisted ROM - patient at 6 weeks, progressing well per protocol.",
          highlightId: "robert-physical-therapy-progress-1"
        },
        {
          type: "Return to Work",
          description: "Clear for modified duty desk work - can return with restrictions (no lifting, reaching).",
          highlightId: "robert-return-to-work-1"
        },
        {
          type: "Pain Management",
          description: "Wean off tramadol - pain well-controlled with minimal narcotic use.",
          highlightId: "robert-current-symptoms-0"
        }
      ],
      trends: [
        {
          title: "Pain Score (0-10)",
          section: "Current Symptoms",
          data: [
            { date: "1/7", value: 8, label: "Jan 7 (Week 1 Post-Op)" },
            { date: "1/14", value: 7, label: "Jan 14" },
            { date: "1/21", value: 6, label: "Jan 21 (Week 2)" },
            { date: "1/28", value: 5, label: "Jan 28 (Week 3)" },
            { date: "2/4", value: 4, label: "Feb 4 (Week 4)" },
            { date: "2/11", value: 3, label: "Feb 11 (Week 5)" },
            { date: "2/18", value: 2, label: "Feb 18 (Week 6, Today)" }
          ],
          unit: "/10",
          color: "#ab2973",
          yAxisDomain: [0, 10] as [number, number],
          xAxisTicks: ["1/7", "1/21", "2/4", "2/18"]
        },
        {
          title: "Passive Forward Flexion",
          section: "Physical Therapy Progress",
          data: [
            { date: "1/14", value: 50, label: "Jan 14 (Week 2)" },
            { date: "1/21", value: 60, label: "Jan 21" },
            { date: "1/28", value: 75, label: "Jan 28 (Week 3)" },
            { date: "2/4", value: 90, label: "Feb 4 (Week 4)" },
            { date: "2/11", value: 100, label: "Feb 11 (Week 5)" },
            { date: "2/18", value: 110, label: "Feb 18 (Week 6, Today)" }
          ],
          unit: "°",
          color: "#1132ee",
          yAxisDomain: [0, 180] as [number, number],
          referenceRange: { min: 150, max: 180, label: "Normal", color: "#2f6a32" },
          xAxisTicks: ["1/14", "1/28", "2/11"]
        },
        {
          title: "Passive Abduction",
          section: "Physical Therapy Progress",
          data: [
            { date: "1/14", value: 40, label: "Jan 14 (Week 2)" },
            { date: "1/21", value: 45, label: "Jan 21" },
            { date: "1/28", value: 55, label: "Jan 28 (Week 3)" },
            { date: "2/4", value: 65, label: "Feb 4 (Week 4)" },
            { date: "2/11", value: 72, label: "Feb 11 (Week 5)" },
            { date: "2/18", value: 80, label: "Feb 18 (Week 6, Today)" }
          ],
          unit: "°",
          color: "#7246b5",
          yAxisDomain: [0, 180] as [number, number],
          referenceRange: { min: 150, max: 180, label: "Normal", color: "#2f6a32" },
          xAxisTicks: ["1/14", "1/28", "2/11"]
        }
      ]
    },
    { 
      name: "Maria Garcia", 
      age: 35, 
      gender: "F", 
      time: "10:00 am", 
      status: "In Queue", 
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
        "Last Visit Summary": [
          "Patient established care 6 months ago for annual wellness visit. {{1}}",
          "Physical exam was unremarkable, no chronic medical conditions identified. {{2}}",
          "Vitals were within normal limits, patient reported regular exercise and healthy diet. {{3}}",
          "Counseled on preventive care and scheduled follow-up in 12 months. {{4}}"
        ],
        "Pain Characteristics": [
          "Sharp, localized to lower lumbar region (L4-L5 area) {{5}}",
          "Pain 7/10 at worst, improves with rest {{6}}",
          "No radiation to legs; no numbness or tingling {{7}}"
        ],
        "Mechanism": [
          "Started after helping move furniture 4 days ago {{8}}",
          "Gradual onset, worsened over 24 hours {{9}}"
        ],
        "Red Flags": [
          "No fever, no bowel/bladder dysfunction {{10}}",
          "No trauma, no night pain {{11}}",
          "No history of cancer or recent weight loss {{12}}"
        ],
        "Physical Exam": [
          "Normal gait; negative straight leg raise bilaterally {{13}}",
          "Tenderness over paraspinal muscles L3-L5 {{14}}",
          "Full ROM with mild discomfort; no neurological deficits {{15}}"
        ],
        "Vitals": [
          "BP 118/72; HR 76; Temp 98.4°F {{16}}",
          "No signs of systemic illness {{17}}"
        ],
        "Current Medications": [
          "None (takes occasional ibuprofen OTC) {{18}}"
        ],
        "Treatment Plan": [
          "Conservative management indicated - no red flags present {{19}}",
          "Physical therapy referral recommended for core strengthening {{20}}",
          "Follow-up in 2 weeks if no improvement {{21}}"
        ]
      },
      citations: [
        { number: 1, citedText: "wellness visit", quote: "Annual wellness visit - August 10, 2023. Chief Complaint: Routine health maintenance.", source: "Aug 10, 2023, Annual wellness visit, Athena" },
        { number: 2, citedText: "exam findings", quote: "Physical Examination: General: Well-appearing, no acute distress. No chronic medical conditions identified.", source: "Aug 10, 2023, Annual wellness visit, Athena" },
        { number: 3, citedText: "vitals and lifestyle", quote: "Vitals: BP 120/75, HR 72, Temp 98.6°F. Patient reports regular exercise and maintains healthy diet.", source: "Aug 10, 2023, Annual wellness visit, Athena" },
        { number: 4, citedText: "preventive counseling", quote: "Counseled on age-appropriate health maintenance. Follow-up scheduled in 12 months.", source: "Aug 10, 2023, Annual wellness visit, Athena" },
        { number: 5, citedText: "pain location", quote: "Sharp pain localized to lower lumbar region, L4-L5 area", source: "Feb 12, Intake form, Ambient" },
        { number: 6, citedText: "pain severity", quote: "Pain severity 7/10 at worst, improves with rest", source: "Feb 12, Intake form, Ambient" },
        { number: 7, citedText: "radiation", quote: "No radiation to legs, no numbness or tingling", source: "Feb 12, Intake form, Ambient" },
        { number: 8, citedText: "onset", quote: "Started after helping son move furniture 4 days ago", source: "Feb 12, Intake form, Ambient" },
        { number: 9, citedText: "progression", quote: "Gradual onset, pain worsened over first 24 hours", source: "Feb 12, Intake form, Ambient" },
        { number: 10, citedText: "constitutional", quote: "No fever, no bowel/bladder dysfunction", source: "Feb 12, Intake form, Ambient" },
        { number: 11, citedText: "trauma and night pain", quote: "No trauma, no night pain", source: "Feb 12, Intake form, Ambient" },
        { number: 12, citedText: "oncologic history", quote: "No history of cancer or recent weight loss", source: "Feb 12, Intake form, Ambient" },
        { number: 13, citedText: "gait and SLR", quote: "Normal gait, negative straight leg raise test bilaterally", source: "Feb 12, Today's visit, Ambient" },
        { number: 14, citedText: "tenderness", quote: "Tenderness over paraspinal muscles L3-L5", source: "Feb 12, Today's visit, Ambient" },
        { number: 15, citedText: "ROM and neuro", quote: "Full range of motion with mild discomfort, no neurological deficits", source: "Feb 12, Today's visit, Ambient" },
        { number: 16, citedText: "vitals", quote: "BP 118/72, HR 76, Temp 98.4°F", source: "Feb 12, Today's visit, Ambient" },
        { number: 17, citedText: "general appearance", quote: "Well-appearing, no acute distress, no signs of systemic illness", source: "Feb 12, Today's visit, Ambient" },
        { number: 18, citedText: "medications", quote: "Current medications: None. Takes occasional ibuprofen OTC as needed.", source: "Feb 12, Intake form, Ambient" },
        { number: 19, citedText: "no red flags", quote: "Assessment: Acute mechanical low back pain, no red flags present", source: "Feb 12, Today's visit, Ambient" },
        { number: 20, citedText: "PT referral", quote: "Physical therapy referral for core strengthening and body mechanics education", source: "Feb 12, Today's visit, Ambient" },
        { number: 21, citedText: "follow-up", quote: "Follow-up in 2 weeks if no improvement or if symptoms worsen", source: "Feb 12, Today's visit, Ambient" }
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
      ],
      trends: [
        {
          title: "Pain Score (0-10)",
          section: "Current Symptoms",
          data: [
            { date: "2/15", value: 4, label: "Feb 15 (Onset)" },
            { date: "2/16", value: 6, label: "Feb 16" },
            { date: "2/17", value: 7, label: "Feb 17" },
            { date: "2/18", value: 7, label: "Feb 18 (Today)" }
          ],
          unit: "/10",
          color: "#ab2973",
          yAxisDomain: [0, 10] as [number, number],
          xAxisTicks: ["2/15", "2/16", "2/17", "2/18"]
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
        "Last Visit Summary": [
          "Patient presented in January 2024 for annual wellness visit. {{1}}",
          "Hypertension continues to be well-controlled on lisinopril 20mg daily, BP was 126/76. {{2}}",
          "Patient quit smoking in 2020 and has maintained tobacco-free status. {{3}}",
          "Discussed importance of age-appropriate health screenings. {{4}}",
          "Patient remains active with regular walking, plan was to schedule colonoscopy. {{5}}"
        ],
        "Preventive Care Due": [
          "Colonoscopy (age 55 - first screening due) {{6}}",
          "Lipid panel (last checked 2 years ago) {{7}}",
          "Consider PSA discussion {{8}}"
        ],
        "Current Medications": [
          "Lisinopril 20mg daily {{9}}",
          "Aspirin 81mg daily {{10}}"
        ],
        "Vitals": [
          "BP 128/78 (well controlled) {{11}}",
          "BMI 28.5 (overweight) {{12}}",
          "Weight stable {{13}}"
        ],
        "Health Maintenance": [
          "Flu vaccine due (fall) {{14}}",
          "Tdap up to date {{15}}",
          "Continue current medications {{16}}"
        ]
      },
      citations: [
        { number: 1, citedText: "wellness visit", quote: "Annual Wellness Visit - January 20, 2024. Chief Complaint: Health maintenance.", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 2, citedText: "BP control", quote: "Hypertension well-controlled on lisinopril 20mg daily. Vitals: BP 126/76, HR 74.", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 3, citedText: "smoking status", quote: "Former smoker, quit in 2020, continues to be tobacco-free. 30 pack-year history.", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 4, citedText: "screening discussion", quote: "Discussed importance of age-appropriate health screenings including colonoscopy.", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 5, citedText: "activity level", quote: "Patient remains physically active with regular walking. Plan to schedule colonoscopy with GI.", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 6, citedText: "colonoscopy", quote: "55-year-old male, due for first-time colorectal cancer screening with colonoscopy per USPSTF guidelines", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 7, citedText: "lipid panel", quote: "Last lipid panel: 01/12/2022 (Total cholesterol 195, LDL 118, HDL 52, TG 125) - repeat due", source: "Jan 12, 2022, Lab results, Athena" },
        { number: 8, citedText: "PSA", quote: "Discuss prostate cancer screening (PSA) - patient age 55, no documented family history", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 9, citedText: "lisinopril", quote: "Lisinopril 20mg daily for hypertension", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 10, citedText: "aspirin", quote: "Aspirin 81mg daily for cardiovascular prevention", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 11, citedText: "blood pressure today", quote: "BP 128/78 mmHg - well controlled on current antihypertensive", source: "Feb 12, Today's visit, Ambient" },
        { number: 12, citedText: "BMI", quote: "Height 5'11\", BMI 28.5 (overweight)", source: "Feb 12, Today's visit, Ambient" },
        { number: 13, citedText: "weight", quote: "Weight 210 lbs, stable compared to last visit", source: "Feb 12, Today's visit, Ambient" },
        { number: 14, citedText: "flu vaccine", quote: "Influenza vaccine due this fall season", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 15, citedText: "Tdap", quote: "Tdap administered 05/2021, up to date", source: "Jan 20, 2024, Annual wellness visit, Athena" },
        { number: 16, citedText: "medication continuation", quote: "Continue current medication regimen: Lisinopril 20mg daily, Aspirin 81mg daily", source: "Jan 20, 2024, Annual wellness visit, Athena" }
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
      status: "In Queue", 
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
        "Last Visit Summary": [
          "Patient presented in January for migraine follow-up after starting propranolol 3 months prior. {{1}}",
          "Reported 3-4 migraine days per month, down from 6-8 before starting preventive therapy. {{2}}",
          "Patient continued to use sumatriptan for acute treatment with good response. {{3}}",
          "Triggers identified include stress, poor sleep, and hormonal fluctuations. {{4}}",
          "Discussed medication adherence and lifestyle modifications, plan was to continue current regimen and reassess in 6 weeks. {{5}}"
        ],
        "Headache Pattern": [
          "4-6 migraine days per month (up from 3-4) {{6}}",
          "Moderate to severe intensity; typically unilateral {{7}}",
          "Associated with photophobia, nausea, occasionally visual aura {{8}}"
        ],
        "Current Medications": [
          "Preventive: Propranolol 80mg daily x 3 months {{9}}",
          "Acute: Sumatriptan 100mg (using 2-3x/week) {{10}}",
          "Sertraline 50mg daily (for anxiety) {{11}}"
        ],
        "Treatment Response": [
          "Limited response to current preventive regimen {{12}}",
          "Frequency increasing despite propranolol {{13}}",
          "Sumatriptan effective but using frequently {{14}}"
        ],
        "Triggers": [
          "Stress, poor sleep, skipping meals {{15}}",
          "Hormonal fluctuation (perimenstrual) {{16}}",
          "Bright lights, strong odors {{17}}"
        ],
        "Vitals": [
          "BP 108/70; HR 58 (on beta-blocker) {{18}}",
          "Weight stable {{19}}"
        ],
        "Impact": [
          "Missing work 1-2 days per month {{20}}",
          "Significant effect on quality of life {{21}}",
          "Patient interested in more effective prevention {{22}}"
        ]
      },
      citations: [
        { number: 1, citedText: "follow-up visit", quote: "Follow-up Visit - January 30, 2024. Chief Complaint: Migraine follow-up.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 2, citedText: "frequency improvement", quote: "Reports migraine frequency 3-4 days/month, down from baseline 6-8 days/month prior to starting preventive therapy.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 3, citedText: "acute treatment", quote: "Uses sumatriptan 100mg for acute treatment with good response.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 4, citedText: "trigger identification", quote: "Known triggers: stress, poor sleep quality, hormonal fluctuations.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 5, citedText: "plan continuation", quote: "Discussed medication adherence and lifestyle modifications including regular sleep schedule, stress management. Reassess in 6 weeks.", source: "Jan 30, Follow-up visit, Ambient" },
        { number: 6, citedText: "frequency today", quote: "Migraine frequency increased to 4-6 days/month (was 3-4 at last visit)", source: "Feb 12, Today's visit, Ambient" },
        { number: 7, citedText: "intensity", quote: "Moderate to severe intensity, typically unilateral", source: "Feb 12, Today's visit, Ambient" },
        { number: 8, citedText: "associated symptoms", quote: "Associated with photophobia, nausea, occasionally visual aura", source: "Feb 12, Today's visit, Ambient" },
        { number: 9, citedText: "propranolol", quote: "Started preventive therapy: Propranolol 80mg daily. Follow up in 3 months to assess response.", source: "Oct 15, 2023, Neurology consult, Athena" },
        { number: 10, citedText: "sumatriptan use", quote: "Sumatriptan 100mg PRN. Patient using 2-3x/week.", source: "Feb 12, Today's visit, Ambient" },
        { number: 11, citedText: "sertraline", quote: "Continue Sertraline 50mg daily for comorbid anxiety disorder", source: "Oct 15, 2023, Neurology consult, Athena" },
        { number: 12, citedText: "treatment response", quote: "Limited response to propranolol after 3 months of therapy", source: "Feb 12, Today's visit, Ambient" },
        { number: 13, citedText: "frequency worsening", quote: "Migraine frequency increasing despite propranolol preventive therapy", source: "Feb 12, Today's visit, Ambient" },
        { number: 14, citedText: "sumatriptan effectiveness", quote: "Sumatriptan effective for acute treatment but frequent use approaching medication overuse threshold.", source: "Feb 12, Today's visit, Ambient" },
        { number: 15, citedText: "behavioral triggers", quote: "Triggers: stress, poor sleep, skipping meals", source: "Feb 12, Intake form, Ambient" },
        { number: 16, citedText: "hormonal triggers", quote: "Hormonal fluctuation (perimenstrual) noted as trigger", source: "Feb 12, Intake form, Ambient" },
        { number: 17, citedText: "environmental triggers", quote: "Environmental triggers: bright lights, strong odors", source: "Feb 12, Intake form, Ambient" },
        { number: 18, citedText: "vital signs", quote: "BP 108/70 mmHg, HR 58 bpm (bradycardia on beta-blocker)", source: "Feb 12, Today's visit, Ambient" },
        { number: 19, citedText: "weight", quote: "Weight 135 lbs (stable from previous visits)", source: "Feb 12, Today's visit, Ambient" },
        { number: 20, citedText: "work impact", quote: "Missing work 1-2 days per month due to migraines.", source: "Feb 12, Intake form, Ambient" },
        { number: 21, citedText: "QOL impact", quote: "Significant effect on quality of life reported.", source: "Feb 12, Intake form, Ambient" },
        { number: 22, citedText: "patient goals", quote: "Patient expresses strong interest in more effective prevention.", source: "Feb 12, Intake form, Ambient" }
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

  const scribesByDate = [
    {
      date: "Thu, Dec 19 (Today)",
      scribes: [
        { name: "Maria Garcia", age: 35, gender: "F", duration: "18m 45s" },
        { name: "Robert Chen", age: 58, gender: "M", duration: "22m 15s" },
        { name: "Lisa Anderson", age: 28, gender: "F", duration: "19m 30s" },
      ]
    },
    {
      date: "Wed, Dec 18",
      scribes: [
        { name: "Sarah Johnson", age: 42, gender: "F", duration: "21m 33s" },
        { name: "James Wilson", age: 55, gender: "M", duration: "26m 08s" },
      ]
    }
  ];

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
    
    // Subjective: Chief complaint + HPI from previsit data
    let subjective = `Chief Complaint: ${patient.chiefComplaint}\n\n`;
    subjective += `History of Present Illness:\n`;
    
    // Generate HPI from atAGlance and details (skip "Next step" items)
    const hpiItems = patient.atAGlance.filter(item => !item.startsWith('Next step'));
    hpiItems.forEach((item, idx) => {
      // Find all citations that match text in this item
      const matchingCitations = patient.citations
        ?.filter(c => item.toLowerCase().includes(c.citedText.toLowerCase()))
        .sort((a, b) => {
          // Sort by position in text
          const aPos = item.toLowerCase().indexOf(a.citedText.toLowerCase());
          const bPos = item.toLowerCase().indexOf(b.citedText.toLowerCase());
          return aPos - bPos;
        });
      
      if (matchingCitations && matchingCitations.length > 0) {
        // Insert citations right after their referenced text
        let modifiedItem = item;
        let offset = 0;
        
        matchingCitations.forEach(citation => {
          const citedTextLower = citation.citedText.toLowerCase();
          const itemLower = modifiedItem.toLowerCase();
          const index = itemLower.indexOf(citedTextLower, offset);
          
          if (index !== -1) {
            const insertPos = index + citation.citedText.length;
            modifiedItem = modifiedItem.slice(0, insertPos) + ` {{${citation.number}}}` + modifiedItem.slice(insertPos);
            offset = insertPos + ` {{${citation.number}}}`.length;
          }
        });
        
        subjective += modifiedItem;
      } else {
        subjective += item;
      }
      subjective += ' ';
    });
    
    // Add medical history with citations
    if (patient.sections['Medical History']) {
      subjective += `\n\nPast Medical History: `;
      const historyItems = patient.sections['Medical History'];
      historyItems.forEach((item, idx) => {
        // Already has citation markers embedded, just use as-is
        subjective += item;
        
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
        // Already has citation markers embedded, just use as-is
        subjective += item;
        
        if (idx < medItems.length - 1) {
          subjective += '; ';
        }
      });
    }
    
    // Objective: Vitals + ROS/PE
    let objective = '';
    if (patient.sections['Vitals']) {
      objective += `Vitals:\n`;
      patient.sections['Vitals'].forEach((item, idx) => {
        // Already has citation markers embedded, just use as-is
        objective += `${item}\n`;
      });
      objective += `\n`;
    }
    objective += `Review of Systems:\n\n`;
    objective += `Physical Examination:`;
    
    // Assessment: Generate preliminary assessment based on chief complaint
    let assessment = '';
    const cc = patient.chiefComplaint.toLowerCase();
    if (cc.includes('diabetes')) {
      assessment = `Type 2 diabetes mellitus, suboptimal control. Will assess glycemic control and screen for complications.`;
    } else if (cc.includes('back pain')) {
      assessment = `Acute lower back pain. Will assess for red flag symptoms and determine need for imaging.`;
    } else if (cc.includes('heart failure')) {
      assessment = `Chronic systolic heart failure. Will review volume status and medication adherence.`;
    } else if (cc.includes('migraine') || cc.includes('headache')) {
      assessment = `Migraine without aura, chronic. Will assess treatment response and consider preventive therapy adjustment.`;
    } else if (cc.includes('wellness') || cc.includes('preventive')) {
      assessment = `Annual wellness visit. Will address preventive care and health maintenance.`;
    } else {
      assessment = `${patient.chiefComplaint}. Will complete history and physical examination.`;
    }
    
    // Plan: Generate based on care nudges and common actions
    let plan = '';
    if (patient.careNudges && patient.careNudges.length > 0) {
      plan += `Considerations:\n`;
      patient.careNudges.forEach((nudge, idx) => {
        plan += `- ${nudge.description}\n`;
      });
      plan += `\n`;
    }
    plan += `Additional management to be determined based on today's evaluation.`;
    
    return { subjective, objective, assessment, plan };
  };

  // Helper function to render prechart text with citations (sentence-based like Scribes)
  const renderPrechartTextWithCitations = (text: string) => {
    const patient = patients[selectedPatientIndex];
    const citations = patient.citations || [];
    
    // Split into sentences/clauses - handle periods, semicolons, and newlines as boundaries
    const sentences: Array<{text: string, start: number, end: number}> = [];
    const sentenceRegex = /[^.!?;\n]+[.!?;\n]+/g;
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
        activeCitation?.id === `prechart-${c.number}`
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
        const citation = citations.find(c => c.number === citationNum);
        const citationId = `prechart-${citationNum}`;
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
              citationCloseTimeoutRef.current = window.setTimeout(() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }, 100);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (citation) {
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

  // Helper function to render text with citation badges (sentence-based highlighting like Scribes)
  const renderTextWithCitations = (text: string, citationsData: any[], contextId: string = 'previsit') => {
    // For short text (like list items), treat the whole thing as one sentence
    // Otherwise split into proper sentences
    const sentences: Array<{text: string, start: number, end: number}> = [];
    
    if (text.length < 300 || !text.match(/[.!?]\s/)) {
      // Short text or no sentence breaks - treat as single unit
      sentences.push({ text: text, start: 0, end: text.length });
    } else {
      // Split into sentences for longer text
      const sentenceRegex = /[^.!?\n]+[.!?\n]+/g;
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
      
      // Add any remaining text
      if (lastEnd < text.length) {
        sentences.push({
          text: text.slice(lastEnd),
          start: lastEnd,
          end: text.length
        });
      }
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
              citationCloseTimeoutRef.current = window.setTimeout(() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }, 100);
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (citation) {
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

  // Helper to render chat messages with sentence highlighting
  const renderChatMessageWithCitations = (text: string, citationsData: any[], contextId: string) => {
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
              if (citation) {
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
      onNavigateToVisits={() => {
        setCurrentView('visits');
        setSelectedPatientForScribe(null);
      }} 
      chatMessages={chatMessages}
      setChatMessages={setChatMessages}
      rightTab={rightTab}
      setRightTab={setRightTab}
      patients={patients}
      selectedPatientName={selectedPatientForScribe}
      isSecondaryNavCollapsed={isSecondaryNavCollapsed}
      setIsSecondaryNavCollapsed={setIsSecondaryNavCollapsed}
      isLogoHovered={isLogoHovered}
      setIsLogoHovered={setIsLogoHovered}
      logoTooltipPosition={logoTooltipPosition}
      setLogoTooltipPosition={setLogoTooltipPosition}
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
                    setHoveredPrimaryNav('visits');
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
                    setHoveredPrimaryNav(hoveredPrimaryNav === 'visits' ? null : 'visits');
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
              {/* Visits - Selected */}
              <button 
                className="content-stretch flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
              >
                <div className="bg-[var(--nav-button,rgba(17,50,238,0.12))] content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] text-[color:var(--text-brand,#1132ee)]">
                  <InlineIcon name="stethoscope" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-brand,#1132ee)] tracking-[-0.36px]">
                  Visits
                </p>
              </button>
              
              {/* Scribes */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onClick={() => {
                  setCurrentView('scribes');
                  if (isSecondaryNavCollapsed) {
                    clearNavHoverDelay();
                    setHoveredPrimaryNav('scribes');
                  }
                }}
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
              >
                <div className="content-stretch flex flex-col items-center justify-center relative rounded-[6px] shrink-0 size-[36px] group-hover:bg-[var(--surface-3,#e6e6e6)] transition-colors text-[color:var(--text-subheading,#666)]">
                  <InlineIcon name="magic_document" size={20} />
                </div>
                <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] text-[color:var(--text-subheading,#666)] text-left tracking-[-0.36px]">
                  Scribes
                </p>
              </button>
              
              {/* Customize */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('customize')}
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
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
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
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
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('visits')}
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
                  setHoveredPrimaryNav('visits');
                }
              }}
            />
            
            {/* Footer */}
            <div 
              className="content-stretch flex flex-col gap-[8px] items-center pb-[24px] pt-[16px] relative shrink-0 w-full"
              onMouseEnter={() => {
                if (isSecondaryNavCollapsed) {
                  clearNavHoverDelay();
                  setHoveredPrimaryNav('visits');
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
        
        {/* Patient List */}
        {!isSecondaryNavCollapsed && (
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
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                {patients.map((patient, index) => (
                  <PatientListItem 
                    key={index} 
                    {...patient} 
                    isSelected={index === selectedPatientIndex}
                    onClick={() => {
                      // If patient has a generated scribe, navigate to scribes
                      if (patient.status === "Generated") {
                        setSelectedPatientForScribe(patient.name);
                        setCurrentView('scribes');
                      } else {
                        setSelectedPatientIndex(index);
                      }
                    }}
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
        )}
      </div>
      
      {/* Overlay Secondary Nav when collapsed */}
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
                  isSelected={index === selectedPatientIndex}
                  onClick={() => {
                    // If patient has a generated scribe, navigate to scribes
                    if (patient.status === "Generated") {
                      setSelectedPatientForScribe(patient.name);
                      setCurrentView('scribes');
                      if (isSecondaryNavCollapsed) {
                        clearNavHoverDelay();
                        setHoveredPrimaryNav('scribes');
                      }
                    } else {
                      setSelectedPatientIndex(index);
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
                          isSelected={false}
                          onClick={() => {
                            setCurrentView('scribes');
                            if (isSecondaryNavCollapsed) {
                              clearNavHoverDelay();
                              setHoveredPrimaryNav('scribes');
                            }
                          }}
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
      <div className="content-stretch flex flex-[1_0_0] flex-col h-full min-h-px min-w-px relative">
        <div className="content-stretch flex flex-[1_0_0] flex-col min-h-px min-w-px relative w-full">
          {/* Header */}
          <div className="content-stretch flex flex-col gap-[6px] py-[8px] relative shrink-0 w-full">
            <div className="content-stretch flex justify-center w-full">
              <div className="content-stretch flex flex-col gap-[6px] max-w-[800px] relative w-full px-[20px]">
                <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
                  <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[24px] text-[color:var(--text-default,black)]">
                    {patients[selectedPatientIndex].name}
                  </p>
                </div>
                
                {/* Patient Info */}
                <div className="content-stretch flex font-['Lato',sans-serif] gap-[4px] items-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px] whitespace-nowrap">
                  <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-ellipsis"><p className="leading-[1.4] overflow-hidden">{patients[selectedPatientIndex].chiefComplaint}</p></div>
                  <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
                  <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{patients[selectedPatientIndex].age}</p></div>
                  <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
                  <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{patients[selectedPatientIndex].gender}</p></div>
                </div>
                
                {/* Tabs */}
                <div className="w-full">
                  <Tabs
                    variant="primary"
                    tabs={[
                      { id: 'previsit', label: 'Previsit' },
                      { id: 'note', label: 'Prechart' }
                    ]}
                    defaultTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as 'previsit' | 'note')}
                    hideBorder={false}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content - Scrollable */}
          <div className="scrollable-content content-stretch flex flex-col items-center relative w-full overflow-y-auto flex-1 min-h-0">
            <div className="content-stretch flex flex-col items-start max-w-[800px] px-[20px] relative w-full">
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
            
            {/* Visit Context Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                <p className="leading-[1.2]">Visit Context</p>
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
              
              // Find charts for this section
              const sectionCharts = patients[selectedPatientIndex].trends?.filter(
                (trend: any) => trend.section === sectionTitle
              ) || [];
              
              return (
                <div key={sectionTitle} className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
                  <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                    <p className="leading-[1.2]">{sectionTitle}</p>
                  </div>
                  
                  {/* Render charts if any exist for this section */}
                  {sectionCharts.length > 0 && (
                    <div className="content-stretch grid grid-cols-1 gap-[12px] items-start relative shrink-0 w-full mt-[8px] mb-[8px]">
                      {sectionCharts.map((trend: any, idx: number) => (
                        <TrendChart
                          key={idx}
                          title={trend.title}
                          data={trend.data}
                          unit={trend.unit}
                          color={trend.color}
                          yAxisDomain={trend.yAxisDomain}
                          xAxisTicks={trend.xAxisTicks}
                          referenceRange={trend.referenceRange}
                        />
                      ))}
                    </div>
                  )}
                  
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
                                {renderTextWithCitations(item, patients[selectedPatientIndex].citations || [], 'previsit')}
                              </mark>
                            ) : (
                              <span className="leading-[1.4]">
                                {renderTextWithCitations(item, patients[selectedPatientIndex].citations || [], 'previsit')}
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
          </div>
          
          {/* Bottom Action Bar */}
          <div className="bg-[var(--surface-base,white)] content-stretch flex justify-center pb-[24px] pt-[8px] relative shrink-0 w-full">
            <div className="content-stretch flex items-center max-w-[800px] px-[20px] relative w-full">
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
      </div>

      {/* Citation Tooltip */}
      {activeCitation !== null && tooltipPosition && (() => {
        // Find citation from appropriate context
        let citation = null;
        const contextId = activeCitation.id;
        
        if (contextId.startsWith('previsit-') || contextId.startsWith('prechart-')) {
          citation = (patients[selectedPatientIndex].citations || []).find(c => c.number === activeCitation.number);
        } else if (contextId.startsWith('chat-')) {
          // Find in chat messages
          const messages = chatMessages[patients[selectedPatientIndex].name] || [];
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

        const availableSpaceBelow = window.innerHeight - tooltipPosition.y;
        const tooltipHeight = 120;
        const showAbove = availableSpaceBelow < tooltipHeight + 20;
        
        let topPosition: number;
        let transformValue: string;
        
        if (tooltipPosition.alignLeft) {
          // Position to the left of the badge
          if (showAbove) {
            topPosition = tooltipPosition.y - 8;
            transformValue = 'translate(-100%, -100%)';
          } else {
            topPosition = tooltipPosition.y + 8;
            transformValue = 'translate(-100%, 0)';
          }
        } else {
          // Default center positioning
          if (showAbove) {
            topPosition = tooltipPosition.y - 8;
            transformValue = 'translate(-50%, -100%)';
          } else {
            topPosition = tooltipPosition.y + 8;
            transformValue = 'translate(-50%, 0)';
          }
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
                // Clear any pending close timeout
                if (citationCloseTimeoutRef.current) {
                  clearTimeout(citationCloseTimeoutRef.current);
                  citationCloseTimeoutRef.current = null;
                }
                setActiveCitation(activeCitation);
                setTooltipPosition(tooltipPosition);
              }}
              onMouseLeave={() => {
                setActiveCitation(null);
                setTooltipPosition(null);
              }}
            >
              <p className="font-['Lato',sans-serif] text-[13px] text-[color:var(--text-subheading,#666)] leading-[1.4] italic mb-[8px]" style={{ wordBreak: 'break-word' }}>
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
                  } else if (dataSourceContent[patients[selectedPatientIndex].name]?.[citation.source]) {
                    // Document exists in dataSourceContent
                    setPreviousTab(rightTab);
                    setViewingDataSource(citation.source);
                    setActiveCitation(null);
                    setTooltipPosition(null);
                  }
                  // If document doesn't exist, do nothing (don't open empty document)
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
        <div className={`content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-start min-h-px min-w-px overflow-y-auto px-[20px] relative w-full ${viewingDataSource ? 'pt-[20px] pb-[20px]' : 'py-[20px]'}`}>
          {viewingDataSource ? (
            /* Data Source View */
            <>
              {/* Back Button */}
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <Button
                  variant="tertiary-neutral"
                  size="small"
                  icon={<InlineIcon name="keyboard_arrow_left" size={16} />}
                  onClick={() => {
                    setViewingDataSource(null);
                    setRightTab(previousTab);
                  }}
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
                        className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px]"
                        style={{
                          color: getDocumentTypeBadgeColor(dataSourceContent[patients[selectedPatientIndex].name][viewingDataSource].type).text,
                          textTransform: 'capitalize'
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
          ) : rightTab === 'sources' ? (
            /* Sources View */
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              {(() => {
                // Group sources by type
                const sourcesByType: Record<string, string[]> = {};
                (patients[selectedPatientIndex].dataSources || []).forEach((source) => {
                  const sourceData = dataSourceContent[patients[selectedPatientIndex].name]?.[source];
                  if (sourceData) {
                    const type = sourceData.type;
                    if (!sourcesByType[type]) {
                      sourcesByType[type] = [];
                    }
                    sourcesByType[type].push(source);
                  }
                });
                
                return Object.entries(sourcesByType).map(([type, sources]) => (
                  <div key={type} className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                    {/* Type Badge */}
                    <div 
                      className="inline-flex items-center px-[8px] py-[4px] rounded-[4px]"
                      style={{
                        backgroundColor: getDocumentTypeBadgeColor(type).bg
                      }}
                    >
                      <p 
                        className="font-['Lato',sans-serif] font-bold leading-[1.2] text-[11px] tracking-[0.5px]"
                        style={{
                          color: getDocumentTypeBadgeColor(type).text,
                          textTransform: 'capitalize'
                        }}
                      >
                        {type}
                      </p>
                    </div>
                    
                    {/* Sources for this type */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full pl-[12px]">
                      {sources.map((source, idx) => (
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
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : rightTab === 'assistant' ? (
            /* Assistant View */
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
                      {message.citations ? renderChatMessageWithCitations(message.content, message.citations, `chat-${idx}`) : message.content}
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
                            const key = `${patients[selectedPatientIndex].name}-chat-${idx}`;
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
                            name={expandedChatSources.has(`${patients[selectedPatientIndex].name}-chat-${idx}`) ? "keyboard_arrow_up" : "keyboard_arrow_down"} 
                            size={16} 
                          />
                        </button>
                        
                        {expandedChatSources.has(`${patients[selectedPatientIndex].name}-chat-${idx}`) && (() => {
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
                                ) : dataSourceContent[patients[selectedPatientIndex].name]?.[citation.source] ? (
                                  <button
                                    onClick={() => {
                                      setPreviousTab(rightTab);
                                      setViewingDataSource(citation.source);
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
              {/* Visit Settings Card */}
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
          
          {/* Care Suggestions Card */}
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Care Suggestions
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
                    className="border border-[var(--neutral-200,#ccc)] content-stretch flex gap-[8px] items-start p-[12px] pr-[40px] relative rounded-[6px] shrink-0 w-full cursor-pointer hover:bg-[var(--surface-1,#f7f7f7)] transition-colors"
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
                    <div className="absolute top-[4px] right-[4px]">
                      <IconButton 
                        variant="tertiary-neutral" 
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
                        className="text-[#666666] hover:bg-[rgba(0,0,0,0.03)]"
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Dismissed Care Suggestions */}
              {dismissedNudges[selectedPatientIndex] && dismissedNudges[selectedPatientIndex].size > 0 && (
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.2] not-italic text-[13px] text-[color:var(--text-subheading,#666)] tracking-[0.065px]">
                      {dismissedNudges[selectedPatientIndex].size} nudge{dismissedNudges[selectedPatientIndex].size !== 1 ? 's' : ''} dismissed
                    </p>
                    <Button
                      variant="tertiary"
                      size="small"
                      onClick={() => setShowDismissedCareNudges(!showDismissedCareNudges)}
                    >
                      {showDismissedCareNudges ? 'Hide' : 'View'}
                    </Button>
                  </div>
                  
                  {showDismissedCareNudges && (
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      {(patients[selectedPatientIndex].careNudges || []).map((nudge, idx) => {
                        if (!dismissedNudges[selectedPatientIndex]?.has(idx)) {
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
                                    const newSet = new Set(prev[selectedPatientIndex]);
                                    newSet.delete(idx);
                                    return {
                                      ...prev,
                                      [selectedPatientIndex]: newSet
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
            </div>
            )}
          </div>
            </>
          )}
        </div>
        
        {/* Chat Input at Bottom */}
        <div className="content-stretch flex gap-[8px] items-start pb-[20px] pl-[8px] pr-[16px] pt-[8px] relative shrink-0 w-full">
          <div 
            className="relative"
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setSmartEditTooltipPosition({
                x: rect.left + rect.width / 2,
                y: rect.top
              });
              setShowSmartEditTooltip(true);
            }}
            onMouseLeave={() => {
              setShowSmartEditTooltip(false);
              setSmartEditTooltipPosition(null);
            }}
          >
            <IconButton 
              variant="tertiary" 
              size="large"
              icon={<InlineIcon name="magic_edit" size={24} />}
              onClick={() => {}}
              aria-label="Smart Edit"
              className="shrink-0 text-[color:var(--text-brand,#1132ee)]"
            />
          </div>
          <div className="flex-[1_0_0] min-w-px">
            <ChatInput
              placeholder="Ask assistant"
              value={chatInputValue}
              onChange={setChatInputValue}
              onSend={() => {
                if (chatInputValue.trim()) {
                  // Switch to assistant view and clear data source view
                  setRightTab('assistant');
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
      
      {/* Smart Edit Tooltip - Fixed positioning to avoid clipping */}
      {showSmartEditTooltip && smartEditTooltipPosition && (
        <div 
          className="fixed z-[9999] flex flex-col items-center pointer-events-none leading-[0]"
          style={{
            left: `${smartEditTooltipPosition.x}px`,
            top: `${smartEditTooltipPosition.y}px`,
            transform: 'translate(-50%, calc(-100% - 8px))'
          }}
        >
          <div className="bg-[var(--surface-semantic-info,#f1f3fe)] flex items-center px-[12px] py-[8px] rounded-[4px]">
            <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic text-[13px] text-[color:var(--shape-brand,#1132ee)] tracking-[0.13px] whitespace-nowrap" style={{ fontFeatureSettings: "'ss07'" }}>
              <p className="leading-[1.2]">Smart Edit</p>
            </div>
          </div>
          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" className="block" style={{ marginTop: '-1px' }}>
            <path d="M6 6L0.803847 0L11.1962 0L6 6Z" fill="#f1f3fe"/>
          </svg>
        </div>
      )}
    </div>
  );
}
