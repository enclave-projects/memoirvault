"use client";

import { useState } from 'react';

interface ReportIssueProps {
  onClose: () => void;
}

export default function ReportIssue({ onClose }: ReportIssueProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [browserInfo, setBrowserInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [issueNumber, setIssueNumber] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in at least the title and description fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create comprehensive issue description
      const issueDescription = `## Issue Description
${description}

## Steps to Reproduce
${stepsToReproduce || 'Not provided'}

## Expected Behavior
${expectedBehavior || 'Not provided'}

## Actual Behavior
${actualBehavior || 'Not provided'}

## Browser/Environment Information
${browserInfo || 'Not provided'}

## Additional Context
- Reported via: Settings > Report Issue page
- User submitted comprehensive form`;

      const response = await fetch('/api/create-github-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: issueDescription,
          userEmail: 'Provided via form submission'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIssueNumber(data.issueNumber);
        setSubmitStatus('success');

        // Clear form
        setTitle('');
        setDescription('');
        setStepsToReproduce('');
        setExpectedBehavior('');
        setActualBehavior('');
        setBrowserInfo('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting issue:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-[#EBEDE8] flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">Report an Issue</h2>
            <p className="text-sm text-[#333F3C] opacity-75 mt-1">
              Help us improve MemoirVault by reporting bugs or issues
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#333F3C] hover:text-[#004838] text-2xl"
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✅</span>
              <div>
                <p className="text-green-800 font-medium">Issue Reported Successfully!</p>
                <p className="text-green-700 text-sm">
                  Your issue has been submitted as #{issueNumber}. Our development team will respond within 48 hours.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-red-600">❌</span>
              <div>
                <p className="text-red-800 font-medium">Failed to Submit Issue</p>
                <p className="text-red-700 text-sm">
                  There was an error submitting your issue. Please try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Issue Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#333F3C] mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
              required
            />
          </div>

          {/* Issue Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#333F3C] mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
              required
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-[#333F3C] mb-2">
              Steps to Reproduce
            </label>
            <textarea
              id="steps"
              value={stepsToReproduce}
              onChange={(e) => setStepsToReproduce(e.target.value)}
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
              rows={3}
              className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
            />
          </div>

          {/* Expected vs Actual Behavior */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expected" className="block text-sm font-medium text-[#333F3C] mb-2">
                Expected Behavior
              </label>
              <textarea
                id="expected"
                value={expectedBehavior}
                onChange={(e) => setExpectedBehavior(e.target.value)}
                placeholder="What should have happened?"
                rows={3}
                className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
              />
            </div>
            <div>
              <label htmlFor="actual" className="block text-sm font-medium text-[#333F3C] mb-2">
                Actual Behavior
              </label>
              <textarea
                id="actual"
                value={actualBehavior}
                onChange={(e) => setActualBehavior(e.target.value)}
                placeholder="What actually happened?"
                rows={3}
                className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
              />
            </div>
          </div>

          {/* Browser Information */}
          <div>
            <label htmlFor="browser" className="block text-sm font-medium text-[#333F3C] mb-2">
              Browser & Environment
            </label>
            <input
              type="text"
              id="browser"
              value={browserInfo}
              onChange={(e) => setBrowserInfo(e.target.value)}
              placeholder="e.g., Chrome 120.0, Windows 11, Mobile Safari"
              className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-[#EBEDE8] text-[#333F3C] rounded-lg font-medium hover:bg-[#EBEDE8] transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="flex-1 px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Issue'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="bg-[#EBEDE8] rounded-lg p-4">
            <p className="text-sm text-[#333F3C]">
              <strong>Privacy Note:</strong> Your issue report will be submitted to our GitHub repository.
              Only your user ID and the information you provide in this form will be included.
              No personal data beyond what you explicitly share will be sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}