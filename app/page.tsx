"use client"

import { useState, useEffect } from "react"
import {
  Phone,
  MapPin,
  Calculator,
  Car,
  Building,
  CreditCard,
  Users,
  Star,
  Menu,
  X,
  MessageCircle,
  Send,
  ChevronRight,
  Volume2,
  VolumeX,
  CheckCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import React from "react"
import Confetti from "react-confetti"
import dynamic from "next/dynamic"

const DonutChart = dynamic(() => import("./DonutChart"), { ssr: false })

export default function DivineLoanCare() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [loanAmount, setLoanAmount] = useState([500000])
  const [loanTenure, setLoanTenure] = useState([5])
  const [chatMessage, setChatMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [chatError, setChatError] = useState("")
  const [userContext, setUserContext] = useState({ name: "", interest: "" })
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message: "Hello! I'm here to help you with your loan requirements. How can I assist you today?",
      timestamp: new Date(),
      id: 1,
    },
  ])
  const [applyName, setApplyName] = useState("")
  const [applyPhone, setApplyPhone] = useState("")
  const [applyEmail, setApplyEmail] = useState("")
  const [applyMsg, setApplyMsg] = useState("")
  const [applyLoading, setApplyLoading] = useState(false)
  const [applyFeedback, setApplyFeedback] = useState<string|null>(null)
  const [speechOn, setSpeechOn] = useState(false)
  const [applyCity, setApplyCity] = useState("")
  const [applyArea, setApplyArea] = useState("")
  const [applyLoanType, setApplyLoanType] = useState("")
  const [applyDocs, setApplyDocs] = useState<string[]>([])
  const [applyDesc, setApplyDesc] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSending, setShowSending] = useState(false)
  const [interestRate, setInterestRate] = useState([8.5])
  const [showAmortization, setShowAmortization] = useState(false)
  const [amortizationMode, setAmortizationMode] = useState<'yearly' | 'monthly'>('yearly')

  const LOAN_TYPES = [
    "Used Car Loan",
    "Old Car Purchase",
    "Car Loan Balance Transfer",
    "Business Loan / OD Limit",
    "Personal Loan"
  ]
  const DOCUMENT_OPTIONS = [
    "Aadhar Card",
    "PAN Card",
    "ITR",
    "Electricity Bill",
    "Asset Against Loan",
    "Driving License",
    "Voter ID",
    "Bank Statement"
  ]

  // Typewriter effect hook
  const useTypewriter = (text: string, speed = 50) => {
    const [displayText, setDisplayText] = useState("")
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
      if (!text) return

      setDisplayText("")
      setIsComplete(false)
      let index = 0

      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
        } else {
          setIsComplete(true)
          clearInterval(timer)
        }
      }, speed)

      return () => clearInterval(timer)
    }, [text, speed])

    return { displayText, isComplete }
  }

  // Enhanced message component with typewriter effect
  const ChatMessage = ({ message, isLatest }: { message: any; isLatest: boolean }) => {
    // Only use typewriter effect for the latest bot message
    const isBot = message.type === "bot"
    const showTypewriter = isBot && isLatest
    const { displayText, isComplete } = useTypewriter(
      showTypewriter ? message.message : message.message,
      showTypewriter ? 30 : 0,
    )

    return (
      <div className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}>
        <div className="flex items-end space-x-2 max-w-[80%]">
          {isBot && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
          )}
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              message.type === "user"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-br-md"
                : "bg-white border border-blue-100 text-blue-900 rounded-bl-md"
            } animate-in slide-in-from-bottom-2 duration-300`}
          >
            <p className="text-sm leading-relaxed">
              {showTypewriter ? displayText : message.message}
              {showTypewriter && !isComplete && (
                <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse" />
              )}
            </p>
            <p className="text-xs opacity-60 mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          {message.type === "user" && (
            <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">U</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleQuickOption = async (option: string) => {
    const userMessage = {
      type: "user",
      message: option,
      timestamp: new Date(),
      id: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message })
      })
      const data = await res.json()
        const botResponse = {
          type: "bot",
        message: data.text || "Sorry, I couldn't get a response.",
          timestamp: new Date(),
          id: Date.now() + 1,
        }
        setChatMessages((prev) => [...prev, botResponse])
    } catch (err: any) {
      setChatMessages((prev) => [...prev, {
        type: "bot",
        message: "Sorry, there was an error contacting Gemini.",
        timestamp: new Date(),
        id: Date.now() + 2,
      }])
    } finally {
        setIsTyping(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) {
      setChatError("Please enter a message")
      setTimeout(() => setChatError(""), 3000)
      return
    }

    const userMessage = {
      type: "user",
      message: chatMessage.trim(),
      timestamp: new Date(),
      id: Date.now(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatMessage("")
    setChatError("")
    setIsTyping(true)

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.message })
      })
      const data = await res.json()
        const botResponse = {
          type: "bot",
        message: data.text || "Sorry, I couldn't get a response.",
          timestamp: new Date(),
          id: Date.now() + 1,
        }
        setChatMessages((prev) => [...prev, botResponse])
    } catch (err: any) {
      setChatMessages((prev) => [...prev, {
        type: "bot",
        message: "Sorry, there was an error contacting Gemini.",
        timestamp: new Date(),
        id: Date.now() + 2,
      }])
    } finally {
        setIsTyping(false)
    }
  }

  const handleChatClose = () => {
    setIsChatOpen(false)
    setChatError("")
  }

  const handleChatOpen = () => {
    setIsChatOpen(true)
    // Add welcome message if it's the first time opening
    if (chatMessages.length === 1) {
      setTimeout(() => {
        const welcomeMessage = {
          type: "bot",
          message:
            "I see you're interested in our loan services! Feel free to ask me anything or use the quick options below to get started.",
          timestamp: new Date(),
          id: Date.now(),
        }
        setChatMessages((prev) => [...prev, welcomeMessage])
      }, 1000)
    }
  }

  const calculateEMI = () => {
    const principal = loanAmount[0]
    const rate = interestRate[0] / 100 / 12
    const tenure = loanTenure[0] * 12
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
    const totalAmount = emi * tenure
    const totalInterest = totalAmount - principal
    // Amortization table (yearly and monthly)
    const amortizationYearly = []
    const amortizationMonthly = []
    let balance = principal
    for (let y = 1; y <= loanTenure[0]; y++) {
      let yearInterest = 0
      let yearPrincipal = 0
      for (let m = 1; m <= 12; m++) {
        const interestComp = balance * (interestRate[0] / 100 / 12)
        const principalComp = emi - interestComp
        yearInterest += interestComp
        yearPrincipal += principalComp
        balance -= principalComp
        amortizationMonthly.push({
          month: (y - 1) * 12 + m,
          principal: Math.max(0, principalComp),
          interest: Math.max(0, interestComp),
          balance: Math.max(0, balance),
        })
      }
      amortizationYearly.push({
        year: y,
        principal: Math.max(0, yearPrincipal),
        interest: Math.max(0, yearInterest),
        balance: Math.max(0, balance),
      })
    }
    return { emi, totalAmount, totalInterest, amortizationYearly, amortizationMonthly }
  }

  const services = [
    {
      title: "Used Car Loan",
      percentage: "Up to 90%",
      icon: Car,
      description: "Get instant approval for used car loans with minimal documentation",
      features: ["Quick approval", "Minimal documentation", "Competitive rates"],
    },
    {
      title: "Old Car Purchase",
      percentage: "Up to 90%",
      icon: Car,
      description: "Purchase your dream car with our flexible financing options",
      features: ["Flexible tenure", "Low interest rates", "Easy processing"],
    },
    {
      title: "Car Loan Balance Transfer",
      percentage: "Up to 200%",
      icon: CreditCard,
      description: "Transfer your existing car loan and get additional funding",
      features: ["Top-up facility", "Lower EMI", "Better terms"],
    },
    {
      title: "Business Loan/OD Limit",
      percentage: "Unsecured",
      icon: Building,
      description: "Grow your business with our unsecured business loans",
      features: ["No collateral", "Quick disbursal", "Flexible repayment"],
    },
    {
      title: "Personal Loan",
      percentage: "20K Min Salary",
      icon: Users,
      description: "Personal loans for all your financial needs",
      features: ["Instant approval", "Minimal salary requirement", "No hidden charges"],
    },
  ]

  const partnerBanks = [
    { name: "Bajaj Finserv", img: "/partners/BajajFinserv.png" },
    { name: "Yes Bank", img: "/partners/YesBank.png" },
    { name: "Hero FinCorp", img: "/partners/HeroFinCorp.png" },
    { name: "Axis Bank", img: "/partners/axisbank.png" },
    { name: "IDFC First Bank", img: "/partners/IDFC.png" },
    { name: "Tata Capital", img: "/partners/TataCapital.png" },
  ]

  // Handler for sending SMS via API
  const handleApplySend = async () => {
    if (!applyName || !applyPhone || !applyLoanType || applyDocs.length === 0) {
      setApplyFeedback("Please fill in all required fields.")
      return
    }
    setApplyLoading(true)
    setShowSending(true)
    setApplyFeedback(null)
    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: applyName,
          phone: applyPhone,
          email: applyEmail,
          city: applyCity,
          area: applyArea,
          loanType: applyLoanType,
          documents: applyDocs,
          description: applyDesc,
        })
      })
      const data = await res.json()
      if (data.success) {
        setTimeout(() => {
          setShowSending(false)
          setShowSuccess(true)
          setApplyFeedback("Message sent successfully!")
          setTimeout(() => {
            setShowSuccess(false)
            setIsMessageDialogOpen(false)
            setApplyName("")
            setApplyPhone("")
            setApplyEmail("")
            setApplyCity("")
            setApplyArea("")
            setApplyLoanType("")
            setApplyDocs([])
            setApplyDesc("")
            setApplyMsg("")
            setApplyFeedback(null)
          }, 2000)
        }, 1200)
      } else {
        setShowSending(false)
        setApplyFeedback("Failed to send message: " + (data.error || "Unknown error"))
      }
    } catch (err: any) {
      setShowSending(false)
      setApplyFeedback("Failed to send message: " + err.message)
    } finally {
      setApplyLoading(false)
    }
  }

  // Add effect to clear feedback when user edits any field
  useEffect(() => {
    if (applyFeedback && applyFeedback.startsWith("Please fill")) {
      setApplyFeedback(null)
    }
    // eslint-disable-next-line
  }, [applyName, applyPhone, applyLoanType, applyDocs])

  // Speak the latest bot message if speech is on
  useEffect(() => {
    if (!speechOn) return
    const lastMsg = chatMessages[chatMessages.length - 1]
    if (lastMsg && lastMsg.type === "bot" && lastMsg.message) {
      const utter = new window.SpeechSynthesisUtterance(lastMsg.message)
      utter.rate = 1.05
      window.speechSynthesis.speak(utter)
    }
    // eslint-disable-next-line
  }, [chatMessages, speechOn])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Emergency Contact Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2 px-4 text-center">
        <p className="text-sm">
          <span className="font-semibold">Emergency Loan Assistance:</span> Call Now -
          <a href="tel:9109999436" className="ml-1 font-bold hover:text-blue-200 transition-colors">
            9109999436
          </a>
        </p>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-blue-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-900">Divine Loan Care</h1>
                <p className="text-sm text-blue-600">Apka Vishwas Hamara Sath</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#services" className="text-blue-800 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#about" className="text-blue-800 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-blue-800 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <div className="flex items-center space-x-2 text-blue-800">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">9109999436</span>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-blue-800">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-blue-200 pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#services" className="text-blue-800 hover:text-blue-600 transition-colors">
                  Services
                </a>
                <a href="#about" className="text-blue-800 hover:text-blue-600 transition-colors">
                  About
                </a>
                <a href="#contact" className="text-blue-800 hover:text-blue-600 transition-colors">
                  Contact
                </a>
                <div className="flex items-center space-x-2 text-blue-800">
                  <Phone className="w-4 h-4" />
                  <span className="font-semibold">9109999436</span>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-blue-600/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
                Your Trusted
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  Loan Partner
                </span>
              </h2>
              <p className="text-xl text-blue-700 mb-8 leading-relaxed">
                Get instant loan approvals with minimal documentation. From car loans to business funding, we make your
                financial dreams come true.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsMessageDialogOpen(true)}
                >
                  Apply Now
                </Button>
                <a
                  href="tel:+919109999436"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg flex items-center justify-center gap-2 text-lg font-medium border transition-colors"
                  style={{ textDecoration: 'none' }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </div>
            </div>

            {/* Loan Calculator */}
            <Card className="bg-white rounded-2xl shadow-xl border border-blue-100 max-w-xl mx-auto">
              <CardHeader className="pb-0">
                <CardTitle className="text-2xl font-bold text-blue-900 mb-2">Car Loan EMI Calculator</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 min-w-[260px]">
                  {/* Loan Amount Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-blue-800 font-medium">Loan amount</label>
                      <div className="bg-blue-50 px-3 py-1 rounded-lg text-blue-800 font-semibold text-lg border border-blue-100">₹ {loanAmount[0].toLocaleString()}</div>
                  </div>
                    <Slider value={loanAmount} onValueChange={setLoanAmount} min={100000} max={2000000} step={10000} />
                </div>
                  {/* Interest Rate Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-blue-800 font-medium">Rate of interest (p.a)</label>
                      <div className="bg-green-50 px-3 py-1 rounded-lg text-green-700 font-semibold text-lg border border-green-100">{interestRate[0].toFixed(1)}%</div>
                    </div>
                    <Slider value={interestRate} onValueChange={setInterestRate} min={4} max={18} step={0.1} />
                  </div>
                  {/* Tenure Slider */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-blue-800 font-medium">Loan tenure</label>
                      <div className="bg-blue-50 px-3 py-1 rounded-lg text-blue-800 font-semibold text-lg border border-blue-100">{loanTenure[0]} Yr</div>
                    </div>
                    <Slider value={loanTenure} onValueChange={setLoanTenure} min={1} max={10} step={1} />
                  </div>
                  {/* EMI & Summary */}
                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-blue-900 font-semibold text-lg">
                      <span>Monthly EMI</span>
                      <span>₹{calculateEMI().emi.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-blue-700">
                      <span>Principal amount</span>
                      <span>₹{loanAmount[0].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-blue-700">
                      <span>Total interest</span>
                      <span>₹{calculateEMI().totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-blue-900 font-bold border-t pt-2 mt-2">
                      <span>Total amount</span>
                      <span>₹{calculateEMI().totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                  {/* Amortization Accordion */}
                  <div className="mt-6">
                    <button
                      className="flex items-center gap-2 text-blue-700 font-medium hover:underline focus:outline-none"
                      onClick={() => setShowAmortization(v => !v)}
                    >
                      {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Your Amortization Details ({amortizationMode === 'yearly' ? 'Yearly' : 'Monthly'})
                    </button>
                    {showAmortization && (
                      <div className="mt-4">
                        {/* Segmented Control Dropper */}
                        <div className="mb-4 flex items-center justify-center">
                          <div className="relative flex bg-blue-50 rounded-full p-1 shadow-inner w-fit">
                            <button
                              className={`px-6 py-2 rounded-full z-10 font-semibold text-sm transition-all duration-200 focus:outline-none ${amortizationMode === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-700 hover:bg-blue-100'}`}
                              style={{ position: 'relative', transition: 'background 0.3s' }}
                              onClick={() => setAmortizationMode('yearly')}
                            >
                              Yearly
                            </button>
                            <button
                              className={`px-6 py-2 rounded-full z-10 font-semibold text-sm transition-all duration-200 focus:outline-none ${amortizationMode === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-700 hover:bg-blue-100'}`}
                              style={{ position: 'relative', transition: 'background 0.3s' }}
                              onClick={() => setAmortizationMode('monthly')}
                            >
                              Monthly
                            </button>
                            {/* Animated background highlight */}
                            <span
                              className="absolute top-1 left-1 h-[calc(100%-0.5rem)] w-1/2 rounded-full bg-blue-600/10 z-0 transition-all duration-300"
                              style={{
                                transform: amortizationMode === 'yearly' ? 'translateX(0)' : 'translateX(100%)',
                                width: 'calc(50% - 0.25rem)',
                              }}
                            />
                          </div>
                        </div>
                        {/* Table rendering remains the same */}
                        {amortizationMode === 'yearly' ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border border-blue-100 rounded-lg">
                              <thead>
                                <tr className="bg-blue-50">
                                  <th className="px-3 py-2 text-left">Year</th>
                                  <th className="px-3 py-2 text-right">Principal Paid</th>
                                  <th className="px-3 py-2 text-right">Interest Paid</th>
                                  <th className="px-3 py-2 text-right">Balance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {calculateEMI().amortizationYearly.map((row, idx) => (
                                  <tr key={idx} className="even:bg-blue-50">
                                    <td className="px-3 py-2">{row.year}</td>
                                    <td className="px-3 py-2 text-right">₹{row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-3 py-2 text-right">₹{row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-3 py-2 text-right">₹{row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="overflow-x-auto max-h-72 overflow-y-auto">
                            <table className="min-w-full text-sm border border-blue-100 rounded-lg">
                              <thead>
                                <tr className="bg-blue-50">
                                  <th className="px-3 py-2 text-left">Month</th>
                                  <th className="px-3 py-2 text-right">Principal Paid</th>
                                  <th className="px-3 py-2 text-right">Interest Paid</th>
                                  <th className="px-3 py-2 text-right">Balance</th>
                                </tr>
                              </thead>
                              <tbody>
                                {calculateEMI().amortizationMonthly.map((row, idx) => (
                                  <tr key={idx} className="even:bg-blue-50">
                                    <td className="px-3 py-2">{row.month}</td>
                                    <td className="px-3 py-2 text-right">₹{row.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-3 py-2 text-right">₹{row.interest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="px-3 py-2 text-right">₹{row.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Donut Chart */}
                <div className="flex-1 flex flex-col items-center justify-center min-w-[220px]">
                  <DonutChart
                    principal={loanAmount[0]}
                    interest={calculateEMI().totalInterest}
                  />
                  <div className="flex justify-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-200"></span>
                      <span className="text-blue-700 text-sm">Principal amount</span>
                  </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-blue-600"></span>
                      <span className="text-blue-700 text-sm">Interest amount</span>
                </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-blue-900 mb-4">Our Loan Services</h3>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Comprehensive financial solutions tailored to meet your specific needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-white"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">{service.title}</CardTitle>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                    {service.percentage}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-700 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center text-sm text-blue-600">
                        <ChevronRight className="w-4 h-4 mr-1 text-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banks Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-blue-900 mb-4">Our Banking Partners</h3>
            <p className="text-xl text-blue-600">Trusted by leading financial institutions</p>
          </div>
          <BankCarousel banks={partnerBanks} />
        </div>
      </section>

      {/* About/Trust Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-900 mb-6">Meet Pankaj Dogne</h3>
              <p className="text-xl text-blue-700 mb-6 leading-relaxed">
                With years of experience in the financial sector, Pankaj Dogne leads Divine Loan Care with a commitment
                to providing transparent, reliable, and customer-focused loan solutions.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Expert Guidance</h4>
                    <p className="text-blue-600">Personalized loan solutions for every need</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Customer First</h4>
                    <p className="text-blue-600">Your financial success is our priority</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Pankaj: 9109999436
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Schedule Consultation
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-32 h-32 text-blue-800" />
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <h4 className="text-2xl font-bold text-blue-900 mb-2">1000+</h4>
                <p className="text-blue-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-blue-900 mb-4">Get In Touch</h3>
            <p className="text-xl text-blue-600">Ready to get your loan approved? Contact us today!</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Phone Numbers</h4>
                      <p className="text-blue-700">Primary: 9109999436</p>
                      <p className="text-blue-700">Secondary: 9770206021</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Office Address</h4>
                      <p className="text-blue-700">
                        4EC-3rd Floor, Sche. No. 94,
                        <br />
                        Near Bombay Hospital,
                        <br />
                        Indore (M.P.)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">Business Hours</h4>
                  <div className="space-y-2 text-blue-700">
                    <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                    <p>Sunday: 10:00 AM - 4:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-900">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Your Name" className="border-blue-200 focus:border-blue-500" />
                <Input placeholder="Phone Number" className="border-blue-200 focus:border-blue-500" />
                <Input placeholder="Email Address" className="border-blue-200 focus:border-blue-500" />
                <textarea
                  placeholder="Your Message"
                  className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-500 focus:outline-none resize-none h-32"
                />
                <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Divine Loan Care</h4>
                  <p className="text-blue-200 text-sm">Apka Vishwas Hamara Sath</p>
                </div>
              </div>
              <p className="text-blue-200 mb-4">
                Your trusted partner for all loan requirements in Indore and across Madhya Pradesh.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-blue-200">
                <p>📞 9109999436, 9770206021</p>
                <p>📍 Near Bombay Hospital, Indore</p>
                <p>✉️ info@divineloancare.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-700 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 Divine Loan Care. All rights reserved. | Designed with ❤️ for your financial success</p>
          </div>
        </div>
      </footer>

      {/* Enhanced Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">!</span>
          </div>

          {/* Pulsing ring effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20 animation-delay-1000"></div>

          <Button
            onClick={handleChatOpen}
            className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
            aria-label="Open chat with loan expert"
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </Button>
        </div>
      </div>

      {/* Enhanced Chat Window */}
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={handleChatClose} />

          {/* Chat Container */}
          <div className="fixed inset-0 z-50 flex items-end justify-end p-2 md:p-8 pointer-events-none">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] md:h-[38rem] flex flex-col pointer-events-auto animate-in slide-in-from-bottom-4 duration-500 ease-out border border-blue-100">
              {/* Enhanced Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 rounded-t-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Chat with Pankaj</h4>
                    <p className="text-xs text-blue-200 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      Online now • Typically replies instantly
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSpeechOn((v) => !v)}
                  className={`ml-2 ${speechOn ? 'text-blue-200' : 'text-blue-400'} hover:bg-white/20 p-2 rounded-full transition-colors`}
                  aria-label={speechOn ? "Disable speech" : "Enable speech"}
                >
                  {speechOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChatClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-blue-50/30 to-white">
                <div className="space-y-1">
                  {chatMessages.map((msg, index) => (
                    <ChatMessage key={msg.id} message={msg} isLatest={index === chatMessages.length - 1} />
                  ))}
                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="flex items-end space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-blue-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Message Input */}
              <div className="p-6 border-t border-blue-100 bg-white rounded-b-2xl">
                {chatError && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600">{chatError}</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                      disabled={isTyping}
                      className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl pr-12 disabled:opacity-50 text-base py-4"
                      aria-label="Type your message"
                    />
                    {chatMessage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatMessage("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isTyping || !chatMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl px-6 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                    aria-label="Send message"
                  >
                    {isTyping ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Feedback Options */}
                <div className="mt-3 flex items-center justify-between text-xs text-blue-500">
                  <span>Powered by Divine Loan Care AI</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dialog for Send us a Message */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-blue-900">Apply for a Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 relative">
            {/* Sending Animation Overlay */}
            {showSending && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 rounded-2xl animate-fade-in">
                <div className="flex flex-col items-center gap-4">
                  <span className="animate-bounce">
                    <Send className="w-16 h-16 text-blue-700 drop-shadow-lg" />
                  </span>
                  <div className="w-48 h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800 animate-pulse rounded-full w-3/4" style={{ animationDuration: '1.2s' }}></div>
                  </div>
                  <p className="text-blue-800 font-semibold text-lg mt-2 animate-pulse">Sending your application...</p>
                </div>
              </div>
            )}
            {/* Success Popup Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/90 rounded-2xl animate-fade-in">
                <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={120} recycle={false} />
                <CheckCircle className="w-20 h-20 text-green-500 mb-4 animate-pop" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Application Sent!</h3>
                <p className="text-blue-800 text-lg text-center mb-2">Thank you for your enquiry.<br />Our team will contact you soon.</p>
              </div>
            )}
            <div className={`space-y-4 ${showSending || showSuccess ? 'pointer-events-none opacity-40' : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Your Name" className="border-blue-200 focus:border-blue-500" value={applyName} onChange={e => setApplyName(e.target.value)} disabled={showSending || showSuccess || applyLoading} />
                <Input placeholder="Phone Number" className="border-blue-200 focus:border-blue-500" value={applyPhone} onChange={e => setApplyPhone(e.target.value)} disabled={showSending || showSuccess || applyLoading} />
                <Input placeholder="Email Address" className="border-blue-200 focus:border-blue-500" value={applyEmail} onChange={e => setApplyEmail(e.target.value)} disabled={showSending || showSuccess || applyLoading} />
                <Input placeholder="City" className="border-blue-200 focus:border-blue-500" value={applyCity} onChange={e => setApplyCity(e.target.value)} disabled={showSending || showSuccess || applyLoading} />
                <Input placeholder="Area" className="border-blue-200 focus:border-blue-500" value={applyArea} onChange={e => setApplyArea(e.target.value)} disabled={showSending || showSuccess || applyLoading} />
                <select
                  className="border border-blue-200 focus:border-blue-500 rounded-md px-3 py-2 text-blue-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  value={applyLoanType}
                  onChange={e => setApplyLoanType(e.target.value)}
                  disabled={showSending || showSuccess || applyLoading}
                >
                  <option value="">Select Loan Type</option>
                  {LOAN_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Documents</label>
                <div className="flex flex-wrap gap-2">
                  {DOCUMENT_OPTIONS.map(doc => (
                    <button
                      key={doc}
                      type="button"
                      className={`px-3 py-1 rounded-full border text-sm transition-all duration-200 ${applyDocs.includes(doc) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'}`}
                      onClick={() => setApplyDocs(docs => docs.includes(doc) ? docs.filter(d => d !== doc) : [...docs, doc])}
                      disabled={showSending || showSuccess || applyLoading}
                    >
                      {doc}
                      {applyDocs.includes(doc) && (
                        <span className="ml-2 text-xs">×</span>
                      )}
                    </button>
                  ))}
                </div>
                {applyDocs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {applyDocs.map(doc => (
                      <span key={doc} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200">
                        {doc}
                        <button
                          type="button"
                          className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          onClick={() => setApplyDocs(docs => docs.filter(d => d !== doc))}
                          disabled={showSending || showSuccess || applyLoading}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                placeholder="Describe your loan needs or any additional info..."
                className="w-full p-3 border border-blue-200 rounded-md focus:border-blue-500 focus:outline-none resize-none h-32"
                value={applyDesc}
                onChange={e => setApplyDesc(e.target.value)}
                disabled={showSending || showSuccess || applyLoading}
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white flex items-center justify-center gap-2 text-lg py-3" onClick={handleApplySend} disabled={applyLoading || showSending || showSuccess}>
                {applyLoading || showSending ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Sending...</span>
                ) : (
                  <span className="flex items-center gap-2"><Send className="w-5 h-5" /> Send Application</span>
                )}
              </Button>
              {applyFeedback && <div className="text-center text-sm text-blue-700">{applyFeedback}</div>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BankCarousel({ banks }: { banks: { name: string; img: string }[] }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: true },
    [Autoplay({ delay: 1800, stopOnInteraction: false })]
  )
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div ref={emblaRef} className="embla overflow-hidden">
        <div className="flex">
          {banks.map((bank, idx) => (
            <div
              key={bank.name}
              className="embla__slide flex flex-col items-center justify-center px-4 py-8 transition-transform duration-500"
              style={{
                minWidth: "240px",
                marginRight: "-16px",
                transform: `scale(0.98) translateY(${idx % 2 === 0 ? '0px' : '12px'})`,
                zIndex: 1,
              }}
            >
              <div className="w-40 h-40 rounded-2xl shadow-xl bg-white flex items-center justify-center mb-4">
                <Image
                  src={bank.img}
                  alt={bank.name}
                  width={120}
                  height={120}
                  className="object-contain w-32 h-32"
                />
              </div>
              <div className="text-lg font-semibold text-blue-900 text-center">{bank.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
