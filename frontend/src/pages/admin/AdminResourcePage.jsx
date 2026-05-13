import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createResource, deleteResource, listResource, updateResource } from "../../api/resources";
import AdminForm from "../../components/admin/AdminForm";
import AdminTable from "../../components/admin/AdminTable";
import Pagination from "../../components/public/Pagination";
import StateBlock from "../../components/public/StateBlock";
import { resourceConfig } from "../../config/resources";
import AnimatedPage from "../../components/ui/AnimatedPage";

const AdminResourcePage = ({ resource }) => {
  const config = resourceConfig[resource];
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState({ page: 1, limit: 10, search: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listResource(config.endpoint, params);
      setItems(data.items);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [resource, JSON.stringify(params)]);

  const submit = async (payload, hasFile) => {
    setSaving(true);
    setUploadProgress(0);
    try {
      const onProgress = (value) => setUploadProgress(value);
      if (editing) await updateResource(config.endpoint, editing._id, payload, hasFile, onProgress);
      else await createResource(config.endpoint, payload, hasFile, onProgress);
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save record");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      await deleteResource(config.endpoint, id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete record");
    }
  };

  return (
    <AnimatedPage>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-brand dark:text-teal-200">Content studio</p>
          <h1 className="mt-1 text-4xl font-black text-ink dark:text-white">{config.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Create, edit, search, and delete records.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus size={18} />
          Add Record
        </button>
      </div>
      <div className="glass-panel mb-4 rounded-[2rem] p-4">
        <div className={config.hasFiles ? "grid gap-3 lg:grid-cols-4" : ""}>
          <input value={params.search} onChange={(event) => setParams((prev) => ({ ...prev, search: event.target.value, page: 1 }))} placeholder={`Search ${config.title.toLowerCase()}`} />
          {config.hasFiles && (
            <>
              <input value={params.company || ""} onChange={(event) => setParams((prev) => ({ ...prev, company: event.target.value, page: 1 }))} placeholder="Company" />
              <input value={params.academicYear || ""} onChange={(event) => setParams((prev) => ({ ...prev, academicYear: event.target.value, page: 1 }))} placeholder="Academic year" />
              <select value={params.verificationStatus || ""} onChange={(event) => setParams((prev) => ({ ...prev, verificationStatus: event.target.value, page: 1 }))}>
                <option value="">All status</option>
                <option>Verified</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </>
          )}
        </div>
      </div>
      <StateBlock loading={loading} error={error} empty={!loading && items.length === 0} />
      {!loading && items.length > 0 && <AdminTable columns={config.columns} documentFields={config.documentFields} items={items} onEdit={(item) => { setEditing(item); setFormOpen(true); }} onDelete={remove} />}
      <Pagination pagination={pagination} onPage={(page) => setParams((prev) => ({ ...prev, page }))} />
      {formOpen && <AdminForm config={config} editing={editing} onClose={() => setFormOpen(false)} onSubmit={submit} saving={saving} uploadProgress={uploadProgress} />}
    </AnimatedPage>
  );
};

export default AdminResourcePage;
