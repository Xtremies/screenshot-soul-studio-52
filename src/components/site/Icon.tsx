import { Building2, Gavel, Landmark, Users, Briefcase, Handshake, Scale, Shield, Globe, Banknote, FileText, Lightbulb, type LucideIcon } from "lucide-react";
const MAP: Record<string, LucideIcon> = { Building2, Gavel, Landmark, Users, Briefcase, Handshake, Scale, Shield, Globe, Banknote, FileText, Lightbulb };
export const ICON_NAMES = Object.keys(MAP);
export function AreaIcon({ name, className }: { name: string; className?: string }) {
  const I = MAP[name] ?? Scale;
  return <I className={className} strokeWidth={1.25} aria-hidden="true" />;
}
