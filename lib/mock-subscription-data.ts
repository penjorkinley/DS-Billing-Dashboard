import type { SubscriptionData } from "@/components/subscription/subscription-overview";

// Mock subscription data for different organizations
export const getMockSubscriptionData = (
  orgId: string | null
): SubscriptionData => {
  const baseRates = {
    singleSignaturePrice: 5,
    multipleSignaturePrice: 8,
  };

  // Different subscription data based on organization
  switch (orgId) {
    case "ORG001": // Ministry of IT - Postpaid Active
      return {
        id: "sub_001",
        organizationName: "Ministry of Information Technology",
        subscriptionType: "postpaid",
        status: "active",
        subscriptionDate: "2023-03-15",
        billingCycle: "quarterly",
        subscriptionEndDate: "2024-06-15",
        currentBillAmount: 15600,
        singleSignaturesUsed: 1250,
        multipleSignaturesUsed: 890,
        lastUsageDate: "2024-01-15T14:30:00Z",
        currentRates: baseRates,
      };

    case "ORG002": // Department of Revenue - Prepaid Low Balance
      return {
        id: "sub_002",
        organizationName: "Department of Revenue & Customs",
        subscriptionType: "prepaid",
        status: "low_balance",
        subscriptionDate: "2023-05-22",
        initialAmount: 50000,
        remainingBalance: 4500,
        lowBalanceThreshold: 5000,
        singleSignaturesUsed: 2100,
        multipleSignaturesUsed: 1200,
        lastUsageDate: "2024-01-14T10:15:00Z",
        currentRates: baseRates,
      };

    case "ORG003": // Digital Bhutan - Postpaid Expiring Soon
      return {
        id: "sub_003",
        organizationName: "Digital Bhutan Corporation",
        subscriptionType: "postpaid",
        status: "active",
        subscriptionDate: "2023-01-10",
        billingCycle: "monthly",
        subscriptionEndDate: "2024-02-10", // Expiring soon
        currentBillAmount: 28500,
        singleSignaturesUsed: 3400,
        multipleSignaturesUsed: 2800,
        lastUsageDate: "2024-01-16T09:45:00Z",
        currentRates: baseRates,
      };

    case "ORG004": // Health Ministry - Prepaid Exhausted
      return {
        id: "sub_004",
        organizationName: "Ministry of Health",
        subscriptionType: "prepaid",
        status: "inactive",
        subscriptionDate: "2023-07-08",
        initialAmount: 25000,
        remainingBalance: 0,
        lowBalanceThreshold: 2500,
        singleSignaturesUsed: 780,
        multipleSignaturesUsed: 450,
        lastUsageDate: "2024-01-05T16:20:00Z",
        currentRates: baseRates,
      };

    case "ORG005": // Education Department - Postpaid Active
      return {
        id: "sub_005",
        organizationName: "Department of Education",
        subscriptionType: "postpaid",
        status: "active",
        subscriptionDate: "2023-04-12",
        billingCycle: "half_yearly",
        subscriptionEndDate: "2024-10-12",
        currentBillAmount: 18900,
        singleSignaturesUsed: 1800,
        multipleSignaturesUsed: 1100,
        lastUsageDate: "2024-01-13T11:30:00Z",
        currentRates: baseRates,
      };

    case "ORG006": // Royal Insurance - Prepaid Active
      return {
        id: "sub_006",
        organizationName: "Royal Insurance Corporation",
        subscriptionType: "prepaid",
        status: "active",
        subscriptionDate: "2023-06-18",
        initialAmount: 40000,
        remainingBalance: 22000,
        lowBalanceThreshold: 5000,
        singleSignaturesUsed: 1600,
        multipleSignaturesUsed: 920,
        lastUsageDate: "2024-01-12T13:15:00Z",
        currentRates: baseRates,
      };

    case "ORG007": // Bhutan Power Corporation - Postpaid Expired
      return {
        id: "sub_007",
        organizationName: "Bhutan Power Corporation",
        subscriptionType: "postpaid",
        status: "expired",
        subscriptionDate: "2023-02-28",
        billingCycle: "yearly",
        subscriptionEndDate: "2024-01-01", // Expired
        currentBillAmount: 35600,
        singleSignaturesUsed: 2200,
        multipleSignaturesUsed: 1750,
        lastUsageDate: "2023-12-28T15:45:00Z",
        currentRates: baseRates,
      };

    case "ORG008": // National Statistics Bureau - Prepaid Active
      return {
        id: "sub_008",
        organizationName: "National Statistics Bureau",
        subscriptionType: "prepaid",
        status: "active",
        subscriptionDate: "2023-09-05",
        initialAmount: 15000,
        remainingBalance: 8200,
        lowBalanceThreshold: 2000,
        singleSignaturesUsed: 420,
        multipleSignaturesUsed: 280,
        lastUsageDate: "2024-01-10T08:30:00Z",
        currentRates: baseRates,
      };

    default:
      // Default subscription data for unknown organizations
      return {
        id: "sub_default",
        organizationName: "Organization",
        subscriptionType: "prepaid",
        status: "active",
        subscriptionDate: "2023-01-01",
        initialAmount: 10000,
        remainingBalance: 5000,
        lowBalanceThreshold: 1000,
        singleSignaturesUsed: 100,
        multipleSignaturesUsed: 50,
        lastUsageDate: "2024-01-15T12:00:00Z",
        currentRates: baseRates,
      };
  }
};

// Helper function to get organization display name
export const getOrganizationDisplayName = (orgId: string | null): string => {
  const orgMap: Record<string, string> = {
    ORG001: "Ministry of Information Technology",
    ORG002: "Department of Revenue & Customs",
    ORG003: "Digital Bhutan Corporation",
    ORG004: "Ministry of Health",
    ORG005: "Department of Education",
    ORG006: "Royal Insurance Corporation",
    ORG007: "Bhutan Power Corporation",
    ORG008: "National Statistics Bureau",
  };

  return orgMap[orgId || ""] || "Unknown Organization";
};
