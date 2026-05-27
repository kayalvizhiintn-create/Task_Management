import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "../services/taskService";
import { LogIn, User, Key, Fingerprint } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("kayal@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all required fields.");
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
      setError("Authentication failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#1a1c23] font-sans text-[#a0aec0] selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      
      {/* Decorative Neumorphic background circles */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#1a1c23] shadow-[14px_14px_28px_#121318,-14px_-14px_28px_#22252e] opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-20 right-20 w-96 h-96 rounded-full bg-[#1a1c23] shadow-[14px_14px_28px_#121318,-14px_-14px_28px_#22252e] opacity-50 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-[440px] p-8">
        
        {/* Neumorphic Form Card */}
        <div className="bg-[#1a1c23] rounded-[40px] shadow-[14px_14px_28px_#121318,-14px_-14px_28px_#22252e] p-10 relative">
          
          <div className="flex flex-col items-center mb-10">
            {/* Colorful Icon Container */}
            <div className="w-20 h-20 rounded-full bg-[#1a1c23] shadow-[8px_8px_16px_#121318,-8px_-8px_16px_#22252e] flex items-center justify-center mb-6 text-cyan-500">
              <Fingerprint size={36} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f7fafc]">NavaNala</h1>
            <p className="text-[#cbd5e1] font-medium mt-2">Sign in to orchestrate.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            
            {error && (
              <div className="py-3 px-4 rounded-[16px] bg-[#1a1c23] shadow-[inset_4px_4px_8px_#121318,inset_-4px_-4px_8px_#22252e] text-rose-500 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-bold text-[#cbd5e1] ml-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-orange-500">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-14 pr-6 py-4 bg-[#1a1c23] rounded-full text-[#a0aec0] font-medium focus:outline-none focus:text-[#f7fafc] shadow-[inset_6px_6px_10px_#121318,inset_-6px_-6px_10px_#22252e] transition-all placeholder-[#718096] focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-bold text-[#cbd5e1] ml-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-amber-500">
                  <Key size={20} strokeWidth={2.5} />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-[#1a1c23] rounded-full text-[#a0aec0] font-medium focus:outline-none focus:text-[#f7fafc] shadow-[inset_6px_6px_10px_#121318,inset_-6px_-6px_10px_#22252e] transition-all placeholder-[#718096] focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            {/* Vibrant Gradient Button with Neumorphic Shadows */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 px-6 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full text-white font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-[8px_8px_16px_#121318,-8px_-8px_16px_#22252e] hover:shadow-[4px_4px_8px_#121318,-4px_-4px_8px_#22252e] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.1)] group disabled:opacity-70 disabled:grayscale"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={20} className="transform group-active:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <a href="#" className="text-sm font-bold text-[#cbd5e1] hover:text-cyan-500 transition-colors">
              Forgot your password?
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
