import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-premium-light px-4 dark:bg-premium-dark">
      <motion.form initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-glow backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
        <Link to="/" className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-sky-500 text-white shadow-glow">
            <BrainCircuit size={22} />
          </span>
          <span>
            <p className="font-black text-ink dark:text-white">AIML Activity Portal</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Admin login</p>
          </span>
        </Link>
        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} />
          </div>
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </motion.form>
    </main>
  );
};

export default Login;
