import React, { useState } from 'react';
import { SlideData } from '../types';
import { Plus, Trash2, Save, X, LayoutGrid, CheckCircle2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

interface Props {
  slides: SlideData[];
  onSave: (slides: SlideData[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<Props> = ({ slides, onSave, onClose }) => {
  const [localSlides, setLocalSlides] = useState<SlideData[]>(slides);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleUpdateSlide = (id: string, updates: Partial<SlideData>) => {
    const updated = localSlides.map(s => s.id === id ? { ...s, ...updates } : s);
    setLocalSlides(updated);
    setHasUnsavedChanges(true);
  };

  const handleCreate = () => {
    const newSlide: SlideData = {
      id: Date.now().toString(),
      type: 'promo',
      day: 'New Day',
      title: 'New Special',
      description: 'Enter description...',
      price: '$0',
      imageUrl: 'images/steak-night.jpg',
      highlightColor: '#f59e0b'
    };
    setLocalSlides([...localSlides, newSlide]);
    setHasUnsavedChanges(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this slide?')) {
      const updated = localSlides.filter(s => s.id !== id);
      setLocalSlides(updated);
      setHasUnsavedChanges(true);
    }
  };

  const handleBulkSave = () => {
    onSave(localSlides);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-amber-500 flex items-center gap-3">
              <LayoutGrid className="w-8 h-8" />
              Tavern Overview
            </h1>
            <p className="text-slate-400 text-sm">Rapid bulk editor for all active slides</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all border border-slate-700"
          >
            <Plus className="w-5 h-5" /> Add Slide
          </button>
          
          <button 
            onClick={handleBulkSave}
            disabled={!hasUnsavedChanges}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold transition-all shadow-xl ${
              hasUnsavedChanges 
              ? 'bg-amber-600 hover:bg-amber-500 text-white scale-105' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Save className="w-5 h-5" /> {hasUnsavedChanges ? 'Save All Changes' : 'Saved'}
          </button>

          <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {localSlides.filter(s => s.type === 'promo').map((slide, index) => (
            <div 
              key={slide.id} 
              className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col"
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Slide #{index + 1}</span>
                <button 
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Day / Label</label>
                    <input 
                      type="text" 
                      value={slide.day || ''} 
                      onChange={e => handleUpdateSlide(slide.id, { day: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-amber-500 outline-none transition-colors"
                      placeholder="Monday"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Price / Time</label>
                    <input 
                      type="text" 
                      value={slide.price || ''} 
                      onChange={e => handleUpdateSlide(slide.id, { price: e.target.value })}
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-amber-500 outline-none transition-colors font-bold text-amber-500"
                      placeholder="$20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Title</label>
                  <input 
                    type="text" 
                    value={slide.title || ''} 
                    onChange={e => handleUpdateSlide(slide.id, { title: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-base font-bold focus:border-amber-500 outline-none transition-colors"
                    placeholder="Steak Night"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
                  <textarea 
                    value={slide.description || ''} 
                    onChange={e => handleUpdateSlide(slide.id, { description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-2.5 text-sm focus:border-amber-500 outline-none transition-colors resize-none leading-relaxed"
                    placeholder="Describe the offer..."
                  />
                </div>

                <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Background Image Path</label>
                    <div className="flex items-center gap-2 bg-slate-950/50 border border-slate-700 rounded-lg p-1 px-2">
                      <ImageIcon className="w-4 h-4 text-slate-600" />
                      <input 
                        type="text" 
                        value={slide.imageUrl || ''} 
                        onChange={e => handleUpdateSlide(slide.id, { imageUrl: e.target.value })}
                        className="flex-1 bg-transparent p-1.5 text-xs font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Theme</label>
                    <input 
                      type="color" 
                      value={slide.highlightColor || '#f59e0b'} 
                      onChange={e => handleUpdateSlide(slide.id, { highlightColor: e.target.value })}
                      className="h-9 w-9 bg-transparent cursor-pointer rounded-lg overflow-hidden border border-slate-700"
                    />
                  </div>
                </div>
              </div>

              {/* Status footer for card */}
              <div className="px-6 py-3 bg-slate-800/30 flex items-center justify-between text-[10px] text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  LIVE PREVIEW ACTIVE
                </div>
                <div className="font-mono">{slide.id}</div>
              </div>
            </div>
          ))}

          {/* Add Slide Placeholder */}
          <button 
            onClick={handleCreate}
            className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-12 text-slate-600 hover:text-amber-500 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-bold uppercase tracking-widest text-sm">Add New Promotion</span>
          </button>
        </div>
      </div>
      
      {/* Footer Status Bar */}
      {hasUnsavedChanges && (
        <div className="bg-amber-600 p-3 text-center text-sm font-bold animate-bounce-in">
          You have unsaved changes! Don't forget to click "Save All Changes" before closing.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;