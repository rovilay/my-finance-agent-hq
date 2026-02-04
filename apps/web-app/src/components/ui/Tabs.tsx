import React from 'react';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  return (
    <div className={`border-b border-neutral-200 ${className}`}>
      <div className="flex gap-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`cursor-pointer pb-3 px-1 font-medium text-sm transition-colors relative ${
              activeTab === tab.id ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.label}
            {typeof tab.count !== 'undefined' && (
              <span className="ml-2 text-xs text-neutral-400">({tab.count})</span>
            )}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
