import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, X } from "lucide-react";
import PDFViewer from "./PDFViewer";

const docUrl = (document) => document?.secure_url || document?.url;
const isPdf = (document) => document?.fileType?.includes("pdf") || docUrl(document)?.toLowerCase().includes(".pdf");

const DocumentPreviewModal = ({ document, title = "Document", onClose }) => (
  <AnimatePresence>
    {document && (
      <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 18 }} className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/50 bg-white/95 p-5 shadow-glow dark:border-white/10 dark:bg-night/95">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Secure preview</p>
              <h2 className="text-2xl font-black text-ink dark:text-white">{title}</h2>
            </div>
            <div className="flex gap-2">
              <a className="btn-secondary px-3" href={docUrl(document)} target="_blank" rel="noreferrer" aria-label="Open document">
                <ExternalLink size={17} />
              </a>
              <a className="btn-secondary px-3" href={docUrl(document)} download aria-label="Download document">
                <Download size={17} />
              </a>
              <button className="btn-secondary px-3" onClick={onClose} aria-label="Close preview">
                <X size={17} />
              </button>
            </div>
          </div>
          {isPdf(document) ? (
            <PDFViewer url={docUrl(document)} title={title} />
          ) : (
            <img src={docUrl(document)} alt={title} className="max-h-[70vh] w-full rounded-3xl object-contain bg-slate-100 dark:bg-white/10" />
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default DocumentPreviewModal;
