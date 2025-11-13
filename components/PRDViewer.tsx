'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PRDFile {
  name: string
  path: string
  lastModified: Date
  content: string
}

interface PRDViewerProps {
  prd: PRDFile
  onBack: () => void
}

export default function PRDViewer({ prd, onBack }: PRDViewerProps) {
  return (
    <div className="w-full">
      <div className="w-full">
        <button
          onClick={onBack}
          className="mb-6 flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
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

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-800 rounded-2xl p-12 shadow-2xl">
        <div className="mb-8 pb-6 border-b-2 border-gradient-to-r from-blue-200 to-indigo-200 dark:border-blue-700">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            {prd.name.replace('.md', '')}
          </h1>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {prd.path}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4 className="text-lg font-semibold mt-3 mb-2 text-gray-900 dark:text-white" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300 space-y-1" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-700 dark:text-gray-300" {...props} />
              ),
              code: ({ node, inline, ...props }: any) => {
                if (inline) {
                  return (
                    <code
                      className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200"
                      {...props}
                    />
                  )
                }
                return (
                  <code
                    className="block bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto mb-4"
                    {...props}
                  />
                )
              },
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 bg-gray-50 dark:bg-gray-700 font-semibold text-left text-gray-900 dark:text-white" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props} />
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
  )
}

