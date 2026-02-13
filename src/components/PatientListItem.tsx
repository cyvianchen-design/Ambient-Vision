import React from 'react';
import { Avatar } from './Avatar';
import { VisitStatus } from './Badge';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  time: string;
  status: 'Generated' | 'Uploading' | 'Processing' | 'Error' | 'In Queue';
  duration?: string;
  initial: string;
  isSelected?: boolean;
};

export type PatientListItemProps = {
  patient: Patient;
  onClick?: () => void;
  className?: string;
};

export const PatientListItem: React.FC<PatientListItemProps> = ({
  patient,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        patient.isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : 'hover:bg-gray-50'
      } ${className}`}
    >
      <Avatar initial={patient.initial} color="orange" size="medium" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-gray-900 truncate">{patient.name}</h3>
          <VisitStatus status={patient.status} />
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
          <span>{patient.age} · {patient.gender}</span>
          {patient.duration && <span>· {patient.duration}</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{patient.time}</p>
      </div>
    </div>
  );
};
