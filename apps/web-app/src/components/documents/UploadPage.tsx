import { useState, ChangeEvent } from 'react';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { Upload, FileText, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { DOCUMENT_ROUTE } from '@/lib/constants';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [retentionPolicy, setRetentionPolicy] = useState<'purge_after_extraction' | 'permanent'>(
    'purge_after_extraction'
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    uploadDocument: { id: string; fileName: string; status: string };
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      window.location.reload();
    }
  };

  // eslint-disable-next-line no-undef
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    // eslint-disable-next-line no-undef
    const reader = new FileReader();
    reader.onload = async e => {
      const base64 = e.target?.result?.toString().split(',')[1];

      try {
        // TODO: Implement document upload mutation when backend is ready
        // For now, simulate upload
        console.log('Upload payload:', {
          userId: 'user-1', // TODO: Get from auth
          entityId: 'entity-1', // TODO: Get from context
          fileName: file.name,
          mimeType: file.type,
          fileBuffer: base64?.substring(0, 50) + '...', // Log preview only
          retentionPolicy,
        });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setData({ uploadDocument: { id: 'temp-id', fileName: file.name, status: 'uploaded' } });
        setLoading(false);
      } catch (err) {
        console.error('Upload error:', err);
        setError(err as Error);
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {!data ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload Tax Document</CardTitle>
                <CardDescription>
                  Securely upload your tax document for AI-powered extraction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Select Document
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
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
                          <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                          <p className="text-neutral-600 font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-neutral-500 mt-1">
                            PDF, JPG, JPEG or PNG (Max 10MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Retention Policy */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Retention Policy
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRetentionPolicy('purge_after_extraction')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        retentionPolicy === 'purge_after_extraction'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Shield className="w-5 h-5 text-accent-600" />
                        {retentionPolicy === 'purge_after_extraction' && (
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Auto Purge</h4>
                      <p className="text-sm text-neutral-600">
                        Delete file after data extraction (More secure)
                      </p>
                    </button>

                    <button
                      onClick={() => setRetentionPolicy('permanent')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        retentionPolicy === 'permanent'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="w-5 h-5 text-secondary-600" />
                        {retentionPolicy === 'permanent' && (
                          <CheckCircle className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                      <h4 className="font-semibold text-neutral-900 mb-1">Keep Forever</h4>
                      <p className="text-sm text-neutral-600">Store encrypted file permanently</p>
                    </button>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary-900 mb-1">Envelope Encryption</h4>
                      <p className="text-sm text-primary-700">
                        Your document will be encrypted with a unique key before upload. The key
                        itself is encrypted by GCP KMS for maximum security.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="bg-error-50 border border-error-200 rounded-lg p-4 text-error-700">
                    {error.message}
                  </div>
                )}

                {/* Upload Button */}
                <Button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  isLoading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Uploading...' : 'Upload & Extract Data'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success-dark" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Upload Successful!</h2>
                <p className="text-neutral-600 mb-6">
                  Your document is being processed. AI extraction will begin shortly.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link href={DOCUMENT_ROUTE}>
                    <Button variant="primary">Go to Dashboard</Button>
                  </Link>
                  <Button variant="outline" onClick={handleReload}>
                    Upload Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
