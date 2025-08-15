// types/organization.ts
export interface ExternalOrganizationPayload {
  name: string;
  webhookId: string;
  webhookUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string;
}

export interface ExternalOrganizationUpdatePayload {
  name: string;
  webhookId: string;
  webhookUrl: string;
  status: "ACTIVE" | "INACTIVE";
  createdBy: string; // You might want to rename this to updatedBy in your API
}

export interface ExternalOrganizationResponse {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    orgId?: string;
    name: string;
    webhookId: string;
    webhookUrl: string;
    status: string;
    createdBy: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  error?: string;
}

export interface EditOrganizationApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    id?: string;
    orgId?: string;
    name: string;
    webhookId: string;
    webhookUrl: string;
    status: string;
    createdBy: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  error?: string;
}
