import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

form: any = new FormGroup({
    email:new FormControl(''),
    name: new FormControl('', Validators.required),
    age: new FormControl(''),
    place: new FormControl(''),
    creationDate: new FormControl(''),
    days: new FormControl(''),
    mentorList:new FormControl(''),
    appointments:new FormControl(''),

  });
  constructor(private http:HttpClient) { }
  API='http://localhost:8082/api/v1'

public updateUserByEmail(userProfile){
  console.log(userProfile);
  return this.http.put(this.API+'/update', userProfile).subscribe((data)=>{
    // this.form = data;
    // window.location.reload();
      });
}
  // updateEmployee(employee) {
  //   this.employeeList.update(employee.$key,
  //     {
  //       fullName: employee.fullName,
  //       email: employee.email,
  //       mobile: employee.mobile,
  //       city: employee.city,
  //       gender: employee.gender,
  //       department: employee.department,
  //        hireDate: employee.hireDate == "" ? "" : this.datePipe.transform(employee.hireDate, 'yyyy-MM-dd'),
  //       isPermanent: employee.isPermanent
  //     });
  // }

 populateForm(userdata) {
    this.form.setValue(_.omit(userdata,['imageUrl','physicalLevel','mentalLevel','dietLevel','physicalScore','mentalScore','dietScore','followers','following','plan','date','planType']));
  }
}

