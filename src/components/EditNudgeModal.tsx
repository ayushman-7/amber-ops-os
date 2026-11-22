import React, { useState } from 'react';
import { X, Send, Bot, Hash } from 'lucide-react';
import { SlackNudge } from '../types';

interface EditNudgeModalProps {
  nudge: SlackNudge | null;
  onClose: () => void;
  onSaveAndDispatch: (nudgeId: string, updatedMessage: string, targetChannel: string) => void;
}

export const EditNudgeModal: React.FC<EditNudgeModalProps> = ({
  nudge,
  onClose,
  onSaveAndDispatch,
}) => {
  if (!nudge) return null;

  const [message, setMessage] = useState(nudge.draftedMessage);
  const [channel, setChannel] = useState(nudge.targetChannel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAndDispatch(nudge.id, message, channel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-200 relative animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-rose-50 text-[#ED3A56] px-1.5 py-0.5 rounded">
                {nudge.ticketId}
              </span>
              <span className="text-xs text-slate-500 font-medium">Edit Nudge Draft</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">{nudge.ticketTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Channel / DM
            </label>
            <div className="relative">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Drafted Slack Message (Markdown)
            </label>
            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ED3A56]/20 focus:border-[#ED3A56] leading-relaxed resize-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">AI Context Note: </span>
            {nudge.aiDraftReason}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-[#ED3A56] text-white hover:bg-[#D82945] transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Approve &amp; Dispatch to Slack</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
