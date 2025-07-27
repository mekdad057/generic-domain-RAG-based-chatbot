import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataSourceOperations } from "../../hooks/useDataSources";
import MainLayout from "../layout/MainLayout";
import type { CreateDataSourceData } from "../../types";

const DataSourceCreate: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    source_type: "" as "pdf" | "doc" | "txt" | "", // Initialize with empty string
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [typeError, setTypeError] = useState(""); // Add type validation error

  const { createDataSource, loading, error } = useDataSourceOperations();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "source_type" ? (value as "pdf" | "doc" | "txt" | "") : value,
    }));

    // Clear type error when user selects a type
    if (id === "source_type" && value) {
      setTypeError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "text/plain",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setFileError("Please select a PDF, DOC, or TXT file.");
        setFile(null);
        return;
      }

      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError("File size must be less than 5MB.");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setFileError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate datasource type
    if (!formData.source_type) {
      setTypeError("Please select a file type.");
      return;
    }

    // Validate file
    if (!file) {
      setFileError("Please select a file.");
      return;
    }

    // Additional validation: Check if file type matches selected type
    const fileTypeMap: Record<string, "pdf" | "doc" | "txt"> = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "text/plain": "txt",
    };

    const expectedType = fileTypeMap[file.type];
    if (expectedType && expectedType !== formData.source_type) {
      setFileError(
        `Selected file type doesn't match the chosen type. Please select a ${formData.source_type.toUpperCase()} file or change the file type.`
      );
      return;
    }

    try {
      // Prepare data with correct typing
      const dataToSubmit: CreateDataSourceData = {
        ...formData,
        file,
      } as CreateDataSourceData; // Type assertion since we've validated source_type

      const result = await createDataSource(dataToSubmit);

      if (result.success) {
        navigate("/datasources");
      }
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  return (
    <MainLayout>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">
                <i className="bi bi-database-add me-2"></i>
                Add New Datasource
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div
                  className="alert alert-danger alert-dismissible fade show"
                  role="alert"
                >
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {}}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="source_type" className="form-label">
                    File Type
                  </label>
                  <select
                    className={`form-select ${typeError ? "is-invalid" : ""}`}
                    id="source_type"
                    value={formData.source_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select file type...</option>
                    <option value="pdf">PDF Document</option>
                    <option value="doc">Word Document</option>
                    <option value="txt">Text File</option>
                  </select>
                  {typeError && (
                    <div className="invalid-feedback">{typeError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="file" className="form-label">
                    File
                  </label>
                  <input
                    type="file"
                    className={`form-control ${fileError ? "is-invalid" : ""}`}
                    id="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.txt"
                    required
                  />
                  {fileError && (
                    <div className="invalid-feedback">{fileError}</div>
                  )}
                  <div className="form-text">
                    Supported formats: PDF, DOC, TXT. Maximum file size: 5MB.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/datasources")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-database-add me-1"></i>
                        Create Datasource
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DataSourceCreate;
