'use client';

import { useState, ChangeEvent, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { Button } from '@/components/ui';
import {
  Upload,
  FileText,
  Shield,
  CheckCircle,
  X,
  AlertCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { Document, RetentionPolicy } from '@/lib/graphql/generated';
import { useAuth } from '@/hooks/useAuth';
import { uploadDocumentToApi } from '@/lib/utils';
import { GUIDE_ROUTE } from '@/lib/constants';
import Link from 'next/link';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  onUploadSuccess?: (data: Document) => void;
}

export default function DocumentUploadModal({
  isOpen,
  onClose,
  entityId,
  onUploadSuccess,
}: DocumentUploadModalProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Document | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [retentionPolicy, setRetentionPolicy] = useState<RetentionPolicy>(
    RetentionPolicy.VerifyAndPurge
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = async e => {
      const base64 = e.target?.result?.toString().split(',')[1];

      if (!base64) {
        console.error('Failed to read file');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const result = await uploadDocumentToApi({
          file,
          entityId,
          retentionPolicy,
          extractData: false,
        });
        setData(result);
        setIsLoading(false);

        if (result && onUploadSuccess) {
          onUploadSuccess(result);
        }
      } catch (err) {
        console.error('Upload error:', err);
        setIsLoading(false);
        setError(err as Error);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setFile(null);
    setData(null);
    setError(null);
    setIsLoading(false);
    setRetentionPolicy(RetentionPolicy.VerifyAndPurge);
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

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-xl">
              {!data ? (
                <>
                  <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                    <div>
                      <DialogTitle className="text-xl font-semibold text-neutral-900">
                        Upload your tax slips
                      </DialogTitle>
                      <p className="text-sm text-neutral-500 mt-0.5">
                        Our AI reads your document and extracts the key numbers for you to review.
                      </p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="text-neutral-400 hover:text-neutral-600 transition-colors ml-4 shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Supported Document Types */}
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                          Supported slip types
                        </p>
                        <Link
                          href={GUIDE_ROUTE}
                          target="_blank"
                          className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                        >
                          Full guide <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'T4', note: 'Best supported', highlight: true },
                          { label: 'T4A', note: 'Contract income' },
                          { label: 'T5', note: 'Investments' },
                          { label: 'T3', note: 'Trust income' },
                          { label: 'T2202', note: 'Tuition' },
                          { label: 'T4E', note: 'EI benefits' },
                        ].map(({ label, note, highlight }) => (
                          <div
                            key={label}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${
                              highlight
                                ? 'bg-primary-50 border-primary-200 text-primary-800'
                                : 'bg-white border-neutral-200 text-neutral-700'
                            }`}
                          >
                            <CheckCircle
                              className={`w-3 h-3 shrink-0 ${highlight ? 'text-primary-600' : 'text-secondary-500'}`}
                            />
                            <span className="font-medium">{label}</span>
                            <span
                              className={`${highlight ? 'text-primary-600' : 'text-neutral-400'}`}
                            >
                              — {note}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-neutral-400 mt-2">
                        Other slips can be uploaded too. Complex layouts may need a quick manual
                        review.
                      </p>
                    </div>

                    {/* Drop Zone */}
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="modal-file-upload"
                      />
                      <label htmlFor="modal-file-upload" className="cursor-pointer">
                        {file ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="w-8 h-8 text-primary-600" />
                            <div className="text-left">
                              <p className="font-medium text-neutral-900">{file.name}</p>
                              <p className="text-sm text-neutral-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                            <p className="text-neutral-600 font-medium">
                              Drop your T4, T3, T5 or other tax slip here
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">
                              PDF preferred · JPG or PNG also accepted · Max 10 MB
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5">One slip per upload</p>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* What Happens Next */}
                    <div className="flex items-center justify-center gap-2 text-sm text-neutral-600 py-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          1
                        </span>
                        <span>AI reads your slip</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          2
                        </span>
                        <span>You review the numbers</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
                          3
                        </span>
                        <span>Saved to your summary</span>
                      </div>
                    </div>

                    {/* File Quality Tips */}
                    <details className="group">
                      <summary className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer select-none list-none">
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        Tips for best results
                      </summary>
                      <ul className="mt-2 space-y-1.5 pl-6 text-sm text-neutral-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary-500 shrink-0 mt-0.5" />
                          Use the PDF from your employer or CRA — photos work but are less reliable
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary-500 shrink-0 mt-0.5" />
                          Include all pages, not just the first
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary-500 shrink-0 mt-0.5" />
                          Make sure the text is clear — avoid blurry or rotated scans
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary-500 shrink-0 mt-0.5" />
                          Upload one slip at a time for the most accurate extraction
                        </li>
                      </ul>
                    </details>

                    {/* Storage Preference (secondary) */}
                    <details className="group" open>
                      <summary className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer select-none list-none">
                        <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                        <Shield className="w-3.5 h-3.5 text-neutral-400" />
                        Storage preference
                        <span className="ml-auto text-xs text-neutral-400">
                          {retentionPolicy === RetentionPolicy.VerifyAndPurge
                            ? 'Delete after extraction'
                            : 'Keep encrypted copy'}
                        </span>
                      </summary>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRetentionPolicy(RetentionPolicy.VerifyAndPurge)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            retentionPolicy === RetentionPolicy.VerifyAndPurge
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Shield className="w-4 h-4 text-accent-600" />
                            {retentionPolicy === RetentionPolicy.VerifyAndPurge && (
                              <CheckCircle className="w-4 h-4 text-primary-600" />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">
                            Delete after extraction
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            File deleted once data is read. Most secure.
                          </p>
                        </button>
                        <button
                          onClick={() => setRetentionPolicy(RetentionPolicy.Permanent)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            retentionPolicy === RetentionPolicy.Permanent
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-neutral-200 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <FileText className="w-4 h-4 text-secondary-600" />
                            {retentionPolicy === RetentionPolicy.Permanent && (
                              <CheckCircle className="w-4 h-4 text-primary-600" />
                            )}
                          </div>
                          <p className="text-sm font-semibold text-neutral-900">
                            Keep encrypted copy
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Stored with envelope encryption.
                          </p>
                        </button>
                      </div>
                    </details>

                    {/* Error Display */}
                    {error && (
                      <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-error-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-error-800 mb-1">
                              We couldn&apos;t read that document
                            </p>
                            <p className="text-sm text-error-700">{error.message}</p>
                            <p className="text-sm text-error-600 mt-1.5">
                              Try a clearer version, or a PDF if you used an image.{' '}
                              <Link href={GUIDE_ROUTE} target="_blank" className="underline">
                                See the document guide
                              </Link>{' '}
                              for tips.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 p-6 border-t border-neutral-200">
                    <Button
                      onClick={handleUpload}
                      disabled={!file || isLoading || !user}
                      isLoading={isLoading}
                      className="flex-1"
                      variant="primary"
                    >
                      {isLoading ? 'Uploading...' : 'Upload & Extract Data'}
                    </Button>
                    <Button onClick={handleClose} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success-dark" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">Slip uploaded!</h2>
                  <p className="text-neutral-600 mb-2">
                    Our AI is extracting the key numbers from your document.
                  </p>
                  <p className="text-sm text-neutral-500 mb-6">
                    You&apos;ll be able to review and confirm the extracted data before anything is
                    saved.
                  </p>
                  <Button onClick={handleClose} variant="primary">
                    Done
                  </Button>
                </div>
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
