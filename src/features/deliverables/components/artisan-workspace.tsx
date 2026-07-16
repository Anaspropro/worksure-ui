import React, { useState } from 'react';
import { DeliverableTimeline, DeliverableVersion, DeliverableRevision } from './deliverable-timeline';
import { DeliverableStatusBadge, DeliverableStatus } from './deliverable-status-badge';

interface ArtisanWorkspaceProps {
  contractId: string;
  status: DeliverableStatus;
  versions: DeliverableVersion[];
  revisions: DeliverableRevision[];
  onSubmitVersion: (notes: string, attachments: File[]) => Promise<void>;
}

export const ArtisanWorkspace: React.FC<ArtisanWorkspaceProps> = ({
  contractId,
  status,
  versions,
  revisions,
  onSubmitVersion,
}) => {
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes && files.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitVersion(notes, files);
      setNotes('');
      setFiles([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const canSubmit = status === 'PENDING_SUBMISSION' || status === 'REVISION_REQUESTED';

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-4">
            Deliverables Workspace
            <DeliverableStatusBadge status={status} />
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Timeline</h3>
            <DeliverableTimeline versions={versions} revisions={revisions} />
          </div>
        </div>

        <div className="lg:col-span-1">
          {canSubmit ? (
            <div className="bg-white shadow sm:rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submit Work</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Submission Notes
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe what you have completed..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-500">
                      {files.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || (!notes && files.length === 0)}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Deliverable'}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600">
              You cannot submit work at this time. The deliverable is currently <strong>{status.replace('_', ' ')}</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
