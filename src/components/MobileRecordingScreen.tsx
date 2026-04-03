import React, { useEffect, useRef, useState } from 'react';
import { InlineIcon } from './InlineIcon';

interface CareNudge {
  type: string;
  description: string;
}

interface NudgeItem {
  done: boolean;
  text: string;
}

interface AnimatedNudge {
  id: string;
  type: string;
  description: string;
  visible: boolean;
  textFading?: boolean;
  items?: NudgeItem[];
  cta?: string;
}

interface MobileRecordingScreenProps {
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  chiefComplaint: string;
  nudges?: CareNudge[];
  demoStep?: number;
  isDemoPreview?: boolean;
  onPause?: () => void;
  onEnd?: () => void;
}

const BAR_W = 5;
const BAR_GAP = 6;
const NUM_BARS = 32;
const MAX_H = 96;
const MIN_H = 4;

// Start with quiet bars
const initialBars = () =>
  Array.from({ length: NUM_BARS }, () => MIN_H + Math.random() * 4);

export const MobileRecordingScreen = ({
  patientName,
  patientAge,
  patientGender,
  chiefComplaint,
  nudges = [],
  demoStep = 1,
  isDemoPreview = false,
  onPause,
  onEnd,
}: MobileRecordingScreenProps) => {
  const [seconds, setSeconds] = useState(0);
  const [expandedNudge, setExpandedNudge] = useState(0);
  const [bars, setBars] = useState<number[]>(initialBars);
  const [displayedNudges, setDisplayedNudges] = useState<AnimatedNudge[]>(() =>
    nudges.map((n, i) => ({ id: `prop-${i}`, type: n.type, description: n.description, visible: true }))
  );
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const itemTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [confirmedLines, setConfirmedLines] = useState<{ text: string; visible: boolean }[]>([]);

  const addConfirmedLine = (text: string) => {
    setConfirmedLines(prev => [...prev, { text, visible: false }]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setConfirmedLines(prev => prev.map(l => l.text === text ? { ...l, visible: true } : l));
    }));
  };

  // Activity level (0–1): drives new bar heights
  const activityRef = useRef(0.3);
  const targetActivityRef = useRef(0.4);
  const isSilenceRef = useRef(false);
  // Carry-over from previous bar for organic neighbor blending
  const prevHeightRef = useRef(MIN_H);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Slow interval: change target activity (simulates speech bursts + silences)
  useEffect(() => {
    const update = () => {
      if (isSilenceRef.current) return;
      const r = Math.random();
      if (r < 0.18) {
        // Short mid-sentence pause (like a breath or comma): 150–400ms
        isSilenceRef.current = true;
        targetActivityRef.current = 0.03;
        setTimeout(() => {
          isSilenceRef.current = false;
          targetActivityRef.current = 0.5 + Math.random() * 0.5;
        }, 150 + Math.random() * 250);
      } else if (r < 0.32) {
        // Between-sentence pause: 500–1000ms
        isSilenceRef.current = true;
        targetActivityRef.current = 0.03;
        setTimeout(() => {
          isSilenceRef.current = false;
          targetActivityRef.current = 0.55 + Math.random() * 0.45;
        }, 500 + Math.random() * 500);
      } else if (r < 0.38) {
        // Longer pause (end of thought): 1000–2000ms
        isSilenceRef.current = true;
        targetActivityRef.current = 0.03;
        setTimeout(() => {
          isSilenceRef.current = false;
          targetActivityRef.current = 0.45 + Math.random() * 0.55;
        }, 1000 + Math.random() * 1000);
      } else {
        targetActivityRef.current = 0.2 + Math.random() * 0.8;
      }
    };
    const slow = setInterval(update, 300 + Math.random() * 150);
    return () => clearInterval(slow);
  }, []);

  // Each tick: drop the leftmost bar height, shift everything left,
  // generate a new height for the rightmost bar
  useEffect(() => {
    const TICK_MS = 130; // new height enters from the right every 130ms

    const tick = setInterval(() => {
      // Lerp activity — faster attack, slower release
      const target = targetActivityRef.current;
      const current = activityRef.current;
      activityRef.current = current + (target - current) * (target > current ? 0.18 : 0.08);

      const a = activityRef.current;
      const rawTarget = MAX_H * a;
      const noise = (Math.random() - 0.5) * MAX_H * 0.65;
      const blended = prevHeightRef.current * 0.1 + rawTarget * 0.9 + noise;
      const newH = Math.max(MIN_H, Math.min(MAX_H, Math.round(blended)));
      prevHeightRef.current = newH;

      // Shift heights left, new value enters on the right
      setBars(b => [...b.slice(1), newH]);
    }, TICK_MS);

    return () => clearInterval(tick);
  }, []);

  // Per-timeout refs for demo step nudge timeline
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t3Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t4Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const r1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const r2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate a nudge out by id; rRef tracks the deferred DOM-removal timeout
  const fadeOut = (id: string, rRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>) => {
    setDisplayedNudges(prev => prev.map(n => n.id === id ? { ...n, visible: false } : n));
    rRef.current = setTimeout(() => {
      setDisplayedNudges(prev => prev.filter(n => n.id !== id));
    }, 250);
  };

  // Animate a nudge in; double-rAF ensures the element is mounted before visible:true
  const fadeIn = (id: string, type: string, description: string, items?: NudgeItem[], cta?: string) => {
    setDisplayedNudges(prev => {
      if (prev.find(n => n.id === id)) return prev;
      return [...prev, { id, type, description, visible: false, items, cta }];
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisplayedNudges(prev => prev.map(n => n.id === id ? { ...n, visible: true } : n));
      });
    });
    // Spinner items resolve to checkmark after ~1s (staggered)
    if (items) {
      items.forEach((item, i) => {
        if (!item.done) {
          const tid = setTimeout(() => {
            setCompletedItems(prev => new Set([...prev, `${id}-${i}`]));
          }, 1000 + i * 600);
          itemTimersRef.current.push(tid);
        }
      });
    }
  };

  // Keep the card in place; fade only the text out, swap content, fade text back in
  const updateNudge = (
    id: string,
    type: string,
    description: string,
    rRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    items?: NudgeItem[],
    cta?: string,
  ) => {
    setDisplayedNudges(prev => prev.map(n => n.id === id ? { ...n, textFading: true } : n));
    rRef.current = setTimeout(() => {
      setDisplayedNudges(prev => prev.map(n =>
        n.id === id ? { ...n, type, description, items, cta, textFading: false } : n
      ));
      // Spinner → checkmark for any pending items
      if (items) {
        items.forEach((item, i) => {
          if (!item.done) {
            const tid = setTimeout(() => {
              setCompletedItems(prev => new Set([...prev, `${id}-${i}`]));
            }, 1000 + i * 600);
            itemTimersRef.current.push(tid);
          }
        });
      }
    }, 180);
  };

  useEffect(() => {
    // ── Clear all timers from the previous step ──
    [t1Ref, t2Ref, t3Ref, t4Ref, r1Ref, r2Ref].forEach(r => {
      if (r.current) { clearTimeout(r.current); r.current = null; }
    });
    itemTimersRef.current.forEach(clearTimeout);
    itemTimersRef.current = [];
    setCompletedItems(new Set());
    setExpandedNudge(0);
    if (demoStep === 1) setConfirmedLines([]);

    // ── Snapshot: set the exact nudge state this step starts with ──
    // Each step's initial nudges reflect what would have been true had all
    // prior steps played out fully, so clicking through quickly still works.
    const colonoscopy: AnimatedNudge = { id: 'prop-2', type: 'Colonoscopy due', description: 'Age 45, no prior colonoscopy on file — colorectal screening now indicated.', visible: true };

    const snapshots: Record<number, AnimatedNudge[]> = {
      1: [
        { id: 'prop-0', type: 'Follow up on elevated BP',                      description: 'Recent labs ruled out renal/endocrine causes. Structural cause still undetermined.',                                                                                         visible: true },
        { id: 'prop-1', type: 'Check arm-leg BP differential',                 description: 'Coarctation not yet ruled out — no arm-leg BP or cardiac imaging on file.',                                                                                                    visible: true },
        colonoscopy,
      ],
      2: [
        { id: 'prop-1', type: 'Possible CoA — check arm-leg BP differential',  description: 'Patient reports leg fatigue with exertion. Given persistent hypertension, this raises suspicion for Coarctation of the Aorta — check arm-leg BP differential.',              visible: true },
        colonoscopy,
      ],
      3: [
        { id: 'prop-1', type: 'Discuss CoA diagnosis with patient',             description: 'Imaging results support Coarctation of the Aorta. Recommend discussing diagnosis, next steps, and treatment plan directly with patient.',                                      visible: true },
        colonoscopy,
      ],
      4: [
        colonoscopy,
        { id: 'cardio-referral', type: 'Referral drafted', description: '', items: [{ done: true, text: 'Cardiology referral' }], cta: 'Send Referral', visible: true },
      ],
    };
    setDisplayedNudges(snapshots[demoStep] ?? []);

    // Preview mode: show initial nudge state without starting any timers
    if (isDemoPreview) return;

    // ── Timers: changes that happen *during* the step ──
    if (demoStep === 1) {
      // 5s: dismiss "Follow up on elevated BP"
      t1Ref.current = setTimeout(() => fadeOut('prop-0', r1Ref), 5_000);
      // 15s: update CoA suspicion in-place
      t2Ref.current = setTimeout(() => updateNudge(
        'prop-1',
        'Possible CoA — check arm-leg BP differential',
        'Patient reports leg fatigue with exertion. Given persistent hypertension, this raises suspicion for Coarctation of the Aorta — check arm-leg BP differential.',
        r2Ref
      ), 15_000);

    } else if (demoStep === 2) {
      // 10s: update CoA nudge in place with new finding
      t1Ref.current = setTimeout(() => updateNudge(
        'prop-1',
        'Possible CoA — order imaging to confirm',
        'Significant arm-leg BP gradient detected (40 mmHg). Findings consistent with coarctation of the aorta — echo and chest CT angiography recommended.',
        r1Ref
      ), 10_000);
      // 12.5s: fade in "Orders drafted" after prop-1 text swap has settled
      t2Ref.current = setTimeout(() => fadeIn(
        'orders',
        'Orders drafted',
        '',
        [
          { done: false, text: 'Echo: drafted' },
          { done: false, text: 'Chest CT: drafted' },
        ],
        'Place Orders'
      ), 12_500);

    } else if (demoStep === 3) {
      // 13s: cardiology referral nudge fades in alongside the CoA discussion nudge
      t3Ref.current = setTimeout(() => fadeIn(
        'cardio-referral',
        'Referral drafted',
        '',
        [{ done: true, text: 'Cardiology referral' }],
        'Send Referral'
      ), 13_000);
      // Immediate: update prop-1 text from "Pending imaging" → "Discuss CoA" if coming from step 2
      // (snapshot already sets it correctly, but in case the user stayed in step 2 and placed orders)
      setDisplayedNudges(prev => {
        const has = prev.find(n => n.id === 'prop-1');
        if (has && has.type !== 'Discuss CoA diagnosis with patient') {
          return prev.map(n => n.id === 'prop-1'
            ? { ...n, type: 'Discuss CoA diagnosis with patient', description: 'Imaging results support Coarctation of the Aorta. Recommend discussing diagnosis, next steps, and treatment plan directly with patient.', items: undefined, cta: undefined }
            : n);
        }
        return prev;
      });

    } else if (demoStep === 4) {
      // 4s: colonoscopy nudge fades out
      t1Ref.current = setTimeout(() => fadeOut('prop-2', r1Ref), 4_000);
      // 5s: add colonoscopy referral as a new item on the existing referral nudge
      t4Ref.current = setTimeout(() => {
        setDisplayedNudges(prev => prev.map(n => {
          if (n.id !== 'cardio-referral') return n;
          const newItems = [...(n.items ?? []), { done: true, text: 'Colonoscopy referral' }];
          return { ...n, items: newItems };
        }));
      }, 5_000);
    }

    return () => {
      [t1Ref, t2Ref, t3Ref, t4Ref, r1Ref, r2Ref].forEach(r => {
        if (r.current) { clearTimeout(r.current); r.current = null; }
      });
      itemTimersRef.current.forEach(clearTimeout);
      itemTimersRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoStep, isDemoPreview]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerDisplay = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #3d2daa 0%, #4c5ce6 40%, #2651e8 70%, #4c5ce6 100%)',
      }}
    >
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 40% 100%, rgba(132,0,255,0.5) 0%, transparent 60%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 100% 50%, rgba(0,17,255,0.5) 0%, transparent 60%)' }} />

      {/* Content */}
      <div className="relative flex flex-col items-center w-full h-full">
      <div className="flex flex-col items-center w-full max-w-[375px] h-full px-[22px] pt-[24px] pb-[40px]">

        {/* Patient Info + Status */}
        <div className="flex flex-col gap-[24px] items-center w-full">
          <div className="flex flex-col gap-[6px] items-center">
            <p className="font-['Lato',sans-serif] font-bold text-[19px] text-white tracking-[0.38px] leading-[1.2]">
              {patientName}
            </p>
            <p className="font-['Lato',sans-serif] text-[14px] text-white/80 tracking-[0.07px] leading-[1.4]">
              {patientAge} · {patientGender} · {chiefComplaint}
            </p>
          </div>

          <div className="flex flex-col gap-[12px] items-center">
            <p className="font-['Lato',sans-serif] font-bold text-[19px] text-white tracking-[0.38px] leading-[1.2]">
              Recording
            </p>
            <p
              className="font-['Lato',sans-serif] font-bold text-[49px] text-white tracking-[0.49px] leading-[1.1]"
              style={{ fontFeatureSettings: "'ss07'" }}
            >
              {timerDisplay}
            </p>
            <button className="flex items-center gap-[6px] text-white/80 hover:text-white transition-colors">
              <InlineIcon name="mic" size={16} />
              <span className="font-['Lato',sans-serif] text-[14px] tracking-[0.07px]">iPhone Mic</span>
              <InlineIcon name="arrow_drop_down" size={16} />
            </button>
          </div>

          {/* Waveform — bars fixed in place, heights scroll through them */}
          <div className="w-full h-[100px] overflow-hidden flex items-center" style={{ gap: BAR_GAP }}>
            {bars.map((h, i) => (
              <div
                key={i}
                className="rounded-full shrink-0"
                style={{
                  width: BAR_W,
                  height: h,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  transition: 'height 0.15s ease-out',
                }}
              />
            ))}
          </div>

          {/* Care Nudges */}
          {displayedNudges.length > 0 && (
          <div className="w-full pt-[8px] flex flex-col gap-[6px]">
            {displayedNudges.map((nudge, idx) => {
              const isExpanded = expandedNudge === idx;
              return (
                <div
                  key={nudge.id}
                  className={`flex gap-[8px] px-[10px] py-[8px] rounded-[8px] w-full cursor-pointer ${(isExpanded || nudge.items) ? 'items-start' : 'items-center'}`}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.07)',
                    opacity: nudge.visible ? 1 : 0,
                    transform: nudge.visible ? 'translateY(0px)' : 'translateY(8px)',
                    maxHeight: nudge.visible ? '200px' : '0px',
                    overflow: 'hidden',
                    marginTop: nudge.visible ? undefined : '0px',
                    paddingTop: nudge.visible ? undefined : '0px',
                    paddingBottom: nudge.visible ? undefined : '0px',
                    transition: 'opacity 200ms ease, transform 200ms ease, max-height 200ms ease',
                  }}
                  onClick={() => setExpandedNudge(idx)}
                >
                  <div className={`flex flex-col flex-1 min-w-0 gap-[6px] transition-opacity duration-[180ms] ease-in-out ${nudge.textFading ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="font-['Lato',sans-serif] font-bold text-[14px] text-white tracking-[0.14px] leading-[1.3]">
                      {nudge.type}
                    </p>
                    {nudge.items ? (
                      <div className="flex flex-col gap-[6px]">
                        {nudge.items.map((item, i) => {
                          const done = item.done || completedItems.has(`${nudge.id}-${i}`);
                          return (
                          <div key={i} className="flex items-center gap-[8px]">
                            <div className="shrink-0 w-[14px] h-[14px] relative">
                              {/* Spinner */}
                              <div className={`absolute inset-0 rounded-full border-[2px] border-white/25 border-t-white/80 transition-opacity duration-300 ${done ? 'opacity-0' : 'animate-spin opacity-100'}`} />
                              {/* Geometric checkmark */}
                              <svg className={`absolute inset-0 transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0'}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                              </svg>
                            </div>
                            <p className="font-['Lato',sans-serif] italic text-[13px] text-white/90 tracking-[0.065px] leading-[1.4]">
                              {item.text}
                            </p>
                          </div>
                          );
                        })}
                        {nudge.cta && (
                          <button
                            className="mt-[4px] self-start px-[10px] h-[28px] rounded-[6px] font-['Lato',sans-serif] font-bold text-[13px] tracking-[0.13px] text-white/90 hover:bg-white/15 transition-colors"
                            style={{ border: '1px solid rgba(255,255,255,0.35)' }}
                            onClick={e => {
                              e.stopPropagation();
                              // Update CoA nudge in place to "pending" state
                              setDisplayedNudges(prev => prev.map(n =>
                                n.id === 'prop-1' ? { ...n, textFading: true } : n
                              ));
                              setTimeout(() => {
                                setDisplayedNudges(prev => prev.map(n =>
                                  n.id === 'prop-1' ? { ...n, type: 'Pending imaging results', description: 'Echo and chest CT ordered — awaiting results to confirm or rule out coarctation of the aorta.', textFading: false } : n
                                ));
                              }, 180);
                              // Notify desktop frame that orders were placed
                              if (nudge.cta === 'Place Orders') {
                                const bc = new BroadcastChannel('demo-events');
                                bc.postMessage({ type: 'ORDERS_PLACED' });
                                bc.close();
                              }
                              // Fade out only the orders nudge
                              setDisplayedNudges(prev => prev.map(n =>
                                n.id === nudge.id ? { ...n, visible: false } : n
                              ));
                              setTimeout(() => {
                                setDisplayedNudges(prev => prev.filter(n => n.id !== nudge.id));
                                addConfirmedLine('Order placed: Echo and Chest CT');
                              }, 250);
                            }}
                          >
                            {nudge.cta}
                          </button>
                        )}
                      </div>
                    ) : isExpanded && (
                      <p className="font-['Lato',sans-serif] text-[13px] text-white/90 tracking-[0.065px] leading-[1.4]">
                        {nudge.description}
                      </p>
                    )}
                  </div>
                  {!nudge.items && (
                  <div className="flex flex-col items-center justify-between self-stretch shrink-0 gap-[4px]">
                    <button className="size-[24px] flex items-center justify-center rounded-[6px] hover:bg-white/10 transition-colors" onClick={e => { e.stopPropagation(); setExpandedNudge(idx === expandedNudge ? -1 : idx); }}>
                      <InlineIcon name={isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} size={14} className="text-white" />
                    </button>
                    {isExpanded && (
                      <button className="size-[24px] flex items-center justify-center rounded-[6px] hover:bg-white/10 transition-colors">
                        <InlineIcon name="arrow_forward" size={14} className="text-white" />
                      </button>
                    )}
                  </div>
                  )}
                </div>
              );
            })}
          </div>
          )}

          {/* Confirmed action lines */}
          {confirmedLines.length > 0 && (
            <div className="w-full flex flex-col gap-[8px]">
              {confirmedLines.map((line, i) => (
                <p
                  key={i}
                  className="w-full font-['Lato',sans-serif] text-[13px] text-white/70 italic tracking-[0.065px] leading-[1.4] transition-opacity duration-300"
                  style={{ opacity: line.visible ? 1 : 0 }}
                >
                  ✓ {line.text}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-[8px] items-center w-full mt-auto">
          <button
            onClick={onPause}
            className="w-full h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Lato',sans-serif] font-bold text-[17px] text-white tracking-[0.34px] transition-colors hover:bg-white/10"
            style={{ border: '1.5px solid rgba(255,255,255,0.6)' }}
          >
            <InlineIcon name="pause" size={20} />
            Pause Recording
          </button>
          <button
            onClick={onEnd}
            className="w-full h-[48px] rounded-[8px] flex items-center justify-center gap-[8px] font-['Lato',sans-serif] font-bold text-[17px] text-[#1a1a1a] tracking-[0.34px] bg-white hover:bg-white/90 transition-colors"
          >
            <InlineIcon name="stop" size={20} />
            End Visit
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
