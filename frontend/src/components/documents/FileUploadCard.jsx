import { AnimatePresence, motion } from "framer-motion";
import { FileText, Image, RotateCcw, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import UploadProgress from "./UploadProgress";

const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const maxBytes = 5 * 1024 * 1024;

const isImage = (file) => file?.type?.startsWith("image/") || file?.fileType?.startsWith("image/");
const docUrl = (document) => document?.secure_url || document?.url;

const FileUploadCard = ({ label, name, value, file, progress, onChange, onRemove, onPreview }) => {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useMemo(() => (file && isImage(file) ? URL.createObjectURL(file) : docUrl(value)), [file, value]);
  const displayName = file?.name || docUrl(value)?.split("/").pop() || "No file selected";

  const selectFile = (nextFile) => {
    if (!nextFile) return;
    if (!allowedTypes.includes(nextFile.type)) {
      setError("Only PDF, JPG, JPEG, and PNG files are allowed.");
      return;
    }
    if (nextFile.size > maxBytes) {
      setError("File size must be 5MB or less.");
      return;
    }
    setError("");
    onChange(name, nextFile);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`rounded-[1.5rem] border border-dashed p-4 transition ${dragging ? "border-brand bg-teal-50/80 dark:bg-teal-300/10" : "border-slate-300/70 bg-white/55 dark:border-white/10 dark:bg-white/5"}`}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        selectFile(event.dataTransfer.files?.[0]);
      }}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow" aria-label={`Upload ${label}`}>
          <UploadCloud size={22} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-black text-ink dark:text-white">{label}</p>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{displayName}</p>
          {error && <p className="mt-2 text-xs font-bold text-red-600">{error}</p>}
          {progress > 0 && progress < 100 && <UploadProgress value={progress} />}
        </div>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,image/jpeg,image/jpg,image/png" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
      <AnimatePresence>
        {(file || docUrl(value)) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden">
            <button type="button" onClick={() => onPreview?.(file ? { secure_url: URL.createObjectURL(file), fileType: file.type } : { ...value, secure_url: docUrl(value) }, label)} className="flex w-full items-center gap-3 rounded-2xl bg-slate-100 p-3 text-left dark:bg-white/10">
              <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white dark:bg-white/10">
                {previewUrl && isImage(file || value) ? <img src={previewUrl} alt={label} className="h-full w-full object-cover" /> : file?.type?.startsWith("image/") ? <Image size={20} /> : <FileText size={20} />}
              </span>
              <span className="min-w-0 flex-1 text-sm font-bold text-slate-700 dark:text-slate-200">Preview document</span>
            </button>
            <div className="mt-3 flex gap-2">
              <button type="button" className="btn-secondary flex-1 px-3 py-2" onClick={() => inputRef.current?.click()}>
                <RotateCcw size={16} />
                Replace
              </button>
              <button type="button" className="btn-secondary flex-1 px-3 py-2 text-red-600" onClick={() => onRemove(name)}>
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileUploadCard;
