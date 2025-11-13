'use client'

import { useState } from 'react'

interface FolderConfigProps {
  label: string
  folderPath: string
  onFolderChange: (folder: string) => void
}

export default function FolderConfig({ label, folderPath, onFolderChange }: FolderConfigProps) {
  const [inputValue, setInputValue] = useState(folderPath)
  const [isEditing, setIsEditing] = useState(!folderPath)

  const handleSave = () => {
    onFolderChange(inputValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setInputValue(folderPath)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()} path...`}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        {folderPath && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}:</span>
        <span className="ml-2 text-gray-900 dark:text-white font-mono text-sm">
          {folderPath || 'Not configured'}
        </span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Change
      </button>
    </div>
  )
}

