"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ProfileContext = createContext(null)

const DEFAULT_PROFILES = [
  { id: 1, name: "You", color: "bg-red-500", initial: "Y" },
  { id: 2, name: "Mom", color: "bg-blue-500", initial: "M" },
  { id: 3, name: "Dad", color: "bg-green-500", initial: "D" },
  { id: 4, name: "Kids", color: "bg-yellow-500", initial: "K" },
]

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(DEFAULT_PROFILES)
  const [currentProfileId, setCurrentProfileId] = useState(1)
  const [showProfileSelector, setShowProfileSelector] = useState(false)

  // Load profiles from localStorage on mount
  useEffect(() => {
    try {
      const savedProfiles = localStorage.getItem("cinescope_profiles")
      const savedCurrentId = localStorage.getItem("cinescope_current_profile")
      if (savedProfiles) {
        const parsed = JSON.parse(savedProfiles)
        setProfiles(parsed)
      }
      if (savedCurrentId) {
        setCurrentProfileId(Number(savedCurrentId))
      }
    } catch (e) {
      console.error("Failed to load profiles", e)
    }
  }, [])

  // Persist profiles whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cinescope_profiles", JSON.stringify(profiles))
    } catch (e) {
      console.error("Failed to save profiles", e)
    }
  }, [profiles])

  // Persist current profile ID
  useEffect(() => {
    try {
      localStorage.setItem("cinescope_current_profile", String(currentProfileId))
    } catch (e) {
      console.error("Failed to save current profile", e)
    }
  }, [currentProfileId])

  const currentProfile = profiles.find((p) => p.id === currentProfileId) || profiles[0]

  const switchProfile = (profileId) => {
    setCurrentProfileId(profileId)
    setShowProfileSelector(false)
  }

  const addProfile = (name, color) => {
    const newId = Math.max(...profiles.map((p) => p.id), 0) + 1
    const initial = name.charAt(0).toUpperCase()
    const newProfile = { id: newId, name, color, initial }
    setProfiles([...profiles, newProfile])
    return newProfile
  }

  const deleteProfile = (profileId) => {
    if (profiles.length <= 1) return // Keep at least one profile
    const filtered = profiles.filter((p) => p.id !== profileId)
    setProfiles(filtered)
    if (currentProfileId === profileId) {
      setCurrentProfileId(filtered[0].id)
    }
  }

  const updateProfile = (profileId, updates) => {
    setProfiles(
      profiles.map((p) =>
        p.id === profileId ? { ...p, ...updates } : p
      )
    )
  }

  const value = {
    profiles,
    currentProfile,
    currentProfileId,
    showProfileSelector,
    setShowProfileSelector,
    switchProfile,
    addProfile,
    deleteProfile,
    updateProfile,
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider")
  return ctx
}
