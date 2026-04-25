'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, Star, CheckCircle2, Loader2 } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { submitFeedback } from '@/lib/ai-api';
import { useAuth } from '@/hooks/useAuth';

type Category = 'bug' | 'feature_request' | 'general';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'bug', label: 'Bug' },
  { value: 'feature_request', label: 'Feature Request' },
];

export function FeedbackWidget() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState<Category>('general');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    // Reset form after close animation
    setTimeout(() => {
      setRating(0);
      setHoveredRating(0);
      setCategory('general');
      setComment('');
      setSubmitted(false);
      setError(null);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating.');
      return;
    }
    if (!comment.trim()) {
      setError('Please add a comment.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await submitFeedback({ rating, category, comment });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  const displayRating = hoveredRating || rating;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Share feedback"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <MessageSquarePlus className="h-4 w-4" />
        Feedback
      </button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Share your feedback"
        description="Help us improve Finance Agent HQ. All feedback is read by the team."
        size="sm"
      >
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-lg font-semibold text-neutral-900">Thank you!</p>
            <p className="text-sm text-neutral-500">
              Your feedback helps us build a better product.
            </p>
            <Button variant="secondary" size="sm" onClick={handleClose} className="mt-2">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Star rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Overall rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= displayRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">Category</label>
              <div className="flex gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus:outline-none ${
                      category === c.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-neutral-200 text-neutral-600 hover:border-indigo-300'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="feedback-comment"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback-comment"
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us what you think, what's missing, or what broke..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send feedback'
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
