import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentDetails } from '../payment/paymentDetails';
import { PaymentResponse } from '../payment/PaymentResponse';
@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {

  constructor(public httpClient: HttpClient) { }
  makeCharge(paymentDetail: PaymentDetails): Observable<PaymentResponse> {
    return this.httpClient.post<PaymentResponse>('http://localhost:8096/api/v1/payment/charge', paymentDetail);
  }
}
