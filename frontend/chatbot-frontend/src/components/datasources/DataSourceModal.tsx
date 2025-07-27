import React from "react";
import type { DataSource } from "../../types";

interface DataSourceModalProps {
  dataSource: DataSource | null;
  isOpen: boolean;
  onClose: () => void;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({
  dataSource,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !dataSource) return null;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "processing":
        return "bg-warning text-dark";
      case "failed":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "bi-file-pdf";
      case "doc":
        return "bi-file-word";
      case "txt":
        return "bi-file-text";
      default:
        return "bi-file-earmark";
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i
                className={`bi ${getSourceTypeIcon(
                  dataSource.source_type
                )} me-2`}
              ></i>
              {dataSource.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <h6 className="text-muted mb-1">Description</h6>
                  <p>{dataSource.description || "No description provided"}</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Details</h6>
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            dataSource.processing_status
                          )}`}
                        >
                          {dataSource.processing_status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">Created</small>
                      <div>
                        {new Date(dataSource.created_at).toLocaleString()}
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">File Type</small>
                      <div>{dataSource.source_type.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceModal;
