'use client'

import { useState, KeyboardEvent } from 'react'

interface GlobalTagManagerProps {
  allTags: string[]
  onClose: () => void
  onTagRenamed: (oldTag: string, newTag: string) => void
  onTagDeleted: (tag: string) => void
}

export default function GlobalTagManager({ allTags, onClose, onTagRenamed, onTagDeleted }: GlobalTagManagerProps) {
  const [editingTag, setEditingTag] = useState<{ old: string; new: string } | null>(null)
  const [deletingTag, setDeletingTag] = useState<string | null>(null)

  const handleRename = async (oldTag: string, newTag: string) => {
    if (newTag && newTag !== oldTag) {
      onTagRenamed(oldTag, newTag)
    }
    setEditingTag(null)
  }

  const handleDelete = (tag: string) => {
    setDeletingTag(tag)
  }

  const confirmDelete = () => {
    if (deletingTag) {
      onTagDeleted(deletingTag)
      setDeletingTag(null)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingTag) {
      handleRename(editingTag.old, editingTag.new)
    } else if (e.key === 'Escape') {
      setEditingTag(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Tags</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Rename or delete tags across all PRDs
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {allTags.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No tags found</p>
          ) : (
            <div className="space-y-2">
              {allTags.map(tag => (
                <div key={tag} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  {editingTag?.old === tag ? (
                    <input
                      type="text"
                      value={editingTag.new}
                      onChange={(e) => setEditingTag({ ...editingTag, new: e.target.value })}
                      onKeyDown={handleKeyDown}
                      onBlur={() => handleRename(editingTag.old, editingTag.new)}
                      autoFocus
                      className="flex-1 px-3 py-1 border-2 border-blue-500 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <>
                      <span className="text-gray-900 dark:text-white font-medium">#{tag}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTag({ old: tag, new: tag })}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Rename tag"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(tag)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete tag"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deletingTag && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDeletingTag(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Tag?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This will remove <span className="font-semibold text-red-600">#{deletingTag}</span> from all PRDs. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeletingTag(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

