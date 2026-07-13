"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

const auroraShapes = [
  "bg-gradient-to-br from-[#5749E2] via-[#7B80FF] to-[#38FFD5]",
  "bg-gradient-to-tr from-[#DB28B6] via-[#5B51F3] to-[#6FFFE9]",
  "bg-gradient-to-b from-[#FA8C33] via-[#745CFF] to-[#55EFCB]",
];

const features = [
  {
    name: "Habit Tracker",
    desc: "Build life-changing habits with daily tracker.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#5548ea2d]" />
        <path d="M13 19l3 3l7-7" stroke="#7c72f2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Study Tracker",
    desc: "Monitor your study sessions & focus streaks.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#43d8b632]" />
        <path d="M9 25v-12l9-4l9 4v12" stroke="#43d8b6" strokeWidth="2.3" strokeLinejoin="round" />
        <path d="M18 21v4" stroke="#43d8b6" strokeWidth="2.3" />
      </svg>
    ),
  },
  {
    name: "Workout Tracker",
    desc: "Track workouts & exercise routines easily.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#ff8e5b28]" />
        <path d="M11 25l14-14M25 25l-14-14" stroke="#ff8e5b" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Water Tracker",
    desc: "Stay hydrated with smart water tracking.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#4bbad828]" />
        <path d="M18 8l7 12a7 7 0 0 1-14 0l7-12z" stroke="#4bbad8" strokeWidth="2.1" />
        <circle cx="18" cy="23" r="1.2" fill="#4bbad8" />
      </svg>
    ),
  },
  {
    name: "Sleep Tracker",
    desc: "Analyze sleep quality and optimize rest.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#82cfff27]" />
        <path d="M18 28a10 10 0 1 1 6.5-17" stroke="#82cfff" strokeWidth="2.1" />
        <circle cx="23" cy="13" r="1.2" fill="#82cfff" />
      </svg>
    ),
  },
  {
    name: "Yoga Tracker",
    desc: "Track yoga practice and flexibility growth.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#b469ff22]" />
        <path d="M18 12v12M13 22l5-10l5 10" stroke="#b469ff" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Calendar",
    desc: "Visualize habits, routines and events on calendar.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#FFE26626]" />
        <rect x="10" y="15" width="16" height="11" rx="3" stroke="#ffe066" strokeWidth="2" />
        <rect x="15" y="11" width="6" height="4" rx="2" stroke="#ffe066" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "Analytics",
    desc: "Insightful analytics to optimize your day.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#51eaea22]" />
        <rect x="10.5" y="22" width="3" height="4" rx="1" fill="#51eaea" />
        <rect x="16.5" y="17" width="3" height="9" rx="1" fill="#51eaea" />
        <rect x="22.5" y="12" width="3" height="14" rx="1" fill="#51eaea" />
      </svg>
    ),
  },
  {
    name: "Cloud Sync",
    desc: "Seamless real-time sync on all devices.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#1ae8d6,0.12]" />
        <path d="M24 22a4 4 0 1 0-7.87-1.11A3.5 3.5 0 1 0 16 25h8a3 3 0 0 0 0-6" stroke="#1ae8d6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Support Chat",
    desc: "Instant support with real team members.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#8986fd25]" />
        <path d="M12 16v-2a6 6 0 0 1 12 0v2" stroke="#8986fd" strokeWidth="2.1" />
        <rect x="10" y="16" width="16" height="10" rx="2" stroke="#8986fd" strokeWidth="2" />
        <circle cx="14" cy="21" r="1" fill="#8986fd" />
        <circle cx="18" cy="21" r="1" fill="#8986fd" />
        <circle cx="22" cy="21" r="1" fill="#8986fd" />
      </svg>
    ),
  },
  {
    name: "Admin Dashboard",
    desc: "Powerful controls, announcements & insights.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#ff75981c]" />
        <path d="M14 26v-8a4 4 0 0 1 8 0v8" stroke="#ff7598" strokeWidth="2.1" />
        <rect x="12" y="18" width="12" height="8" rx="2" stroke="#ff7598" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: "PWA Support",
    desc: "Install as an app, seamless offline experience.",
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect width="36" height="36" rx="12" className="fill-[#ffd64430]" />
        <path d="M18 22l4-6H14l4 6z" stroke="#ffd644" strokeWidth="2.1" strokeLinejoin="round" />
        <rect x="8" y="9" width="20" height="18" rx="6" stroke="#ffd644" strokeWidth="2" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    name: "Sakshi Jain",
    review:
      "Ritik Tracker keeps all my daily goals and habits in one place. Love the dashboard and analytics. Beautiful design, flawless sync across devices.",
    emoji: "🌟",
  },
  {
    name: "Aman Patel",
    review:
      "The streak system and daily records keep me motivated. Water tracking & analytics are super useful. The best productivity tool I’ve used.",
    emoji: "💪",
  },
  {
    name: "Priya Gupta",
    review:
      "Simple, reliable, and elegant. The cloud sync and PWA support are game changers. Really premium experience on all my devices.",
    emoji: "🔥",
  },
  {
    name: "Yash Verma",
    review:
      "Support is quick and friendly. I love seeing my progress charts and daily improvements. Highly recommended for anyone serious about habits.",
    emoji: "🚀",
  },
];

