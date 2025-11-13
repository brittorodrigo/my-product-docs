'use client'

import { useState, KeyboardEvent } from 'react'

interface TagEditorProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  allTags: string[]
}

export default function TagEditor({ tags, onTagsChange, allTags }: TagEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [editingTag, setEditingTag] = useState<{ old: string; new: string } | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag])
      setNewTag('')
      setShowSuggestions(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setNewTag('')
      setShowSuggestions(false)
    }
  }

  const startEditingTag = (tag: string) => {
    setEditingTag({ old: tag, new: tag })
  }

  const saveEditedTag = () => {
    if (editingTag && editingTag.new.trim()) {
      const newTagValue = editingTag.new.trim().toLowerCase()
      if (newTagValue !== editingTag.old && !tags.includes(newTagValue)) {
        const updatedTags = tags.map(tag => 
          tag === editingTag.old ? newTagValue : tag
        )
        onTagsChange(updatedTags)
      }
      setEditingTag(null)
    }
  }

  const cancelEditingTag = () => {
    setEditingTag(null)
  }

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEditedTag()
    } else if (e.key === 'Escape') {
      cancelEditingTag()
    }
  }

  const suggestedTags = allTags.filter(tag => 
    !tags.includes(tag) && 
    tag.toLowerCase().includes(newTag.toLowerCase())
  ).slice(0, 5)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {isEditing ? 'Done' : 'Edit Tags'}
        </button>
      </div>

      {/* Tags Display/Edit */}
      <div className="flex flex-wrap gap-2">
        {tags.length === 0 && !isEditing && (
          <span className="text-sm text-gray-400 dark:text-gray-500 italic">
            No tags yet
          </span>
        )}
        
        {tags.map(tag => (
          <div
            key={tag}
            className="group relative"
          >
            {editingTag?.old === tag ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editingTag.new}
                  onChange={(e) => setEditingTag({ ...editingTag, new: e.target.value })}
                  onKeyDown={handleEditKeyDown}
                  onBlur={saveEditedTag}
                  autoFocus
                  className="px-2 py-1 text-xs border-2 border-blue-500 rounded-full focus:outline-none"
                />
              </div>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isEditing
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 pr-1'
                    : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                }`}
              >
                #{tag}
                {isEditing && (
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => startEditingTag(tag)}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                      title="Edit tag"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition-colors text-red-600 dark:text-red-400"
                      title="Remove tag"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </span>
            )}
          </div>
        ))}

        {/* Add New Tag Input */}
        {isEditing && (
          <div className="relative">
            <input
              type="text"
              value={newTag}
              onChange={(e) => {
                setNewTag(e.target.value)
                setShowSuggestions(e.target.value.length > 0)
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(newTag.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Add tag..."
              className="px-3 py-1 text-xs border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-full focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 w-32"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestedTags.length > 0 && (
              <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg shadow-lg z-10 min-w-[160px]">
                <div className="p-1">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1">
                    Existing tags:
                  </div>
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        onTagsChange([...tags, tag])
                        setNewTag('')
                        setShowSuggestions(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-gray-700 dark:text-gray-300"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {newTag && (
              <button
                onClick={handleAddTag}
                className="ml-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            )}
          </div>
        )}
      </div>

      {/* Helper Text */}
      {isEditing && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">Enter</kbd> to add, 
          <kbd className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">Esc</kbd> to cancel
        </p>
      )}
    </div>
  )
}

