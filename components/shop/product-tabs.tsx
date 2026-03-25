'use client'

import { useState } from 'react'

type Tab = {
  label: string
  key: string
  content: string | null
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const availableTabs = tabs.filter((t) => t.content)
  const [activeKey, setActiveKey] = useState(availableTabs[0]?.key || '')

  if (availableTabs.length === 0) return null

  const activeTab = availableTabs.find((t) => t.key === activeKey)

  return (
    <div>
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveKey(tab.key)}
            className={`whitespace-nowrap px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeKey === tab.key
                ? 'border-mint-500 text-mint-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-6 text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {activeTab?.content || 'No information available.'}
      </div>
    </div>
  )
}
