'use client'

import { useState } from 'react'
import PRDRepository from '@/components/PRDRepository'
import PrototypeDirectory from '@/components/PrototypeDirectory'

export default function Home() {
  // Hardcoded paths - API will resolve these relative to project root
  const prdFolder = 'prds'
  const prototypeFolder = 'prototypes'
  const [viewingPRD, setViewingPRD] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            📚 Documentation Hub
          </h1>
          <p className="text-blue-100 text-lg">
            Your PRDs and Prototypes in one place
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-8">
        <div className={viewingPRD ? "w-full" : "grid grid-cols-1 lg:grid-cols-2 gap-6"}>
          {/* PRDs - always rendered */}
          <div className={viewingPRD ? "w-full" : "flex flex-col"}>
            <PRDRepository folderPath={prdFolder} onViewChange={setViewingPRD} />
          </div>
          
          {/* Right side - Prototypes - hidden when viewing PRD */}
          {!viewingPRD && (
            <div className="flex flex-col">
              <PrototypeDirectory folderPath={prototypeFolder} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

