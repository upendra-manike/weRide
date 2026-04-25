import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }

  async processRefund(paymentIntentId: string) {
    return this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }
}
