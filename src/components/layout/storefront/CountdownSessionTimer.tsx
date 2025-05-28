'use client'

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion'

export default function CountdownSessionTimer() {
  const { data: session } = useSession()
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (session?.expires) {
      const expiryTime = new Date(session.expires).getTime()
      const existing = localStorage.getItem('session_expiry')

      if (!existing) {
        localStorage.setItem('session_expiry', expiryTime.toString());
      }
    }
  }, [session?.expires])

  useEffect(() => {
    const expiryStr = localStorage.getItem('session_expiry')
    if (!expiryStr) return

    const expiry = parseInt(expiryStr, 10)
    const initialTimeLeft = Math.max(0, Math.floor((expiry - Date.now()) / 1000))
    setTimeLeft(initialTimeLeft)

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, Math.floor((expiry - now) / 1000))
      setTimeLeft(diff)

      if (diff <= 0) {
        clearInterval(interval)
        localStorage.removeItem('session_expiry');
        signOut()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const danger = timeLeft <= 60;

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 space-y-4">
      <h2 className="text-xl font-semibold text-center text-zinc-800 dark:text-white">
        ⏳ Session Timeout
      </h2>
      <div className="text-4xl font-mono text-center text-blue-600 dark:text-blue-400">
        {formatTime(timeLeft)}
      </div>
      <AnimatePresence>
        {danger && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 animate-pulse"
          >
            ⚠️ Session about to expire!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
