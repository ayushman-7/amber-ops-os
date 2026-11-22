import React, { useState } from 'react';
import {
  X,
  Hash,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  ExternalLink,
  Volume2,
  Sparkles,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { DispatchedSlackMessage, WebhookConfig } from '../types';
import { playSlackChime } from '../utils/webhookClient';

interface SlackChannelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: DispatchedSlackMessage[];
  onSendMessage: (channel: string, text: string) => void;
  onClearMessages: () => void;
  webhookConfig: WebhookConfig;
}

const CHANNELS = [
  '#pod-guarantors-alerts',
  '#product-leadership-digest',
  '#pod-booking-ops',
  '#pod-pb-sync-eng',
  '#pod-supply-partners',
];

export const SlackChannelDrawer: React.FC<SlackChannelDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onClearMessages,
  webhookConfig,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('#pod-guarantors-alerts');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMessages = messages.filter(
    (m) => m.channel === selectedChannel || selectedChannel === 'all'
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    onSendMessage(selectedChannel, inputMessage.trim());
    setInputMessage('');
    playSlackChime();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasRealSlackWebhook = Boolean(
    webhookConfig.slackWebhookUrl && webhookConfig.slackWebhookUrl.trim().startsWith('http')
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#1A1D21] text-slate-200 w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Workspace Top Header */}
        <div className="h-14 px-4 bg-[#121016] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-[#ED3A56] text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
              a
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm text-white font-sans">Amber Engineering Hub</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                {hasRealSlackWebhook ? 'Connected to Real Slack Webhook' : 'Live In-App Slack Terminal'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => playSlackChime()}
              title="Test Slack Chime Sound"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real Slack Status Banner (if configured) */}
        {hasRealSlackWebhook && (
          <div className="bg-emerald-950/70 border-b border-emerald-800/80 px-4 py-2 text-[11px] text-emerald-300 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Real Incoming Slack Webhook Active: Messages forward to your team workspace!</span>
            </div>
          </div>
        )}

        {/* Channels Bar */}
        <div className="px-3 py-2 bg-[#19171D] border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto scrollbar-none shrink-0">
          {CHANNELS.map((ch) => {
            const isSelected = selectedChannel === ch;
            const count = messages.filter((m) => m.channel === ch).length;

            return (
              <button
                key={ch}
                onClick={() => setSelectedChannel(ch)}
                className={`px-2.5 py-1 rounded text-xs font-mono whitespace-nowrap transition-colors flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <Hash className="w-3 h-3 text-slate-500" />
                <span>{ch.replace('#', '')}</span>
                {count > 0 && (
                  <span className="text-[10px] bg-[#ED3A56] text-white px-1 py-0.2 rounded-full font-bold ml-1">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Channel Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                <Hash className="w-5 h-5" />
              </div>
              <h4 className="font-sans font-bold text-slate-300 text-sm">
                Welcome to {selectedChannel}
              </h4>
              <p className="text-xs max-w-xs leading-relaxed text-slate-400">
                This is where automated nudges and sprint digests land when you click <strong>"Approve &amp; Send Nudge"</strong> in the control tower.
              </p>
            </div>
          ) : (
            currentMessages.map((msg) => (
              <div
                key={msg.id}
                className="group p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
              >
                {/* Message Header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded bg-[#ED3A56] text-white font-bold text-[11px] flex items-center justify-center">
                      a
                    </div>
                    <span className="font-bold text-white font-sans">{msg.sender}</span>
                    {msg.senderBadge && (
                      <span className="bg-slate-700 text-slate-300 font-sans text-[9px] px-1 py-0.2 rounded font-bold">
                        {msg.senderBadge}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy text"
                      className="p-1 rounded hover:bg-slate-850 text-slate-400 hover:text-white"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap pl-8">
                  {msg.text}
                </div>

                {/* Tag Footer */}
                <div className="pl-8 flex items-center space-x-2 text-[10px] text-slate-500">
                  <span className="font-mono bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-400">
                    {msg.channel}
                  </span>
                  {msg.ticketId && (
                    <span className="font-mono text-[#ED3A56] bg-rose-950/60 px-1.5 py-0.2 rounded">
                      {msg.ticketId}
                    </span>
                  )}
                  <span className="text-emerald-500">✓ Dispatched</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input Footer (Simulate sending text straight into Slack) */}
        <div className="p-3 bg-[#121016] border-t border-slate-800 shrink-0">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              placeholder={`Send message to ${selectedChannel}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#ED3A56] focus:border-[#ED3A56]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-[#ED3A56] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
            <span>
              Every approved nudge from the control tower is automatically routed here.
            </span>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={onClearMessages}
                className="text-slate-400 hover:text-rose-400 underline underline-offset-2"
              >
                Clear Messages
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
