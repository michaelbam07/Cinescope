"use client"

import { useProfile } from "@/app/context/ProfileContext"
import { Plus, X, Trash2, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

const COLORS = [
  "from-red-500 to-orange-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-amber-400 to-orange-500",
]

export default function ProfileSelector() {
  const {
    profiles,
    currentProfileId,
    switchProfile,
    addProfile,
    deleteProfile,
    setShowProfileSelector,
  } = useProfile()

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState("")

  const handleAddProfile = (e) => {
    e.preventDefault()
    if (newName.trim()) {
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)]
      addProfile(newName.trim(), randomColor)
      setNewName("")
      setIsAdding(false)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Close Button */}
      <button 
        onClick={() => setShowProfileSelector(false)}
        className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors"
      >
        <X size={40} strokeWidth={1} />
      </button>

      <div className="max-w-5xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            Who is <span className="text-primary">Watching?</span>
          </h1>
          <p className="text-white/20 font-bold tracking-[0.4em] uppercase text-[10px] mt-4">
            Select a profile to customize your experience
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-10 md:gap-14 mb-16">
          <AnimatePresence mode="popLayout">
            {profiles.map((profile) => {
              const isActive = currentProfileId === profile.id;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  key={profile.id}
                  className="relative group flex flex-col items-center"
                >
                  <button 
                    onClick={() => switchProfile(profile.id)}
                    className="relative"
                  >
                    <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-6xl font-black shadow-2xl transition-all duration-500 group-hover:scale-105 active:scale-95 overflow-hidden relative border-4 ${isActive ? 'border-primary' : 'border-transparent'}`}>
                      {profile.initial}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30" />
                      
                      {isActive && (
                        <div className="absolute top-2 right-2 bg-white text-primary rounded-full p-1 shadow-lg">
                          <Check size={16} strokeWidth={4} />
                        </div>
                      )}
                    </div>
                  </button>

                  <p className={`mt-6 font-black uppercase tracking-[0.2em] text-[11px] transition-all duration-300 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white'}`}>
                    {profile.name}
                  </p>

                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProfile(profile.id)
                      }}
                      className="absolute -top-3 -right-3 p-2 bg-black border border-white/10 text-white/40 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 hover:border-red-500/50 shadow-2xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              )
            })}

            {profiles.length < 5 && !isAdding && (
              <motion.div layout className="flex flex-col items-center group">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/10 transition-all hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                >
                  <Plus size={50} strokeWidth={1} />
                </button>
                <p className="mt-6 text-white/10 font-black uppercase tracking-[0.2em] text-[11px] group-hover:text-white transition-colors">Add Profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Form & Management Toggle */}
        <div className="h-24"> {/* Height fix to prevent jump */}
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.form 
                key="add-form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onSubmit={handleAddProfile}
                className="max-w-sm mx-auto flex items-center gap-3"
              >
                <input
                  autoFocus
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-primary transition-all font-bold"
                  placeholder="Profile Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button type="submit" className="bg-primary text-white p-4 rounded-2xl font-black">
                  <Check size={24} />
                </button>
                <button 
                  type="button"
                  onClick={() => setIsAdding(false)} 
                  className="bg-white/5 text-white p-4 rounded-2xl"
                >
                  <X size={24} />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="manage-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <button
                  className="px-10 py-4 border border-white/10 text-white/40 hover:text-white hover:border-white uppercase tracking-[0.4em] text-[10px] font-black transition-all rounded-full hover:bg-white/5"
                >
                  Manage Profiles
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}