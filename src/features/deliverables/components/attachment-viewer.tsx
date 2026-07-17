import React from 'react';
import { DownloadIcon, FileIcon } from 'lucide-react';

export interface DeliverableAttachment {
  id: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  originalName: string;
}

interface AttachmentViewerProps {
  attachments: DeliverableAttachment[];
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return <p className="text-sm text-gray-500 italic">No attachments provided.</p>;
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <ul className="mt-2 divide-y divide-gray-200 rounded-md border border-gray-200">
      {attachments.map((attachment) => (
        <li key={attachment.id} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
          <div className="flex w-0 flex-1 items-center">
            <FileIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
            <span className="ml-2 w-0 flex-1 truncate">{attachment.originalName}</span>
            <span className="ml-2 flex-shrink-0 text-gray-500">{formatSize(attachment.fileSize)}</span>
          </div>
          <div className="ml-4 flex-shrink-0">
            <a
              href={attachment.fileUrl}
              download={attachment.originalName}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
            >
              <DownloadIcon className="h-4 w-4" /> Download
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};
