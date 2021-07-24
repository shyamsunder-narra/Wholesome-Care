import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SucessMessageComponent } from '../sucess-message/sucess-message.component';
import { LoadingService } from '../_services/loadingservice.service';
import { PaymentServiceService } from '../_services/payment-service.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';
import { PaymentDetails } from './paymentDetails';
import { PaymentResponse } from './PaymentResponse';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {


  paymentDetails: PaymentDetails;
  paymentResponse: Observable<PaymentResponse> ;
  cardDetails: FormGroup;
  errMessage: string;
  loading$ = this.loader.loading$;
  currentUser: any;
  constructor(private token: TokenStorageService,private userService: UserService,private formBuilder: FormBuilder, public httpClient: HttpClient, public dialog: MatDialog,public router:Router,private activatedRoute: ActivatedRoute,private loader:LoadingService, private paymentService: PaymentServiceService) {

  }


  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    this.paymentDetails = new PaymentDetails();
    this.activatedRoute.queryParams.subscribe((params)=>{
      this.paymentDetails.plan = params.data.split("\"")[1];
      this.paymentDetails.emailId = this.currentUser.email;
    })
    // this.paymentResponse = new PaymentResponse();
    this.createGroup();
  }
createGroup(){
  this.cardDetails = this.formBuilder.group({
    cardNumber: new FormControl(['', [Validators.required, Validators.maxLength(16)]]),
    expMonth: new FormControl('', [Validators.required, Validators.max(12), Validators.min(1)]),
    expYear: new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]),
    cvc: new FormControl('', [Validators.minLength(3), Validators.maxLength(3)])
  });
}
  payCharge() {
    this.loader.show();
    this.paymentDetails.card_number = this.cardDetails.value.cardNumber;
    this.paymentDetails.cvc = this.cardDetails.value.cvc;
    this.paymentDetails.exp_month = this.cardDetails.value.expMonth;
    this.paymentDetails.exp_year = this.cardDetails.value.expYear;

    console.log(this.paymentDetails);
    this.paymentService.makeCharge(this.paymentDetails).subscribe((data) => {
      // this.paymentResponse = data;
      this.loader.hide();
      console.log(data);

      if (data.activeStatus) {
        this.dialog.open(SucessMessageComponent, {
          data:'Successfull'

        });
        sessionStorage.setItem("paymentResponse",JSON.stringify(data));
        
        this.router.navigate(['/questionnaire']);
      }
      else {
        this.dialog.open(SucessMessageComponent, {
          data:'Failure'
        });
        this.router.navigate(['/payment']);
      }
    }, (error) => {
      this.errMessage = error.error.split(";")[0];
    })
    this.paymentDetails = new PaymentDetails();
    this.createGroup();

  }



}
