import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote } from '../services/notesService';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createNote({
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPinned
      });
      toast.success('Note created successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to create note.');
      toast.error('Failed to create note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Tags (comma separated)</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="e.g. work, personal, urgent"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPinned"
            checked={isPinned}
            onChange={e => setIsPinned(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isPinned" className="font-semibold">Pin this note</label>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Note'}
        </button>
      </form>
    </div>
  );
}

export default CreateNotePage; 