import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import DocumentPreviewModal from "../documents/DocumentPreviewModal";
import FileUploadCard from "../documents/FileUploadCard";
import UploadProgress from "../documents/UploadProgress";

const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const AdminForm = ({ config, editing, onClose, onSubmit, saving, uploadProgress = 0 }) => {
  const initial = useMemo(() => {
    const values = {};
    config.fields.forEach((field) => {
      if (field.type === "file") return;
      values[field.name] = field.type === "date" ? toInputDate(editing?.[field.name]) : editing?.[field.name] ?? "";
    });
    return values;
  }, [config, editing]);

  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState({});
  const [removedDocuments, setRemovedDocuments] = useState([]);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial);
    setFiles({});
    setRemovedDocuments([]);
    setErrors({});
  }, [initial]);

  const validate = () => {
    const next = {};
    config.fields.forEach((field) => {
      if (field.required && !form[field.name] && field.type !== "file") {
        next[field.name] = `${field.label} is required`;
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (config.hasImage || config.hasFiles) {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) data.append(key, value);
      });
      if (config.hasImage && files.image) data.append("image", files.image);
      if (config.hasFiles) {
        Object.entries(files).forEach(([key, value]) => {
          if (value) data.append(key, value);
        });
        if (removedDocuments.length) data.append("removeDocuments", removedDocuments.join(","));
      }
      onSubmit(data, true);
      return;
    }

    onSubmit(form, false);
  };

  const setFile = (name, file) => {
    setFiles((prev) => ({ ...prev, [name]: file }));
    setRemovedDocuments((prev) => prev.filter((item) => item !== name));
  };

  const removeDocument = (name) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (editing?.[name]?.secure_url) {
      setRemovedDocuments((prev) => (prev.includes(name) ? prev : [...prev, name]));
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/50 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="mx-auto max-h-[92vh] max-w-3xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/95 shadow-glow dark:border-white/10 dark:bg-night/95">
        <div className="flex items-center justify-between border-b border-slate-200/70 p-5 dark:border-white/10">
          <h2 className="text-xl font-black text-ink dark:text-white">{editing ? `Edit ${config.title}` : `Add ${config.title}`}</h2>
          <button className="btn-secondary px-3" onClick={onClose} aria-label="Close form">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <div key={field.name} className={field.type === "textarea" || field.type === "file" ? "sm:col-span-2" : ""}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea id={field.name} rows={4} value={form[field.name] || ""} onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))} />
              ) : field.type === "select" ? (
                <select id={field.name} value={form[field.name] || ""} onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <FileUploadCard
                  label={field.label}
                  name={field.name}
                  value={editing?.image || editing?.[field.name]}
                  file={files[field.name]}
                    progress={uploadProgress}
                  onChange={setFile}
                  onRemove={removeDocument}
                  onPreview={(document, title) => setPreview({ document, title })}
                />
              ) : (
                <input
                  id={field.name}
                  type={field.type || "text"}
                  value={form[field.name] || ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, [field.name]: event.target.value }))}
                  step={field.type === "number" ? "0.1" : undefined}
                />
              )}
              {errors[field.name] && <p className="mt-1 text-xs font-semibold text-red-600">{errors[field.name]}</p>}
            </div>
          ))}
          {config.documentFields?.length > 0 && (
            <div className="sm:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Secure documents</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">PDF, JPG, JPEG, PNG up to 5MB each.</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {config.documentFields.map((documentField) => (
                  <FileUploadCard
                    key={documentField.name}
                    label={documentField.label}
                    name={documentField.name}
                    value={removedDocuments.includes(documentField.name) ? null : editing?.[documentField.name]}
                    file={files[documentField.name]}
                    progress={files[documentField.name] ? uploadProgress : 0}
                    onChange={setFile}
                    onRemove={removeDocument}
                    onPreview={(document, title) => setPreview({ document, title })}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-slate-200/70 pt-4 dark:border-white/10 sm:col-span-2">
            {saving && uploadProgress > 0 && (
              <div className="mr-auto min-w-40 flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Uploading {uploadProgress}%</p>
                <UploadProgress value={uploadProgress} />
              </div>
            )}
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </motion.div>
      <DocumentPreviewModal document={preview?.document} title={preview?.title} onClose={() => setPreview(null)} />
    </div>
  );
};

export default AdminForm;
