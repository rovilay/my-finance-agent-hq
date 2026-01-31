'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { ArrowLeft, Upload, FileText, Plus } from 'lucide-react';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';

interface CreateEntryPageProps {
  entityId: string;
  onBack: () => void;
}

export default function CreateEntryPage({ entityId, onBack }: CreateEntryPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    type: 'income',
    date: '',
    taxYear: new Date().getFullYear().toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement mutation
    console.log('Submit entry:', formData);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Entries
          </button>

          <Card>
            <CardHeader>
              <CardTitle>Create Financial Entry</CardTitle>
              <CardDescription>Add a new income, deduction, or expense entry</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upload Option */}
              <div className="mb-8 p-6 border-2 border-dashed border-neutral-300 rounded-lg">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    Upload Document to Auto-Fill
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Upload a tax document to automatically extract and fill this form
                  </p>
                  <Button onClick={() => setIsUploadModalOpen(true)} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-neutral-500">OR ENTER MANUALLY</span>
                </div>
              </div>

              {/* Manual Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="income">Income</option>
                      <option value="deduction">Deduction</option>
                      <option value="credit">Credit</option>
                      <option value="tax_paid">Tax Paid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Employment, Investment, Medical"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tax Year
                    </label>
                    <input
                      type="text"
                      value={formData.taxYear}
                      onChange={e => setFormData({ ...formData, taxYear: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="2024"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" variant="primary" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Entry
                  </Button>
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        entityId={entityId}
      />
    </div>
  );
}
