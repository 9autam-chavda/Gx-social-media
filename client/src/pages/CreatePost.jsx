import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/icons/Icon';
import Toast from '../components/common/Toast';
import PageHeader from '../components/layout/PageHeader';
import { postService } from '../services/postService';
import { getErrorMessage } from '../utils/api';

const CreatePost = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('text');
  const [caption, setCaption] = useState('');
  const [textContent, setTextContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const previewUrl = useMemo(() => (mediaFile ? URL.createObjectURL(mediaFile) : ''), [mediaFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const validateFile = (file) => {
    if (!file) {
      setError('No file selected');
      return false;
    }

    const imageMode = type === 'image';
    const videoMode = type === 'video';
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const maxSize = videoMode ? 100 * 1024 * 1024 : 10 * 1024 * 1024;

    if ((imageMode && !isImage) || (videoMode && !isVideo)) {
      setError(`Please select a valid ${type} file`);
      return false;
    }

    if (file.size > maxSize) {
      setError(`File must be ${videoMode ? '100MB' : '10MB'} or smaller`);
      return false;
    }

    return true;
  };

  const handleMediaChange = (event) => {
    const file = event.target.files?.[0] || null;
    setError('');

    if (!file) {
      setMediaFile(null);
      return;
    }

    if (validateFile(file)) {
      setMediaFile(file);
    } else {
      setMediaFile(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files?.[0] || null;
    if (file && validateFile(file)) {
      setMediaFile(file);
    }
  };

  const handleRemoveMedia = (event) => {
    event.preventDefault();
    setMediaFile(null);
    setError('');
  };

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setError('');

    if (nextType === 'text') {
      setMediaFile(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (type === 'text' && !textContent.trim()) {
      setError('Text content is required for text posts');
      return;
    }

    if ((type === 'image' || type === 'video') && !mediaFile) {
      setError(`Please upload a ${type} file`);
      return;
    }

    setSubmitting(true);

    try {
      await postService.create({
        type,
        caption: caption.trim(),
        textContent: textContent.trim(),
        hashtags: hashtags.trim(),
        mediaFile,
      });

      setToast('Post created');
      setTimeout(() => navigate('/feed'), 650);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create post'));
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = [
    { value: 'text', label: 'Text', icon: 'pen' },
    { value: 'image', label: 'Image', icon: 'image' },
    { value: 'video', label: 'Video', icon: 'video' },
  ];

  return (
    <section className="mx-auto max-w-4xl pb-8">
      <Toast message={toast} />
      <PageHeader
        badge="Publish"
        title="Create post"
        description="Share text, image, or video content with your feed."
      />

      <form className="app-panel grid gap-5 p-4 sm:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-3 rounded-2xl border border-line/70 bg-surface-muted p-3 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-sm font-semibold text-ink">Post type</p>
            <p className="text-xs text-ink-muted">Choose the content style for this post.</p>
          </div>
          <div className="segmented-control justify-self-start sm:justify-self-end">
            {typeOptions.map((option) => {
              const iconName = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTypeChange(option.value)}
                  className="segmented-option"
                  data-active={type === option.value}
                >
                  <span className="inline-flex items-center justify-center text-base">
                    <Icon name={iconName} />
                  </span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {type !== 'text' && (
          <label
            className="grid min-h-64 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-surface-muted text-center transition duration-150 hover:border-brand/70 hover:bg-white hover:shadow-[var(--shadow-card)] sm:min-h-72"
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            {mediaFile ? (
              <div className="relative h-full w-full">
                {type === 'video' ? (
                  <video className="max-h-[520px] w-full object-contain" controls src={previewUrl} />
                ) : (
                  <img className="max-h-[520px] w-full object-contain" src={previewUrl} alt="Upload preview" />
                )}
                <button
                  className="absolute right-3 top-3 icon-button bg-white"
                  onClick={handleRemoveMedia}
                  type="button"
                  aria-label="Remove media"
                >
                  <Icon name="close" />
                </button>
              </div>
            ) : (
              <div className="p-8">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-xl text-brand">
                  <Icon name={type === 'video' ? 'video' : 'image'} />
                </div>
                <p className="mt-4 text-sm font-bold text-ink">Upload a {type}</p>
                <p className="mt-1 text-xs text-ink-muted">Drag and drop or click to select a file.</p>
                <p className="mt-2 text-xs text-ink-muted">{type === 'video' ? 'Up to 100MB, mp4/webm/mov.' : 'Up to 10MB, jpg/png/webp.'}</p>
              </div>
            )}
            <input
              accept={type === 'video' ? 'video/*' : 'image/*'}
              className="sr-only"
              onChange={handleMediaChange}
              type="file"
            />
          </label>
        )}

        <label className="grid gap-2 text-sm font-bold text-ink">
          {type === 'text' ? 'Text content' : 'Post description'}
          <textarea
            className="form-field min-h-32 resize-none"
            maxLength={2000}
            onChange={(event) => setTextContent(event.target.value)}
            placeholder={type === 'text' ? 'Share your thoughts...' : 'Add a short description for your media.'}
            value={textContent}
          />
          <span className="text-right text-xs font-semibold text-ink-muted">{textContent.length}/2000</span>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          Caption
          <textarea
            className="form-field min-h-24 resize-none"
            maxLength={500}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Optional caption"
            value={caption}
          />
          <span className="text-right text-xs font-semibold text-ink-muted">{caption.length}/500</span>
        </label>

        <label className="grid gap-2 text-sm font-bold text-ink">
          Hashtags
          <input
            className="form-field"
            onChange={(event) => setHashtags(event.target.value)}
            placeholder="#tag1 #tag2"
            value={hashtags}
          />
          <span className="text-right text-xs font-semibold text-ink-muted">Optional - comma separated</span>
        </label>

        {error && <p className="app-alert">{error}</p>}

        <button className="primary-button" disabled={submitting} type="submit">
          <Icon name="send" className="mr-2" />
          {submitting ? 'Publishing...' : 'Publish post'}
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
