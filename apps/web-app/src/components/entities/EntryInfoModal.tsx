'use client';

import { Modal } from '@/components/ui';
import { format } from 'date-fns';
import { Calendar, DollarSign, Tag, FileText, Clock } from 'lucide-react';
import { TYPE_CONFIG } from './constants';
import { FinancialEntry } from '@/lib/graphql';

interface EntryInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: FinancialEntry | null;
}

export default function EntryInfoModal({ isOpen, onClose, entry }: EntryInfoModalProps) {
  if (!entry) return null;

  const config = TYPE_CONFIG[entry.type as keyof typeof TYPE_CONFIG];
  const Icon = config?.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Entry Details"
      description="View financial entry information"
      size="lg"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 pb-6 border-b border-neutral-200">
          {config && Icon && (
            <div className={`p-4 rounded-xl ${config.bgColor}`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-neutral-900">{entry.category}</h3>
              {config && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
                >
                  {config.label}
                </span>
              )}
            </div>
            <div className="text-3xl font-bold text-neutral-900">
              {entry.currency} $
              {entry.amount.toLocaleString('en-CA', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Date</span>
            </div>
            <p className="text-lg font-semibold text-neutral-900">
              {format(new Date(entry.date), 'MMMM dd, yyyy')}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <FileText className="w-4 h-4" />
              <span className="font-medium">Tax Year</span>
            </div>
            <p className="text-lg font-semibold text-neutral-900">{entry.taxYear}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">Currency</span>
            </div>
            <p className="text-lg font-semibold text-neutral-900">{entry.currency}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Tag className="w-4 h-4" />
              <span className="font-medium">Entry ID</span>
            </div>
            <p className="text-sm font-mono text-neutral-600 break-all">{entry.id}</p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
            <Clock className="w-4 h-4" />
            <span className="font-medium">Timestamps</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Created:</span>{' '}
              <span className="text-neutral-900">
                {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
            <div>
              <span className="text-neutral-500">Updated:</span>{' '}
              <span className="text-neutral-900">
                {format(new Date(entry.updatedAt), 'MMM dd, yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
