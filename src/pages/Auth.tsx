import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wind, Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const success = await login(formData.email, formData.password);
      if (success) navigate("/");
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      const success = await register(formData.name, formData.email, formData.password);
      if (success) navigate("/");
    }
  };

  const InputField = ({
    icon: Icon,
    label,
    type,
    field,
    placeholder,
    extra,
  }: {
    icon: typeof Mail;
    label: string;
    type: string;
    field: keyof typeof formData;
    placeholder: string;
    extra?: React.ReactNode;
  }) => (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={field === "password" || field === "confirmPassword" ? (showPassword ? "text" : "password") : type}
          value={formData[field]}
          onChange={(e) => update(field, e.target.value)}
          required
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
        />
        {extra}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(220,30%,8%)] to-[hsl(199,60%,20%)] flex items-center justify-center px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="gradient-brand px-8 py-8 text-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wind className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {mode === "login"
              ? "Sign in to your CoolAir account"
              : "Join CoolAir for exclusive deals"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={cn(
                "flex-1 py-3 text-sm font-semibold transition-colors capitalize",
                mode === m
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {mode === "register" && (
            <InputField
              icon={User}
              label="Full Name"
              type="text"
              field="name"
              placeholder="Rahul Kumar"
            />
          )}

          <InputField
            icon={Mail}
            label="Email Address"
            type="email"
            field="email"
            placeholder="you@example.com"
          />

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => update("password", e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background"
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Demo Hint */}
          {mode === "login" && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground">
              <strong>Demo account:</strong> arun@example.com / password123
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-brand text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-primary font-semibold hover:underline"
            >
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
