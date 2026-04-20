import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import loginArt from "@/assets/login-art.jpg";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const redirectUrl =
    import.meta.env.VITE_EMAIL_REDIRECT_URL ||
    `${window.location.origin}/auth/callback`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!" });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { role, first_name: firstName, last_name: lastName },
          },
        });
        if (error) throw error;
        toast({ title: "Check your email", description: "We sent you a verification link." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
        <a href="/" className="font-serif text-3xl font-bold tracking-tight text-foreground mb-12">
          ARTIFY
        </a>

        <h1 className="text-4xl md:text-5xl font-serif font-bold italic text-foreground mb-2 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {isLogin ? "Welcome!" : "Create Account"}
        </h1>
        <p className="text-muted-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.25s" }}>
          {isLogin ? "Enter your email and password to continue." : "Fill in your details to get started."}
        </p>

        {/* Role Toggle */}
        {!isLogin && (
          <div className="flex rounded-full border border-border overflow-hidden mb-6 max-w-md">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                role === "buyer"
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                role === "seller"
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              Seller
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          {!isLogin && (
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-12 rounded-full px-6"
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-12 rounded-full px-6"
              />
            </div>
          )}

          <Input
            type="email"
            placeholder="Type your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-full px-6"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password here"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-full px-6 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-foreground">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-sm text-foreground underline">
                Forgot Password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {loading ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground max-w-md">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-foreground underline font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>

      {/* Right - Art Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={loginArt}
          alt="Digital art"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute top-6 left-6">
          <span className="bg-foreground/30 backdrop-blur-sm text-background text-xs px-4 py-2 rounded-full">
            Curated · Original · Limited
          </span>
        </div>
        <div className="absolute top-6 right-6">
          <span className="text-background/80 text-xs">A Space for Digital Originals</span>
        </div>
        <div className="absolute bottom-12 left-8 right-8">
          <h2 className="text-3xl font-serif italic text-background mb-2">
            Where Digital Art Finds Its Value
          </h2>
          <p className="text-background/70 text-sm">
            Discover, collect, and sell original digital artworks from visionary artists around the world.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
