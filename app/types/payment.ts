export enum PaymentGateway {
  PAYSTACK = "paystack",
  KORA = "kora",
  CRYPTO = "crypto",
}

export interface PaymentGatewayOption {
  id: PaymentGateway;
  name: string;
  description: string;
  icon: string;
  currencies: string[];
  regions: string[];
  fees: string;
  processingTime: string;
}
