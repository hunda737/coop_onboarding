import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster
      containerStyle={{ position: "fixed", zIndex: 2147483647 }}
      toastOptions={{
        style: { position: "relative", zIndex: 2147483647 },
      }}
    />
  );
};
