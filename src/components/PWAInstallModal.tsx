import React, { useState } from 'react';
import { Smartphone, X, CheckCircle2, Share, PlusSquare, MoreVertical, Download, Sparkles, ShieldCheck } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                Aplikasi Web Progresif (PWA)
              </span>
              <h2 className="text-lg font-bold leading-tight">Instal di Layar Utama HP</h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Quick Instant Install if browser supports beforeinstallprompt */}
          {isInstallable && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Browser Anda Mendukung Instal Otomatis!
              </div>
              <p className="text-xs text-slate-600">
                Klik tombol di bawah ini untuk langsung menambahkan aplikasi ke layar utama HP Anda.
              </p>
              <button
                onClick={async () => {
                  const success = await install();
                  if (success) onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Pasang Sekarang (1-Klik)
              </button>
            </div>
          )}

          {/* Platform Tab Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Jenis Perangkat HP Anda:
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActivePlatform('android')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activePlatform === 'android'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Android (Chrome)
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform('ios')}
                className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activePlatform === 'ios'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Share className="w-3.5 h-3.5" />
                iPhone / iPad (Safari)
              </button>
            </div>
          </div>

          {/* Instructions: Android */}
          {activePlatform === 'android' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px]">A</span>
                Cara Instal di Google Chrome (Android):
              </h4>
              <ol className="text-xs text-slate-600 space-y-2.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">1.</span>
                  <span>Buka halaman aplikasi ini menggunakan peramban <strong>Google Chrome</strong> di HP Anda.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">2.</span>
                  <span>Ketuk ikon <strong>titik tiga (⋮)</strong> di sudut kanan atas Chrome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">3.</span>
                  <span>Pilih menu <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">4.</span>
                  <span>Konfirmasi dengan menekan <strong>"Instal"</strong>. Ikon aplikasi akan muncul di beranda HP seperti aplikasi native.</span>
                </li>
              </ol>
            </div>
          )}

          {/* Instructions: iOS */}
          {activePlatform === 'ios' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[11px]">i</span>
                Cara Pasang di Safari (iPhone / iPad):
              </h4>
              <ol className="text-xs text-slate-600 space-y-2.5 list-none pl-0">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">1.</span>
                  <span>Buka situs web ini di peramban <strong>Safari</strong> (bawaan iOS).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">2.</span>
                  <span>Ketuk tombol <strong>Bagikan / Share</strong> (ikon kotak dengan panah ke atas <Share className="inline w-3.5 h-3.5 text-blue-600" />) di bilah bawah Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">3.</span>
                  <span>Gulir ke bawah dan ketuk opsi <strong>"Add to Home Screen" (Tambah ke Layar Utama)</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">4.</span>
                  <span>Ketuk <strong>"Tambah" (Add)</strong> di pojok kanan atas. Selesai!</span>
                </li>
              </ol>
            </div>
          )}

          {/* Offline benefit info */}
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-teal-900 leading-snug">
              <strong>Bisa Dibuka Tanpa Kuota / Offline:</strong> Data nilai dan santri otomatis tersimpan di memori HP Anda. Aplikasi dapat dibuka kapan pun saat tidak ada sinyal internet.
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
