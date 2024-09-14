import NotesCreateForm from '../Notes/NotesCreateForm';
import NotesDashboardView from '../Dashboard/NotesDashboardView';

const NotesDashboard = () => {
  return (
    <div className="my-auto lg:mt-20">
      <div className="flex justify-center items-center mx-2.5 font-poppins">
        <h6 className="lg:text-20">Notes</h6>
        <NotesCreateForm />
      </div>
      <NotesDashboardView />
    </div>
  );
};

export default NotesDashboard;
