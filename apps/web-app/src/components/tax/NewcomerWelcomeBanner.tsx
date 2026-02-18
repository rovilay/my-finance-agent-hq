import React, { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { BookOpen, MessageCircle, X, Video, FileText } from 'lucide-react';

interface NewcomerWelcomeBannerProps {
  onOpenChat?: () => void;
  onOpenGuide?: () => void;
}

export const NewcomerWelcomeBanner: React.FC<NewcomerWelcomeBannerProps> = ({
  onOpenChat,
  onOpenGuide,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage to see if user has dismissed before
  React.useEffect(() => {
    const dismissed = localStorage.getItem('newcomer-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('newcomer-banner-dismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <Card className="mb-6 bg-linear-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full -translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full translate-x-16 translate-y-16" />
      </div>

      <CardContent className="py-5 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Dismiss welcome banner"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-2xl">🇨🇦</span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-blue-900 mb-2">
              Welcome to Canadian Taxes! New to Canada?
            </h3>
            <p className="text-sm text-blue-800 mb-4 leading-relaxed">
              We understand that navigating the Canadian tax system can be overwhelming. That's why
              we've made everything simple and clear. Hover over any{' '}
              <span className="border-b-2 border-dotted border-blue-600 font-medium cursor-help">
                underlined term
              </span>{' '}
              to learn what it means. No question is too basic — we're here to help you succeed!
            </p>

            <div className="flex flex-wrap gap-2">
              {onOpenChat && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenChat}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask Our Tax Assistant
                </Button>
              )}

              {onOpenGuide && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenGuide}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Beginner's Guide
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                onClick={() => {
                  // Could open a modal or navigate to tutorial
                  alert('Video tutorials coming soon!');
                }}
              >
                <Video className="w-4 h-4 mr-2" />
                Watch Tutorial
              </Button>
            </div>

            <div className="mt-4 p-3 bg-white/60 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Quick Tips:</p>
              </div>
              <ul className="text-xs text-blue-800 space-y-1 ml-6 list-disc">
                <li>
                  <strong>Everyone</strong> automatically gets ~$3,000 in tax credits (called BPA)
                </li>
                <li>
                  You pay <strong>two</strong> taxes: Federal (Canada) + Provincial (Ontario)
                </li>
                <li>
                  Tax deadline is <strong>April 30</strong> each year
                </li>
                <li>
                  The CRA (Tax Office) is helpful — call{' '}
                  <a href="tel:1-800-959-8281" className="font-semibold hover:underline">
                    1-800-959-8281
                  </a>{' '}
                  or visit{' '}
                  <a
                    href="https://www.canada.ca/en/revenue-agency.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                  >
                    canada.ca/taxes
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewcomerWelcomeBanner;
