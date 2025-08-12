import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Wallet, ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://rugradar-backend.onrender.com'
const WALLET = '0x70e83336B8750A23bf8C947D51d17E3AceEd9b34'
const TELEGRAM = 'https://t.me/KITTYBEATSTEAM'

const gradients = [
  'from-sky-400/40 via-indigo-300/30 to-fuchsia-300/20',
  'from-emerald-300/30 via-teal-300/30 to-cyan-300/20',
  'from-rose-300/30 via-amber-200/30 to-pink-300/20'
]

const PLANS = {
  free: { title: 'Free', price: '$0', perks: ['Delayed alerts (30–60m)', 'Basic risk tags', 'Public Telegram'] },
  premium: { title: 'Premium', price: '$19/mo', perks: ['Instant alerts', 'Owner risk + lock checks', 'Private TG channel'] },
  lifetime: { title: 'Lifetime', price: '$129', perks: ['All Premium features', 'Priority support', 'Founder badge'] },
}

export default function App(){
  const [cursorPos, setCursorPos] = useState({x:0,y:0})
  const [gradIndex, setGradIndex] = useState(0)

  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [network, setNetwork] = useState('bsc') // default BSC (low fees)
  const [txHash, setTxHash] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verifyResult, setVerifyResult] = useState(null)

  useEffect(()=>{
    const onMove = e => setCursorPos({x:e.clientX,y:e.clientY})
    window.addEventListener('mousemove', onMove)
    const t = setInterval(()=> setGradIndex(g=> (g+1)%gradients.length), 4500)
    return ()=>{ window.removeEventListener('mousemove', onMove); clearInterval(t) }
  },[])

  const openPlan = (plan) => {
    if (plan === 'free') {
      window.open(TELEGRAM, '_blank')
      return
    }
    setSelectedPlan(plan)
    setShowModal(true)
  }

  const onVerify = async (e) => {
    e?.preventDefault()
    setVerifying(true)
    setVerifyResult(null)
    try{
      const res = await fetch(`${BACKEND_URL}/verify-payment`,{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ txHash, network })
      })
      const data = await res.json()
      setVerifyResult(data)
    }catch(err){
      setVerifyResult({ success:false, error:String(err) })
    }finally{
      setVerifying(false)
    }
  }

  return (
    <div className="min-h-screen text-neutral-800 relative overflow-hidden">
      {/* animated glow */}
      <motion.div className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-70 bg-gradient-to-br ${gradients[gradIndex]}`} style={{left:cursorPos.x, top:cursorPos.y}} animate={{scale:[1,1.05,1], opacity:[0.55,0.7,0.55]}} transition={{duration:4.5, repeat:Infinity, ease:'easeInOut'}} />

      {/* navbar */}
      <nav className="relative z-10 max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-xl">RugRadar</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="#pricing" className="hover:opacity-70">Pricing</a>
          <a href={TELEGRAM} target="_blank" rel="noreferrer" className="hover:opacity-70">Telegram</a>
        </div>
      </nav>

      {/* hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">Don’t get <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">rug pulled</span> again</h1>
          <p className="mt-4 text-lg text-neutral-700">Real-time DEX scans on ETH, BSC, Polygon. Flags honeypots, owner risks, liquidity pulls — before they hit you.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a href={TELEGRAM} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 text-white px-5 py-3 shadow hover:opacity-90">Join Free Alerts <ArrowRight className="ml-2 h-4 w-4"/></a>
            <a href="#pricing" className="inline-flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur px-5 py-3 border border-neutral-200 hover:bg-white">See Pricing</a>
          </div>
          <div className="mt-5 flex items-center gap-3 text-sm text-neutral-600">
            <CheckCircle2 className="h-4 w-4"/> Instant alerts • ETH & BSC & Polygon
            <CheckCircle2 className="h-4 w-4"/> Wallet-gated Premium
          </div>
        </div>
        <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="relative">
          <div className="rounded-3xl border border-neutral-200 bg-white shadow-xl p-5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white shadow">
                <ShieldCheck className="h-5 w-5"/>
              </div>
              <div>
                <p className="font-medium">Live Risk Snapshot</p>
                <p className="text-sm text-neutral-600">Example Premium panel</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <Info label="Honeypot" value="No" good/>
              <Info label="Owner Risk" value="Medium"/>
              <Info label="Liquidity Lock" value="90 days"/>
              <Info label="Mintable" value="Disabled" good/>
              <Info label="Blacklist" value="None" good/>
              <Info label="Buy/Sell Tax" value="3% / 3%"/>
            </div>
          </div>
        </motion.div>
      </section>

      {/* pricing */}
      <section id="pricing" className="relative z-10 max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Upgrade to Premium</h2>
        <p className="text-center text-neutral-600 mt-2">Pay in crypto, then paste your TX hash to unlock instantly.</p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <PriceCard planKey="free" onSelect={openPlan} highlight={false} />
          <PriceCard planKey="premium" onSelect={openPlan} highlight />
          <PriceCard planKey="lifetime" onSelect={openPlan} highlight={false} />
        </div>
      </section>

      {/* Modal */}
      <PaymentModal
        open={showModal}
        onClose={()=>{ setShowModal(false); setTxHash(''); setVerifyResult(null) }}
        plan={PLANS[selectedPlan]}
        planKey={selectedPlan}
        wallet={WALLET}
        network={network}
        setNetwork={setNetwork}
        txHash={txHash}
        setTxHash={setTxHash}
        verifying={verifying}
        verifyResult={verifyResult}
        onVerify={onVerify}
      />

      <footer className="relative z-10 border-t border-neutral-200 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-neutral-600 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} RugRadar. All rights reserved.</p>
          <div className="flex gap-5">
            <a className="hover:opacity-70" href="#">Terms</a>
            <a className="hover:opacity-70" href="#">Privacy</a>
            <a className="hover:opacity-70" href={TELEGRAM} target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Info({label, value, good}){
  return (
    <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-3">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className={`mt-1 font-medium ${good? 'text-emerald-700':'text-neutral-800'}`}>{value}</div>
    </div>
  )
}

function PriceCard({ planKey, onSelect, highlight }){
  const p = PLANS[planKey]
  return (
    <button onClick={()=>onSelect(planKey)} className={`text-left w-full rounded-3xl border ${highlight? 'border-neutral-900':'border-neutral-200'} bg-white p-6 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neutral-900`}>
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-neutral-500">{highlight? 'Best for active traders':'Try before you buy'}</p>
          <h3 className="mt-1 text-2xl font-semibold">{p.title}</h3>
        </div>
        <div className="text-3xl font-bold">{p.price}</div>
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {p.perks.map((perk, idx)=> (
          <li key={idx} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5"/>{perk}</li>
        ))}
      </ul>
    </button>
  )
}

function PaymentModal({ open, onClose, plan, planKey, wallet, network, setNetwork, txHash, setTxHash, verifying, onVerify, verifyResult }){
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:20}} transition={{duration:0.2}}
            className="relative w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
            <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-xl hover:bg-neutral-100" aria-label="Close"><X className="h-4 w-4"/></button>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow"><Wallet className="h-5 w-5"/></div>
              <div>
                <h3 className="font-semibold">Upgrade: {plan.title}</h3>
                <p className="text-sm text-neutral-600">Send payment, then paste your transaction hash to unlock instantly.</p>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
              <AddressBox chain="ETH / USDT (ERC20)" addr={wallet} />
              <AddressBox chain="BNB / USDT (BEP20)" addr={wallet} />
              <AddressBox chain="MATIC / USDT (Polygon)" addr={wallet} />
            </div>

            <form onSubmit={onVerify} className="mt-6 grid md:grid-cols-[1fr_auto_auto] gap-3">
              <select value={network} onChange={e=>setNetwork(e.target.value)} className="rounded-2xl border border-neutral-300 px-4 py-3">
                <option value="eth">Ethereum (ETH / USDT)</option>
                <option value="bsc">BNB Chain (BNB / USDT)</option>
                <option value="polygon">Polygon (MATIC / USDT)</option>
              </select>
              <input value={txHash} onChange={e=>setTxHash(e.target.value)} required placeholder="Paste your transaction hash (0x...)" className="w-full rounded-2xl border border-neutral-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900"/>
              <button disabled={verifying} className="rounded-2xl bg-neutral-900 text-white px-6 py-3 disabled:opacity-60">{verifying? 'Verifying…' : 'Verify & Unlock'}</button>
            </form>

            <AnimatePresence>
              {verifyResult && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="mt-4 text-sm">
                  {verifyResult.success ? (
                    <div className="text-emerald-700">✓ Payment confirmed on {network.toUpperCase()}. You now have Premium access.</div>
                  ) : (
                    <div className="text-rose-700">✗ {verifyResult.error || 'Verification failed.'}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AddressBox({chain, addr}){
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(addr); setCopied(true); setTimeout(()=>setCopied(false),1200) }
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <div className="text-xs text-neutral-500">{chain}</div>
      <div className="mt-1 font-mono break-all text-sm">{addr}</div>
      <button onClick={copy} className="mt-3 text-xs underline">{copied? 'Copied!' : 'Copy address'}</button>
    </div>
  )
}
