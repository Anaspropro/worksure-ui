import React from 'react';

export type DeliverableStatus = 'PENDING_SUBMISSION' | 'SUBMITTED' | 'IN_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED' | 'AUTO_APPROVED' | 'DISPUTED';

interface DeliverableStatusBadgeProps {
  status: DeliverableStatus;
}

const statusConfig: Record<DeliverableStatus, { label: string; className: string }> = {
  PENDING_SUBMISSION: { label: 'Pending Submission', className: 'bg-gray-100 text-gray-800' },
  SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-800' },
  IN_REVIEW: { label: 'In Review', className: 'bg-indigo-100 text-indigo-800' },
  REVISION_REQUESTED: { label: 'Revision Requested', className: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-800' },
  AUTO_APPROVED: { label: 'Auto Approved', className: 'bg-green-100 text-green-800' },
  DISPUTED: { label: 'Disputed', className: 'bg-red-100 text-red-800' },
};

export const DeliverableStatusBadge: React.FC<DeliverableStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status];
  
  if (!config) return null;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
