// types/organization.ts
export interface ExternalOrganizationPayload {
  name: string;
  webhookId: string;
  webhookUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string;
}

export interface ExternalOrganizationResponse {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    name: string;
    webhookId: string;
    webhookUrl: string;
    status: string;
    createdBy: string;
    createdAt?: string;
    updatedAt?: string;
  };
  error?: string;
}
