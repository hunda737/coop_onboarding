import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Loader2, CheckCircle2, User, Phone, Calendar, MapPin } from "lucide-react";
import { wsManager } from "@/lib/websocketManager";
import { useLazyGetFaydaUrlQuery } from "@/features/harmonization/harmonizationApiSlice";
import { useHarmonizationModal } from "@/hooks/use-harmonization-modal";
import { FaydaAuthenticationResult } from "@/lib/websocketManager";

interface Step2FaydaProps {
  onNext?: () => void;
  onBack?: () => void;
}

export const Step2Fayda: FC<Step2FaydaProps> = () => {
  const harmonizationModal = useHarmonizationModal();
  
  const faydaData = harmonizationModal.faydaData;
  const [consent, setConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(!faydaData);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false);

  const [getFaydaUrl, { isLoading: isLoadingUrl }] = useLazyGetFaydaUrlQuery();

  // If faydaData exists, don't show consent screen
  useEffect(() => {
    if (faydaData) {
      setShowConsent(false);
    }
  }, [faydaData]);

  useEffect(() => {
    // Cleanup WebSocket on unmount
    return () => {
      if (wsManager.isConnected()) {
        wsManager.disconnect();
      }
    };
  }, []);

  const handleContinue = async () => {
    if (!consent) {
      toast.error("Please accept the consent to continue");
      return;
    }

    setIsConnecting(true);

    try {
      // Generate random client ID
      const newClientId = Date.now().toString();
      // setClientId(newClientId);

      // Connect to WebSocket (with built-in 30 second timeout)
      console.log("Attempting to connect to WebSocket...");
      try {
        await wsManager.connect(undefined, 30000); // 30 second timeout
        console.log("WebSocket connected successfully");
      } catch (connectError: any) {
        console.error("WebSocket connection error:", connectError);
        toast.error(connectError?.message || "Failed to connect to WebSocket. Please try again.");
        setIsConnecting(false);
        wsManager.disconnect();
        return;
      }

      // Register client
      wsManager.registerClient(newClientId);

      // Set up message listener with authentication timeout
      let authTimeout: NodeJS.Timeout;
      
      const unsubscribe = wsManager.onMessage((message) => {
        if (message.type === "authentication_result") {
          const authResult = message as FaydaAuthenticationResult;
          
          if (authResult.clientId === newClientId && authResult.data) {
            clearTimeout(authTimeout);
            
            // Map WebSocket response to FaydaData interface
            harmonizationModal.setFaydaData({
              id: 0,
              sub: authResult.data.sub || "",
              name: authResult.data.name || "",
              phoneNumber: authResult.data.phone_number || "",
              pictureUrl: authResult.data.picture || "",
              birthdate: authResult.data.birthdate || "",
              gender: authResult.data.gender || "",
              givenName: authResult.data.given_name || "",
              familyName: authResult.data.family_name || "",
              email: authResult.data.email || "",
              addressStreetAddress: authResult.data.address?.street_address || "",
              addressLocality: authResult.data.address?.locality || "",
              addressRegion: authResult.data.address?.region || "",
              addressPostalCode: authResult.data.address?.postal_code || "",
              addressCountry: authResult.data.address?.country || "",
              createdAt: new Date().toISOString(),
            });

            setIsWaitingForAuth(false);
            toast.success("Authentication successful!");
            unsubscribe();
            wsManager.disconnect();
          }
        }
      });
      
      // Set authentication timeout (5 minutes)
      authTimeout = setTimeout(() => {
        if (!harmonizationModal.faydaData) {
          toast.error("Authentication timeout. Please try again.");
          setIsWaitingForAuth(false);
          setShowConsent(true);
          setIsConnecting(false);
          unsubscribe();
          wsManager.disconnect();
        }
      }, 300000);

      // Get Fayda URL
      console.log("Fetching Fayda URL for clientId:", newClientId);
      let response;
      try {
        response = await getFaydaUrl(newClientId).unwrap();
        console.log("Fayda URL received:", response);
      } catch (urlError: any) {
        console.error("Error fetching Fayda URL:", urlError);
        toast.error(urlError?.data?.message || "Failed to get authentication URL. Please try again.");
        setIsConnecting(false);
        setShowConsent(true);
        wsManager.disconnect();
        return;
      }

      if (response.url) {
        // Open popup
        const popup = window.open(
          response.url,
          "FaydaAuth",
          "width=600,height=700,left=100,top=100"
        );

        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          toast.error("Popup blocked! Please allow popups for this site.");
          setIsConnecting(false);
          wsManager.disconnect();
          return;
        }

        // Only hide consent screen after popup opens successfully
        setShowConsent(false);
        setIsConnecting(false);
        setIsWaitingForAuth(true);
      }
    } catch (error: any) {
      console.error("Fayda authentication error:", error);
      toast.error(error?.data?.message || "Failed to start authentication");
      setIsConnecting(false);
      setShowConsent(true);
      wsManager.disconnect();
    }
  };

  // Consent Screen
  if (showConsent && !faydaData) {
    return (
      <div className="space-y-4">
        {/* National ID Verification Description */}
        <div className="border-2 rounded-lg p-4 shadow-sm" style={{ background: "linear-gradient(to right, rgba(13, 176, 241, 0.1), rgba(13, 176, 241, 0.05))", borderColor: "rgba(13, 176, 241, 0.3)" }}>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="rounded-full p-1.5" style={{ backgroundColor: "rgba(13, 176, 241, 0.2)" }}>
                <CheckCircle2 className="h-4 w-4" style={{ color: "#0db0f1" }} />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "#0db0f1" }}>National ID Verification Required</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                To harmonize your account data, we need to verify your identity using your
                National ID (Fayda). This process is secure and will allow us to match and 
                synchronize your account information with your National ID data for accurate 
                harmonization.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why National ID Verification Is Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Accurate identity matching</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Validation of customer information</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Prevention of duplication and fraud</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <span>Improved data integrity and security</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-start gap-3 p-4 border rounded-md">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
          />
          <Label htmlFor="consent" className="cursor-pointer">
            I consent to Cooperative Bank of Oromia accessing my National ID (Fayda) data
            for the purpose of account harmonization and verification. I understand that
            this information will be used securely and in accordance with applicable data
            protection regulations.
          </Label>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleContinue}
            disabled={!consent || isConnecting || isLoadingUrl}
            className="w-full shadow-md"
            style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
            onMouseEnter={(e) => {
              if (!e.currentTarget.disabled && !isConnecting && !isLoadingUrl) {
                e.currentTarget.style.backgroundColor = "#0ba0d8";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.disabled && !isConnecting && !isLoadingUrl) {
                e.currentTarget.style.backgroundColor = "#0db0f1";
              }
            }}
          >
            {(isConnecting || isLoadingUrl) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue with National ID
          </Button>
        </div>
      </div>
    );
  }

  // Waiting for authentication
  if (isWaitingForAuth && !faydaData) {
    return (
      <div className="space-y-6 text-center py-12">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin mx-auto" style={{ color: "#0db0f1" }} />
          <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full border-4 animate-pulse" style={{ borderColor: "#0db0f1", opacity: 0.3 }}></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold" style={{ color: "#0db0f1" }}>Waiting for authentication...</h3>
          <p className="text-gray-600">
            Please complete the authentication process in the popup window.
          </p>
          <p className="text-sm text-gray-500">
            This may take a few moments. Please do not close this window.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsWaitingForAuth(false);
            setShowConsent(true);
            setIsConnecting(false);
            wsManager.disconnect();
          }}
          className="hover:bg-gray-50"
          style={{ borderColor: "#0db0f1", color: "#0db0f1" }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Display Fayda data
  if (faydaData) {
    return (
      <div className="space-y-4">
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
          <div className="inline-block p-3 bg-green-100 rounded-full mb-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-600">Verification Successful!</h2>
          <p className="text-gray-600 mt-2">Your National ID information has been retrieved.</p>
        </div>

        {faydaData.pictureUrl && (
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={faydaData.pictureUrl}
                alt="Profile"
                  className="w-32 h-32 rounded-full border-4 object-cover shadow-lg"
                  style={{ borderColor: "#0db0f1" }}
              />
              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-4 border-white">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: "#0db0f1", borderWidth: "1px", opacity: 0.2 }}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "#0db0f1", opacity: 0.1 }}>
                  <User className="h-5 w-5" style={{ color: "#0db0f1" }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Full Name</p>
                  <p className="font-bold text-gray-900">{faydaData.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                  <p className="font-bold text-gray-900">{faydaData.gender}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-green-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Date of Birth</p>
                  <p className="font-bold text-gray-900">{faydaData.birthdate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-cyan-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone Number</p>
                  <p className="font-bold text-gray-900">{faydaData.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2 shadow-md hover:shadow-lg transition-shadow border-orange-100">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-1">Region</p>
                  <p className="font-bold text-gray-900">{faydaData.addressRegion}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => harmonizationModal.setStep(3)}
            className="px-6 py-2 shadow-md"
            style={{ backgroundColor: "#0db0f1", borderColor: "#0db0f1" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#0ba0d8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0db0f1";
            }}
          >
            Continue to Review
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

