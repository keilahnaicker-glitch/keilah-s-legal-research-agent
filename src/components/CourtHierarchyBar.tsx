import React from 'react';
import { CourtFocus } from '../types';
import { Award, ShieldAlert, Landmark, Building2, Briefcase } from 'lucide-react';

interface CourtHierarchyBarProps {
  currentCourt: CourtFocus;
  onSelectCourt: (court: CourtFocus) => void;
}

export const CourtHierarchyBar: React.FC<CourtHierarchyBarProps> = ({
  currentCourt,
  onSelectCourt,
}) => {
  const courts: { id: CourtFocus; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'all',
      label: 'All SA Courts',
      sub: 'Strict Precedent Hierarchy',
      icon: <Landmark className="w-3.5 h-3.5" />,
    },
    {
      id: 'ZACC',
      label: 'Constitutional Court',
      sub: 'ZACC • Apex Court',
      icon: <Award className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      id: 'ZASCA',
      label: 'Supreme Court of Appeal',
      sub: 'ZASCA • Appellate Apex',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      id: 'ZAHC',
      label: 'High Courts',
      sub: 'GP, WC, KZN, FS, EC, etc.',
      icon: <Building2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      id: 'ZALAC',
      label: 'Labour Courts',
      sub: 'LC & LAC (ZALC / ZALAC)',
      icon: <Briefcase className="w-3.5 h-3.5 text-indigo-500" />,
    },
    {
      id: 'SPECIALIST',
      label: 'Specialist Tribunals',
      sub: 'CAC, Tax, Land Claims, Eq.',
      icon: <Landmark className="w-3.5 h-3.5 text-purple-600" />,
    },
  ];

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-1 no-print">
      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
        Court Focus:
      </span>
      {courts.map((court) => {
        const isActive = currentCourt === court.id;
        return (
          <button
            key={court.id}
            id={`court-focus-${court.id}`}
            onClick={() => onSelectCourt(court.id)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border shrink-0 transition-all ${
              isActive
                ? 'bg-stone-900 text-stone-100 border-stone-800 shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
            }`}
          >
            {court.icon}
            <span className="font-semibold">{court.label}</span>
            <span className={`text-[10px] hidden sm:inline ${isActive ? 'text-amber-300/80' : 'text-stone-400'}`}>
              • {court.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
