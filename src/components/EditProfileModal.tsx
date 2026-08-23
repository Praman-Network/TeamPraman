'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { updateMemberProfile } from '@/app/members/actions'

export function EditProfileModal({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Smooth animation logic and mount check
  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      setTimeout(() => setShowModal(true), 10)
    } else {
      setShowModal(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setShowModal(false)
    setTimeout(() => setIsOpen(false), 300)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await updateMemberProfile(user.id, formData)
      handleClose()
    } catch (err) {
      alert('Error updating profile')
    }
    setLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 mt-4 md:mt-0 text-sm font-semibold rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all duration-300"
      >
        Edit Profile
      </button>

      {mounted && isOpen && createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-all duration-300 ${showModal ? 'bg-background/80 backdrop-blur-md opacity-100' : 'bg-transparent backdrop-blur-none opacity-0'}`}>
          <div 
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 rounded-3xl border border-border shadow-[0_0_50px_rgba(0,229,255,0.1)] relative transition-all duration-300 transform ${showModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}
          >
        <div className="sticky top-0 bg-card/90 backdrop-blur-xl border-b border-border/50 px-8 py-6 z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              Edit Member Profile
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Update details for {user.name}</p>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-input/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-input transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Full Name *</label>
              <input 
                name="name" 
                defaultValue={user.name} 
                required 
                placeholder="e.g. Rahul Chaudhary"
                className="w-full px-4 py-3 rounded-xl bg-input/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Department</label>
              <input 
                name="department" 
                defaultValue={user.department || ''} 
                placeholder="e.g. Engineering, Design"
                className="w-full px-4 py-3 rounded-xl bg-input/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Avatar Image URL</label>
            <input 
              name="avatarUrl" 
              type="url"
              placeholder="https://example.com/image.jpg"
              defaultValue={user.avatarUrl || ''} 
              className="w-full px-4 py-3 rounded-xl bg-input/40 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
            />
            <p className="text-xs text-primary/80 font-medium">Leave blank to auto-fetch from GitHub if a GitHub URL is provided below.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#0077b5] tracking-wide uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn URL
              </label>
              <input 
                name="linkedinUrl" 
                type="url"
                placeholder="https://linkedin.com/in/username"
                defaultValue={user.linkedinUrl || ''} 
                className="w-full px-4 py-3 rounded-xl bg-[#0077b5]/5 border border-[#0077b5]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#0077b5]/50 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground tracking-wide uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                GitHub URL
              </label>
              <input 
                name="githubUrl" 
                type="url"
                placeholder="https://github.com/username"
                defaultValue={user.githubUrl || ''} 
                className="w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/50 transition-all"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#5865F2] tracking-wide uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Discord Handle
              </label>
              <input 
                name="discordHandle" 
                type="text"
                placeholder="e.g. username#1234"
                defaultValue={user.discordHandle || ''} 
                className="w-full px-4 py-3 rounded-xl bg-[#5865F2]/5 border border-[#5865F2]/20 text-foreground focus:outline-none focus:ring-2 focus:ring-[#5865F2]/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-border/50">
            <button 
              type="button" 
              onClick={handleClose}
              className="px-6 py-3 rounded-xl text-muted-foreground font-semibold hover:bg-input hover:text-foreground transition-all duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-blue-500 text-white font-bold tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none transition-all duration-300"
            >
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )}
  </>
  )
}
