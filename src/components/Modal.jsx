const Modal = ({ isOpen, title, closable, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg w-[40rem] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "scale-100" : "scale-50"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          {closable && (
            <button
              className="text-gray-600 w-8 h-8 flex justify-center items-center rounded-full hover:bg-gray-500 hover:text-white"
              onClick={closeModal}
            >
              X
            </button>
          )}
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
