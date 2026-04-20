import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Supabase automatically parses the hash parameters
        // Just wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User verified successfully, redirect to home
          navigate("/", { replace: true });
        } else {
          // No session, redirect to login
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-foreground text-lg">Verifying your email...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
