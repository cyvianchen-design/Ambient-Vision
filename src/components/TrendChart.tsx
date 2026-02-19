import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface TrendChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
  color?: string;
  yAxisDomain?: [number, number];
  referenceRange?: { min: number; max: number; label: string; color?: string };
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  title, 
  data, 
  unit = '', 
  color = '#1132ee',
  yAxisDomain,
  referenceRange,
  height = 240
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-[12px] py-[8px] rounded-[6px] shadow-[0px_2px_8px_rgba(0,0,0,0.1)] border border-[#e5e5e5]">
          <p className="font-['Lato',sans-serif] text-[12px] text-[#666] mb-[4px]">
            {payload[0].payload.label || payload[0].payload.date}
          </p>
          <p className="font-['Lato',sans-serif] text-[13px] font-bold text-[#000]">
            {payload[0].value}{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[var(--surface-base,white)] flex flex-col gap-[24px] p-[16px] rounded-[12px] border border-[#e5e5e5] w-full">
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-col font-['Lato',sans-serif] font-bold justify-center leading-[0] not-italic text-[13px] text-[color:var(--text-default,black)] tracking-[0.13px]" style={{ fontFeatureSettings: "'ss07'" }}>
          <p className="leading-[1.2]">{title}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height - 70}>
        <LineChart data={data} margin={{ top: 0, right: 0, left: -4, bottom: 5 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#d0d0d0" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            tick={{ 
              fill: '#666', 
              fontSize: 12, 
              fontFamily: 'Lato, sans-serif',
              textAnchor: 'middle'
            }}
            axisLine={{ stroke: '#d0d0d0' }}
            tickLine={false}
            height={20}
            padding={{ left: 10, right: 0 }}
          />
          <YAxis 
            domain={yAxisDomain}
            tick={{ 
              fill: '#666', 
              fontSize: 12, 
              fontFamily: 'Lato, sans-serif',
              textAnchor: 'end'
            }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e5e5', strokeWidth: 1 }} />
          {referenceRange && (
            <ReferenceArea
              y1={referenceRange.min}
              y2={referenceRange.max}
              fill={referenceRange.color || '#2f6a32'}
              fillOpacity={0.1}
              label={{
                value: referenceRange.label,
                position: 'insideTopRight',
                fill: referenceRange.color || '#2f6a32',
                fontSize: 11,
                fontFamily: 'Lato, sans-serif',
                fontWeight: 600
              }}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
