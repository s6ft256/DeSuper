import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { sound } from "../utils/audio";
import { Mail, Lock, User, Eye, EyeOff, Zap } from "lucide-react";

function Scene() {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[2, 1]} />
          <MeshDistortMaterial
            color="#0f172a"
            emissive="#06b6d4"
            emissiveIntensity={0.2}
            wireframe
            distort={0.3}
            speed={2}
          />
        </mesh>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0f172a" wireframe transparent opacity={0.1} />
      </mesh>

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export const Auth3D: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    sound.playKeyClick();

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
      sound.playLevelUp();
      onAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    sound.playKeyClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 w-full max-w-md p-4 sm:p-6">
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-cyan-500/20 blur-xl opacity-60" />
        <div className="relative p-8 rounded-3xl bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_8px_60px_rgba(6,182,212,0.15),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-cyan-400/30 blur-md" />
              <img src="/favicon.png" alt="DeSuper" className="relative w-8 h-8 rounded-lg" />
            </div>
            <h1 className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              DE SUPER
            </h1>
          </div>

          <p className="text-center text-xs font-mono text-slate-300/80 mb-8 tracking-widest uppercase">
            {isSignUp ? "Initialize your operative profile" : "Access the mainframe"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-focus-within:from-cyan-500/40 group-focus-within:to-purple-500/40 blur-sm transition-all duration-300" />
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Callsign (optional)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="relative w-full pl-10 pr-4 py-2.5 bg-transparent border border-white/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-transparent transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-focus-within:from-cyan-500/30 group-focus-within:to-purple-500/30 blur-sm transition-all duration-300" />
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                type="email"
                placeholder="operative@desuper.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="relative w-full pl-10 pr-4 py-2.5 bg-transparent border border-white/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-transparent transition-all"
              />
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/0 to-purple-500/0 group-focus-within:from-cyan-500/30 group-focus-within:to-purple-500/30 blur-sm transition-all duration-300" />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="relative w-full pl-10 pr-10 py-2.5 bg-transparent border border-white/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-white/[0.03] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/[0.08] border border-rose-400/20 text-rose-300 text-xs font-mono backdrop-blur-sm">
                {error}
              </div>
            )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3 mt-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 disabled:from-cyan-500/10 disabled:to-purple-500/10 border border-cyan-400/25 hover:border-cyan-400/40 text-cyan-200 font-bold font-mono text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-[0_4px_20px_rgba(6,182,212,0.1),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.2),inset_0_1px_0_rgba(255,255,255,0.15)]"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 to-purple-400/0 group-hover:from-cyan-400/10 group-hover:to-purple-400/10 transition-all duration-300" />
                {loading ? (
                  <span className="relative w-4 h-4 border-2 border-white/30 border-t-cyan-300 rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="relative w-4 h-4" />
                    <span className="relative">{isSignUp ? "[ INITIALIZE ]" : "[ ACCESS MAINFRAME ]"}</span>
                  </>
                )}
              </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-xs font-mono text-cyan-400/80 hover:text-cyan-300 transition-colors hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            >
              {isSignUp ? "Already have access? Sign in" : "New operative? Initialize profile"}
            </button>
          </div>

          <p className="text-[10px] font-mono text-slate-500/70 text-center mt-4">
            Secured by Supabase Auth • End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};
