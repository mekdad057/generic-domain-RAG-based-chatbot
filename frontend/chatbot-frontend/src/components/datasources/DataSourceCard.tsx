import React from "react";
import type { DataSource } from "../../types";

interface DataSourceCardProps {
  dataSource: DataSource;
  onProcess?: (id: number) => void;
  onViewDetails?: (dataSource: DataSource) => void; // Add this prop
  processingId?: number | null;
}

const DataSourceCard: React.FC<DataSourceCardProps> = ({
  dataSource,
  onProcess,
  onViewDetails, // Add this prop
  processingId,
}) => {
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

  // Determine if process button should be shown
  const canProcess =
    dataSource.processing_status === "unprocessed" ||
    dataSource.processing_status === "failed";

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title">{dataSource.title}</h5>
            <p className="card-text text-muted small mb-2">
              <i
                className={`bi ${getSourceTypeIcon(
                  dataSource.source_type
                )} me-1`}
              ></i>
              {dataSource.source_type.toUpperCase()}
            </p>
          </div>
          <span
            className={`badge ${getStatusBadgeClass(
              dataSource.processing_status
            )}`}
          >
            {dataSource.processing_status}
          </span>
        </div>

        {dataSource.description && (
          <p className="card-text">{dataSource.description}</p>
        )}

        <div className="d-flex justify-content-between text-muted small">
          <span>
            <i className="bi bi-calendar me-1"></i>
            {new Date(dataSource.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="card-footer bg-transparent">
        <div className="d-grid gap-2 d-md-flex justify-content-between">
          <button // Changed from Link to button
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewDetails && onViewDetails(dataSource)} // Use the new prop
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>

          {canProcess && onProcess && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => onProcess(dataSource.id)}
              disabled={processingId === dataSource.id}
            >
              {processingId === dataSource.id ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                  ></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-gear me-1"></i>
                  Process
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourceCard;
