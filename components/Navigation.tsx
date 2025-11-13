'use client'

interface NavigationProps {
  activeSection: 'prds' | 'prototypes'
  onSectionChange: (section: 'prds' | 'prototypes') => void
}

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Documentation Hub
            </h1>
          </div>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => onSectionChange('prds')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'prds'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              PRDs
            </button>
            <button
              onClick={() => onSectionChange('prototypes')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeSection === 'prototypes'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Prototypes
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

