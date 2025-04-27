
export type UserRole = "individual" | "corporate" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
}
