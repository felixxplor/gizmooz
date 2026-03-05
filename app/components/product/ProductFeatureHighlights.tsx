import {
  Zap, Palette, Wifi, Box, Radio, Layers, Shield, Truck, Star,
  Heart, Clock, Globe, Lock, Leaf, Award, Headphones, Camera,
  Battery, Thermometer, Wind, Droplets, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap, Palette, Wifi, Box, Radio, Layers, Shield, Truck, Star,
  Heart, Clock, Globe, Lock, Leaf, Award, Headphones, Camera,
  Battery, Thermometer, Wind, Droplets,
};

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface ProductFeatureHighlightsProps {
  features: Feature[] | null;
}

export function ProductFeatureHighlights({features}: ProductFeatureHighlightsProps) {
  if (!features?.length) return null;

  return (
    <div className="border-t border-brand-200 pt-6">
      <h5 className="text-sm font-bold text-brand-900 mb-4">What You Get</h5>
      <ul className="space-y-3">
        {features.map(({icon, title, desc}) => {
          const Icon = ICON_MAP[icon] ?? Box;
          return (
            <li key={title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-accent-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-brand-900">{title}</span>
                <span className="text-sm text-brand-500"> — {desc}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
