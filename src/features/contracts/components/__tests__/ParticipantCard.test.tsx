import { render, screen } from '@testing-library/react';
import { ParticipantCard } from '../ParticipantCard';
import { describe, it, expect } from 'vitest';
import type { Contract } from '@/types';

const mockContract = {
  id: 'contract-1',
  amount: 75000,
  currency: 'NGN',
  status: 'ACTIVE',
  escrowReleased: false,
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T12:00:00Z',
  client: {
    id: 'client-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
  artisan: {
    id: 'artisan-1',
    name: 'Bob Builder',
    email: 'bob@example.com',
  },
} as unknown as Contract;

describe('ParticipantCard', () => {
  it('renders agreement participants heading', () => {
    render(<ParticipantCard contract={mockContract} role="CLIENT" />);
    expect(screen.getByText('Agreement Participants')).toBeInTheDocument();
  });

  it('renders client and artisan member names and emails', () => {
    render(<ParticipantCard contract={mockContract} role="CLIENT" />);

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Builder')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('renders role badges correctly', () => {
    render(<ParticipantCard contract={mockContract} role="CLIENT" />);

    expect(screen.getAllByText('Client').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Artisan').length).toBeGreaterThanOrEqual(1);
  });
});
