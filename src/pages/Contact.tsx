import React from 'react';

const contacts = [
  {
    label: 'ایمیل',
    value: 'studio@activelegend.ir',
    href: 'mailto:studio@activelegend.ir',
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12l-4-4-4 4m8 0l-4 4-4-4" /></svg>
    ),
  },
  {
    label: 'کانال تلگرام',
    value: 'ActiveLegend_ir',
    href: 'https://t.me/ActiveLegend_ir',
    icon: (
      <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.569l-.398 3.934c.57 0 .816-.244 1.113-.54l2.664-2.53 5.522 4.03c1.012.558 1.73.264 1.98-.94l3.594-16.84c.328-1.522-.552-2.12-1.54-1.76L2.36 9.75c-1.48.58-1.46 1.4-.252 1.77l4.32 1.35 10.03-6.32c.47-.3.9-.13.55.17"/></svg>
    ),
  },
  {
    label: 'گروه تلگرام',
    value: 'ActiveLegendGroup',
    href: 'https://t.me/ActiveLegendGroup',
    icon: (
      <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9.036 16.569l-.398 3.934c.57 0 .816-.244 1.113-.54l2.664-2.53 5.522 4.03c1.012.558 1.73.264 1.98-.94l3.594-16.84c.328-1.522-.552-2.12-1.54-1.76L2.36 9.75c-1.48.58-1.46 1.4-.252 1.77l4.32 1.35 10.03-6.32c.47-.3.9-.13.55.17"/></svg>
    ),
  },
  {
    label: 'اینستاگرام',
    value: 'activelegend.ir',
    href: 'https://www.instagram.com/activelegend.ir',
    icon: (
      <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5a5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5zm5.25.75a1 1 0 1 1 0 2a1 1 0 0 1 0-2z"/></svg>
    ),
  },
  {
    label: 'دیسکورد',
    value: 'ActiveLegend Discord',
    href: 'https://discord.gg/w7pqAwJfta',
    icon: (
      <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.2a.074.074 0 0 0-.079.037c-.34.607-.719 1.396-.984 2.01a18.524 18.524 0 0 0-5.614 0a12.51 12.51 0 0 0-.995-2.01a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.684 4.369a.07.07 0 0 0-.032.027C.533 9.09-.32 13.579.099 18.021a.082.082 0 0 0 .031.056a19.9 19.9 0 0 0 5.993 3.03a.077.077 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.104a13.124 13.124 0 0 1-1.885-.9a.077.077 0 0 1-.008-.128c.127-.096.254-.197.373-.299a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.062 0a.073.073 0 0 1 .078.009c.12.102.246.203.373.299a.077.077 0 0 1-.006.128a12.3 12.3 0 0 1-1.886.9a.076.076 0 0 0-.04.104c.36.699.772 1.364 1.225 1.994a.076.076 0 0 0 .084.027a19.876 19.876 0 0 0 6.002-3.03a.077.077 0 0 0 .03-.055c.5-5.177-.838-9.637-3.285-13.625a.062.062 0 0 0-.03-.028zM8.02 15.331c-1.183 0-2.156-1.085-2.156-2.419c0-1.333.955-2.418 2.156-2.418c1.21 0 2.175 1.094 2.156 2.418c0 1.334-.955 2.419-2.156 2.419zm7.974 0c-1.183 0-2.156-1.085-2.156-2.419c0-1.333.955-2.418 2.156-2.418c1.21 0 2.175 1.094 2.156 2.418c0 1.334-.955 2.419-2.156 2.419z"/></svg>
    ),
  },
];

export default function Contact() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-neutral-900 rounded-lg shadow mt-10 mb-10" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">تماس با ما</h1>
      <ul className="space-y-4">
        {contacts.map((c) => (
          <li key={c.label} className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 rounded p-3 hover:shadow transition">
            <span>{c.icon}</span>
            <span className="font-semibold w-28">{c.label}:</span>
            <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline break-all">{c.value}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 