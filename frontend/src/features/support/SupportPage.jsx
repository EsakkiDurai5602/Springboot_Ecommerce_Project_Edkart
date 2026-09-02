import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Headphones,
  HelpCircle,
  MessageSquare,
  PhoneCall,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Send,
} from 'lucide-react';
import { BANK_CONFIG } from '../../utils/constants';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';

export const SupportPage = () => {
  const location = useLocation();
  const disputeRef = location.state?.disputeTxnRef || '';

  const [activeFaq, setActiveFaq] = useState(null);
  const [ticketData, setTicketData] = useState({
    subject: disputeRef ? `Dispute Transaction Ref: ${disputeRef}` : '',
    category: disputeRef ? 'Transaction Dispute' : 'General Inquiry',
    description: '',
  });
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Chat simulation
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your EdKart Virtual Banking Assistant. How can I assist with your NetBanking account today?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const faqs = [
    {
      q: 'How fast are IMPS and NEFT fund transfers?',
      a: 'IMPS transfers are credited instantly 24/7 in real-time. NEFT transfers are settled within 15–30 minutes based on RBI clearing batches.',
    },
    {
      q: 'What should I do if a card transaction fails but amount is debited?',
      a: 'Failed transactions are automatically reversed by our settlement engine within 24 to 48 hours. You can also file a ticket using the dispute form below.',
    },
    {
      q: 'How do I increase my daily online debit/credit card limit?',
      a: 'Navigate to "Cards" from the sidebar menu, select your card, and adjust the Daily Spending Limit slider to your preferred threshold.',
    },
    {
      q: 'Is Two-Factor Authentication mandatory for all transfers?',
      a: 'Yes, 2FA OTP authorization is required on all outbound fund transfers and profile updates for your financial security.',
    },
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setTicketData({ subject: '', category: 'General Inquiry', description: '' });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for your message regarding "${userMsg}". Your query has been logged under priority ticket #${Math.floor(10000 + Math.random() * 90000)}.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Support & Help Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          24/7 dedicated assistance for transaction disputes, card issues, and inquiries
        </p>
      </div>

      {/* Support Channels Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-5 text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Toll-Free Helpline</h4>
          <p className="font-mono text-sm font-extrabold text-brand-600 dark:text-cyan-400">{BANK_CONFIG.SUPPORT_PHONE}</p>
        </Card>

        <Card variant="default" className="p-5 text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Email Desk</h4>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{BANK_CONFIG.SUPPORT_EMAIL}</p>
        </Card>

        <Card variant="default" className="p-5 text-center space-y-2">
          <div className="mx-auto w-10 h-10 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Core Services Status</h4>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All Systems Normal (99.9%)</p>
        </Card>
      </div>

      {/* FAQs Accordion */}
      <Card variant="default">
        <CardHeader title="Frequently Asked Questions" subtitle="Instant answers to common NetBanking inquiries" />
        <CardBody className="divide-y divide-slate-100 dark:divide-slate-800">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3.5">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-cyan-400"
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {activeFaq === idx && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed animate-slide-up">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Raise Dispute Ticket & Live Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ticket Form */}
        <div className="lg:col-span-6">
          <Card variant="default">
            <CardHeader title="File Support Ticket or Dispute" />
            <CardBody className="p-6">
              {ticketSuccess ? (
                <div className="text-center py-6 space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Support Ticket Created!</h4>
                  <p className="text-xs text-slate-400">Ticket Ref: #{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
                  <Select
                    label="Issue Category"
                    value={ticketData.category}
                    onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  >
                    <option value="Transaction Dispute">Transaction Dispute / Double Debit</option>
                    <option value="Card Block / Unblock">Card Block / PIN Issue</option>
                    <option value="NetBanking Access">NetBanking Login / 2FA</option>
                    <option value="General Inquiry">General Account Inquiry</option>
                  </Select>

                  <Input
                    label="Subject / Reference ID"
                    placeholder="e.g. Transaction TXN2609028812 issue"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                    required
                  />

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
                      Detailed Description
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please provide specifics regarding the transaction or query..."
                      value={ticketData.description}
                      onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>

                  <Button type="submit" variant="primary" fullWidth size="lg">
                    Submit Issue Ticket
                  </Button>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Live Chat Simulation */}
        <div className="lg:col-span-6">
          <Card variant="default" className="flex flex-col h-[400px]">
            <CardHeader title="Virtual Banking Assistant" subtitle="Instant automated answers" />
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-br-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
              <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />}>
                Send
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
