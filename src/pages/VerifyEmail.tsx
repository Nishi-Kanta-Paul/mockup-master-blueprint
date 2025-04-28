
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { verifyEmail } from "@/lib/auth";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const token = searchParams.get("token");
  
  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setError("Invalid verification link. No token provided.");
      return;
    }
    
    verifyEmail(token)
      .then((success) => {
        setVerifying(false);
        setVerified(success);
      })
      .catch((err) => {
        setVerifying(false);
        setError(err.message || "Failed to verify email.");
      });
  }, [token]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-subscription-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              We're confirming your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            {verifying && (
              <>
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <p className="text-lg font-medium">Verifying your email...</p>
              </>
            )}
            
            {!verifying && verified && (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <p className="text-lg font-medium mb-6">Email verified successfully!</p>
                <Button onClick={() => navigate("/login")}>
                  Continue to Login
                </Button>
              </>
            )}
            
            {!verifying && error && (
              <>
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <p className="text-lg font-medium mb-2">Verification Failed</p>
                <p className="text-gray-500 mb-6 text-center">{error}</p>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Back to Login
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
