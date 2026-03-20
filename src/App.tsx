import { useRef } from 'react';
import { UrlInput } from './components/UrlInput/UrlInput';
import { TemplateSelector } from './components/TemplateSelector/TemplateSelector';
import { StoryPreview } from './components/StoryPreview/StoryPreview';
import { DownloadBar } from './components/DownloadBar/DownloadBar';
import { useStoryBuilder } from './hooks/useStoryBuilder';
import './App.css';

function App() {
  const { storyData, selectedTemplateId, isLoading, error, handleSubmit, handleTemplateChange } =
    useStoryBuilder();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="app">
      <h1 className="app__title">YToStories</h1>
      <UrlInput onSubmit={handleSubmit} />
      {isLoading && (
        <div className="app__spinner" aria-label="Loading">
          Loading...
        </div>
      )}
      {error && (
        <div className="app__error" role="alert">
          {error}
        </div>
      )}
      <TemplateSelector selectedId={selectedTemplateId} onSelect={handleTemplateChange} />
      <StoryPreview storyData={storyData} templateId={selectedTemplateId} canvasRef={canvasRef} />
      {storyData && <DownloadBar canvasRef={canvasRef} videoId={storyData.videoId} />}
    </div>
  );
}

export default App;
