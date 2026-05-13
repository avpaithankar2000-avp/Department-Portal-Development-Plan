const PDFViewer = ({ url, title = "Document preview" }) => (
  <iframe src={url} title={title} className="h-[70vh] w-full rounded-3xl border border-slate-200 bg-white dark:border-white/10" />
);

export default PDFViewer;
