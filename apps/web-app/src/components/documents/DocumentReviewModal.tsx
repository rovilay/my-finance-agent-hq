import React, { useState, Fragment } from 'react';
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Button } from '@/components/ui';
import { FileText, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { RetentionPolicy, useVerifyAndFinalizeDocumentMutation } from '@/lib/graphql';

interface DocumentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  entityId: string;
  fileName: string;
  extractedData?: string | null;
  retentionPolicy: RetentionPolicy;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export default function DocumentReviewModal({
  isOpen,
  onClose,
  documentId,
  fileName,
  extractedData,
  retentionPolicy,
  readOnly = false,
  onSuccess,
}: DocumentReviewModalProps) {
  const [shouldKeepFile, setShouldKeepFile] = useState(
    retentionPolicy === RetentionPolicy.Permanent
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [verifyAndFinalize, { loading: submitting }] = useVerifyAndFinalizeDocumentMutation({
    onCompleted: () => {
      setErrors({});
      onSuccess?.();
      onClose();
    },
    onError: err => {
      setErrors({ form: err.message || 'Failed to finalize document. Please try again.' });
    },
    refetchQueries: ['GetDocumentsByEntity', 'GetFinancialEntries'],
  });

  // Parse extracted data for display
  let parsedData: Record<string, any> | null = null;
  let parseError = false;

  if (extractedData) {
    try {
      parsedData = JSON.parse(extractedData);
    } catch (error) {
      console.error('Failed to parse extracted data:', error);
      parseError = true;
    }
  }

  console.log('Parsed Data:', parsedData);

  // Format key names for display (camelCase -> Title Case)
  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Format value for display
  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      // Format as currency if it looks like a monetary value
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
      }).format(value);
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  const handleApprove = async () => {
    setErrors({});
    try {
      await verifyAndFinalize({
        variables: {
          documentId,
          approved: true,
          shouldKeepFile,
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleReject = async () => {
    try {
      await verifyAndFinalize({
        variables: {
          documentId,
          approved: false,
          shouldKeepFile: false,
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={handleClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl my-8 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                <div>
                  <DialogTitle className="text-xl font-semibold text-neutral-900">
                    {readOnly ? 'Extracted Data' : 'Review Extracted Data'}
                  </DialogTitle>
                  <Description className="text-sm text-neutral-600 mt-1">
                    {readOnly
                      ? 'Data saved to your tax summary'
                      : 'Verify the accuracy of the extracted information'}
                  </Description>
                </div>
                <button
                  onClick={handleClose}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Document Info Section */}
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-10 h-10 text-primary-500" />
                    <div className="flex-1">
                      <p className="text-sm text-neutral-600 mb-1">Document</p>
                      <p className="font-semibold text-neutral-900">{fileName || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Extracted Data Display */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-neutral-700">Extracted Data</h3>

                  {parseError ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">Failed to parse extracted data</p>
                      </div>
                    </div>
                  ) : !parsedData ? (
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <p className="text-sm text-neutral-500">No data extracted from document</p>
                    </div>
                  ) : (
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-neutral-200">
                        {Object.entries(parsedData).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-4 hover:bg-neutral-100 transition-colors"
                          >
                            <span className="text-sm font-medium text-neutral-600">
                              {formatKey(key)}
                            </span>
                            <span className="text-sm font-semibold text-neutral-900">
                              {formatValue(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Retention Policy — hidden in read-only mode */}
                {!readOnly && (
                  <div className="border-t border-neutral-200 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shouldKeepFile}
                        onChange={e => setShouldKeepFile(e.target.checked)}
                        className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-medium text-neutral-900">Keep document file</p>
                        <p className="text-sm text-neutral-600">
                          If unchecked, the file will be securely purged after verification
                        </p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Error Message */}
                {errors.form && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{errors.form}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t border-neutral-200">
                {readOnly ? (
                  <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleReject}
                      disabled={submitting}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleApprove}
                      disabled={submitting || !parsedData}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {submitting ? 'Approving...' : 'Approve & Save'}
                    </Button>
                  </>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
