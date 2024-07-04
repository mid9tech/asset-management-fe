export interface ModalConfirmProps {
  showModalConfirm: boolean;
  setShowModalConfirm: (value: boolean) => void;
  handleConfirmCancel?: () => void;
  handleConfirmComplete?: () => void;
}
