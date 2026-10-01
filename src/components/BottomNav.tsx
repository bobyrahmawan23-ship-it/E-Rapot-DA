import React from 'react';
import { Edit3, FileText, BookOpen, Users, Download } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'input' | 'rapot' | 'kompetensi' | 'santri';
  setActiveTab: (tab: 'input' | 'rapot' | 'kompetensi' | 'santri') => void;
  onOpenInstallGuide: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenInstallGuide,
}) => {
  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 sm:hidden">
      <div className="grid grid-cols-5 gap-1 items-center">
        
        {/* Tab 1: Input Nilai */}
        <button
          type="button"
          onClick={() => setActiveTab('input')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'input'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'input' ? 'bg-emerald-100' : ''}`}>
            <Edit3 className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Nilai</span>
        </button>

        {/* Tab 2: Rapot A4 */}
        <button
          type="button"
          onClick={() => setActiveTab('rapot')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'rapot'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'rapot' ? 'bg-emerald-100' : ''}`}>
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Rapot A4</span>
        </button>

        {/* Tab 3: Kompetensi */}
        <button
          type="button"
          onClick={() => setActiveTab('kompetensi')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'kompetensi'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'kompetensi' ? 'bg-emerald-100' : ''}`}>
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">KKM (75)</span>
        </button>

        {/* Tab 4: Santri */}
        <button
          type="button"
          onClick={() => setActiveTab('santri')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
            activeTab === 'santri'
              ? 'text-emerald-700 font-extrabold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <div className={`p-1 rounded-lg ${activeTab === 'santri' ? 'bg-emerald-100' : ''}`}>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Santri</span>
        </button>

        {/* Tab 5: Instal HP */}
        <button
          type="button"
          onClick={onOpenInstallGuide}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-emerald-800 hover:text-emerald-950 font-medium"
        >
          <div className="p-1 rounded-lg bg-emerald-50">
            <Download className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Instal PWA</span>
        </button>

      </div>
    </nav>
  );
};
