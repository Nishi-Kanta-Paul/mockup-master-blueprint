import { Contract, ContractPrice, Invoice, Product, Subscription, User } from "@/types";

export const products: Product[] = [
  {
    id: "prod_1",
    name: "Advanced React Course",
    description: "Master React with this comprehensive course covering hooks, context, state management, and advanced patterns. Learn to build scalable, efficient React applications with best practices and modern techniques.",
    shortDescription: "Comprehensive React training for developers",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDI3fHx0ZWNobm9sb2d5fGVufDB8fHx8MTY5OTU3Mjk3NXww&ixlib=rb-4.0.3&q=80&w=400",
    regularPrice: 199.99
  },
  {
    id: "prod_2",
    name: "UX/UI Design Masterclass",
    description: "Learn the principles of effective UX/UI design with hands-on projects and industry-standard tools. Create beautiful, user-friendly interfaces that convert visitors into customers.",
    shortDescription: "Create beautiful, user-friendly interfaces",
    category: "Design",
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDR8fGRlc2lnbnxlbnwwfHx8fDE2OTk1NzMwMjN8MA&ixlib=rb-4.0.3&q=80&w=400",
    regularPrice: 149.99
  },
  {
    id: "prod_3",
    name: "Project Management Software",
    description: "Comprehensive project management solution with task tracking, team collaboration, and analytics. Boost your team's productivity with our intuitive software.",
    shortDescription: "Boost team productivity with our PM solution",
    category: "Software",
    imageUrl: "https://images.unsplash.com/photo-1531973819741-e27a5ae2cc7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDExfHxwcm9qZWN0JTIwbWFuYWdlbWVudHxlbnwwfHx8fDE2OTk1NzMwNzl8MA&ixlib=rb-4.0.3&q=80&w=400",
    regularPrice: 29.99
  },
  {
    id: "prod_4",
    name: "Cyber Security Essentials",
    description: "Learn the fundamentals of cyber security, including threat detection, prevention strategies, and security best practices. Protect your digital assets with knowledge from industry experts.",
    shortDescription: "Protection strategies from security experts",
    category: "Security",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDZ8fGN5YmVyJTIwc2VjdXJpdHl8ZW58MHx8fHwxNjk5NTczMTIxfDA&ixlib=rb-4.0.3&q=80&w=400",
    regularPrice: 179.99
  },
];

export const users: User[] = [
  {
    id: "user_1",
    name: "John Doe",
    email: "john@example.com",
    role: "individual",
    verified: true
  },
  {
    id: "user_2",
    name: "Jane Smith",
    email: "jane@acme.corp",
    role: "corporate",
    verified: true
  },
  {
    id: "user_3",
    name: "Admin User",
    email: "admin@system.com",
    role: "admin",
    verified: true
  }
];

export const subscriptions: Subscription[] = [
  {
    id: "sub_1",
    userId: "user_1",
    productId: "prod_1",
    product: products[0],
    startDate: "2023-01-15",
    nextBillingDate: "2023-02-15",
    status: "active",
    price: 199.99
  },
  {
    id: "sub_2",
    userId: "user_1",
    productId: "prod_3",
    product: products[2],
    startDate: "2023-03-10",
    nextBillingDate: "2023-04-10",
    status: "active",
    price: 29.99
  }
];

export const invoices: Invoice[] = [
  {
    id: "inv_1",
    subscriptionId: "sub_1",
    productName: "Advanced React Course",
    billingDate: "2023-01-15",
    amount: 199.99,
    status: "paid"
  },
  {
    id: "inv_2",
    subscriptionId: "sub_2",
    productName: "Project Management Software",
    billingDate: "2023-03-10",
    amount: 29.99,
    status: "paid"
  },
  {
    id: "inv_3",
    subscriptionId: "sub_1",
    productName: "Advanced React Course",
    billingDate: "2023-02-15",
    amount: 199.99,
    status: "pending"
  }
];

export const contracts: Contract[] = [
  {
    id: "contract_1",
    corporateName: "Acme Corporation",
    effectiveDate: "2023-01-01",
    expirationDate: "2024-01-01",
    status: "active"
  }
];

export const contractPrices: ContractPrice[] = [
  {
    id: "price_1",
    contractId: "contract_1",
    productId: "prod_1",
    price: 149.99,
    effectiveDate: "2023-01-01"
  },
  {
    id: "price_2",
    contractId: "contract_1",
    productId: "prod_2",
    price: 99.99,
    effectiveDate: "2023-01-01"
  }
];
