import { Download, Edit, Eye, FileCheck2, FileX2, Trash2 } from "lucide-react";
import { useState } from "react";
import DocumentPreviewModal from "../documents/DocumentPreviewModal";
import VerificationBadge from "../documents/VerificationBadge";
import { formatDate, moneyLpa } from "../../utils/formatters";

const dateFields = new Set(["date", "awardDate", "startDate", "endDate", "placedDate"]);

const formatValue = (key, value) => {
  if (dateFields.has(key)) return formatDate(value);
  if (key === "packageLpa") return moneyLpa(value);
  if (key === "verificationStatus") return <VerificationBadge status={value} />;
  return value || "N/A";
};

const AdminTable = ({ columns, documentFields = [], items, onEdit, onDelete }) => {
  const [preview, setPreview] = useState(null);

  return (
    <div className="glass-panel overflow-hidden rounded-[2rem]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/50 text-xs uppercase text-slate-500 dark:bg-white/5 dark:text-slate-400">
            <tr>
              {columns.map(([, label]) => (
                <th key={label} className="px-4 py-3">{label}</th>
              ))}
              {documentFields.length > 0 && <th className="px-4 py-3">Documents</th>}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/10">
            {items.map((item) => (
              <tr key={item._id}>
                {columns.map(([key]) => (
                  <td key={key} className="px-4 py-4 text-slate-700 dark:text-slate-200">{formatValue(key, item[key])}</td>
                ))}
                {documentFields.length > 0 && (
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {documentFields.map((field) => {
                        const document = item[field.name];
                        return (
                          <span key={field.name} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${document?.secure_url ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-slate-500/10 text-slate-500"}`} title={field.label}>
                            {document?.secure_url ? <FileCheck2 size={13} /> : <FileX2 size={13} />}
                            {field.label.split(" ")[0]}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {documentFields.some((field) => item[field.name]?.secure_url) && (
                      <div className="flex gap-1">
                        {documentFields
                          .filter((field) => item[field.name]?.secure_url)
                          .slice(0, 2)
                          .map((field) => (
                            <span key={field.name} className="flex gap-1">
                              <button className="btn-secondary px-3" onClick={() => setPreview({ document: item[field.name], title: field.label })} aria-label={`Preview ${field.label}`}>
                                <Eye size={16} />
                              </button>
                              <a className="btn-secondary px-3" href={item[field.name].secure_url} download aria-label={`Download ${field.label}`}>
                                <Download size={16} />
                              </a>
                            </span>
                          ))}
                      </div>
                    )}
                    <button className="btn-secondary px-3" onClick={() => onEdit(item)} aria-label="Edit record">
                      <Edit size={16} />
                    </button>
                    <button className="btn-secondary px-3 text-red-600" onClick={() => onDelete(item._id)} aria-label="Delete record">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DocumentPreviewModal document={preview?.document} title={preview?.title} onClose={() => setPreview(null)} />
    </div>
  );
};

export default AdminTable;
