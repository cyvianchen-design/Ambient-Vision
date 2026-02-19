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
  const [activeTab, setActiveTab] = useState<'clinical' | 'codes' | 'transcript' | 'previsit'>('clinical');
  const [selectedScribeIndex, setSelectedScribeIndex] = useState(0);
  const [selectedView, setSelectedView] = useState<'default' | 'highlights' | 'citation'>('default');
  const [activeCitation, setActiveCitation] = useState<{ id: string; number: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; alignLeft?: boolean } | null>(null);
  const [isViewsHighlightsExpanded, setIsViewsHighlightsExpanded] = useState(true);
  const [isEditToolsExpanded, setIsEditToolsExpanded] = useState(true);
  const [isImproveScribeExpanded, setIsImproveScribeExpanded] = useState(true);
  const [editingSection, setEditingSection] = useState<'hpi' | 'ros' | 'pe' | null>(null);
  const [editedContent, setEditedContent] = useState<{hpi: string; ros: string; pe: string}>({
    hpi: '',
    ros: '',
    pe: ''
  });
  const [viewingDataSource, setViewingDataSource] = useState<string | null>(null);
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const [previousTab, setPreviousTab] = useState<'actions' | 'assistant' | 'sources'>('actions');
  const [expandedChatSources, setExpandedChatSources] = useState<Set<string>>(new Set());
  const [showSmartEditTooltip, setShowSmartEditTooltip] = useState(false);
  const [smartEditTooltipPosition, setSmartEditTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  
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
    "Robert Chen": {
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
          name: "Maria Garcia", 
          age: 35, 
          gender: "F", 
          duration: "18m 45s",
          chiefComplaint: "Lower Back Pain",
          room: "Room 215",
          hpi: "35-year-old female presenting with acute lower back pain x 4 days{{1}}. Pain started after moving furniture{{2}}, located in lower lumbar region. Describes sharp pain, 7/10 intensity{{3}}, worse with bending and lifting{{4}}. Pain improves with rest{{5}}. Denies radiation to legs{{6}}, no paresthesias. No bowel/bladder dysfunction{{7}}. Takes ibuprofen with moderate relief{{8}}. No prior history of back problems{{9}}.",
          ros: "Musculoskeletal: Lower back pain as described; no other joint pain{{10}}.\nNeurologic: No numbness, tingling, or weakness in legs{{11}}.\nConstitutional: Denies fever, chills, or weight loss{{12}}.\nGU: Normal bowel and bladder function{{13}}.",
          pe: "General: Well-appearing, mild discomfort with position changes.\nVitals: BP 118/76, HR 72, RR 14{{14}}.\nBack: Tenderness over paraspinal muscles L3-L5{{15}}; no midline tenderness. Normal spinal curvature{{16}}.\nNeuro: Strength 5/5 lower extremities bilaterally; sensation intact; negative straight leg raise bilaterally{{17}}; reflexes 2+ and symmetric{{18}}.",
          citations: [
            { number: 1, citedText: "x 4 days", quote: "The pain started about 4 days ago, on Saturday morning", source: "Visit transcript, 00:01:15" },
            { number: 2, citedText: "moving furniture", quote: "I was helping my husband move our couch and I felt something pull in my lower back", source: "Visit transcript, 00:01:32" },
            { number: 3, citedText: "7/10 intensity", quote: "Pain severity: 7 out of 10 at worst", source: "Intake form, 02/12/2024" },
            { number: 4, citedText: "worse with bending and lifting", quote: "It hurts really bad when I bend forward or try to pick anything up", source: "Visit transcript, 00:02:45" },
            { number: 5, citedText: "improves with rest", quote: "When I lie down flat it feels a bit better", source: "Visit transcript, 00:03:10" },
            { number: 6, citedText: "Denies radiation", quote: "No, the pain stays in my back. It doesn't go down my legs at all", source: "Visit transcript, 00:03:58" },
            { number: 7, citedText: "No bowel/bladder dysfunction", quote: "Bathroom habits are completely normal", source: "Visit transcript, 00:04:22" },
            { number: 8, citedText: "ibuprofen with moderate relief", quote: "I've been taking ibuprofen 600mg three times a day. It helps a little but doesn't take it away completely", source: "Visit transcript, 00:05:15" },
            { number: 9, citedText: "No prior history", quote: "Past medical history: No prior back problems or injuries", source: "Intake form, 02/12/2024" },
            { number: 10, citedText: "no other joint pain", quote: "Just my back. My knees, hips, everything else feels fine", source: "Visit transcript, 00:06:30" },
            { number: 11, citedText: "No numbness, tingling, or weakness", quote: "No numbness, tingling, or weakness in lower extremities reported", source: "ROS documentation, today" },
            { number: 12, citedText: "Denies fever, chills, or weight loss", quote: "No fever, chills, night sweats, or unintentional weight changes", source: "ROS documentation, today" },
            { number: 13, citedText: "Normal bowel and bladder", quote: "Bowel and bladder function normal, no incontinence or retention", source: "ROS documentation, today" },
            { number: 14, citedText: "BP 118/76, HR 72, RR 14", quote: "Blood pressure 118/76 mmHg, heart rate 72 bpm, respiratory rate 14", source: "Visit vitals, today" },
            { number: 15, citedText: "Tenderness over paraspinal muscles L3-L5", quote: "Moderate tenderness to palpation over bilateral paraspinal musculature from L3 to L5 level", source: "Physical examination, today" },
            { number: 16, citedText: "Normal spinal curvature", quote: "Spine: Normal thoracic kyphosis and lumbar lordosis, no scoliosis", source: "Physical examination, today" },
            { number: 17, citedText: "negative straight leg raise", quote: "Straight leg raise test negative bilaterally at 70 degrees, no radicular symptoms provoked", source: "Physical examination, today" },
            { number: 18, citedText: "reflexes 2+ and symmetric", quote: "Deep tendon reflexes: 2+ and symmetric at patellar and Achilles tendons bilaterally", source: "Physical examination, today" }
          ],
          hccItems: [],
          nudges: [
            { 
              type: "Documentation", 
              description: "Missing indication of pain location laterality, please select an option to complete your note.",
              highlightId: "maria-garcia-hpi-laterality",
              options: [
                { id: 'left', label: 'Left', type: 'single-select' },
                { id: 'right', label: 'Right', type: 'single-select' }
              ],
              previewText: (selected: string[]) => selected.length > 0 ? `${selected[0]} side of ` : '',
              insertLocation: 'hpi',
              insertAfter: 'located in '
            },
            { 
              type: "Billing Compliance", 
              description: "Select all examination components performed to support E/M level.",
              highlightId: "maria-garcia-pe-exam",
              options: [
                { id: 'back', label: 'Back examination', type: 'multi-select' },
                { id: 'neuro', label: 'Neurological examination', type: 'multi-select' },
                { id: 'musculoskeletal', label: 'Musculoskeletal ROM', type: 'multi-select' },
                { id: 'gait', label: 'Gait assessment', type: 'multi-select' }
              ],
              previewText: (selected: string[]) => {
                if (selected.length === 0) return '';
                const labelMap: Record<string, string> = {
                  back: 'comprehensive back examination', 
                  neuro: 'neurological examination including strength, sensation, and reflexes',
                  musculoskeletal: 'musculoskeletal range of motion assessment',
                  gait: 'gait and stability assessment'
                };
                return `Examination included: ${selected.map(s => labelMap[s]).join(', ')}.`;
              },
              insertLocation: 'pe',
              insertAfter: 'Normal spinal curvature.'
            },
            { type: "Documentation", description: "Specify mechanism of injury timing and activity to support acute diagnosis.", highlightId: "maria-garcia-hpi-mechanism" }
          ],
          dataSources: [
            "Visit transcript, 00:01:15",
            "Intake form, 02/12/2024",
            "ROS documentation, today",
            "Visit vitals, today",
            "Physical examination, today"
          ]
        },
        { 
          name: "Robert Chen", 
          age: 58, 
          gender: "M", 
          duration: "22m 15s",
          chiefComplaint: "Right Shoulder Post-Op",
          room: "Room 301",
          hpi: "58-year-old male presenting for 6-week post-operative visit following shoulder arthroscopic rotator cuff repair{{1}}. Surgery performed January 3rd{{2}} for large full-thickness supraspinatus tear (2.5cm){{3}} and partial infraspinatus tear{{4}}. Repair with double-row technique{{5}}. Patient reports good pain control{{6}}, currently 2-4/10 with PT exercises. Incisions well-healed{{7}}, no signs of infection. Discontinued sling 2 weeks ago per PT{{8}}. Passive ROM improving: forward flexion 110°, abduction 80°{{9}}. Sleeping better, able to lie on opposite side{{10}}. No numbness or tingling in hand{{11}}. Currently out of work (software engineer), interested in return-to-work timeline{{12}}.",
          ros: "Musculoskeletal: Shoulder pain improving; no other joint pain{{13}}.\nNeurologic: No numbness, tingling, or weakness in arm/hand{{14}}.\nConstitutional: No fever, chills{{15}}.\nCardiovascular: Denies chest pain or palpitations.\nRespiratory: No shortness of breath.",
          pe: "General: Well-appearing, no acute distress.\nVitals: BP 128/82, HR 74, RR 14{{16}}.\nShoulder: Incisions well-healed, no erythema or drainage{{17}}; minimal effusion{{18}}. ROM (passive): Forward flexion 110°, abduction 80°, ER 30°{{19}}. Neurovascular: Axillary nerve intact (deltoid sensation present){{20}}; radial/median/ulnar intact distally{{21}}. Strength: Deferred at this early timepoint{{22}}.",
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
          hpi: "28-year-old female recreational runner presenting with 3-week history of knee pain{{1}}. Pain started during half-marathon training{{2}}, gradual onset without acute injury. Located medial joint line{{3}}, 5-6/10 intensity with activity{{4}}, improves with rest{{5}}. Describes clicking sensation{{6}} and occasional giving way{{7}}. Denies locking or true instability. Pain worse with stairs, squatting, twisting motions{{8}}. Running limited to 1 mile before pain forces stop{{9}}. Has been icing and taking ibuprofen with minimal relief{{10}}. No prior knee problems{{11}}.",
          ros: "Musculoskeletal: Knee pain as described; no other joint pain{{12}}.\nNeurologic: No numbness, tingling, or weakness in leg{{13}}.\nConstitutional: Denies fever, chills.\nCardiovascular: No chest pain or palpitations with exercise.",
          pe: "General: Well-appearing, athletic build.\nVitals: BP 118/72, HR 68, RR 14{{14}}.\nKnee: No effusion{{15}}; tenderness to palpation at medial joint line{{16}}. ROM: Full extension, flexion to 135°{{17}}. McMurray test positive for medial meniscus{{18}}. Thessaly test positive{{19}}. Lachman, anterior drawer negative{{20}}. Valgus/varus stress stable{{21}}. No patellar apprehension{{22}}.",
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
          hpi: "42-year-old female with Type 2 diabetes mellitus{{1}} presents for routine 3-month follow-up. Recent A1c 7.8%{{2}}, up from 7.2% three months ago{{3}}. Patient reports good medication compliance with metformin 1000mg BID{{4}}. Admits to dietary indiscretions during holidays{{5}}. No hypoglycemic episodes{{6}}. Denies polyuria, polydipsia, or changes in vision{{7}}. Checking blood sugars 2-3 times per week{{8}}, fasting values range 130-150 mg/dL{{9}}. No new symptoms. Co-morbid hypertension and hyperlipidemia well-controlled{{10}}.",
          ros: "Endocrine: No polyuria, polydipsia, or polyphagia{{11}}.\nCardiovascular: Denies chest pain, palpitations, or leg swelling{{12}}.\nNeurologic: Denies numbness, tingling in feet{{13}}.\nOphthalmic: No vision changes; last eye exam 8 months ago{{14}}.\nConstitutional: Weight stable{{15}}.",
          pe: "General: Well-appearing, comfortable.\nVitals: BP 132/84, HR 76, RR 16, Weight 185 lbs (stable){{16}}.\nCardiac: RRR, no murmurs{{17}}.\nExtremities: No edema; pedal pulses 2+ bilaterally{{18}}; monofilament sensation intact{{19}}.",
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
      "maria-garcia-hpi-laterality": "lower lumbar region",
      "maria-garcia-hpi-mechanism": "Pain started after moving furniture",
      "maria-garcia-pe-exam": "Back: Tenderness over paraspinal muscles L3-L5",
      "robert-chen-hpi-shoulder": "shoulder arthroscopic rotator cuff repair",
      "robert-chen-note-header": "Right Shoulder Post-Op",
      "robert-chen-hpi-work": "Currently out of work (software engineer), interested in return-to-work timeline",
      "lisa-anderson-hpi-knee": "knee pain",
      "lisa-anderson-hpi-onset": "gradual onset without acute injury",
      "lisa-anderson-hpi-running": "Running limited to 1 mile before pain forces stop",
      "sarah-johnson-hpi-a1c": "Recent A1c 7.8%, up from 7.2% three months ago",
      "sarah-johnson-note-header": "Diabetes Follow-up",
      "james-wilson-note-header": "Annual Check-up",
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
    
    // Don't collect all nudge highlights by default - only show when hovering
    // This prevents all nudges from highlighting simultaneously
    
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
        const isActive = activeCitation?.number === citationNum;
        
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
              } else if (activeCitation?.number === citationNum) {
                setActiveCitation(null);
                setTooltipPosition(null);
              } else {
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
      
      // Add citation/nudge highlight (for hovered nudge)
      if (shouldHighlight && highlightTargetText && part && (isNudgeHovered || isHighlightHovered)) {
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
      if (shouldShowNudgeHighlights && nudgeHighlights.length > 0 && part) {
        nudgeHighlights.forEach(({ text: nudgeText, nudgeIndex }) => {
          let searchStart = 0;
          let foundIndex;
          const searchLower = part.toLowerCase();
          const targetLower = nudgeText.toLowerCase();
          // Find all occurrences
          while ((foundIndex = searchLower.indexOf(targetLower, searchStart)) !== -1) {
            allHighlights.push({
              start: foundIndex,
              end: foundIndex + nudgeText.length,
              color: highlightColor,
              priority: 3, // Lower priority than hovered highlights
              nudgeIndex: nudgeIndex
            });
            searchStart = foundIndex + 1;
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
              onMouseLeave={() => {
                setHoveredHighlight(null);
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
      const sentenceIdx = sentences.findIndex(s => position >= s.start && position < s.end);
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
              className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-center min-h-px min-w-px overflow-clip px-[4px] py-[16px] relative w-full"
              onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
            >
              {/* Visits */}
              <button 
                className="content-stretch cursor-pointer flex flex-col gap-[2px] items-center justify-center relative rounded-[6px] shrink-0 w-full group"
                onClick={onNavigateToVisits}
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
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
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
                onMouseLeave={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
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
              onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
            />
            
            {/* Footer */}
            <div 
              className="content-stretch flex flex-col gap-[8px] items-center pb-[24px] pt-[16px] relative shrink-0 w-full"
              onMouseEnter={() => isSecondaryNavCollapsed && setHoveredNavWithDelay('scribes')}
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
          onMouseEnter={() => setHoveredPrimaryNav('visits')}
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
          onMouseEnter={() => setHoveredPrimaryNav('scribes')}
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
          onMouseEnter={() => setHoveredPrimaryNav('customize')}
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
          onMouseEnter={() => setHoveredPrimaryNav('assistant')}
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
          onMouseEnter={() => setHoveredPrimaryNav('admin')}
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
                { id: 'codes', label: 'ICD10/CPT Codes' },
                { id: 'transcript', label: 'Transcript' },
                { id: 'previsit', label: 'Previsit' }
              ]}
              defaultTab={activeTab}
              onTabChange={(id) => setActiveTab(id as 'clinical' | 'codes' | 'transcript' | 'previsit')}
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
              </>
            )}
          </div>
          
          {/* Bottom Action Bar - only show for clinical note */}
          {activeTab !== 'previsit' && (
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
        <div className={`content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px overflow-y-auto relative w-full ${viewingDataSource ? '' : 'py-[20px] px-[20px]'}`}>
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
                // Determine which sources to show based on active tab
                let sourcesToShow: string[] = [];
                
                if (activeTab === 'previsit') {
                  // Show patient's data sources (non-transcript sources)
                  const matchingPatient = patients.find(p => p.name === currentScribe.name);
                  if (matchingPatient && matchingPatient.dataSources) {
                    sourcesToShow = matchingPatient.dataSources;
                  }
                } else if (activeTab === 'transcript') {
                  // Show visit transcript entries
                  sourcesToShow = Object.keys(dataSourceContent[currentScribe.name] || {})
                    .filter(key => key.startsWith('Visit transcript'));
                } else {
                  // Show scribe's data sources for clinical note and codes
                  sourcesToShow = currentScribe.dataSources || [];
                }
                
                // Group sources by type (and date for Clinical Notes)
                const sourcesByType: Record<string, string[]> = {};
                sourcesToShow.forEach((source) => {
                  const sourceData = dataSourceContent[currentScribe.name]?.[source];
                  if (sourceData) {
                    const badgeInfo = getDocumentTypeBadgeColor(sourceData.type, sourceData.date);
                    const groupKey = badgeInfo.label; // Use label as key to separate Clinical Notes by date
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
                            setHighlightedQuote(null);
                          }}
                        />
                      ))}
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
                    {message.citations && message.citations.length > 0 && (
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
                            {message.citations.length} source{message.citations.length !== 1 ? 's' : ''}
                          </p>
                          <InlineIcon 
                            name={expandedChatSources.has(`${currentScribe.name}-chat-${idx}`) ? "keyboard_arrow_up" : "keyboard_arrow_down"} 
                            size={16} 
                          />
                        </button>
                        
                        {expandedChatSources.has(`${currentScribe.name}-chat-${idx}`) && (
                          <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                            {message.citations.map((citation, citIdx) => (
                              <div key={citIdx} className="flex items-start gap-[6px] w-full">
                                <span className="inline-flex items-center justify-center rounded-[2px] text-[10px] font-bold leading-none bg-[#f1f3fe] text-[color:var(--text-brand,#1132ee)] shrink-0" style={{ width: '14px', height: '14px', marginTop: '3px' }}>
                                  {citation.number}
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
                                ) : (
                                  <button
                                    onClick={() => {
                                      setPreviousTab(rightTab);
                                      setViewingDataSource(citation.source);
                                      setHighlightedQuote(null);
                                    }}
                                    className="font-['Lato',sans-serif] text-[13px] leading-[1.4] text-[color:var(--text-link,#1132ee)] hover:underline tracking-[0.065px] text-left"
                                  >
                                    {citation.source}
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
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
                  { id: 'highlights', label: 'Highlights' },
                  { id: 'citation', label: 'Citation' },
                  { id: 'none', label: 'None' }
                ]}
                value={selectedView}
                onChange={(id) => setSelectedView(id as 'default' | 'highlights' | 'citation')}
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
                    icon={<InlineIcon name="dashboard" size={16} />}
                    onClick={() => {}}
                  >
                    Change Template
                  </Button>
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    icon={<InlineIcon name="sync" size={16} />}
                    onClick={() => {}}
                  >
                    Regenerate
                  </Button>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
                  <Button 
                    variant="tertiary-neutral" 
                    size="small"
                    icon={<InlineIcon name="add" size={16} />}
                    onClick={() => {}}
                  >
                    New Letters / Docs
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
                      onMouseLeave={() => setHoveredNudge(null)}
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
                    } else {
                      setPreviousTab(rightTab);
                      setViewingDataSource(citation.source);
                      // If it's a visit transcript, set the highlighted quote
                      if (citation.source.startsWith('Visit transcript')) {
                        setHighlightedQuote(citation.quote);
                      } else {
                        setHighlightedQuote(null);
                      }
                    }
                    setActiveCitation(null);
                    setTooltipPosition(null);
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
