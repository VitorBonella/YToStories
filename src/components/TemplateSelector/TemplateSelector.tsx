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
          className={`template-selector__card template-selector__card--${template.id}${selectedId === template.id ? ' template-selector__card--selected' : ''}`}
          onClick={() => onSelect(template.id)}
          aria-label={template.name}
        >
          <div className="template-selector__thumb" aria-hidden="true">
            <div className="template-selector__thumb-img" />
          </div>
          <div className="template-selector__info">
            <div className="template-selector__title-bar" aria-hidden="true">
              <div className="template-selector__title-line" />
              <div className="template-selector__title-line template-selector__title-line--short" />
            </div>
            <span className="template-selector__name">{template.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
