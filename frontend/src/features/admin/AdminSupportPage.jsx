import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/bankingServices';
import {
  Headphones,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

export const AdminSupportPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadTickets = async () => {
    const list = await adminService.getTickets();
    setTickets(list || []);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    await adminService.replyTicket(selectedTicket.id, replyText);
    setReplyText('');
    await loadTickets();
    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, { sender: 'admin', text: replyText, timestamp: new Date().toISOString() }],
    }));
  };

  const handleUpdateStatus = async (status) => {
    await adminService.updateTicketStatus(selectedTicket.id, status);
    await loadTickets();
    setSelectedTicket((prev) => ({ ...prev, status }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Disputes & Support Desk
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review customer transaction dispute tickets, send official replies, and resolve issues
        </p>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((t) => (
          <Card key={t.id} variant="default" className="flex flex-col justify-between">
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant={t.status === 'RESOLVED' ? 'success' : t.status === 'IN_PROGRESS' ? 'warning' : 'danger'} size="sm">
                  {t.status}
                </Badge>
                <span className="font-mono text-[10px] text-slate-400">{t.ticketNumber}</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{t.subject}</h3>
              <p className="text-xs text-slate-500">
                Customer: <strong className="text-slate-800 dark:text-slate-200">{t.customerName}</strong> ({t.customerId})
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {t.messages[0]?.text}
              </div>
            </CardBody>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{formatDateTime(t.createdAt)}</span>
              <Button onClick={() => setSelectedTicket(t)} variant="primary" size="sm">
                Open Resolution Desk
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Ticket Details & Chat Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={selectedTicket?.ticketNumber}
        subtitle={`${selectedTicket?.category} — ${selectedTicket?.customerName}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedTicket?.subject}</h4>
            <div className="flex gap-1.5">
              <Button
                onClick={() => handleUpdateStatus('IN_PROGRESS')}
                variant={selectedTicket?.status === 'IN_PROGRESS' ? 'primary' : 'secondary'}
                size="sm"
              >
                In Progress
              </Button>
              <Button
                onClick={() => handleUpdateStatus('RESOLVED')}
                variant={selectedTicket?.status === 'RESOLVED' ? 'success' : 'secondary'}
                size="sm"
              >
                Resolve
              </Button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
            {selectedTicket?.messages?.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'admin'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1">
                    {m.sender === 'admin' ? 'Admin Support' : selectedTicket?.customerName}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleReplySubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Type administrative reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="w-4 h-4" />}>
              Send Reply
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
