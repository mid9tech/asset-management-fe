// components/DetailModal.tsx
import React from 'react';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/12" onClick={handleBackdropClick}>
        <div className="bg-header-modal px-4 pb-4 pt-5 sm:p-6 sm:pb-4 rounded-t-md">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold leading-6 text-nashtech" id="modal-title">{title}</h3>
            <button className="text-xl font-bold" onClick={onClose}><CancelPresentationIcon className='text-nashtech cursor-pointer'/></button>
          </div>
        </div>
        <div className="space-y-2 py-8 px-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
