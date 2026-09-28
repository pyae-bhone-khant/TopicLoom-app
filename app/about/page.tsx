"use client"
import axiosInstance from "@/component/lib/axiosInstance"
import { useEffect, useState } from "react"

interface Profile {
  id: string
  name: string
  email: string
  role: string
  bio?: string
  image?: string
}

export default function About() { 
  const [data, setData] = useState<Profile[]>([]) 
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/api/profile/get-all-profile')
        setData(res.data)
      } catch (error) {
        console.error("Failed to fetch profiles:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])  

  const admins = data.filter(profile => profile.role === 'ADMIN')
  const editors = data.filter(profile => profile.role === 'EDITOR')

  return (
    <div className="min-h-screen"> 
      {/* Hero Section */}
      <div className="bg-slate-900/10 border-b border-slate-800 text-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            About Our Blog
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Meet the passionate team behind our stories
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8"> 
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-slate-400">
            Loading profiles...
          </div>
        ) : (
          <>
            {/* Admin Section */}
            {admins.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
                  <span className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Administrators</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {admins.map((profile) => (
                    <div 
                      key={profile.id} 
                      className="bg-slate-900 rounded-xl border border-slate-800 p-6 flex items-center gap-6 hover:border-slate-700 transition-colors border-l-4 border-l-indigo-600"
                    >
                      {/* Avatar */}
                      <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center shrink-0">
                        {profile.image ? (
                          <img 
                            src={profile.image} 
                            alt={profile.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-indigo-400">
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="grow">
                        <h3 className="text-xl font-bold text-slate-100">{profile.name}</h3>
                        <span className="inline-block mt-1 px-3 py-1 bg-indigo-900/50 text-indigo-400 text-xs font-semibold rounded-full">
                          ADMIN
                        </span>
                        <p className="text-sm text-slate-400 mt-3">
                          {profile.bio || "Leading the blog with passion and dedication."}
                        </p>
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium mt-2 inline-block"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Editor Section */}
            {editors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
                  <span className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Editors</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {editors.map((profile) => (
                    <div 
                      key={profile.id} 
                      className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-colors border-t-4 border-t-emerald-500"
                    >
                      {/* Avatar */}
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        {profile.image ? (
                          <img 
                            src={profile.image} 
                            alt={profile.name} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-emerald-400">
                            {profile.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-slate-100">{profile.name}</h3>
                        <span className="inline-block mt-1 px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs font-semibold rounded-full">
                          EDITOR
                        </span>
                        <p className="text-sm text-slate-400 mt-3">
                          {profile.bio || "Creating engaging content for our readers."}
                        </p>
                        <a 
                          href={`mailto:${profile.email}`} 
                          className="text-sm text-emerald-400 hover:text-emerald-300 font-medium mt-2 inline-block"
                        >
                          {profile.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}