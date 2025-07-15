import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, deleteNote } from '../services/notesService';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaThumbtack } from 'react-icons/fa';

const PAGE_SIZE = 10;

function NotesListPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial load
    fetchNotes(1, true);
    // eslint-disable-next-line
  }, []);

  const fetchNotes = async (pageToFetch, reset = false) => {
    if (reset) setLoading(true);
    try {
      const data = await getNotes();
      setNotes(reset ? data.notes : prev => [...prev, ...data.notes]);
      setTotal(data.total);
      setPage(pageToFetch);
    } catch (err) {
      setError(err.message);
    } finally {
      if (reset) setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    fetchNotes(page + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes(notes => notes.filter(note => note._id !== id));
      toast.success('Note deleted successfully!');
    } catch (err) {
      setError('Failed to delete note.');
      toast.error('Failed to delete note.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const updated = { ...note, isPinned: !note.isPinned };
      await fetch(`/api/notes/${note._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
        credentials: 'include'
      });
      setNotes(notes => notes.map(n => n._id === note._id ? { ...n, isPinned: !n.isPinned } : n));
      toast.success(updated.isPinned ? 'Note pinned!' : 'Note unpinned!');
    } catch {
      toast.error('Failed to update pin status.');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => navigate('/create')}
        >
          Create Note
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {filteredNotes.length === 0 ? (
        <div>No notes found.</div>
      ) : (
        <>
          <ul className="space-y-4">
            {filteredNotes.map(note => (
              <li
                key={note._id}
                className="p-4 border rounded shadow bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:bg-blue-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                style={{ animation: 'fadeIn 0.5s' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold truncate text-gray-900 dark:text-white">{note.title}</h2>
                    {note.isPinned && <span className="ml-1 px-2 py-0.5 bg-yellow-300 text-yellow-900 text-xs rounded-full">Pinned</span>}
                  </div>
                  <div className="mt-2 break-words prose prose-sm max-w-none text-gray-700 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: note.content }} />
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {note.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition flex items-center gap-1"
                    onClick={() => navigate(`/edit/${note._id}`)}
                    title="Edit"
                  >
                    <FaEdit /> <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-900 transition flex items-center gap-1"
                    onClick={() => handleTogglePin(note)}
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <FaThumbtack className={note.isPinned ? 'rotate-45 text-yellow-500' : ''} />
                    <span className="hidden sm:inline">{note.isPinned ? 'Unpin' : 'Pin'}</span>
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1"
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                    title="Delete"
                  >
                    <FaTrash /> <span className="hidden sm:inline">{deletingId === note._id ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {notes.length < total && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing {notes.length} of {total} notes
          </div>
        </>
      )}
    </div>
  );
}

export default NotesListPage; 