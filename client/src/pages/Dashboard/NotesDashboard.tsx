import NotesCreateForm from '../Notes/NotesCreateForm';
import NotesDashboardView from '../Dashboard/NotesDashboardView';

const NotesDashboard = () => {
  return (
    <div className="my-auto lg:mt-20">
      <div className="flex justify-between items-center font-poppins">
        <h6 className="lg:text-20 ml-8 md:mx-4">Notes</h6>
        <NotesCreateForm />
      </div>
      <NotesDashboardView />
    </div>
  );
};

export default NotesDashboard;
