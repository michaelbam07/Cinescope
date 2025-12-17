"use client"

import { useProfile } from "@/app/context/ProfileContext"
import { Plus, X, Trash2, User } from "lucide-react"
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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[100] p-6">
      <div className="max-w-4xl w-full">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-white mb-16 text-center tracking-tighter italic"
        >
          WHO'S WATCHING?
        </motion.h1>

        <div className="flex flex-wrap justify-center gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {profiles.map((profile) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                key={profile.id}
                className="relative group text-center"
              >
                <div 
                  onClick={() => switchProfile(profile.id)}
                  className="relative cursor-pointer"
                >
                  <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${profile.color} flex items-center justify-center text-white text-5xl font-black shadow-2xl transition-all duration-300 group-hover:ring-4 group-hover:ring-primary group-hover:scale-105 active:scale-95 overflow-hidden relative`}>
                    {profile.initial}
                    {/* Glossy overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-30" />
                  </div>
                  
                  {currentProfileId === profile.id && (
                    <motion.div 
                      layoutId="active-profile"
                      className="absolute -inset-2 border-2 border-primary rounded-[22px]"
                    />
                  )}
                </div>

                <p className="mt-4 text-white/70 font-bold group-hover:text-white transition-colors uppercase tracking-widest text-xs">
                  {profile.name}
                </p>

                {profiles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteProfile(profile.id)
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </motion.div>
            ))}

            {profiles.length < 5 && !isAdding && (
              <motion.div layout className="text-center group">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-32 h-32 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-white/30 transition-all hover:border-white/40 hover:text-white hover:bg-white/10"
                >
                  <Plus size={48} strokeWidth={1} />
                </button>
                <p className="mt-4 text-white/30 font-bold uppercase tracking-widest text-xs">Add</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Profile Inline Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onSubmit={handleAddProfile}
              className="glass-card max-w-sm mx-auto p-6 rounded-2xl border border-white/10"
            >
              <h2 className="text-white font-bold mb-4 uppercase tracking-tighter">New Profile</h2>
              <input
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary transition-all mb-4"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-xl font-bold">Create</button>
                <button onClick={() => setIsAdding(false)} className="px-4 bg-white/5 text-white py-2 rounded-xl font-bold">Cancel</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {!isAdding && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowProfileSelector(false)}
              className="text-white/40 hover:text-white uppercase tracking-[0.3em] text-[10px] font-bold transition-colors"
            >
              [ Manage Profiles ]
            </button>
          </div>
        )}
      </div>
    </div>
  )
}