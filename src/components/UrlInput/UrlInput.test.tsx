import { render, screen, fireEvent } from '@testing-library/react';
import { UrlInput } from './UrlInput';

describe('UrlInput', () => {
  it('renders input, submit button, and clear button', () => {
    render(<UrlInput onSubmit={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('submit button is disabled when input is empty', () => {
    render(<UrlInput onSubmit={() => {}} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('submit button is enabled when input has value', () => {
    render(<UrlInput onSubmit={() => {}} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'https://www.youtube.com/watch?v=abc123' },
    });
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
  });

  it('shows error on blur when URL is invalid', () => {
    render(<UrlInput onSubmit={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'not-a-url' } });
    fireEvent.blur(input);
    expect(screen.getByText(/valid youtube url/i)).toBeInTheDocument();
  });

  it('shows error on submit attempt with invalid URL', () => {
    render(<UrlInput onSubmit={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'not-a-url' } });
    fireEvent.submit(input.closest('form')!);
    expect(screen.getByText(/valid youtube url/i)).toBeInTheDocument();
  });

  it('clears error when user modifies input', () => {
    render(<UrlInput onSubmit={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.blur(input);
    expect(screen.getByText(/valid youtube url/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'ba' } });
    expect(screen.queryByText(/valid youtube url/i)).not.toBeInTheDocument();
  });

  it('calls onSubmit with validated URL', () => {
    const onSubmit = vi.fn();
    render(<UrlInput onSubmit={onSubmit} />);
    const url = 'https://www.youtube.com/watch?v=abc123';
    fireEvent.change(screen.getByRole('textbox'), { target: { value: url } });
    fireEvent.submit(screen.getByRole('textbox').closest('form')!);
    expect(onSubmit).toHaveBeenCalledWith(url);
  });

  it('does not call onSubmit with invalid URL', () => {
    const onSubmit = vi.fn();
    render(<UrlInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'bad-url' } });
    fireEvent.submit(screen.getByRole('textbox').closest('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clear button resets input and error', () => {
    render(<UrlInput onSubmit={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.blur(input);
    expect(screen.getByText(/valid youtube url/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(input).toHaveValue('');
    expect(screen.queryByText(/valid youtube url/i)).not.toBeInTheDocument();
  });
});
