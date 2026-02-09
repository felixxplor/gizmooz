import {useState} from 'react';

interface ProductTabsProps {
  description: string;
  descriptionHtml: string;
}

export function ProductTabs({description, descriptionHtml}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'description'>('description');

  return (
    <div className="mt-16">
      {/* Tab Headers */}
      <div className="border-b border-brand-200" role="tablist">
        <div className="flex gap-8">
          <button
            role="tab"
            aria-selected={activeTab === 'description'}
            aria-controls="panel-description"
            id="tab-description"
            onClick={() => setActiveTab('description')}
            className={`pb-4 font-semibold transition-colors relative ${
              activeTab === 'description'
                ? 'text-brand-900'
                : 'text-brand-500 hover:text-brand-900'
            }`}
          >
            Description
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-900"></span>
            )}
          </button>
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
      </div>
    </div>
  );
}
