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
  const [editingSection, setEditingSection] = useState<'hpi' | 'ros' | 'pe' | null>(null);
  const [editedContent, setEditedContent] = useState<{hpi: string; ros: string; pe: string}>({
    hpi: '',
    ros: '',
    pe: ''
  });
  
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
  
  // Helper to render text with citation numbers
  const renderTextWithCitations = (text: string) => {
    if (selectedView !== 'citation') {
      // Remove citation markers when not in citation view
      return text.replace(/\{\{(\d+)\}\}/g, '');
    }
    
    // Get citation data for current scribe
    const currentScribe = allScribes[selectedScribeIndex];
    const citations = currentScribe.citations || [];
    
    // Split text by citation markers and render with inline citation badges
    const parts = text.split(/(\{\{\d+\}\})/);
    let textBeforeCitation = '';
    
    return parts.map((part, idx) => {
      const match = part.match(/\{\{(\d+)\}\}/);
      if (match) {
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
      
      // Check if this text should be highlighted (without shifting layout)
      if (activeCitation && part) {
        const citation = citations.find(c => c.number === activeCitation);
        if (citation && part.toLowerCase().includes(citation.citedText.toLowerCase())) {
          // Highlight the cited text within this part using background with mark element
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
          textBeforeCitation += part;
          return <span key={idx}>{highlighted}</span>;
        }
      }
      
      textBeforeCitation += part;
      return <span key={idx}>{part}</span>;
    });
  };
  
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
          hccItems: []
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
          hccItems: [
            { condition: "Migraine with aura, intractable", meat: [true, true, false, true] },
            { condition: "Generalized anxiety disorder", meat: [true, false, true, false] }
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
          hccItems: [
            { condition: "Type 2 diabetes mellitus without complications", meat: [true, true, true, true] },
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "Hyperlipidemia", meat: [true, false, false, true] }
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
          hccItems: [
            { condition: "Essential hypertension", meat: [true, false, true, true] },
            { condition: "History of nicotine dependence", meat: [true, false, false, false] }
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
                {allScribes[selectedScribeIndex].name}
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
              <div className="flex flex-col justify-center overflow-hidden relative shrink-0 text-ellipsis"><p className="leading-[1.4] overflow-hidden">{allScribes[selectedScribeIndex].chiefComplaint}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">Age {allScribes[selectedScribeIndex].age}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">Sex {allScribes[selectedScribeIndex].gender}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{allScribes[selectedScribeIndex].room}</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">·</p></div>
              <div className="flex flex-col justify-center relative shrink-0"><p className="leading-[1.4]">{allScribes[selectedScribeIndex].duration}</p></div>
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
            <div className="content-stretch flex items-center relative shrink-0 w-full pb-[32px] pt-[8px]">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[15px] text-[color:var(--text-default,black)] tracking-[0.15px]" style={{ fontFeatureSettings: "'ss07'" }}>
                Clinical Note
              </p>
            </div>
            
            {/* HPI Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
                        setEditedContent({ ...editedContent, hpi: allScribes[selectedScribeIndex].hpi.replace(/\{\{(\d+)\}\}/g, '') });
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
                    setEditedContent({ ...editedContent, hpi: allScribes[selectedScribeIndex].hpi.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('hpi');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(allScribes[selectedScribeIndex].hpi)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* ROS Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
                        setEditedContent({ ...editedContent, ros: allScribes[selectedScribeIndex].ros.replace(/\{\{(\d+)\}\}/g, '') });
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
                    setEditedContent({ ...editedContent, ros: allScribes[selectedScribeIndex].ros.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('ros');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(allScribes[selectedScribeIndex].ros)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* PE Section */}
            <div className="content-stretch flex flex-col gap-[4px] items-start py-[12px] relative shrink-0 w-full">
              {/* Section Title & CTAs */}
              <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px] pl-[8px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
                        setEditedContent({ ...editedContent, pe: allScribes[selectedScribeIndex].pe.replace(/\{\{(\d+)\}\}/g, '') });
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
                    setEditedContent({ ...editedContent, pe: allScribes[selectedScribeIndex].pe.replace(/\{\{(\d+)\}\}/g, '') });
                    setEditingSection('pe');
                  }}
                >
                  <div className="content-stretch flex flex-col items-start p-[8px] relative rounded-[6px] shrink-0 w-full">
                    <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[#111827] text-[15px] tracking-[0.15px] w-full whitespace-pre-wrap">
                      {renderTextWithCitations(allScribes[selectedScribeIndex].pe)}
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
        {/* Header */}
        <div className="content-stretch flex items-center px-[20px] pt-[20px] pb-[12px] relative shrink-0 w-full">
          <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[17px] text-[color:var(--text-default,black)] tracking-[0.34px]">
            For this scribe
          </p>
        </div>
        
        {/* Tabs */}
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
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px overflow-y-auto p-[8px] relative w-full">
          {rightTab === 'chat' ? (
            /* Chat View */
            <div className="content-stretch flex flex-col gap-[16px] items-start px-[12px] py-[4px] relative w-full">
              {(chatMessages[allScribes[selectedScribeIndex].name] || []).map((message, idx) => (
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
              {/* Views & Highlights */}
              <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
                  { id: 'citation', label: 'Citation' }
                ]}
                value={selectedView}
                onChange={(id) => setSelectedView(id as 'default' | 'abnormals' | 'citation')}
                className="w-full"
              />
            )}
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
          </div>
          
          {/* Edit Tools */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full">
              <p className="font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
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
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
          </div>
          
          {/* Improve Scribe */}
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
            <div className="content-stretch flex h-[28px] items-center justify-between relative shrink-0 w-full">
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
              <>
                {/* Risk & Safety Card */}
                <div className="bg-[var(--surface-1,#f7f7f7)] content-stretch flex flex-col gap-[8px] items-start px-[12px] py-[8px] relative rounded-[8px] shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[12px] text-[color:var(--text-subheading,#666)] tracking-[0.24px]">
                      Risk & Safety
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col font-['Lato',sans-serif] gap-[4px] items-start leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-body,#1a1a1a)] tracking-[0.065px] w-full">
                    <p className="relative shrink-0 w-full">Pain scale 1-10?</p>
                    <p className="relative shrink-0 w-full">Presence of fever?</p>
                    <p className="relative shrink-0 w-full">Migration or movement of pain?</p>
                  </div>
                </div>
                
                {/* HCC for Review Card - Only show if patient has HCC items */}
                {allScribes[selectedScribeIndex].hccItems && allScribes[selectedScribeIndex].hccItems.length > 0 && (
                <div className="bg-[var(--surface-1,#f7f7f7)] content-stretch flex flex-col gap-[2px] items-start px-[12px] py-[8px] relative rounded-[12px] shrink-0 w-full">
                  <div className="content-stretch flex items-center relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Lato',sans-serif] font-bold leading-[1.2] min-h-px min-w-px not-italic relative text-[12px] text-[color:var(--text-subheading,#666)] tracking-[0.24px]">
                      HCC for Review
                    </p>
                  </div>
                  <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                    {allScribes[selectedScribeIndex].hccItems.map((item, itemIdx) => (
                      <div key={itemIdx} className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                        <p className="font-['Lato',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[13px] text-[color:var(--text-default,black)] tracking-[0.065px] w-full">
                          {item.condition}
                        </p>
                        <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px relative">
                          {['M', 'E', 'A', 'T'].map((letter, idx) => {
                            const isCompleted = item.meat[idx];
                            return (
                              <div key={idx} className={`content-stretch flex flex-[1_0_0] gap-[4px] h-[24px] items-center justify-center min-h-px min-w-px px-[4px] relative rounded-[8px] ${
                                isCompleted 
                                  ? 'bg-white border border-[var(--green-200,#b9dfbb)] border-solid' 
                                  : 'bg-[var(--surface-3,#e6e6e6)] border border-[var(--shape-tertiary,#b3b3b3)] border-solid'
                              }`}>
                                <p className={`font-['Lato',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-[12px] tracking-[0.24px] ${
                                  isCompleted ? 'text-[color:var(--green-550,#479e4c)]' : 'text-[color:var(--text-subheading,#666)]'
                                }`}>{letter}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </>
            )}
            
            <div className="border border-[var(--shape-outline,rgba(0,0,0,0.1))] border-solid h-px shrink-0 w-full" />
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
      
      {/* Citation Tooltip */}
      {activeCitation && tooltipPosition && (() => {
        const citation = allScribes[selectedScribeIndex].citations?.find(c => c.number === activeCitation);
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
                />
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
