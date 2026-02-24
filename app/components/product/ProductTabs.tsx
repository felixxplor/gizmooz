import {useState} from 'react';
import {ChevronDown} from 'lucide-react';

interface ProductTabsProps {
  description: string;
  descriptionHtml: string;
}

const SPECS = [
  {label: 'Dimensions', value: '8 × 8 × 8 cm'},
  {label: 'Weight', value: '280 g'},
  {label: 'Material', value: 'Optical-grade crystal acrylic'},
  {label: 'Power', value: 'USB-C, 5V / 1A'},
  {label: 'Colors', value: '16 million RGB'},
  {label: 'Brightness Levels', value: '6 levels'},
  {label: 'Light Modes', value: 'Static, Breathing, Colour Cycle'},
  {label: 'Remote', value: 'Included (IR, 2× AAA batteries)'},
  {label: 'Cable Length', value: '1.2 m USB-C cable included'},
  {label: 'Compatibility', value: 'Any USB-A/C power source (≥5W)'},
];

const FAQS = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are dispatched within 1–2 business days. Standard Australian shipping takes 3–7 business days. Express options are available at checkout.',
  },
  {
    q: 'Can I use it with a power bank?',
    a: 'Yes — any USB power bank with at least a 5W output will work. The lamp draws less than 5W so it\'s great for travel or areas without a nearby outlet.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day change-of-mind return. Simply contact us and we\'ll arrange a prepaid return label. Items must be in original packaging.',
  },
  {
    q: 'Is the lamp safe to leave on overnight?',
    a: 'Yes. The LED base runs cool to the touch and has no fire risk. The lamp does not include an auto-off timer, so we recommend using a smart plug if you want scheduled shutdowns.',
  },
  {
    q: 'Does it come with a warranty?',
    a: 'All Gizmody products include a 1-year manufacturer\'s warranty covering defects in materials and workmanship.',
  },
];

type Tab = 'description' | 'specs' | 'faq';

function FaqItem({q, a}: {q: string; a: string}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-semibold text-brand-900">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-brand-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-brand-600 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export function ProductTabs({description, descriptionHtml}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('description');

  const tabs: {id: Tab; label: string}[] = [
    {id: 'description', label: 'Description'},
    {id: 'specs', label: 'Specifications'},
    {id: 'faq', label: 'FAQ'},
  ];

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="border-b border-brand-200" role="tablist">
        <div className="flex gap-8">
          {tabs.map(({id, label}) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              aria-controls={`panel-${id}`}
              id={`tab-${id}`}
              onClick={() => setActiveTab(id)}
              className={`pb-4 font-semibold transition-colors relative whitespace-nowrap ${
                activeTab === id
                  ? 'text-brand-900'
                  : 'text-brand-500 hover:text-brand-900'
              }`}
            >
              {label}
              {activeTab === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-900" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === 'description' && (
          <div
            id="panel-description"
            role="tabpanel"
            aria-labelledby="tab-description"
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{__html: descriptionHtml}}
          />
        )}

        {activeTab === 'specs' && (
          <div
            id="panel-specs"
            role="tabpanel"
            aria-labelledby="tab-specs"
            className="max-w-2xl"
          >
            <table className="w-full text-sm">
              <tbody>
                {SPECS.map(({label, value}, i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? 'bg-brand-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 font-semibold text-brand-700 w-48 rounded-l-lg">
                      {label}
                    </td>
                    <td className="py-3 px-4 text-brand-600 rounded-r-lg">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'faq' && (
          <div
            id="panel-faq"
            role="tabpanel"
            aria-labelledby="tab-faq"
            className="max-w-2xl"
          >
            {FAQS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
