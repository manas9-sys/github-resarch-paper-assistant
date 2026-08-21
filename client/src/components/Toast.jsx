import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const styles = {
    success: 'bg-emerald-600 border-emerald-500/40',
    error: 'bg-red-600 border-red-500/40',
    info: 'bg-sky-600 border-sky-500/40',
    warning: 'bg-amber-500 border-amber-400/40'
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  };

  const Icon = icons[toast.type] || Info;
  const style = styles[toast.type] || styles.info;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-white text-sm font-medium backdrop-blur-sm ${style} animate-slide-in`}
      style={{ animation: 'slideInRight 0.3s ease' }}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{toast.message}</span>
    </div>
  );
}
