import { TEMPLATES } from '../../utils/templates';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="template-selector">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          className={`template-selector__card${selectedId === template.id ? ' template-selector__card--selected' : ''}`}
          onClick={() => onSelect(template.id)}
        >
          <div className="template-selector__preview" aria-hidden="true" />
          <span className="template-selector__name">{template.name}</span>
        </button>
      ))}
    </div>
  );
}
