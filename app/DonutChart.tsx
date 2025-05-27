import React, { useEffect, useRef, useState } from "react"

interface DonutChartProps {
  principal: number
  interest: number
}

export default function DonutChart({ principal, interest }: DonutChartProps) {
  const total = principal + interest
  const principalPercent = total === 0 ? 0 : (principal / total) * 100
  const interestPercent = total === 0 ? 0 : (interest / total) * 100
  // SVG circle math
  const radius = 60
  const circumference = 2 * Math.PI * radius

  // Animated values
  const [animatedPrincipal, setAnimatedPrincipal] = useState(principalPercent)
  const [animatedInterest, setAnimatedInterest] = useState(interestPercent)
  const prevPrincipal = useRef(principalPercent)
  const prevInterest = useRef(interestPercent)

  useEffect(() => {
    let frame: number
    const animate = (from: number, to: number, setter: (v: number) => void) => {
      const duration = 500
      const start = performance.now()
      function step(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const value = from + (to - from) * progress
        setter(value)
        if (progress < 1) {
          frame = requestAnimationFrame(step)
        }
      }
      frame = requestAnimationFrame(step)
    }
    animate(prevPrincipal.current, principalPercent, setAnimatedPrincipal)
    animate(prevInterest.current, interestPercent, setAnimatedInterest)
    prevPrincipal.current = principalPercent
    prevInterest.current = interestPercent
    return () => cancelAnimationFrame(frame)
  }, [principalPercent, interestPercent])

  const principalStroke = (animatedPrincipal / 100) * circumference
  const interestStroke = (animatedInterest / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="150" height="150" viewBox="0 0 150 150">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.10" />
          </filter>
        </defs>
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#e0e7ef"
          strokeWidth="18"
          filter="url(#shadow)"
        />
        {/* Interest (top, orange/red) */}
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth="18"
          strokeDasharray={`${interestStroke} ${circumference - interestStroke}`}
          strokeDashoffset={circumference * 0.25}
          style={{ transition: 'stroke-dasharray 0.5s' }}
          filter="url(#shadow)"
        />
        {/* Principal (bottom, blue) */}
        <circle
          cx="75"
          cy="75"
          r={radius}
          fill="none"
          stroke="#2563eb"
          strokeWidth="18"
          strokeDasharray={`${principalStroke} ${circumference - principalStroke}`}
          strokeDashoffset={circumference * 0.25 + interestStroke}
          style={{ transition: 'stroke-dasharray 0.5s' }}
          filter="url(#shadow)"
        />
      </svg>
    </div>
  )
} 