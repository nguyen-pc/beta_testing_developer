import React, { createContext, useState, useContext } from "react";

interface CampaignContextType {
  campaignId: string | null;
  setCampaignId: (id: string | null) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaignId, setCampaignId] = useState<string | null>(null);

  return (
    <CampaignContext.Provider value={{ campaignId, setCampaignId }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaignContext = () => {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error("useCampaignContext must be used within CampaignProvider");
  return ctx;
};