const faqs = [
  {
    q: "Is Ritik Tracker secure?",
    a: "Absolutely. Ritik Tracker uses Firebase Authentication, secure cloud, and encrypted storage for every account.",
  },
  {
    q: "Can I access my data offline?",
    a: "Yes, Ritik Tracker supports offline mode and automatic syncing when you’re back online.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes, basic features are completely free. Upgrade anytime for premium analytics and admin tools.",
  },
  {
    q: "Does it work on mobile?",
    a: "Ritik Tracker is fully optimized for mobile, tablet, and desktop—plus installable as a PWA app.",
  },
  {
    q: "How do I contact support?",
    a: "Use the live support chat anytime, or reach out by email or phone for personal assistance.",
  },
];

const statCards = [
  {
    value: "1000+",
    label: "Daily Entries",
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#7B80FF" strokeWidth="2.5" />
        <path d="M12 16l3 3l5-6" stroke="#7B80FF" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: "from-[#6657e9] to-[#7B80FF]",
  },
  {
    value: "99.9%",
    label: "Uptime",
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#4bbad8" strokeWidth="2.5" />
        <path d="M16 8v8l6 4" stroke="#4bbad8" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
    accent: "from-[#10CDEF] to-[#55EFCB]",
  },
  {
    value: "24/7",
    label: "Cloud Sync",
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#38FFD5" strokeWidth="2.5" />
        <path d="M12 22a4 4 0 1 1 8 0H12z" stroke="#38FFD5" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
    accent: "from-[#51eaea] to-[#38FFD5]",
  },
  {
    value: "Fast",
    label: "Performance",
    icon: (
      <svg width="32" height="32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="#ff8e5b" strokeWidth="2.5" />
        <path d="M16 8v10l7 4" stroke="#ff8e5b" strokeWidth="2.1" strokeLinecap="round" />
      </svg>
    ),
    accent: "from-[#ff8e5b] to-[#fa8c33]",
  },
];

const revealVariants: Variants = {
  initial: { opacity: 0, y: 48 },
  animate: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.7,
      type: "spring",
    },
  }),
};

