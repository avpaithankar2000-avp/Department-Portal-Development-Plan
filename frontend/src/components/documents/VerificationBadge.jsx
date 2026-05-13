import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const styles = {
  Verified: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Pending: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Rejected: "bg-red-500/15 text-red-700 dark:text-red-300"
};

const icons = {
  Verified: CheckCircle2,
  Pending: Clock3,
  Rejected: XCircle
};

const VerificationBadge = ({ status = "Pending" }) => {
  const Icon = icons[status] || Clock3;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${styles[status] || styles.Pending}`}>
      <Icon size={14} />
      {status}
    </span>
  );
};

export default VerificationBadge;
