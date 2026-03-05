import {useState} from 'react';
import {ChevronDown} from 'lucide-react';

interface Spec {
  label: string;
  value: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ProductTabsProps {
  description: string;
  descriptionHtml: string;
  specifications: Spec[] | null;
  faq: FaqItem[] | null;
}

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

export function ProductTabs({description, descriptionHtml, specifications, faq}: ProductTabsProps) {
const [activeTab, setActiveTab] = useState<Tab>('description');

  const tabs: {id: Tab; label: string}[] = [
    {id: 'description', label: 'Description'},
    ...(specifications?.length ? [{id: 'specs' as Tab, label: 'Specifications'}] : []),
    ...(faq?.length ? [{id: 'faq' as Tab, label: 'FAQ'}] : []),
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

        {activeTab === 'specs' && specifications?.length && (
          <div
            id="panel-specs"
            role="tabpanel"
            aria-labelledby="tab-specs"
            className="max-w-2xl"
          >
            <table className="w-full text-sm">
              <tbody>
                {specifications.map(({label, value}, i) => (
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

        {activeTab === 'faq' && faq?.length && (
          <div
            id="panel-faq"
            role="tabpanel"
            aria-labelledby="tab-faq"
            className="max-w-2xl"
          >
            {faq.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
