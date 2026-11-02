import { render, screen } from '@testing-library/react';
import { EscrowSummary } from '../EscrowSummary';
import { describe, it, expect } from 'vitest';
import type { Contract } from '@/types';

const mockContract = {
  id: 'contract-1',
  amount: 75000,
  currency: 'NGN',
  status: 'ACTIVE',
  escrowReleased: false,
  fundedAt: '2026-03-01T12:00:00Z',
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T12:00:00Z',
} as unknown as Contract;

describe('EscrowSummary', () => {
  it('renders escrow financial summary heading and status correctly', () => {
    render(<EscrowSummary contract={mockContract} />);

    expect(screen.getByText('Escrow Financial Summary')).toBeInTheDocument();
    expect(screen.getByText('Locked in Escrow')).toBeInTheDocument();
  });

  it('renders refunded status when contract status is REFUNDED', () => {
    const refundedContract: Contract = {
      ...mockContract,
      status: 'REFUNDED',
      fundedAt: undefined,
    };

    render(<EscrowSummary contract={refundedContract} />);
    expect(screen.getByText('Refunded')).toBeInTheDocument();
  });

  it('renders awaiting funding status when not funded', () => {
    const unfundedContract: Contract = {
      ...mockContract,
      status: 'PENDING_PAYMENT',
      fundedAt: undefined,
    };

    render(<EscrowSummary contract={unfundedContract} />);
    expect(screen.getByText('Awaiting Funding')).toBeInTheDocument();
  });
});
