import {Zap, Palette, Wifi, Box, Radio, Layers} from 'lucide-react';

const FEATURES = [
  {
    icon: Palette,
    title: '16 Million Colors',
    desc: 'Full RGB spectrum with smooth color transitions',
  },
  {
    icon: Layers,
    title: '6 Brightness Levels',
    desc: 'Dial in the perfect ambiance for any setting',
  },
  {
    icon: Zap,
    title: 'USB-C Powered',
    desc: 'Plug into any laptop, power bank, or USB adapter',
  },
  {
    icon: Box,
    title: 'Crystal Acrylic Cube',
    desc: 'High-clarity optical-grade acrylic for deep light scatter',
  },
  {
    icon: Radio,
    title: 'Remote Included',
    desc: 'Control colors & brightness without touching the lamp',
  },
  {
    icon: Wifi,
    title: 'Silent Operation',
    desc: 'Zero fan, zero hum — pure ambient light',
  },
];

export function ProductFeatureHighlights() {
  return (
    <div className="border-t border-brand-200 pt-6">
      <h5 className="text-sm font-bold text-brand-900 mb-4">What You Get</h5>
      <ul className="space-y-3">
        {FEATURES.map(({icon: Icon, title, desc}) => (
          <li key={title} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-accent-600" />
            </div>
            <div>
              <span className="text-sm font-semibold text-brand-900">{title}</span>
              <span className="text-sm text-brand-500"> — {desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
