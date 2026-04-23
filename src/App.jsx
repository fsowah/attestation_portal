import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        {/* Header Section */}
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wider uppercase animate-fade-in">
            Vite + React + Tailwind v4
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Premium Starter Portal
          </h1>
          <p className="text-lg text-neutral-400 max-w-lg mx-auto leading-relaxed">
            A beautiful, performant, and modern starting point for your next big idea. 
            Built with the latest technologies.
          </p>
        </div>

        {/* Action Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col items-center p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl space-y-6 min-w-[320px]">
            <div className="flex space-x-4">
              <div className="p-3 bg-neutral-800 rounded-xl border border-neutral-700 group-hover:border-indigo-500/50 transition-colors">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Interactive Counter</h3>
              <p className="text-sm text-neutral-500">Test React state and HMR</p>
            </div>

            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)]"
            >
              Count is {count}
            </button>
            
            <code className="text-xs text-neutral-600 font-mono">
              edit src/App.jsx to see changes
            </code>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <a href="https://vitejs.dev" className="hover:text-indigo-400 transition-colors">Vite Docs</a>
          <a href="https://react.dev" className="hover:text-indigo-400 transition-colors">React Docs</a>
          <a href="https://tailwindcss.com" className="hover:text-indigo-400 transition-colors">Tailwind CSS</a>
          <a href="https://github.com" className="hover:text-indigo-400 transition-colors">GitHub</a>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}} />
    </div>
  )
}

export default App
