"use client"

import { useProfile } from "@/app/context/ProfileContext"
import ProfileSelector from "./ProfileSelector"

export default function ProfileSelectorWrapper() {
  const { showProfileSelector } = useProfile()

  if (!showProfileSelector) {
    return null
  }

  return <ProfileSelector />
}
