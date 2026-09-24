'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: signInError } = await createClient().auth.signInWithPassword({ email, password })
    if (signInError) setError('Email hoặc mật khẩu không đúng.')
    else window.location.assign('/admin')
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-6 py-16 text-white">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">THUECAM ADMIN</p>
          <h1 className="mt-2 text-2xl font-black">Đăng nhập quản trị</h1>
          <p className="mt-2 text-sm text-slate-400">Chỉ email có trong danh sách admin mới truy cập được.</p>
        </div>
        <label className="block text-sm font-bold">Email<input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label className="block text-sm font-bold">Mật khẩu<input className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        {error && <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 disabled:opacity-60">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
      </form>
    </main>
  )
}
