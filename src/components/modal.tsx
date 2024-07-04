// components/DetailModal.tsx
import React from "react";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isShowCloseIcon?: boolean;
  children: React.ReactNode;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isShowCloseIcon,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-white border border-black rounded-lg shadow-lg w-auto"
        onClick={handleBackdropClick}>
        <div className="bg-bluegray border-b border-black flex flex-row justify-between items-center px-4 py-4 rounded-t-lg">
          <h3
            className="text-xl font-bold leading-6 text-nashtech"
            id="modal-title">
            {title}
          </h3>
          {isShowCloseIcon ?? (
            <button className="text-xl font-bold" onClick={onClose}>
              <CancelPresentationIcon className="text-nashtech cursor-pointer" />
            </button>
          )}
        </div>
        <div className="space-y-2 py-8 px-12">{children}</div>
      </div>
    </div>
  );
};

export default DetailModal;
