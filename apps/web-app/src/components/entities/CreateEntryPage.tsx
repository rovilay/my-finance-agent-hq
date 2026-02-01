'use client';

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
} from '@/components/ui';
import { Upload, FileText, Plus, AlertCircle, Loader } from 'lucide-react';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';
import { BackButton } from '../BackButton';
import { CATEGORIES_BY_TYPE } from './constants';
import { createFinancialEntrySchema, supportedTaxYears } from '@hq/validation-schema';
import { FinancialType, useAddFinancialEntryMutation } from '@/lib/graphql';

interface CreateEntryPageProps {
  entityId: string;
  onBack: () => void;
}

export default function CreateEntryPage({ entityId, onBack }: CreateEntryPageProps) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: 0,
    category: '',
    type: FinancialType.Income,
    date: '',
    taxYear: new Date().getFullYear().toString(),
  });
  const [customCategory, setCustomCategory] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [addFinancialEntry, { loading }] = useAddFinancialEntryMutation({
    onCompleted: () => {
      setErrors({});
      onBack();
    },
    onError: err => {
      setErrors({ form: err.message || 'Failed to update entity. Please try again.' });
    },
    refetchQueries: ['GetFinancialEntries'],
  });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors({});
    console.log('Submitting form data:', formData);

    // Determine the final category
    let finalCategory = formData.category;

    // If "Other" is selected, use the custom category
    if (formData.category === 'Other') {
      const trimmedCustom = customCategory.trim();

      // Check if custom category matches a popular one for this type (case-insensitive)
      const categoriesForType =
        CATEGORIES_BY_TYPE[formData.type as keyof typeof CATEGORIES_BY_TYPE] || [];
      const matchingCategory = categoriesForType.find(
        cat => cat.toLowerCase() === trimmedCustom.toLowerCase()
      );

      finalCategory = matchingCategory || trimmedCustom;
    }

    // Validate form data
    const dataToValidate = { ...formData, category: finalCategory, currency: 'CAD', entityId };
    const result = createFinancialEntrySchema.safeParse(dataToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      console.log('Validation errors:', fieldErrors);
      return;
    }
    try {
      await addFinancialEntry({
        variables: {
          input: {
            entityId,
            amount: formData.amount,
            category: finalCategory,
            type: formData.type as FinancialType,
            date: formData.date,
            taxYear: formData.taxYear,
          },
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <BackButton onClick={onBack} text="Back to Entries" />

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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Amount (CAD)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={formData.amount}
                      onChange={e => {
                        const value = Math.abs(parseFloat(e.target.value) || 0);
                        setFormData({ ...formData, amount: value });
                        if (errors.amount) setErrors({ ...errors, amount: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.amount ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="0.00"
                      required
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={e => {
                        setFormData({
                          ...formData,
                          type: e.target.value as FinancialType,
                          category: '',
                        });
                        setCustomCategory('');
                      }}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value={FinancialType.Income}>Income</option>
                      <option value={FinancialType.Deduction}>Deduction</option>
                      <option value={FinancialType.Credit}>Credit</option>
                      <option value={FinancialType.TaxPaid}>Tax Paid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => {
                      setFormData({ ...formData, category: e.target.value });
                      // Clear custom category if switching away from "Other"
                      if (e.target.value !== 'Other') {
                        setCustomCategory('');
                      }
                      if (errors.category) setErrors({ ...errors, category: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-neutral-300'
                    }`}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES_BY_TYPE[formData.type as keyof typeof CATEGORIES_BY_TYPE]?.map(
                      category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      )
                    )}
                    <option value="Other">Other</option>
                  </select>

                  {/* Show custom Input when "Other" is selected */}
                  {formData.category === 'Other' && (
                    <Input
                      type="text"
                      value={customCategory}
                      onChange={e => {
                        setCustomCategory(e.target.value);
                        if (errors.category) setErrors({ ...errors, category: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2 ${
                        errors.category ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      placeholder="Enter custom category"
                      required
                    />
                  )}
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={e => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) setErrors({ ...errors, date: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.date ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      required
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tax Year
                    </label>
                    <select
                      value={formData.taxYear}
                      onChange={e => {
                        setFormData({ ...formData, taxYear: e.target.value });
                        if (errors.taxYear) setErrors({ ...errors, taxYear: '' });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.taxYear ? 'border-red-500' : 'border-neutral-300'
                      }`}
                      required
                    >
                      {supportedTaxYears.map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.taxYear && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.taxYear}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {errors.form && (
                  <div className="bg-error-light border border-error text-error-dark px-4 py-3 rounded-lg text-sm">
                    {errors.form}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" variant="primary" className="flex-1">
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Entry
                      </>
                    )}
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
