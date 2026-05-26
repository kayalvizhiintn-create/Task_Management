import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import { Lock, Mail, Layers, CheckCircle2, ChevronRight, AlertCircle, Shield, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("kayal@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all credentials.");
      setLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        const user = taskService.login(email, password);
        setLoading(false);
        navigate("/");
      }, 800);
    } catch (err) {
      setError("Invalid credentials. Try the demo accounts.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center font-sans relative overflow-hidden bg-slate-950">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/40 blur-[150px] rounded-full mix-blend-screen animate-pulse-subtle"></div>
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-secondary/40 blur-[150px] rounded-full mix-blend-screen animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/20 blur-[120px] rounded-full mix-blend-screen"></div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Main Login Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-12 p-8">

        {/* Left Side: Brand Identity */}
        <div className="hidden md:flex flex-col flex-1 text-left max-w-lg">
          <div className="mb-10">
            <img src="/src/assets/logo.jpg" alt="NavaNala Logo" className="h-24 w-auto object-contain rounded-xl shadow-2xl" />
          </div>

          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-[1.1] tracking-tight">
            Elevate Your Team's Productivity.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mt-6 font-medium">
            Experience the next generation of workload orchestration. NavaNala Technologies provides surgical precision for managing projects, tracking milestones, and delivering results.
          </p>

          {/* <div className="flex items-center gap-6 mt-10">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} alt="user" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" />
              ))}
            </div>
            <div className="text-sm font-semibold text-slate-300">
              <span className="text-white font-bold">10k+</span> professionals<br />are already using NavaNala.
            </div>
          </div> */}
        </div>

        {/* Right Side: Glassmorphism Login Form */}
        <div className="w-full max-w-md flex-1">
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            {/* Glossy top highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-white tracking-tight">Sign In</h3>
              <p className="text-slate-400 text-sm mt-2 font-semibold">Welcome back to your workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold flex items-center gap-3 animate-fade-in">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-extrabold text-slate-300 tracking-wider uppercase ml-1">Work Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 text-white placeholder-slate-600 font-semibold shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-xs font-extrabold text-slate-300 tracking-wider uppercase">Password</label>
                  <a href="#" className="text-xs font-bold text-primary hover:text-primary-light hover:underline transition-all">Recover</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 text-white placeholder-slate-600 font-semibold shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded-md checked:bg-primary checked:border-primary transition-all cursor-pointer"
                    />
                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dark hover:to-indigo-700 text-white rounded-2xl text-sm font-black shadow-glow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts List */}
            {/* <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Demo Login</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { setEmail("kayal@gmail.com"); setPassword("12345678"); }}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-white transition-all"
                >
                  <Shield size={14} className="text-emerald-400" /> Admin
                </button>
                <button
                  onClick={() => { setEmail("emma@company.com"); setPassword("password123"); }}
                  className="flex items-center justify-center gap-2 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-white transition-all"
                >
                  Emma (Manager)
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
