import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  HeartPulse, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (isAuthenticated) {
      if (loginTimestamp) {
        const elapsed = Date.now() - parseInt(loginTimestamp, 10);
        if (elapsed > 2 * 60 * 60 * 1000) { // 2 hours session expiry
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('loginTimestamp');
        } else {
          localStorage.setItem('loginTimestamp', Date.now().toString());
          navigate('/');
        }
      } else {
        localStorage.setItem('loginTimestamp', Date.now().toString());
        navigate('/');
      }
    }
  }, [navigate]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (username.toLowerCase() === 'admin@gmail.com' && password === 'admin@2026') {
        setSuccess(true);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTimestamp', Date.now().toString());
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid username or password. Please try again.');
        setLoading(false);
      }
    }, 1200);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setSuccess(false);
    setLoading(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#50ad77]/20 selection:text-[#50ad77]">
      {(loading || success) && (
        <div id="loader">
          <img src="./KHMCPL_LOGO.png" alt="Loading Logo" />
        </div>
      )}
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img 
              src="KHMCPL_LOGO.png" 
              alt="Kavin Health & Medicare Logo" 
              className="h-16 w-16 rounded-2xl object-cover border-2 border-[#50ad77]/20 shadow-md shadow-[#50ad77]/10"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-16 w-16 rounded-2xl bg-[#50ad77]/10 items-center justify-center border-2 border-[#50ad77]/20 overflow-hidden">
              <img src="/KHMCPL_LOGO.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl text-[#1958a8] font-black tracking-tight">
              KAVIN
            </h1>
            <p className="text-xs text-[#50ad77] font-bold tracking-widest uppercase">
              Health & Medicare Pvt Ltd
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-100/50">       
          {success ? (
            <div className="text-center space-y-4 py-4 animate-fade-in">
              <div className="mx-auto w-14 h-14 bg-[#50ad77]/10 text-[#50ad77] rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Access Granted</h3>
                <p className="text-xs text-slate-500">Connecting to secure medical panel dashboard...</p>
              </div>
              <button 
                onClick={resetForm}
                className="text-xs font-bold text-[#50ad77] hover:underline block mx-auto pt-2"
              >
                Log Out / Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              <div className="text-center pb-2">
                <h2 className="text-lg font-bold text-slate-900">Admin Login</h2>
                <p className="text-xs text-slate-400">Enter your official administrative credentials</p>
              </div>
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-600 text-xs animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication Failed:</span> {error}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                  Username / Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin@gmail.com"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-[#50ad77] focus:ring-1 focus:ring-[#50ad77] transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                    Password
                  </label>                 
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-11 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-[#50ad77] focus:ring-1 focus:ring-[#50ad77] transition-all duration-200"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? ( <Eye className="w-4 h-4" /> ) : ( <EyeOff className="w-4 h-4" /> )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#50ad77] hover:bg-[#419263] disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#50ad77]/10 hover:shadow-[#50ad77]/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Logging In...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}