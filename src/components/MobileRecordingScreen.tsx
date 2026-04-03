import React, { useEffect, useRef, useState } from 'react';
import { InlineIcon } from './InlineIcon';

interface CareNudge {
  type: string;
  description: string;
}

interface MobileRecordingScreenProps {
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  chiefComplaint: string;
  nudges?: CareNudge[];
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
  onPause,
  onEnd,
}: MobileRecordingScreenProps) => {
  const [seconds, setSeconds] = useState(0);
  const [expandedNudge, setExpandedNudge] = useState(0);
  const [bars, setBars] = useState<number[]>(initialBars);

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
          {nudges.length > 0 && (
          <div className="w-full pt-[8px] flex flex-col gap-[6px]">
            {nudges.map((nudge, idx) => {
              const isExpanded = expandedNudge === idx;
              return (
                <div
                  key={idx}
                  className={`flex gap-[8px] px-[10px] py-[6px] rounded-[8px] w-full cursor-pointer ${isExpanded ? 'items-start' : 'items-center'}`}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: '0px 4px 16px 0px rgba(0,0,0,0.07)',
                  }}
                  onClick={() => setExpandedNudge(idx)}
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-['Lato',sans-serif] font-bold text-[14px] text-white tracking-[0.14px] leading-[1.2] h-[24px] flex items-center">
                      {nudge.type}
                    </p>
                    {isExpanded && (
                      <p className="font-['Lato',sans-serif] text-[13px] text-white/90 tracking-[0.065px] leading-[1.4]">
                        {nudge.description}
                      </p>
                    )}
                  </div>
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
                </div>
              );
            })}
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
