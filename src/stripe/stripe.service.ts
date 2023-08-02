import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Stripe from 'stripe';
import { IUserEntity } from '../user/entities/user.entity';
import { ChargeDto } from './dto/charge.dto';

@Injectable()
export class StripeService implements IStripeService {
  private readonly stripeSecret: string;
  private readonly stripeProductId: string;
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripeSecret = this.configService.get<string>('STRIPE_PRIVATE_KEY');
    this.stripeProductId = this.configService.get<string>('STRIPE_PRODUCT_ID');
    this.stripe = new Stripe(this.stripeSecret, { apiVersion: null });
  }

  async createCustomer(email: string, userId: string) {
    return await this.stripe.customers.create({ email, metadata: { userId } });
  }

  async getCustomer(email: string) {
    return await this.stripe.customers.search({ query: `email:\"${email}\"` });
  }

  async getInfo(stripeId: string) {
    return await this.stripe.customers.retrieve(stripeId);
  }

  async retrievePrice(priceId: string) {
    return await this.stripe.prices.retrieve(priceId);
  }

  async getPrices() {
    return await this.stripe.prices.search({
      query: `
      product:\"${this.stripeProductId}\" 
      AND active:\'true\' 
      `
    });
  }

  async getCustomPrices(userId: string) {
    return await this.stripe.prices.search({
      query: `
      product:\"${this.stripeProductId}\" 
      AND active:\'true\' 
      AND metadata[\'userId\']:\'${userId}\'
      `
    });
  }

  async charge(user: IUserEntity, data: ChargeDto) {
    return await this.stripe.checkout.sessions.create({
      success_url: data.success,
      cancel_url: data.cancel,
      mode: 'payment',
      customer: user.stripeId,
      line_items: [
        { price: data.priceId, quantity: data.quantity }
      ],
      metadata: {
        userId: user.id,
        email: user.userName,
        priceId: data.priceId
      }
    })
  }

}

export interface IStripeService {
  createCustomer(email: string, userId: string): Promise<Stripe.Response<Stripe.Customer>>;
  getCustomer(email: string): Promise<Stripe.ApiSearchResultPromise<Stripe.Customer> & any>;
  getInfo(stripeId: string): Promise<Stripe.ApiSearchResultPromise<Stripe.Customer> & any>;
  getPrices(): Promise<Stripe.ApiSearchResultPromise<Stripe.Price> & any>;
  retrievePrice(priceId: string): Promise<Stripe.Response<Stripe.Price>>
  getCustomPrices(userId: string): Promise<Stripe.ApiSearchResultPromise<Stripe.Price> & any>;
  charge(user: IUserEntity, data: ChargeDto): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}