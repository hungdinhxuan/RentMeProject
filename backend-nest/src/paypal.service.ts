import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PayPalService {
  private readonly PAYPAL_CLIENT_ID;
  private readonly PAYPAL_CLIENT_SECRET;
  private readonly PAYPAL_BASE_URL;
  constructor(private readonly configService: ConfigService) {
    this.PAYPAL_CLIENT_ID = this.configService.get<string>('PAYPAL_CLIENT_ID');
    this.PAYPAL_CLIENT_SECRET = this.configService.get<string>(
      'PAYPAL_CLIENT_SECRET',
    );
    this.PAYPAL_BASE_URL = this.configService.get<string>('PAYPAL_BASE_URL');
  }

  public async createOrder(
    amount: number, 
    currency: number,
    description: string,
    platform_fee: number
  ) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.PAYPAL_BASE_URL}/v2/checkout/orders`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
              description: description,
            },
            payment_instruction: {
              platform_fees: [
                {
                  amount: {
                    currency_code: currency,
                    value: platform_fee,
                  },
                },
              ],
            },
          },
        ],
      }),
    });
    return await response.json();
  }

  public async capturePayment(orderId) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return await response.json();
  }

  private async generateAccessToken() {
    const auth = Buffer.from(
      this.PAYPAL_CLIENT_ID + ':' + this.PAYPAL_CLIENT_SECRET,
    ).toString('base64');
    const response = await fetch(`${this.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    const {access_token} = await response.json();
    return access_token;
  }
}
