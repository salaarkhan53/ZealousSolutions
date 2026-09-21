import {
  BarChart3,
  Cpu,
  FileText,
  Globe,
  GraduationCap,
  Headset,
  HeartPulse,
  Home,
  Megaphone,
  Shield,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps the icon names used in content/site.ts to components, so content stays
 * plain data with no imports of its own.
 */
const icons: Record<string, LucideIcon> = {
  headset: Headset,
  chart: BarChart3,
  users: Users,
  globe: Globe,
  target: Target,
  shield: Shield,
  megaphone: Megaphone,
  'heart-pulse': HeartPulse,
  'file-text': FileText,
  stethoscope: Stethoscope,
  home: Home,
  'shopping-bag': ShoppingBag,
  cpu: Cpu,
  sparkles: Sparkles,
  'trending-up': TrendingUp,
  'graduation-cap': GraduationCap,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Component = icons[name] ?? Shield;
  return <Component className={className} strokeWidth={1.5} aria-hidden="true" />;
}