export default function Page() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Aurora BG floating shapes/blur gradients
  function AuroraBG() {
    return (
      <>
        <div className="fixed inset-0 z-[-10] pointer-events-none">
          {/* Aurora gradient shapes */}
          <motion.div
            initial={{ filter: "blur(120px)", opacity: 0.8, scale: 1 }}
            animate={{ filter: "blur(120px)", opacity: 1, scale: 1.1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="absolute -top-32 -left-16 w-[38vw] h-[40vh] bg-gradient-to-br from-[#6e73ff] via-[#ad62ff93] to-[#3affd6] rounded-full blur-[108px] z-[-5] select-none"
          />
          <motion.div
            initial={{ filter: "blur(105px)", opacity: 0.47, scale: 0.96 }}
            animate={{ filter: "blur(140px)", opacity: 0.42, scale: 1.08 }}
            transition={{ duration: 2.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-[42vw] h-[34vh] bg-gradient-to-tr from-[#fa8c33b2] via-[#52ffe9d7] to-[#7c88ff7c] rounded-full blur-[112px] z-[-5] select-none"
          />
        </div>
      </>
    );
  }

  function AuroraShapesFloating() {
    return (
      <>
        <motion.div
          initial={{ y: 0, x: 0, rotate: 0, scale: 1 }}
          animate={{ y: [0, -16, 0], x: [0, 20, 0], rotate: [0, 6, -3, 0], scale: [1, 1.09, 1] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="hidden md:block absolute top-7 left-16 w-64 h-44 bg-gradient-to-br from-[#6e73ff93] to-[#3affd688] rounded-[36%] blur-3xl opacity-70 pointer-events-none"
        ></motion.div>
        <motion.div
          initial={{ y: 0, scale: 1, rotate: 0 }}
          animate={{ y: [0, 30, 0], scale: [1, 1.08, 1], rotate: [0, 12, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="hidden md:block absolute bottom-36 right-40 w-48 h-44 bg-gradient-to-tl from-[#b16aff67] to-[#37ffd673] rounded-[44%] blur-2xl opacity-60 pointer-events-none"
        />
      </>
    );
  }

  // Premium Navbar
  function Navbar() {
    return (
      <nav className="sticky top-0 left-0 z-40 w-full flex items-center backdrop-blur-2xl bg-[#181B24E0]/60 shadow-xl border-b border-[#312e48]/40 px-4 sm:px-9 py-2 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center font-black text-xl md:text-2xl bg-gradient-to-r from-[#6e73ff] via-[#b16aff] to-[#34ffe9] bg-clip-text text-transparent tracking-tight select-none">
            <svg width={32} height={32} className="mr-2" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="9" fill="#6e73ff" />
              <path d="M14 22v-8l8 8v-8" stroke="#FFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ritik Tracker
          </div>
        </div>
        <ul className="hidden md:flex items-center gap-2 text-sm font-semibold tracking-normal">
          <li>
            <a href="#" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#7B80FF]">Home</a>
          </li>
          <li>
            <a href="#features" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#55EFCB]">Features</a>
          </li>
          <li>
            <a href="#dashboard" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#FFF27E]">Dashboard</a>
          </li>
          <li>
            <a href="#analytics" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#FA8C33]">Analytics</a>
          </li>
          <li>
            <a href="#faq" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#b16aff]">FAQ</a>
          </li>
          <li>
            <a href="#contact" className="px-4 py-2 rounded-xl transition hover:bg-[#25263b]/50 hover:text-[#38FFD5]">Contact</a>
          </li>
        </ul>
        <div className="flex items-center">
  <a
    href="https://ritik-tracker-app.vercel.app/"
    className="rounded-xl px-6 py-2.5 bg-gradient-to-r from-[#6e73ff] via-[#7B80FF] to-[#38FFD5] text-white text-sm font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
  >
    🚀 Get Started
  </a>
</div>
      </nav>
    );
  }

  // Hero Section
  function HeroSection() {
    return (
      <section className="relative flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-12 min-h-[80vh] pt-8 md:pt-10 pb-12" id="hero">
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <motion.h1
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-[#6e73ff] via-[#b16aff] to-[#38FFD5] bg-clip-text text-transparent"
          >
            Track Every Day.<br />
            <span className="opacity-90">Improve Every Day.</span>
          </motion.h1>
          <motion.p
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={revealVariants}
            custom={1}
            className="text-lg md:text-xl text-[#dfdfefb5] max-w-xl tracking-normal font-medium"
          >
            Ritik Tracker is your modern productivity OS for daily habits, study, fitness, sleep, water, and more &mdash; in a blazing fast, cloud-synced dashboard. Start tracking, analyzing, and improving every single day.
          </motion.p>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={revealVariants}
            custom={2}
            className="flex gap-3 mt-2"
          >
            <a
  href="https://ritik-tracker-app.vercel.app/"
  className="..."
>
  🚀 Get Started
</a>
            
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full md:w-1/2 flex items-center justify-center h-[400px] md:h-[460px]"
        >
          <HeroDashboardPreview />
        </motion.div>
      </section>
    );
  }

  // Hero Dashboard Preview (beautiful glass card dashboard mockup)
  function HeroDashboardPreview() {
    return (
      <motion.div
        initial={{ opacity: 0.75, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative w-full max-w-xl h-full flex flex-col rounded-2xl border border-[#383a4c]/30 shadow-[0_6px_64px_0_#7b80ff1a] bg-[#191b23fc] backdrop-blur-md glass overflow-hidden select-none"
      >
        <div className="flex items-center gap-2 px-7 pt-7 pb-2 bg-gradient-to-br from-[#242634] to-transparent">
          <span className="w-3 h-3 rounded-full bg-[#7b80ff]"></span>
          <span className="w-3 h-3 rounded-full bg-[#43f7d9]"></span>
          <span className="w-3 h-3 rounded-full bg-[#fa8c33]"></span>
        </div>
        <div className="p-5 pb-0 flex flex-col gap-4">
          <div className="flex gap-3 items-center">
            <span className="bg-[#38FFD6]/10 border border-[#38FFD6]/30 text-xs rounded-full px-3 py-1 text-[#38FFD6] font-semibold">Streak: 34 Days</span>
            <span className="bg-[#b16aff]/10 border border-[#ad62ff]/30 text-xs rounded-full px-3 py-1 text-[#b16aff] font-semibold">Water: 2200ml</span>
            <span className="bg-[#FF8C33]/10 border border-[#FF8C33]/30 text-xs rounded-full px-3 py-1 text-[#FF8C33] font-semibold">Sleep: 7.2h</span>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-[#6e73ff]/20 rounded-2xl p-2 mb-2 border border-[#6e73ff]/30">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="12" fill="#6e73ff22" />
                  <path d="M13 19l3 3l7-7" stroke="#7c72f2" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <span className="text-xs text-[#b6c8f7] font-semibold">Habits</span>
              <span className="text-base font-bold text-[#7B80FF]">6/7</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#38ffd5]/20 rounded-2xl p-2 mb-2 border border-[#38FFD5]/30">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="12" fill="#38ffd516"></rect>
                  <path d="M18 8l7 12a7 7 0 0 1-14 0l7-12z" stroke="#38ffd5" strokeWidth="2.1"></path>
                  <circle cx="18" cy="23" r="1.2" fill="#38ffd5"></circle>
                </svg>
              </div>
              <span className="text-xs text-[#74f7e7] font-semibold">Water</span>
              <span className="text-base font-bold text-[#38FFD5]">2.2L</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-[#fa8c33]/20 rounded-2xl p-2 mb-2 border border-[#fa8c33]/30">
                <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                  <rect width="36" height="36" rx="12" fill="#fa8c3312"></rect>
                  <path d="M18 12v12M13 22l5-10l5 10" stroke="#fa8c33" strokeWidth="2.1"></path>
                </svg>
              </div>
              <span className="text-xs text-[#ffc995] font-semibold">Sleep</span>
              <span className="text-base font-bold text-[#FA8C33]">7.2h</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-[60px] bg-gradient-to-r from-[#6e73ff99] via-[#b16aff55] to-[#38FFD566] rounded-xl flex items-center px-4 gap-4 glass border border-[#38FFD5]/15 shadow-inner shadow-[#7B80FF]/5">
              <span className="text-[#cccfee] font-bold">Today&apos;s Goals:</span>
              <span className="px-2 py-1 bg-[#38FFD5]/10 border border-[#38FFD5]/30 rounded-lg text-[#38FFD5] text-xs font-semibold">Read 10 pages</span>
              <span className="px-2 py-1 bg-[#b16aff]/10 border border-[#ad62ff]/30 rounded-lg text-[#b16aff] text-xs font-semibold">30 min Yoga</span>
              <span className="px-2 py-1 bg-[#FA8C33]/10 border border-[#fa8c33]/30 rounded-lg text-[#FA8C33] text-xs font-semibold">Drink 2L Water</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full py-3 px-6 flex items-center gap-2 bg-gradient-to-t from-[#191b23de] to-transparent">
          <span className="text-[#7B80FF] font-semibold text-xs">Sync Status: </span>
          <span className="flex items-center gap-1 text-[#38FFD5] text-xs font-semibold">
            <svg width="16" height="16" fill="none"><circle cx="8" cy="8" r="6" stroke="#38FFD6" strokeWidth="1.8" /></svg>
            Cloud Synced
          </span>
          <span className="ml-auto text-[#b16aff] text-xs font-semibold">Streak: <span className="font-bold text-[#f5eaff]">34</span></span>
        </div>
      </motion.div>
    );
  }

  // Trusted By Section
  function TrustedBySection() {
    return (
      <section className="max-w-6xl mx-auto my-12" id="stats">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                className={`group flex-1 min-w-[180px] transition glass rounded-2xl px-6 py-6 border border-[#6e73ff1c] shadow-lg bg-gradient-to-br ${card.accent} bg-opacity-20 backdrop-blur-md hover:-translate-y-1.5 hover:shadow-2xl hover:scale-105`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, type: "spring" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="scale-110">{card.icon}</span>
                  <span className="ml-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-tr from-white/90 to-[#7B80FF]">{card.value}</span>
                </div>
                <span className="text-[#c8d0fa] font-semibold text-md">{card.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    );
  }

  // Features Section
  function FeaturesSection() {
    return (
      <section className="max-w-6xl mx-auto py-20" id="features">
        <div className="mb-6 text-center">
          <motion.h2
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={revealVariants}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-tr from-[#b16aff] via-[#6e73ff] to-[#38FFD5] bg-clip-text text-transparent mb-2"
          >
            All-in-one Productivity Platform
          </motion.h2>
          <motion.p
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={1}
            variants={revealVariants}
            className="text-lg text-[#c3cbf7af] max-w-2xl mx-auto font-medium"
          >
            Everything you need to track, improve, and analyze your daily life. Designed for speed, clarity, and growth.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7 mt-12">
          {features.map((f, i) => (
            <motion.div
              key={f.name}
              className="group rounded-2xl bg-[#191b23eb] border border-[#37398e2c] p-5 shadow-lg glass backdrop-blur-md transition-all hover:scale-105 hover:z-10 focus-within:scale-105 hover:shadow-2xl focus-within:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45, type: "spring" }}
              tabIndex={0}
            >
              <div className="mb-3 scale-110 drop-shadow-lg group-hover:scale-125 transition-transform">{f.icon}</div>
              <h3 className="font-bold text-lg mb-1 text-[#fff]">{f.name}</h3>
              <p className="text-[#b7c3fa] text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Dashboard Showcase Section
  function DashboardShowcase() {
    return (
      <section className="max-w-6xl mx-auto py-16" id="dashboard">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent mb-6"
        >
          Real Dashboard Experience
        </motion.h2>
        <motion.div
          initial={{ opacity: 0.7, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-3xl rounded-3xl overflow-hidden border-[1.5px] border-[#7B80FF] bg-gradient-to-br from-[#1c1e2bce] to-[#202032d8] shadow-[0_8px_80px_0_#7b80ff18] glass backdrop-blur-[7px]">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#35376e]/30">
              <span className="font-bold text-lg bg-gradient-to-r from-[#7B80FF] to-[#38FFD5] bg-clip-text text-transparent tracking-tight">Dashboard</span>
              <span className="rounded-full px-3 py-1 text-xs text-[#38FFD5] border border-[#38FFD5]/40 bg-[#38ffd523]/15 font-semibold">Cloud Sync: ON</span>
            </div>
            {/* Dashboard main grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-[#ffe066] font-semibold text-sm mb-2">Habits Today</div>
                <div className="flex gap-3">
                  <div className="rounded-xl px-4 py-3 bg-[#7B80FF]/10 border border-[#7B80FF]/30 backdrop-blur">
                    <span className="font-bold text-2xl text-[#7B80FF]">✔️ 5</span>
                    <span className="block text-xs text-[#bec0f2]">Completed</span>
                  </div>
                  <div className="rounded-xl px-4 py-3 bg-[#FA8C33]/10 border border-[#FA8C33]/30">
                    <span className="font-bold text-2xl text-[#FA8C33]">2</span>
                    <span className="block text-xs text-[#fac399]">Pending</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[#7B80FF] font-semibold text-sm mb-2">Water Intake</div>
                <div className="relative w-full rounded-lg h-9 bg-[#38FFD5]/10 border border-[#38FFD5]/30 overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#38FFD5]/90 transition-all rounded-l-lg" style={{ width: "70%" }} />
                  <span className="relative z-10 text-[#222445] font-bold pl-4">1.8L / 2.5L</span>
                </div>
                <div className="flex justify-between mt-1 text-xs text-[#bafdf3]">
                  <span className="font-semibold">Goal</span>
                  <span>2.5L</span>
                </div>
              </div>
              <div>
                <div className="text-[#FA8C33] font-semibold text-sm mb-2">Study Time</div>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-extrabold text-[#fa8c33]">2.2h</span>
                  <div className="w-32 h-2 rounded-full bg-[#fa8c33]/15">
                    <div className="h-2 bg-[#fa8c33] rounded-full" style={{ width: "55%" }} />
                  </div>
                </div>
                <div className="mt-1 text-xs text-[#fac399]">Goal: 4h</div>
              </div>
              <div>
                <div className="text-[#b16aff] font-semibold text-sm mb-2">Sleep Duration</div>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-extrabold text-[#b16aff]">7.0h</span>
                  <div className="w-32 h-2 rounded-full bg-[#b16aff]/15">
                    <div className="h-2 bg-[#b16aff] rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>
                <div className="mt-1 text-xs text-[#edc8ff]">Target: 8h</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Analytics Preview Section
  function AnalyticsPreviewSection() {
    return (
      <section className="max-w-6xl mx-auto py-14" id="analytics">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#38FFD5] to-[#FA8C33] bg-clip-text text-transparent mb-7"
        >
          Analytics & Progress
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 justify-items-center">
          {/* Circular progress */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#191b23e6] glass border border-[#38FFD5]/15 rounded-3xl p-8 flex flex-col items-center shadow-lg relative"
          >
            <div className="relative">
              {/* CSS Circular Chart */}
              <svg width="124" height="124">
                <circle
                  cx="62"
                  cy="62"
                  r="51"
                  stroke="#232740"
                  strokeWidth="19"
                  fill="none"
                />
                <circle
                  cx="62"
                  cy="62"
                  r="51"
                  stroke="#7B80FF"
                  strokeWidth="19"
                  fill="none"
                  strokeDasharray={Math.PI * 2 * 51}
                  strokeDashoffset={Math.PI * 2 * 51 * 0.14}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1.8s ease" }}
                />
              </svg>
              <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-extrabold text-[#7B80FF]">
                86%
              </span>
            </div>
            <span className="text-lg font-semibold text-[#7B80FF] mt-2">Weekly Habit Completion</span>
          </motion.div>
          {/* Progress bars/ charts */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-[#191b23e6] glass border border-[#7B80FF]/15 rounded-3xl p-8 shadow-lg w-full max-w-md"
          >
            <div className="mb-6">
              <span className="font-semibold text-[#FA8C33]">Study Progress (hrs)</span>
              <div className="flex gap-2 mt-1 items-end h-20">
                {[1.3, 3.2, 2.9, 3.8, 2.2, 2.6, 4.1].map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-6 rounded-md bg-gradient-to-t from-[#b16aff66] via-[#7B80FF99] to-[#38FFD5CC] hover:scale-110 transition"
                      style={{ height: `${20 + v * 16}px` }}
                    />
                    <span className="text-xs text-[#b6c8f7] mt-1">{['M','T','W','T','F','S','S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-[#38FFD5]">Workout Streak</span>
              <div className="flex gap-1.5 mt-2">
                {[true, true, true, false, true, false, true].map((act, i) => (
                  <span
                    key={i}
                    className={`w-6 h-2 rounded-full ${act ? "bg-gradient-to-r from-[#38ffd5] to-[#7B80FF]" : "bg-[#363a4f]"}`}
                  ></span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold text-[#b16aff]">Monthly Growth</span>
              <div className="w-full bg-[#b16aff22] rounded-full h-2 mt-1 relative">
                <div className="bg-gradient-to-r from-[#b16aff] to-[#7B80FF] h-2 rounded-full" style={{ width: "66%" }}></div>
                <span className="absolute -top-6 right-0 font-extrabold text-[#b16aff]">+66%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Why Ritik Tracker Section
  function WhyRitikTrackerSection() {
    return (
      <section className="max-w-6xl mx-auto py-20">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent mb-9"
        >
          Why Choose Ritik Tracker?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl glass bg-[#1d1e28f7] border border-[#7B80FF]/18 p-6 shadow-xl flex flex-col gap-4 hover:scale-105 transition"
          >
            <div className="bg-gradient-to-tr from-[#38FFD5] to-[#7B80FF] rounded-xl p-3 w-12 h-12 mb-2 flex items-center justify-center shadow-lg">
              <svg width={28} height={28} fill="none"><path d="M5 22l8-8 8 8" stroke="#191b23" strokeWidth="2.1" strokeLinecap="round" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#fff]">Unmatched Simplicity</h3>
            <p className="text-[#c3cbf7af] font-medium">Zero clutter. Everything organized. One seamless dashboard for all routines.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 42 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.06 }}
            className="rounded-2xl glass bg-[#1d1e28f7] border border-[#B16AFF]/18 p-6 shadow-xl flex flex-col gap-4 hover:scale-105 transition"
          >
            <div className="bg-gradient-to-tr from-[#b16aff] to-[#7B80FF] rounded-xl p-3 w-12 h-12 mb-2 flex items-center justify-center shadow-lg">
              <svg width={28} height={28} fill="none"><circle cx="14" cy="14" r="10" stroke="#fff" strokeWidth="2.1" /><path d="M14 9v5l4 2" stroke="#fff" strokeWidth="2.1" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#fff]">Pro-level Analytics</h3>
            <p className="text-[#c3cbf7af] font-medium">Advance charts, stats, streaks and records. See real growth, not just numbers.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 56 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="rounded-2xl glass bg-[#1d1e28f7] border border-[#38FFD5]/18 p-6 shadow-xl flex flex-col gap-4 hover:scale-105 transition"
          >
            <div className="bg-gradient-to-tr from-[#FA8C33] to-[#7B80FF] rounded-xl p-3 w-12 h-12 mb-2 flex items-center justify-center shadow-lg">
              <svg width={28} height={28} fill="none"><path d="M6 18v-6a8 8 0 0 1 16 0v6" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#fff]">Always Synced & Secure</h3>
            <p className="text-[#c3cbf7af] font-medium">Realtime sync, cloud backup, offline support, and full data privacy.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  // How It Works Section
  function HowItWorksSection() {
    return (
      <section className="max-w-5xl mx-auto py-16">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#38FFD5] to-[#FA8C33] bg-clip-text text-transparent mb-9"
        >
          How Ritik Tracker Works
        </motion.h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.01 }}
            className="flex flex-col items-center gap-2 bg-[#181B24ea] glass border border-[#38FFD5]/12 rounded-2xl px-7 py-8 shadow-md hover:scale-105 transition"
          >
            <span className="text-2xl font-bold text-[#7B80FF]">1</span>
            <span className="text-lg font-semibold text-white">Create Account</span>
            <span className="text-[#b7c3fa] text-sm">Sign up securely with email or Google.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.04 }}
            className="flex flex-col items-center gap-2 bg-[#181B24ea] glass border border-[#7B80FF]/12 rounded-2xl px-7 py-8 shadow-md hover:scale-105 transition"
          >
            <span className="text-2xl font-bold text-[#38FFD5]">2</span>
            <span className="text-lg font-semibold text-white">Track Activities</span>
            <span className="text-[#b7c3fa] text-sm">Log habits, study, workouts, sleep, water, and more.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.07 }}
            className="flex flex-col items-center gap-2 bg-[#181B24ea] glass border border-[#b16aff]/12 rounded-2xl px-7 py-8 shadow-md hover:scale-105 transition"
          >
            <span className="text-2xl font-bold text-[#b16aff]">3</span>
            <span className="text-lg font-semibold text-white">View Analytics</span>
            <span className="text-[#b7c3fa] text-sm">See daily, weekly, and monthly insights and charts.</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center gap-2 bg-[#181B24ea] glass border border-[#fac399]/10 rounded-2xl px-7 py-8 shadow-md hover:scale-105 transition"
          >
            <span className="text-2xl font-bold text-[#FA8C33]">4</span>
            <span className="text-lg font-semibold text-white">Improve Daily</span>
            <span className="text-[#b7c3fa] text-sm">Build improvement with streaks and consistent action.</span>
          </motion.div>
        </div>
      </section>
    );
  }

  // Testimonials Section
  function TestimonialsSection() {
    return (
      <section className="max-w-6xl mx-auto py-16">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent mb-9"
        >
          User Testimonials
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.93, y: 32 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.62, type: "spring" }}
              className="rounded-2xl glass bg-[#181B24e6] border border-[#7B80FF]/18 p-7 shadow-xl flex flex-col gap-2 hover:scale-105 transition"
            >
              <span className="text-3xl mb-1">{t.emoji}</span>
              <span className="text-lg font-semibold text-[#7B80FF]">{t.name}</span>
              <p className="text-[#c3cbf7af] text-base font-medium mt-1 leading-relaxed">{t.review}</p>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // FAQ Accordion Section
  function FAQSection() {
    return (
      <section className="max-w-4xl mx-auto py-16" id="faq">
        <motion.h2
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent mb-7"
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="rounded-2xl bg-[#191b23f2] glass border border-[#7B80FF]/13 shadow-lg p-6">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.53 }}
              className={`border-b border-[#2324524c] last:border-none py-3 cursor-pointer transition`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="flex items-center font-bold text-md md:text-lg text-[#7B80FF] group w-full transition"
                aria-expanded={activeFaq === i}
              >
                <span className="flex-1 text-left">{f.q}</span>
                <motion.span
                  className="ml-3"
                  animate={{ rotate: activeFaq === i ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg width={24} height={24} viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#7B80FF" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg>
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: activeFaq === i ? "auto" : 0, opacity: activeFaq === i ? 1 : 0 }}
                transition={{ duration: 0.32 }}
                className={`overflow-hidden text-[#b6c8f7] font-medium text-md pr-11`}
                style={{ marginTop: activeFaq === i ? 8 : 0 }}
              >
                {activeFaq === i && <div>{f.a}</div>}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Contact Section
  function ContactSection() {
    return (
      <section className="max-w-4xl mx-auto py-20" id="contact">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={revealVariants}
          className=""
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-tr from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent mb-6">
            Contact
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-10 justify-center mt-6">
            <div className="flex flex-col gap-4 bg-[#181B24ea] glass rounded-2xl px-7 py-7 border border-[#7B80FF]/15 shadow-lg min-w-[220px]">
              <span className="font-bold text-lg text-[#7B80FF]">Founder</span>
              <span className="text-base text-white font-medium">Ritik Bhagoliya</span>
            </div>
            <div className="flex flex-col gap-4 bg-[#181B24ea] glass rounded-2xl px-7 py-7 border border-[#38FFD5]/15 shadow-lg min-w-[220px]">
              <span className="font-bold text-lg text-[#38FFD5]">Phone</span>
              <span className="text-base text-white font-medium">+91 7415006800</span>
            </div>
            <div className="flex flex-col gap-4 bg-[#181B24ea] glass rounded-2xl px-7 py-7 border border-[#FA8C33]/15 shadow-lg min-w-[220px]">
              <span className="font-bold text-lg text-[#FA8C33]">Email</span>
              <span className="text-base text-white font-medium">bhagoliyaritik@gmail.com</span>
            </div>
            <div className="flex flex-col gap-4 bg-[#181B24ea] glass rounded-2xl px-7 py-7 border border-[#b16aff]/15 shadow-lg min-w-[220px]">
              <span className="font-bold text-lg text-[#b16aff]">Location</span>
              <span className="text-base text-white font-medium">Indore, Madhya Pradesh, India</span>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Footer
  function FooterSection() {
    return (
      <footer className="mt-12 px-4 md:px-0 border-t border-[#363a4f]/40 pt-8 pb-6 bg-[#181B24d8] shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="font-black text-xl bg-gradient-to-r from-[#7B80FF] via-[#B16AFF] to-[#38FFD5] bg-clip-text text-transparent">Ritik Tracker</div>
            <div className="text-xs text-[#b6c8f7]/70">
              Made with <span className="text-pink-400">&#10084;&#65039;</span> by Ritik Bhagoliya
            </div>
            <div className="text-xs text-[#b6c8f7]/80">
              Copyright © 2026 Ritik Tracker
            </div>
          </div>
          <div className="flex flex-row gap-8 md:gap-14 items-center text-[15px] font-medium">
            <a href="#" className="hover:text-[#7B80FF] transition">Home</a>
            <a href="#features" className="hover:text-[#38FFD5] transition">Features</a>
            <a href="#faq" className="hover:text-[#FA8C33] transition">FAQ</a>
            <a href="#contact" className="hover:text-[#b16aff] transition">Contact</a>
            <a href="/privacy" className="hover:text-[#b7c3fa] transition">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#b7c3fa] transition">
  Terms &amp; Conditions
</a>
            <a href="#" className="hover:text-[#7B80FF] transition">Support</a>
          </div>
        </div>
      </footer>
    );
  }

  // SEO Head
  React.useEffect(() => {
    document.title = "Ritik Tracker – Track Every Day. Improve Every Day.";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Ritik Tracker is a modern productivity platform for tracking habits, study, workouts, sleep, water, goals and more. Premium cloud sync, analytics, streaks, PWA and beautiful dashboard."
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Ritik Tracker is a modern productivity platform for tracking habits, study, workouts, sleep, water, goals and more. Premium cloud sync, analytics, streaks, PWA and beautiful dashboard.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="relative font-sans min-h-screen bg-[#181B24] text-white overflow-x-hidden">
      <AuroraBG />
      <AuroraShapesFloating />
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <DashboardShowcase />
        <AnalyticsPreviewSection />
        <WhyRitikTrackerSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}