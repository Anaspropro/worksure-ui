import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminReconciliationWorkspace from '../AdminReconciliationWorkspace';
import * as useAdminHooks from '@/hooks/useAdmin';
import { toast } from 'sonner';
import '@testing-library/jest-dom';

// Mock the hooks
vi.mock('@/hooks/useAdmin', () => ({
  useAdminReconciliationReports: vi.fn(),
  useTriggerReconciliation: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ResizeObserver which is required by some Radix components used in shadcn
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('AdminReconciliationWorkspace', () => {
  const mockTriggerReconciliation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAdminHooks.useTriggerReconciliation as any).mockReturnValue({
      mutate: mockTriggerReconciliation,
      status: 'idle',
    });

    (useAdminHooks.useAdminReconciliationReports as any).mockReturnValue({
      data: {
        data: [
          {
            id: '1',
            action: 'RECONCILIATION_SUCCESS',
            performedAt: new Date().toISOString(),
            metadata: {
              totalObligations: 1000,
              actualPaystackBalance: 1000,
              discrepancy: 0,
            },
          },
          {
            id: '2',
            action: 'RECONCILIATION_DISCREPANCY',
            performedAt: new Date().toISOString(),
            metadata: {
              totalObligations: 1000,
              actualPaystackBalance: 900,
              discrepancy: -100,
            },
          },
        ],
        meta: { total: 2 },
      },
      isLoading: false,
    });
  });

  it('renders the reconciliation center title and table headers', () => {
    render(<AdminReconciliationWorkspace />);
    
    expect(screen.getByText('Reconciliation Center')).toBeInTheDocument();
    expect(screen.getByText('Ledger Obligations')).toBeInTheDocument();
    expect(screen.getByText('Paystack Actual')).toBeInTheDocument();
  });

  it('renders the reconciliation reports correctly', () => {
    render(<AdminReconciliationWorkspace />);
    
    // Check if the mock data values are rendered (e.g. 1,000.00 and 900.00)
    // We expect 1000.00 to appear multiple times
    const thousands = screen.getAllByText('1,000.00');
    expect(thousands.length).toBeGreaterThan(0);
    
    expect(screen.getByText('900.00')).toBeInTheDocument();
    
    // Check if badges render
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getAllByText('Discrepancy').length).toBeGreaterThan(0);
  });

  it('triggers manual reconciliation when the button is clicked', async () => {
    render(<AdminReconciliationWorkspace />);
    
    const triggerButton = screen.getByText('Trigger Manual Reconciliation');
    fireEvent.click(triggerButton);

    expect(mockTriggerReconciliation).toHaveBeenCalledTimes(1);
    
    // Simulate onSuccess
    const callbacks = mockTriggerReconciliation.mock.calls[0][1];
    callbacks.onSuccess();
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Manual reconciliation triggered successfully.');
    });
  });

  it('disables the button when reconciliation is pending', () => {
    (useAdminHooks.useTriggerReconciliation as any).mockReturnValue({
      mutate: mockTriggerReconciliation,
      status: 'pending',
    });

    render(<AdminReconciliationWorkspace />);
    
    const triggerButton = screen.getByText('Reconciling...');
    expect(triggerButton).toBeDisabled();
  });
});
