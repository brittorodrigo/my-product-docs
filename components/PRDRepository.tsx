'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import PRDViewer from './PRDViewer'
import FolderConfig from './FolderConfig'
import GlobalTagManager from './GlobalTagManager'

interface PRDFile {
  name: string
  path: string
  lastModified: Date
  content: string
  tags?: string[]
  status?: string
  version?: string
}

interface PRDRepositoryProps {
  folderPath: string
  onViewChange?: (isViewing: boolean) => void
}

export default function PRDRepository({ folderPath, onViewChange }: PRDRepositoryProps) {
  const [prds, setPrds] = useState<PRDFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPRD, setSelectedPRD] = useState<PRDFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [showTagManager, setShowTagManager] = useState(false)

  useEffect(() => {
    if (folderPath) {
      loadPRDs()
    } else {
      setPrds([])
    }
  }, [folderPath])

  useEffect(() => {
    // Extract all unique tags from PRDs
    const tags = new Set<string>()
    prds.forEach(prd => {
      prd.tags?.forEach(tag => tags.add(tag))
    })
    setAllTags(Array.from(tags).sort())
  }, [prds])

  const loadPRDs = async () => {
    if (!folderPath) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/prds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      })

      if (!response.ok) {
        throw new Error('Failed to load PRDs')
      }

      const data = await response.json()
      setPrds(data.prds || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PRDs')
      setPrds([])
    } finally {
      setLoading(false)
    }
  }

  const filteredPRDs = prds.filter(prd => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        prd.name.toLowerCase().includes(query) ||
        prd.content.toLowerCase().includes(query) ||
        prd.tags?.some(tag => tag.toLowerCase().includes(query))
      
      if (!matchesSearch) return false
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      const hasTags = selectedTags.every(tag => prd.tags?.includes(tag))
      if (!hasTags) return false
    }

    return true
  })

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSearchQuery('')
  }

  const handleTagRenamed = async (oldTag: string, newTag: string) => {
    try {
      const response = await fetch('/api/prds/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath: folderPath,
          action: 'rename',
          oldTag: oldTag,
          newTag: newTag,
        }),
      })

      if (response.ok) {
        // Reload PRDs to reflect changes
        await loadPRDs()
      }
    } catch (error) {
      console.error('Error renaming tag:', error)
    }
  }

  const handleTagDeleted = async (tag: string) => {
    try {
      const response = await fetch('/api/prds/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath: folderPath,
          action: 'delete',
          oldTag: tag,
        }),
      })

      if (response.ok) {
        // Reload PRDs to reflect changes
        await loadPRDs()
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  const handleSelectPRD = (prd: PRDFile) => {
    setSelectedPRD(prd)
    onViewChange?.(true)
  }

  const handleBack = () => {
    setSelectedPRD(null)
    onViewChange?.(false)
  }

  const handlePRDUpdate = (updatedPRD: PRDFile) => {
    // Update the PRD in the list
    setPrds(prevPrds => 
      prevPrds.map(prd => 
        prd.path === updatedPRD.path ? updatedPRD : prd
      )
    )
    setSelectedPRD(updatedPRD)
  }

  if (selectedPRD) {
    return (
      <PRDViewer 
        prd={selectedPRD} 
        onBack={handleBack}
        allTags={allTags}
        onPRDUpdate={handlePRDUpdate}
      />
    )
  }

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 dark:border-blue-800 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <svg 
            className="h-8 w-8 text-blue-600 dark:text-blue-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            PRDs
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Product Requirements Documents
        </p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search PRDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 pr-10 border-2 border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Tags</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTagManager(true)}
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1"
                title="Manage tags globally"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage
              </button>
              {(selectedTags.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Global Tag Manager Modal */}
      {showTagManager && (
        <GlobalTagManager
          allTags={allTags}
          onClose={() => setShowTagManager(false)}
          onTagRenamed={handleTagRenamed}
          onTagDeleted={handleTagDeleted}
        />
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading PRDs...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-700 dark:text-red-200 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && filteredPRDs.length === 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-xl p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {searchQuery ? '🔍 No PRDs found matching your search.' : '📄 No PRDs found in the folder.'}
          </p>
        </div>
      )}

      {!loading && !error && filteredPRDs.length > 0 && (
        <div className="space-y-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar">
          {filteredPRDs.map((prd) => (
            <button
              key={prd.path}
              onClick={() => handleSelectPRD(prd)}
              className="w-full text-left bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-xl p-4 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate">
                    {prd.name.replace('.md', '')}
                  </h3>
                  {prd.tags && prd.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                      {prd.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {prd.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{prd.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {format(prd.lastModified, 'MMM d, yyyy')}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-blue-500 flex-shrink-0 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
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

