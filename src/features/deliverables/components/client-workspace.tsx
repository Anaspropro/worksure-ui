import React, { useState } from 'react';
import { DeliverableTimeline, DeliverableVersion, DeliverableRevision } from './deliverable-timeline';
import { DeliverableStatusBadge, DeliverableStatus } from './deliverable-status-badge';

interface ClientWorkspaceProps {
  contractId: string;
  status: DeliverableStatus;
  versions: DeliverableVersion[];
  revisions: DeliverableRevision[];
  onApprove: () => Promise<void>;
  onRequestRevision: (comments: string) => Promise<void>;
}

export const ClientWorkspace: React.FC<ClientWorkspaceProps> = ({
  contractId,
  status,
  versions,
  revisions,
  onApprove,
  onRequestRevision,
}) => {
  const [revisionComments, setRevisionComments] = useState('');
  const [isRequestingRevision, setIsRequestingRevision] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    if (window.confirm('Are you sure you want to approve this work? This will release funds and complete the contract.')) {
      setIsSubmitting(true);
      try {
        await onApprove();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRevisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionComments) return;
    
    setIsSubmitting(true);
    try {
      await onRequestRevision(revisionComments);
      setRevisionComments('');
      setIsRequestingRevision(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canReview = status === 'SUBMITTED' || status === 'IN_REVIEW';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-4">
            Deliverables Review
            <DeliverableStatusBadge status={status} />
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Timeline</h3>
            <DeliverableTimeline versions={versions} revisions={revisions} />
          </div>
        </div>

        <div className="lg:col-span-1">
          {canReview ? (
            <div className="bg-white shadow sm:rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Review Actions</h3>
              
              {!isRequestingRevision ? (
                <div className="space-y-4">
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Processing...' : 'Approve Work'}
                  </button>
                  <button
                    onClick={() => setIsRequestingRevision(true)}
                    disabled={isSubmitting}
                    className="flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-100"
                  >
                    Request Revision
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-4">
                    Approving the work will release funds from Escrow to the Artisan.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRevisionSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                      Revision Details
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Be specific about what needs to be changed.</p>
                    <textarea
                      id="comments"
                      name="comments"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={revisionComments}
                      onChange={(e) => setRevisionComments(e.target.value)}
                      placeholder="e.g. Please update the colors on the second image..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsRequestingRevision(false)}
                      disabled={isSubmitting}
                      className="flex-1 justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !revisionComments}
                      className="flex-1 justify-center rounded-md border border-transparent bg-yellow-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:bg-gray-300"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600">
              There is currently no new work to review. The deliverable is <strong>{status.replace('_', ' ')}</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
