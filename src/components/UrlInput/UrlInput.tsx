import { useState } from 'react';
import { extractVideoId } from '../../utils/youtube';
import './UrlInput.css';

interface UrlInputProps {
  onSubmit: (url: string) => void;
}

export function UrlInput({ onSubmit }: UrlInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function validate(url: string): boolean {
    if (!extractVideoId(url)) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    setError('');
    return true;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (error) setError('');
  }

  function handleBlur() {
    if (value) validate(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate(value)) {
      onSubmit(value);
    }
  }

  function handleClear() {
    setValue('');
    setError('');
  }

  return (
    <form className="url-input" onSubmit={handleSubmit}>
      <div className="url-input__row">
        <input
          className="url-input__field"
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <button
          className="url-input__submit"
          type="submit"
          disabled={!value}
        >
          Submit
        </button>
        <button
          className="url-input__clear"
          type="button"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>
      {error && <p className="url-input__error">{error}</p>}
    </form>
  );
}
