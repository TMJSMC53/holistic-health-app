import NotesCreateForm from '../Notes/NotesCreateForm';
import NotesDashboardView from '../Dashboard/NotesDashboardView';

const NotesDashboard = () => {
  return (
    <div>
      <NotesCreateForm />
      <NotesDashboardView />
    </div>
  );
};

export default NotesDashboard;
