export type UserRole = "individual" | "corporate" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added password field
  role: UserRole;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  imageUrl: string;
  regularPrice: number;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  startDate: string;
  nextBillingDate: string;
  status: "active" | "canceled" | "expired";
  price: number;
}

export interface Invoice {
  id: string;
  subscriptionId: string;
  productName: string;
  billingDate: string;
  amount: number;
  status: "paid" | "pending" | "failed";
}

export interface Contract {
  id: string;
  corporateName: string;
  effectiveDate: string;
  expirationDate: string;
  status: "active" | "expired";
}

export interface ContractPrice {
  id: string;
  contractId: string;
  productId: string;
  price: number;
  effectiveDate: string;
  expirationDate?: string; // New field for contract price expiration
}

// New interfaces for enhanced corporate pricing management
export interface CorporateClient {
  id: string;
  name: string;
  contactEmail: string;
  contactName: string;
  status: "active" | "inactive";
}

export interface PriceHistory {
  id: string;
  contractId: string;
  productId: string;
  price: number;
  effectiveDate: string;
  expirationDate?: string;
  createdAt: string;
}
