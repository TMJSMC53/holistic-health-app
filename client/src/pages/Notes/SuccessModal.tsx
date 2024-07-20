const SuccessModal = () => {
  return (
    <div className={`modal ${true && 'modal-open'}`} role="dialog">
      <div className="modal-box h-90 md:w-96 overflow-y-hidden px-4">
        <h2>Note successfully created!</h2>
      </div>
      <div className="modal-backdrop">
        <button type="button">Close</button>
      </div>
    </div>
  );
};

export default SuccessModal;
