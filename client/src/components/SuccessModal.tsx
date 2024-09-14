interface SuccessModalProps {
  message: string;
}

// const [isShowSuccessModalOpen, setIsShowSuccessModalOpen] = useState(false);

/* 
{isShowSuccessModalOpen && (
        <SuccessModal message="Note successfully created" />
      )}
*/

const SuccessModal = ({ message }: SuccessModalProps) => {
  return (
    <div className={`modal ${true && 'modal-open'}`} role="dialog">
      <div className="modal-box h-90 md:w-96 overflow-y-hidden px-4">
        <h2>{message}</h2>
      </div>
      <div className="modal-backdrop">
        <button type="button">Close</button>
      </div>
    </div>
  );
};

export default SuccessModal;
