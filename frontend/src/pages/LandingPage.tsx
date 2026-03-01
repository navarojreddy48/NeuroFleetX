import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronRight,
  LineChart as LineChartIcon,
  Menu,
  PlayCircle,
  X,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/landing/Reveal'
import { SectionHeading } from '../components/landing/SectionHeading'
import {
  demoDonutData,
  demoLineData,
  featureCards,
  howItWorks,
  navLinks,
  progressMetrics,
  trafficHighlights,
  trustedLogos,
  whyChooseCards,
} from '../data/landingData'
import { RippleButton } from '../ui/RippleButton'
import { cn } from '../ui/cn'

const donutColors = ['#10b981', '#14b8a6', '#6366f1']

const LazyLandingHeroChart = lazy(() => import('../components/charts/LandingHeroChart'))
const LazyLandingAnalyticsCharts = lazy(() => import('../components/charts/LandingAnalyticsCharts'))

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hasToken, setHasToken] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkToken = () => {
      setHasToken(Boolean(localStorage.getItem('token') || localStorage.getItem('authToken')))
    }

    checkToken()
    window.addEventListener('storage', checkToken)

    return () => window.removeEventListener('storage', checkToken)
  }, [])

  const navClassName = useMemo(
    () =>
      cn(
        'fixed inset-x-0 top-0 z-50 transition duration-300 ease-in-out',
        scrolled
          ? 'border-b border-slate-200/70 bg-white/80 shadow-lg backdrop-blur-xl'
          : 'bg-transparent',
      ),
    [scrolled],
  )

  const onScrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="relative overflow-x-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35" />
      <div className="pointer-events-none absolute -left-36 top-24 -z-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-48 -z-10 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

      <header className={navClassName}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl font-bold tracking-tight text-slate-900">
            NeuroFleetX
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => onScrollTo(item.id)}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {hasToken ? (
              <Link
                to="/dashboard"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
            )}
            <Link to="/signup">
              <RippleButton className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white">
                Get Started
              </RippleButton>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-xl border border-slate-300 p-2 text-slate-700 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed right-0 top-0 z-[60] h-screen w-80 border-l border-slate-200 bg-white p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">Menu</p>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg border border-slate-300 p-2">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {navLinks.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onScrollTo(item.id)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-slate-700"
                  >
                    {item.label}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                {hasToken ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>
                )}
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <RippleButton className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white">
                    Get Started
                  </RippleButton>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main>
        <section className="relative pt-34 sm:pt-38">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                AI Powered Urban Mobility
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                AI-Powered Fleet & Traffic Intelligence for Smarter Cities
              </h1>
              <p className="mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
                Optimize routes, monitor vehicles in real-time, reduce congestion, and improve operational efficiency
                using intelligent analytics.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/signup">
                  <RippleButton className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white">
                    Get Started
                  </RippleButton>
                </Link>
                <button
                  onClick={() => onScrollTo('analytics')}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <PlayCircle className="h-4 w-4 text-indigo-500" />
                  Watch Demo
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative rounded-2xl bg-white p-6 shadow-xl"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">Operations Control Preview</h3>

                  <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm">
                      <p className="text-xs text-slate-500">Avg Speed</p>
                      <p className="text-lg font-semibold text-slate-700">74 km/h</p>
                    </div>
                  </div>
                </div>

                <div className="h-36 rounded-xl bg-slate-50 p-4">
                  <Suspense fallback={<div className="h-full w-full animate-pulse rounded-xl bg-slate-200/80" />}>
                    <LazyLandingHeroChart data={demoLineData} />
                  </Suspense>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Active Vehicles</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">214</p>
                  </div>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">184K</p>
                  </div>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Alerts</p>
                    <p className="mt-1 text-xl font-semibold text-red-500">12</p>
                  </div>
                  <div className="h-full rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Route Efficiency</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">+18%</p>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-slate-200/70 bg-white/75 py-10 backdrop-blur" id="solutions">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Trusted by modern mobility teams</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {trustedLogos.map((logo, index) => (
                <Reveal key={logo} delay={index * 0.05}>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-400 grayscale transition duration-300 hover:grayscale-0 hover:text-emerald-600">
                    {logo}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Features"
              title="Everything You Need to Manage Modern Fleets"
              description="Built for city operators, logistics leaders, and mobility teams that need real-time visibility and measurable operational gains."
            />
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((feature, index) => {
                const Icon = feature.icon

                return (
                  <Reveal key={feature.title} delay={index * 0.06}>
                    <motion.article
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-xl"
                    >
                      <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                    </motion.article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20" id="analytics">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <SectionHeading
                eyebrow="Live Dashboard"
                title="Monitor your fleet in real-time with intelligent insights"
                description="Get a complete operational snapshot with actionable charts, KPIs, and traffic behavior intelligence."
                centered={false}
              />
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-slate-300">Trips Today</p>
                  <p className="mt-2 text-2xl font-semibold text-white">842</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-slate-300">Downtime</p>
                  <p className="mt-2 text-2xl font-semibold text-white">3.1%</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs text-slate-300">Alerts</p>
                  <p className="mt-2 text-2xl font-semibold text-amber-300">17</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 p-4" />
                      <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-slate-900/40 p-4" />
                    </div>
                  }
                >
                  <LazyLandingAnalyticsCharts
                    lineData={demoLineData}
                    donutData={demoDonutData}
                    donutColors={donutColors}
                  />
                </Suspense>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20" id="how-it-works">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="How It Works"
              title="Deploy in Days. Improve Outcomes Fast."
              description="A streamlined workflow designed for operations teams and city mobility command centers."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {howItWorks.map((step, index) => {
                const Icon = step.icon

                return (
                  <Reveal key={step.title} delay={index * 0.08}>
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Step {step.step}</span>
                        <Icon className="h-5 w-5 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <Reveal>
              <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-xl">
                <p className="mb-4 text-sm font-semibold text-slate-700">Traffic Heatmap Intelligence</p>
                <div className="grid h-72 grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-3">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <div
                      key={`heat-${index}`}
                      className={cn(
                        'rounded-lg',
                        index % 7 === 0
                          ? 'bg-red-400/70'
                          : index % 5 === 0
                            ? 'bg-amber-300/70'
                            : 'bg-emerald-300/60',
                      )}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <SectionHeading
                eyebrow="Traffic Analytics Highlight"
                title="Predict and respond before roads become bottlenecks"
                description="Combine traffic intelligence and fleet telemetry to proactively reroute and maintain service quality."
                centered={false}
              />
              <ul className="mt-8 space-y-3">
                {trafficHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-4">
                {progressMetrics.map((metric, index) => (
                  <div key={metric.label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.08 }}
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-20" id="why-choose">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why NeuroFleetX"
              title="Why Choose NeuroFleetX?"
              description="A premium platform designed to help enterprise mobility teams scale confidently with AI intelligence and operational clarity."
            />

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyChooseCards.map((item, index) => {
                const Icon = item.icon

                return (
                  <Reveal key={item.title} delay={index * 0.06}>
                    <motion.article
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-xl"
                    >
                      <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-2 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </motion.article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-14 text-center shadow-xl sm:px-10">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Transform Your Fleet Operations?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-emerald-50">
                  Onboard your fleet quickly and unlock AI-powered urban mobility intelligence with enterprise-grade reliability.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link to="/signup">
                    <RippleButton className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700">
                      Start Free Trial
                    </RippleButton>
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/70 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Schedule Demo
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <p className="text-xl font-bold text-slate-900">NeuroFleetX</p>
            <p className="mt-3 max-w-sm text-sm text-slate-600">
              AI Powered Urban Fleet & Traffic Intelligence Platform built for modern operations teams.
            </p>
            <div className="mt-4 flex items-center gap-3 text-slate-500">
              <LineChartIcon className="h-4 w-4" />
              <span className="text-sm">Live Mobility Intelligence</span>
            </div>
          </div>

          {[
            { title: 'Product', links: ['Features', 'Integrations', 'Dashboard', 'API'] },
            { title: 'Company', links: ['About', 'Careers', 'Press', 'Partners'] },
            { title: 'Resources', links: ['Blog', 'Docs', 'Case Studies', 'Help Center'] },
          ].map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-slate-900">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link} className="text-sm text-slate-600 transition hover:text-slate-900">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 pt-6 text-sm text-slate-500 sm:px-6 lg:px-8">
          <p>© 2026 NeuroFleetX. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="transition hover:text-slate-900" href="#" aria-label="X">
              X
            </a>
            <a className="transition hover:text-slate-900" href="#" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a className="transition hover:text-slate-900" href="#" aria-label="GitHub">
              GitHub
            </a>
          </div>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur transition hover:bg-white"
      >
        Top
        <ArrowRight className="h-3.5 w-3.5 -rotate-90" />
      </button>
    </div>
  )
}
