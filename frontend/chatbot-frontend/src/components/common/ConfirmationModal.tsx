// src/components/common/ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "confirm" | "warning";
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "confirm",
}) => {
  if (!isOpen) return null;

  // Determine styling based on type
  const getButtonClasses = () => {
    switch (type) {
      case "delete":
        return "btn-danger";
      case "warning":
        return "btn-warning";
      default:
        return "btn-primary";
    }
  };

  const getTitleClasses = () => {
    switch (type) {
      case "delete":
        return "text-danger";
      case "warning":
        return "text-warning";
      default:
        return "";
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className={`modal-title ${getTitleClasses()}`}>{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
            {type === "delete" && (
              <p className="text-danger">This action cannot be undone.</p>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${getButtonClasses()}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
