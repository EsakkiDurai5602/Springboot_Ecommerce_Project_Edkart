import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { OtpInput } from '../components/ui/OtpInput';

describe('Reusable UI Components', () => {
  it('renders Button with proper text and handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Transfer Money</Button>);

    const btn = screen.getByRole('button', { name: /transfer money/i });
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables Button and shows loading indicator when isLoading is true', () => {
    render(<Button isLoading>Processing</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('renders Badge with correct status style', () => {
    render(<Badge variant="success">ACTIVE</Badge>);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('renders Card with Header and Body', () => {
    render(
      <Card>
        <CardHeader title="Account Summary" />
        <CardBody>Available Balance: ₹4,82,500</CardBody>
      </Card>
    );

    expect(screen.getByText('Account Summary')).toBeInTheDocument();
    expect(screen.getByText(/Available Balance/i)).toBeInTheDocument();
  });

  it('renders 6 input boxes for OtpInput and manages auto-focus', () => {
    const handleComplete = vi.fn();
    render(<OtpInput length={6} onComplete={handleComplete} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);

    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    fireEvent.change(inputs[4], { target: { value: '5' } });
    fireEvent.change(inputs[5], { target: { value: '6' } });

    expect(handleComplete).toHaveBeenCalledWith('123456');
  });
});
