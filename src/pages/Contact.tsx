import { motion } from 'framer-motion';

const contacts = [
  {
    label: 'ایمیل',
    value: 'studio@activelegend.ir',
    href: 'mailto:studio@activelegend.ir',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0l-4 4-4-4" /></svg>
    ),
    color: 'bg-blue-500',
  },
  {
    label: 'تلگرام',
    value: 'کانال',
    href: 'https://t.me/ActiveLegend_ir',
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.569l-.398 3.934c.57 0 .816-.244 1.113-.54l2.664-2.53 5.522 4.03c1.012.558 1.73.264 1.98-.94l3.594-16.84c.328-1.522-.552-2.12-1.54-1.76L2.36 9.75c-1.48.58-1.46 1.4-.252 1.77l4.32 1.35 10.03-6.32c.47-.3.9-.13.55.17"/></svg>
    ),
    color: 'bg-sky-400',
  },
  {
    label: 'تلگرام',
    value: 'گروه',
    href: 'https://t.me/ActiveLegendGroup',
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.569l-.398 3.934c.57 0 .816-.244 1.113-.54l2.664-2.53 5.522 4.03c1.012.558 1.73.264 1.98-.94l3.594-16.84c.328-1.522-.552-2.12-1.54-1.76L2.36 9.75c-1.48.58-1.46 1.4-.252 1.77l4.32 1.35 10.03-6.32c.47-.3.9-.13.55.17"/></svg>
    ),
    color: 'bg-sky-600',
  },
  {
    label: 'اینستاگرام',
    value: 'activelegend.ir',
    href: 'https://www.instagram.com/activelegend.ir',
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"/></svg>
    ),
    color: 'bg-pink-500',
  },
  {
    label: 'دیسکورد',
    value: 'Discord',
    href: 'https://discord.gg/w7pqAwJfta',
    icon: (
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.074.074 0 0 0-.079.037c-.34.607-.719 1.396-.984 2.01a18.524 18.524 0 0 0-5.614 0a12.51 12.51 0 0 0-.995-2.01a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.684 4.369a.07.07 0 0 0-.032.027C.533 9.09-.32 13.579.099 18.021a.082.082 0 0 0 .031.056a19.9 19.9 0 0 0 5.993 3.03a.077.077 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.104a13.124 13.124 0 0 1-1.885-.9a.077.077 0 0 1-.008-.128c.127-.096.254-.197.373-.299a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.073.073 0 0 1 .078.009c.12.102.246.203.373.299a.077.077 0 0 1-.006.128a12.3 12.3 0 0 1-1.886.9a.076.076 0 0 0-.04.104c.36.699.772 1.364 1.225 1.994a.076.076 0 0 0 .084.027a19.876 19.876 0 0 0 6.002-3.03a.077.077 0 0 0 .03-.055c.5-5.177-.838-9.637-3.285-13.625a.062.062 0 0 0-.03-.028zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419c0-1.333.955-2.418 2.156-2.418c1.21 0 2.175 1.094 2.156 2.418c0 1.334-.955 2.419-2.156 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419c0-1.333.955-2.418 2.156-2.418c1.21 0 2.175 1.094 2.156 2.418c0 1.334-.955 2.419-2.156 2.419z"/></svg>
    ),
    color: 'bg-indigo-500',
  },
];

export default function Contact() {
  return (
    <motion.div
      className="max-w-2xl mx-auto mt-32 mb-16 px-4 py-10 rounded-2xl glass shadow-lg flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      dir="rtl"
    >
      <motion.h1
        className="text-3xl font-extrabold mb-6 text-center text-white drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        تماس با ما
      </motion.h1>
      <motion.p
        className="text-lg text-white/80 mb-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        برای ارتباط با تیم اکتیو لجند از راه‌های زیر استفاده کنید:
      </motion.p>
      <div className="flex flex-wrap justify-center gap-6">
        {contacts.map((c, i) => (
          <motion.a
            key={c.href}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center gap-2 p-5 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 ${c.color} bg-opacity-80`}
            whileHover={{ scale: 1.13, rotate: 2 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
          >
            {c.icon}
            <span className="text-white font-bold">{c.label}</span>
            <span className="text-white/80 text-xs">{c.value}</span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
} 