import { Building2 } from "lucide-react";

const CompanyLogoCard = ({ logo, company, className = "" }) => (
  <div className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white/80 shadow-sm ring-1 ring-white/70 dark:bg-white/10 dark:ring-white/10 ${className}`}>
    {logo?.secure_url || logo?.url ? (
      <img src={logo.secure_url || logo.url} alt={`${company} logo`} className="h-full w-full object-contain p-2" />
    ) : (
      <Building2 className="text-brand dark:text-teal-200" size={24} />
    )}
  </div>
);

export default CompanyLogoCard;
