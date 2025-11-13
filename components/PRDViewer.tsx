'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import TagEditor from './TagEditor'

interface PRDFile {
  name: string
  path: string
  lastModified: Date
  content: string
  tags?: string[]
  status?: string
  version?: string
}

interface TOCItem {
  id: string
  text: string
  level: number
}

interface VersionHistoryItem {
  date: Date
  content: string
  version?: string
}

interface PRDViewerProps {
  prd: PRDFile
  onBack: () => void
  allTags: string[]
  onPRDUpdate?: (updatedPRD: PRDFile) => void
}

export default function PRDViewer({ prd, onBack, allTags, onPRDUpdate }: PRDViewerProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [versionHistory, setVersionHistory] = useState<VersionHistoryItem[]>([])
  const [currentTags, setCurrentTags] = useState<string[]>(prd.tags || [])
  const [saving, setSaving] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Extract table of contents from markdown
  useEffect(() => {
    const headings: TOCItem[] = []
    const lines = prd.content.split('\n')
    
    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
        headings.push({ id, text, level })
      }
    })
    
    setToc(headings)
  }, [prd.content])

  // Load version history
  useEffect(() => {
    loadVersionHistory()
  }, [prd.path])

  const loadVersionHistory = async () => {
    try {
      const response = await fetch('/api/prds/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: prd.path }),
      })

      if (response.ok) {
        const data = await response.json()
        setVersionHistory(data.versions || [])
      }
    } catch (error) {
      console.error('Error loading version history:', error)
    }
  }

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = toc.map(item => document.getElementById(item.id))
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading) {
          const rect = heading.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveId(toc[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  // Update tags
  const handleTagsChange = async (newTags: string[]) => {
    setCurrentTags(newTags)
    setSaving(true)

    try {
      const response = await fetch('/api/prds/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: prd.path,
          updates: { tags: newTags },
        }),
      })

      if (response.ok) {
        // Update parent component
        if (onPRDUpdate) {
          onPRDUpdate({ ...prd, tags: newTags })
        }
      } else {
        console.error('Failed to update tags')
        // Revert on error
        setCurrentTags(prd.tags || [])
      }
    } catch (error) {
      console.error('Error updating tags:', error)
      setCurrentTags(prd.tags || [])
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to PRD List
          </button>

          {versionHistory.length > 0 && (
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Version History ({versionHistory.length})
            </button>
          )}
        </div>

        {/* Version History Modal */}
        {showVersionHistory && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowVersionHistory(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Version History</h2>
                  <button onClick={() => setShowVersionHistory(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
                {versionHistory.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No version history available</p>
                ) : (
                  <div className="space-y-4">
                    {versionHistory.map((version, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {version.version || `Version ${versionHistory.length - index}`}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(version.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {version.content.substring(0, 200)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Contents
                </h3>
                <nav className="space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                        activeId === item.id
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                    >
                      {item.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-12 shadow-2xl">
              <div className="mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 dark:border-blue-700">
                <div className="mb-3">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {prd.name.replace('.md', '')}
                  </h1>
                </div>
                
                {/* Tag Editor */}
                <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <TagEditor 
                    tags={currentTags} 
                    onTagsChange={handleTagsChange} 
                    allTags={allTags}
                  />
                  {saving && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {prd.path}
                </p>
              </div>

              <div ref={contentRef} className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props}>{children}</h1>
                    },
                    h2: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h2 id={id} className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props}>{children}</h2>
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h3 id={id} className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white" {...props}>{children}</h3>
                    },
                    h4: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h4 id={id} className="text-lg font-bold mt-3 mb-2 text-gray-900 dark:text-white" {...props}>{children}</h4>
                    },
                    h5: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h5 id={id} className="text-base font-bold mt-2 mb-1 text-gray-900 dark:text-white" {...props}>{children}</h5>
                    },
                    h6: ({ children, ...props }) => {
                      const text = String(children)
                      const index = prd.content.split('\n').findIndex(line => line.includes(text))
                      const id = `heading-${index}-${text.toLowerCase().replace(/[^\w]+/g, '-')}`
                      return <h6 id={id} className="text-sm font-bold mt-2 mb-1 text-gray-900 dark:text-white" {...props}>{children}</h6>
                    },
                    p: ({ node, ...props }) => (
                      <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="ml-4" {...props} />
                    ),
                    code: ({ node, inline, ...props }: any) =>
                      inline ? (
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400" {...props} />
                      ) : (
                        <code className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
                      ),
                    pre: ({ node, ...props }) => (
                      <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} />
                    ),
                  }}
                >
                  {prd.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
