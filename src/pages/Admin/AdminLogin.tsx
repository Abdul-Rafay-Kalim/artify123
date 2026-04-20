import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate auth delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (login(password)) {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-serif font-bold text-center text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Enter the admin password to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6 italic">
            Default: password is "artify2026"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
