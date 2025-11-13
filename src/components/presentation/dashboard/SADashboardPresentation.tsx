import * as React from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import "./superset.css";

const SupersetInstanceUrl = "http://10.2.125.7:8089";

const Superset = () => {
  const fetchGuestTokenFromBackend = async () => {
    const resp = await axios.get("http://10.2.125.7:8000/genGuestToken?id=45");
    return resp.data;
  };

  React.useEffect(() => {
    const container = document.getElementById("my-superset-container");
    if (!container) return;

    embedDashboard({
      id: "b598577c-2e4e-40bd-9443-327abde21a19",
      supersetDomain: SupersetInstanceUrl,
      mountPoint: container,
      fetchGuestToken: async () => fetchGuestTokenFromBackend(),
      dashboardUiConfig: {
        filters: {
          expanded: false,
        },
      },
    });
  }, []);

  return <div id="my-superset-container" className="w-screen"></div>;
};

export default Superset;
