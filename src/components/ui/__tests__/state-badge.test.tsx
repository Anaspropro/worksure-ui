import { render, screen } from '@testing-library/react';
import { StateBadge } from '../state-badge';
import { describe, it, expect } from 'vitest';

describe('StateBadge', () => {
  it('renders correctly with default DRAFT state', () => {
    render(<StateBadge>Test Badge</StateBadge>);
    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-state', 'DRAFT');
    expect(badge.className).toContain('bg-muted');
  });

  it('renders correctly with PAID_OUT state', () => {
    render(<StateBadge state="PAID_OUT">Paid Out</StateBadge>);
    const badge = screen.getByText('Paid Out');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-state', 'PAID_OUT');
    expect(badge.className).toContain('bg-success/10');
    expect(badge.className).toContain('text-success');
  });

  it('renders correctly with PENDING_PAYMENT state', () => {
    render(<StateBadge state="PENDING_PAYMENT">Pending</StateBadge>);
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-state', 'PENDING_PAYMENT');
    expect(badge.className).toContain('bg-warning/10');
    expect(badge.className).toContain('text-warning');
  });
});
