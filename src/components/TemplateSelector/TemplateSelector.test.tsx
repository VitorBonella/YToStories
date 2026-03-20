import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateSelector } from './TemplateSelector';
import { TEMPLATES } from '../../utils/templates';

describe('TemplateSelector', () => {
  it('renders one card per template', () => {
    render(<TemplateSelector selectedId="dark" onSelect={() => {}} />);
    TEMPLATES.forEach((t) => {
      expect(screen.getByRole('button', { name: t.name })).toBeInTheDocument();
    });
  });

  it('selected card has selected class', () => {
    render(<TemplateSelector selectedId="light" onSelect={() => {}} />);
    const selected = screen.getByRole('button', { name: 'Light' });
    expect(selected).toHaveClass('template-selector__card--selected');
  });

  it('non-selected cards do not have selected class', () => {
    render(<TemplateSelector selectedId="dark" onSelect={() => {}} />);
    const light = screen.getByRole('button', { name: 'Light' });
    expect(light).not.toHaveClass('template-selector__card--selected');
  });

  it('calls onSelect with template id when card is clicked', () => {
    const onSelect = vi.fn();
    render(<TemplateSelector selectedId="dark" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Gradient' }));
    expect(onSelect).toHaveBeenCalledWith('gradient');
  });
});
