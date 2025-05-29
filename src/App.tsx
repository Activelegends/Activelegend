import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative h-screen flex items-center justify-center bg-black text-white">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center">
          <img src="/logo.svg" alt="Active Legends" className="w-32 h-32 mx-auto mb-8" />
          <h1 className="text-5xl font-bold mb-4">به دنیای اکتیو لجندز خوش آمدید</h1>
          <p className="text-xl mb-8">توسعه‌دهنده بازی‌های موبایل و کامپیوتر</p>
          <div className="space-x-4 space-x-reverse">
            <button className="btn-primary">ثبت‌نام</button>
            <button className="btn-secondary">ورود</button>
          </div>
        </div>
      </header>
    </div>
  )
}

export default App