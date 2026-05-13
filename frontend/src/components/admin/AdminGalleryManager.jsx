import { motion } from "framer-motion";
import { Edit, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Initial dummy data matching public gallery
const initialDummyGalleryData = [
  {
    id: "g1",
    title: "AI & Future Technologies Symposium",
    description: "An immersive deep dive into the next generation of generative AI models, led by industry experts and senior researchers.",
    category: "Event",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2026-03-15"
  },
  {
    id: "g2",
    title: "Hackathon: Neural Networks in Action",
    description: "A 48-hour competitive coding event where students built real-world applications using modern LLMs and computer vision.",
    category: "Workshop",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
    eventDate: "2026-04-02"
  }
];

const AdminGalleryManager = () => {
  const [items, setItems] = useState(initialDummyGalleryData);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Dummy form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    eventDate: ""
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload / update
    setTimeout(() => {
      if (editingId) {
        setItems(items.map(item => item.id === editingId ? {
          ...item,
          ...formData,
          image: preview || item.image
        } : item));
      } else {
        const newItem = {
          id: `g${Date.now()}`,
          title: formData.title || "New Gallery Item",
          description: formData.description || "Description placeholder",
          category: formData.category || "General",
          image: preview || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
          eventDate: formData.eventDate || new Date().toISOString().split("T")[0]
        };
        setItems([newItem, ...items]);
      }
      
      setIsUploading(false);
      setPreview(null);
      setEditingId(null);
      setFormData({ title: "", description: "", category: "", eventDate: "" });
    }, 800);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      eventDate: item.eventDate
    });
    setPreview(item.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (confirm("Remove this gallery item?")) {
      setItems(items.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setPreview(null);
        setFormData({ title: "", description: "", category: "", eventDate: "" });
      }
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/50 p-6 backdrop-blur-xl xl:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white">Gallery Management</h2>
          <p className="mt-2 text-sm text-slate-400">Upload and manage images for the public department highlights carousel.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        {/* Upload Form */}
        <motion.form 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={handleUpload} 
          className="flex flex-col gap-5 rounded-2xl bg-white/5 p-6"
        >
          <h3 className="text-lg font-bold text-white">{editingId ? "Edit Gallery Item" : "Add New Item"}</h3>
          
          {/* Drag & Drop Area */}
          <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-black/20 p-8 transition-colors hover:border-teal-500/50 hover:bg-teal-500/5">
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 z-10 cursor-pointer opacity-0" />
            {preview ? (
              <img src={preview} alt="Preview" className="absolute inset-0 h-full w-full rounded-xl object-cover opacity-60" />
            ) : (
              <>
                <ImagePlus className="mb-3 h-10 w-10 text-slate-400 transition-colors group-hover:text-teal-400" />
                <p className="text-center text-sm font-medium text-slate-300">Click or drag image to upload</p>
                <p className="mt-1 text-xs text-slate-500">High-res 16:9 recommended</p>
              </>
            )}
            {preview && <div className="absolute inset-0 rounded-xl bg-black/40" />}
            {preview && <span className="relative z-20 text-sm font-bold text-white drop-shadow-md">Change Image</span>}
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Event Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <textarea
              placeholder="Short Description"
              rows="3"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Category (e.g. Workshop)"
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
              <input
                type="date"
                required
                value={formData.eventDate}
                onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button 
              type="submit" 
              disabled={isUploading || (!preview && !editingId)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? <Edit size={18} /> : <Plus size={18} />)}
              {isUploading ? "Saving..." : (editingId ? "Update Item" : "Add to Gallery")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setPreview(null);
                  setFormData({ title: "", description: "", category: "", eventDate: "" });
                }}
                className="rounded-lg bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/20"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        {/* Gallery Grid */}
        <div className="content-start grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const isUpcoming = item.eventDate >= today;
            return (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20"
              >
                <div className="aspect-video w-full">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-300">{item.category}</span>
                    <span className={`text-[10px] font-bold ${isUpcoming ? "text-orange-400" : "text-slate-400"}`}>
                      {isUpcoming ? "UPCOMING EVENT" : "PAST EVENT"}
                    </span>
                  </div>
                  <h4 className="truncate text-sm font-bold text-white">{item.title}</h4>
                  <p className="mt-1 text-xs text-slate-400">{new Date(item.eventDate).toLocaleDateString()}</p>
                </div>
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleEdit(item)} className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-teal-500 hover:text-white">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-red-500 hover:text-white">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryManager;
