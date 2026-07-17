import React from 'react';
import { AttachmentViewer, DeliverableAttachment } from './attachment-viewer';
import { CheckCircleIcon, XCircleIcon, ClockIcon, EditIcon } from 'lucide-react';
import { format } from 'date-fns';

export interface DeliverableVersion {
  id: string;
  versionNumber: number;
  notes: string | null;
  submittedAt: string;
  attachments: DeliverableAttachment[];
}

export interface DeliverableRevision {
  id: string;
  requestedAt: string;
  comments: string;
  status: 'PENDING' | 'ADDRESSED' | 'CANCELLED';
  targetVersionId: string;
}

interface DeliverableTimelineProps {
  versions: DeliverableVersion[];
  revisions: DeliverableRevision[];
}

export const DeliverableTimeline: React.FC<DeliverableTimelineProps> = ({ versions, revisions }) => {
  // Combine and sort chronologically
  const timelineEvents = [
    ...versions.map((v) => ({ ...v, type: 'VERSION' as const, date: new Date(v.submittedAt) })),
    ...revisions.map((r) => ({ ...r, type: 'REVISION' as const, date: new Date(r.requestedAt) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first

  if (timelineEvents.length === 0) {
    return <p className="text-gray-500 text-sm">No activity recorded yet.</p>;
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {timelineEvents.map((event, eventIdx) => {
          const isLast = eventIdx === timelineEvents.length - 1;

          if (event.type === 'VERSION') {
            const version = event as Extract<typeof event, { type: 'VERSION' }>;
            return (
              <li key={version.id}>
                <div className="relative pb-8">
                  {!isLast ? (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <CheckCircleIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Version {version.versionNumber}</span> submitted
                        </p>
                        {version.notes && <p className="mt-2 text-sm text-gray-600">{version.notes}</p>}
                        <div className="mt-3">
                          <AttachmentViewer attachments={version.attachments} />
                        </div>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={version.submittedAt}>{format(version.date, 'MMM d, yyyy h:mm a')}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          } else {
            const revision = event as Extract<typeof event, { type: 'REVISION' }>;
            return (
              <li key={revision.id}>
                <div className="relative pb-8">
                  {!isLast ? (
                    <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                        <EditIcon className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">Revision requested</span> by Client
                        </p>
                        <div className="mt-2 text-sm text-gray-600 border-l-2 border-yellow-300 pl-3">
                          <p className="whitespace-pre-line">{revision.comments}</p>
                        </div>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        <time dateTime={revision.requestedAt}>{format(revision.date, 'MMM d, yyyy h:mm a')}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};
