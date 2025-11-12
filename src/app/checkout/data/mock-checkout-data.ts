import { Address, PaymentMethod } from '@/shared/types/api.types';

// Mock addresses for checkout
export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Domicile',
    streetAddress: '123 Rue de la République',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: '75001',
    country: 'France',
    isDefault: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'addr-2',
    label: 'Bureau',
    streetAddress: '456 Avenue des Champs-Élysées',
    city: 'Paris',
    state: 'Île-de-France',
    postalCode: '75008',
    country: 'France',
    isDefault: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock payment methods for checkout
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    type: 'card',
    provider: 'Visa',
    last4: '4242',
    cardBrand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pm-2',
    type: 'card',
    provider: 'Mastercard',
    last4: '5555',
    cardBrand: 'mastercard',
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pm-3',
    type: 'paypal',
    provider: 'PayPal',
    isDefault: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Payment simulation results
export const simulatePayment = async (): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate random payment failures (10% chance)
  const shouldFail = Math.random() < 0.1;

  if (shouldFail) {
    return {
      success: false,
      error: 'Payment declined. Please try another payment method.',
    };
  }

  return {
    success: true,
    transactionId: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
};
