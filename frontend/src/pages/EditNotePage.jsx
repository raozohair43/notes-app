import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNote, updateNote } from '../services/notesService';
import { toast } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditNotePage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const note = await getNote(id);
        setTitle(note.title);
        setContent(note.content);
        setTags(note.tags ? note.tags.join(', ') : '');
        setIsPinned(!!note.isPinned);
      } catch (err) {
        setError('Failed to fetch note.');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateNote(id, {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPinned
      });
      toast.success('Note updated successfully!');
      navigate('/');
    } catch (err) {
      setError('Failed to update note.');
      toast.error('Failed to update note.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
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
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditNotePage; 