import NotesCards from './NotesCards';
import NotesCreateForm from './NotesCreateForm';
import BackButton from '../../components/BackButton';
const Notes = () => {
  return (
    <>
      <div className="ml-4">
        <BackButton />
      </div>
      <NotesCreateForm />
      <NotesCards />
    </>
  );
};

export default Notes;
