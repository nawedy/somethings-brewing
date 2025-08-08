// File: src/tests/components/register.page.test.js
// Purpose: Component test for registration page validations and submit path

import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import RegisterPage from '@/routes/register/+page.svelte';

// Mock fetch for API call
global.fetch = vi.fn().mockResolvedValue({ json: async () => ({ success: false, error: 'Mock error' }) });

describe('Register Page', () => {
  it('renders form and validates inputs', async () => {
    render(RegisterPage);
    const form = screen.getByRole('form', { name: /registration-form/i });
    expect(form).toBeInTheDocument();

    const email = screen.getByLabelText(/email address/i);
    const password = screen.getByLabelText(/password \*/i);
    const confirm = screen.getByLabelText(/confirm password/i);
    const fullName = screen.getByLabelText(/full name/i);

    await fireEvent.blur(fullName);
    await fireEvent.blur(email);
    await fireEvent.blur(password);
    await fireEvent.blur(confirm);

    expect(screen.getAllByText(/required|valid|least/i).length).toBeGreaterThan(0);
  });
});


