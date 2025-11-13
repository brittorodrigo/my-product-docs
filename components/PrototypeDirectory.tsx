'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import FolderConfig from './FolderConfig'

interface Prototype {
  name: string
  path: string
  lastModified: Date
  type: 'directory' | 'file'
}

interface PrototypeDirectoryProps {
  folderPath: string
}

export default function PrototypeDirectory({ folderPath }: PrototypeDirectoryProps) {
  const [prototypes, setPrototypes] = useState<Prototype[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (folderPath) {
      loadPrototypes()
    } else {
      setPrototypes([])
    }
  }, [folderPath])

  const loadPrototypes = async () => {
    if (!folderPath) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/prototypes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      })

      if (!response.ok) {
        throw new Error('Failed to load prototypes')
      }

      const data = await response.json()
      setPrototypes(data.prototypes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prototypes')
      setPrototypes([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenPrototype = async (prototype: Prototype) => {
    try {
      const response = await fetch('/api/prototypes/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: prototype.path }),
      })

      if (!response.ok) {
        throw new Error('Failed to open prototype')
      }

      const data = await response.json()
      
      if (data.url) {
        // External URL - open in new tab
        window.open(data.url, '_blank')
      } else if (data.path && data.type === 'local-html') {
        // Local HTML file - serve through our API and open in new tab
        const serveUrl = `/api/prototypes/serve?path=${encodeURIComponent(data.path)}`
        window.open(serveUrl, '_blank')
      } else if (data.error) {
        alert(`Error opening prototype: ${data.error}`)
      }
    } catch (err) {
      alert(`Error opening prototype: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 dark:border-sky-800 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <svg 
            className="h-8 w-8 text-sky-600 dark:text-sky-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" 
            />
          </svg>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
            Prototypes
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Interactive Prototypes & Designs
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-sky-200 border-t-sky-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading prototypes...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && prototypes.length === 0 && (
        <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-gray-800 dark:to-sky-900/20 border-2 border-sky-100 dark:border-sky-800 rounded-xl p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            🎨 No prototypes found in the folder.
          </p>
        </div>
      )}

      {!loading && !error && prototypes.length > 0 && (
        <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
          {prototypes.map((prototype) => (
            <button
              key={prototype.path}
              onClick={() => handleOpenPrototype(prototype)}
              className="w-full bg-gradient-to-br from-white to-sky-50 dark:from-gray-900 dark:to-sky-900/20 border-2 border-sky-100 dark:border-sky-800 rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 bg-gradient-to-br from-sky-500 to-cyan-500 p-2 rounded-lg">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {prototype.name}
                  </h3>
                  <p className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                    {format(prototype.lastModified, 'MMM d, yyyy')}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-sky-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

