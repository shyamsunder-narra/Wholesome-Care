import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ListComponent } from '../list/list.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { CustomizedPlanComponent } from '../customized-plan/customized-plan.component';
import { Router } from '@angular/router';
import { NotificationModel } from './NotificationModel';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { ShowNotificationComponent } from '../show-notification/show-notification.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { UserProfile } from './UserProfile';
import { ChartType } from 'chart.js';
import { MultiDataSet ,Label, Color} from 'ng2-charts';
import { TokenStorageService } from '../_services/token-storage.service';
// import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  myDate = new Date();
  latestDate:string;
  constructor(private tokenStorageService: TokenStorageService,private _http:HttpClient, private matDialog: MatDialog, private router:Router, private matSnackBar:MatSnackBar, private datePipe: DatePipe) {
    this.latestDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if(this.tokenStorageService.getToken()!=null){
  //     this.isLoggedIn = true;
  //   }

  //   if(sessionStorage.getItem('followSnackBar')!=null){
  //   this.matSnackBar.open(`You have successfully followed ${sessionStorage.getItem('followSnackBar')}`, '', {
  //     duration: 2000,
  //     verticalPosition: 'top',
  //     panelClass: ['blue-snackbar']
  //   });
  //   sessionStorage.removeItem('followSnackBar');
  //  }
  //   if(sessionStorage.getItem('unFollowSnackBar')!=null){
  //     this.matSnackBar.open(`You have successfully unfollowed ${sessionStorage.getItem('unFollowSnackBar')}`, '', {
  //       duration: 2000,
  //       verticalPosition: 'top',
  //       panelClass: ['blue-snackbar']
  //     });
  //     sessionStorage.removeItem('unFollowSnackBar');
  //   }
  //   this.connect();
  //     this._http.get<UserProfile>(`http://localhost:8082/api/v1/userProfile?email=${this.userName.email}`).subscribe(data=>{
  //       this.userDetails=data;
  //       this.secondUser=this.userDetails;
  //       this.dayToday=this.userDetails.days.length;
  //       if(sessionStorage.getItem('physicalScore')!=null){
  //         this.physicalScore = JSON.parse(sessionStorage.getItem('physicalScore'));
  //       } else{
  //         this.physicalScore=this.getScoreAccordingToColour(this.userDetails.physicalLevel);
  //         sessionStorage.setItem('physicalScore', JSON.stringify(this.physicalScore));
  //       }
  //       if(sessionStorage.getItem('mentalScore')!=null){
  //         this.mentalScore = JSON.parse(sessionStorage.getItem('mentalScore'));
  //       } else{
  //         this.mentalScore=this.getScoreAccordingToColour(this.userDetails.mentalLevel);
  //         sessionStorage.setItem('mentalScore', JSON.stringify(this.mentalScore));
  //       }
  //       if(sessionStorage.getItem('dietScore')!=null){
  //         this.dietScore = JSON.parse(sessionStorage.getItem('dietScore'));
  //       } else{
  //         this.dietScore=this.getScoreAccordingToColour(this.userDetails.dietLevel);
  //         sessionStorage.setItem('dietScore', JSON.stringify(this.dietScore));
  //       }
  //       this.todayPlan = data.days.find(day=>day.localDate===this.latestDate);
  //       this.todayDate=this.todayPlan.localDate;
  //       if(sessionStorage.getItem('to do')!=null){
  //         this.todo = JSON.parse(sessionStorage.getItem('to do'));
  //       } else{
  //         this.todo = this.todayPlan.plan.activities;
  //       }
  //       if(sessionStorage.getItem('done')!=null){
  //         this.done =JSON.parse(sessionStorage.getItem('done'));
  //       } else {
  //         this.done = this.todayPlan.plan.activitiesDone;
  //       }
  //     });
  //     this._http.get<Array<any>>(`http://localhost:8097/api/v1/graph-query/suggestions?email=${this.userName.email}`).subscribe(data=>{
  //         this.suggestions=data;
  //         this.suggestionLength=this.suggestions.length;
  //     });
  //     this._http.get<Array<any>>(`http://localhost:8097/api/v1/graph-query/followers?email=${this.userName.email}`).subscribe(data=>{
  //         this.followers=data;
  //         this.followersLength=this.followers.length;
  //     });
  //     this._http.get<Array<any>>(`http://localhost:8097/api/v1/graph-query/following?email=${this.userName.email}`).subscribe(data=>{
  //       this.following=data;
  //       this.followingLength=this.following.length;
  //     });
  //     if(sessionStorage.getItem('doneTask')!=null){
  //       this.doneTaskActivities=sessionStorage.getItem('doneTask');
  //     }
  //     if(sessionStorage.getItem('waterIntake')!=null){
  //       this.waterIntake=JSON.parse(sessionStorage.getItem('waterIntake'));
  //     }
  //     if(sessionStorage.getItem('waterGlass')!=null){
  //       this.waterGlass=JSON.parse(sessionStorage.getItem('waterGlass'));
  //     }
  //     if(sessionStorage.getItem('sleep')!=null){
  //       this.sleep=JSON.parse(sessionStorage.getItem('sleep'));
  //     }
  //     if(sessionStorage.getItem('hourSleep')!=null){
  //       this.hourSleep=JSON.parse(sessionStorage.getItem('hourSleep'));
  //     }
  // }

  // beltColors=['yellow','orange','violet','brown','black'];
  userDetails:UserProfile;
  todo:Array<any>=[];
  done:Array<any>=[];
  followerMap=new Map();
  isLoggedIn = false;
  userName:{displayName:string, email:string, role:string}=JSON.parse(sessionStorage.getItem("auth-user"));
  // userName:{displayName:string, email:string, role:string} = {displayName : 'hema',email :'h@gmail.com', role:'ROLE_USER'};
  suggestions:Array<any>;
  followers:Array<any>;
  following:Array<any>;
  followersLength:number;
  followingLength:number;
  suggestionLength:number;
  todowork:Array<any>=[];
  secondUser;
  stompClient = null;
  days:Array<{localDate:string, plan:{activities:Array<any>, activitiesDone:Array<any>, diet_plan:any}}>;
  todayDate:string;
  waterIntake=0;
  waterGlass=0;
  todayPlan:{localDate:string, plan:{activities:Array<any>, activitiesDone:Array<any>, diet_plan:any}};
  doneTaskActivities=null;
  todayDietPlan;
  noOfDay:String;
  sleep=0;
  hourSleep=0;
  dayToday;
  private datasets = [
    {
        data: [1,1,1,1,1],
          backgroundColor:['red','yellow','blue','orange','green'] ,
          label: 'My dataset',
          borderWidth: 0
    }
  ];
  private labels = [];
  private options = {
    cutoutPercentage: 80,
    tooltips: {
      enabled: false
    }
  };
  ngOnInit(): void {
    if(this.tokenStorageService.getToken()!=null){
      this.isLoggedIn = true;
    }

    if(sessionStorage.getItem('followSnackBar')!=null){
    this.matSnackBar.open(`You have successfully followed ${sessionStorage.getItem('followSnackBar')}`, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
    sessionStorage.removeItem('followSnackBar');
   }
    if(sessionStorage.getItem('unFollowSnackBar')!=null){
      this.matSnackBar.open(`You have successfully unfollowed ${sessionStorage.getItem('unFollowSnackBar')}`, '', {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['blue-snackbar']
      });
      sessionStorage.removeItem('unFollowSnackBar');
    }
    this.connect();
      this._http.get<UserProfile>(`http://localhost:8082/api/v1/userProfile?email=${this.userName.email}`).subscribe(data=>{
        this.userDetails=data;
        this.secondUser=this.userDetails;
        this.dayToday=this.userDetails.days.length;
        // if(sessionStorage.getItem('physicalScore')!=null){
        //   this.physicalScore = JSON.parse(sessionStorage.getItem('physicalScore'));
        // } else{
        //   this.physicalScore=this.getScoreAccordingToColour(this.userDetails.physicalLevel);
        //   sessionStorage.setItem('physicalScore', JSON.stringify(this.physicalScore));
        // }
        // if(sessionStorage.getItem('mentalScore')!=null){
        //   this.mentalScore = JSON.parse(sessionStorage.getItem('mentalScore'));
        // } else{
        //   this.mentalScore=this.getScoreAccordingToColour(this.userDetails.mentalLevel);
        //   sessionStorage.setItem('mentalScore', JSON.stringify(this.mentalScore));
        // }
        // if(sessionStorage.getItem('dietScore')!=null){
        //   this.dietScore = JSON.parse(sessionStorage.getItem('dietScore'));
        // } else{
        //   this.dietScore=this.getScoreAccordingToColour(this.userDetails.dietLevel);
        //   sessionStorage.setItem('dietScore', JSON.stringify(this.dietScore));
        // }
        this.todayPlan = data.days.find(day=>day.localDate===this.latestDate);
        this.todayDate=this.todayPlan.localDate;
        if(sessionStorage.getItem('to do')!=null){
          this.todo = JSON.parse(sessionStorage.getItem('to do'));
        } else{
          this.todo = this.todayPlan.plan.activities;
        }
        if(sessionStorage.getItem('done')!=null){
          this.done =JSON.parse(sessionStorage.getItem('done'));
        } else {
          this.done = this.todayPlan.plan.activitiesDone;
        }
      });
      this._http.get<Array<any>>(`http://localhost:8097/api/v1/suggestions?email=${this.userName.email}`).subscribe(data=>{
          this.suggestions=data;
          this.suggestionLength=this.suggestions.length;
      });
      this._http.get<Array<any>>(`http://localhost:8097/api/v1/followers?email=${this.userName.email}`).subscribe(data=>{
          this.followers=data;
          this.followersLength=this.followers.length;
      });
      this._http.get<Array<any>>(`http://localhost:8097/api/v1/following?email=${this.userName.email}`).subscribe(data=>{
        this.following=data;
        this.followingLength=this.following.length;
      });
      if(sessionStorage.getItem('doneTask')!=null){
        this.doneTaskActivities=sessionStorage.getItem('doneTask');
      }
      if(sessionStorage.getItem('waterIntake')!=null){
        this.waterIntake=JSON.parse(sessionStorage.getItem('waterIntake'));
      }
      if(sessionStorage.getItem('waterGlass')!=null){
        this.waterGlass=JSON.parse(sessionStorage.getItem('waterGlass'));
      }
      if(sessionStorage.getItem('sleep')!=null){
        this.sleep=JSON.parse(sessionStorage.getItem('sleep'));
      }
      if(sessionStorage.getItem('hourSleep')!=null){
        this.hourSleep=JSON.parse(sessionStorage.getItem('hourSleep'));
      }
  }
  updated:boolean=false;
  updateProfile(){
    let days:Array<{localDate:string, plan:{activities:Array<any>, activitiesDone:Array<any>, diet_plan:any}}>;
    days=this.userDetails.days;
    let todayPlan:{localDate:string, plan:{activities:Array<any>, activitiesDone:Array<any>, diet_plan:any}};
    todayPlan = days.find(day=>day.localDate===this.latestDate);
    let index = days.indexOf(todayPlan);
    if(sessionStorage.getItem('to do')!=null){
      todayPlan.plan.activities = JSON.parse(sessionStorage.getItem('to do'));
    } else{
      todayPlan.plan.activities;
    }
    if(sessionStorage.getItem('done')!=null){
      todayPlan.plan.activitiesDone =JSON.parse(sessionStorage.getItem('done'));
    } else {
      todayPlan.plan.activitiesDone;
    }
    days[index]=todayPlan;
    let updatedProfile:UserProfile=new UserProfile(this.userDetails.email, this.userDetails.name, this.userDetails.creationDate,
      this.userDetails.age, this.userDetails.place, this.userDetails.imageUrl, this.userDetails.planType,
       this.userDetails.physicalLevel, this.userDetails.mentalLevel, this.userDetails.dietLevel, this.userDetails.followers,
       this.userDetails.following, this.userDetails.mentorList, this.userDetails.plan, days);
       this._http.put<UserProfile>(`http://localhost:8082/api/v1/updateProfile`,updatedProfile).subscribe(
         data=>{
           this.updated=true;
           console.log(data);
          });
      // window.location.reload();
      // sessionStorage.setItem('doneTask', 'doneTasks');
  }
  connect() {
    const socket = new SockJS('http://localhost:8099/our-websocket');
    this.stompClient = Stomp.over(socket);
    const _this = this;
    this.stompClient.connect({}, function (frame) {
      console.log('Connected: ' + frame);
        _this.stompClient.subscribe('/topic/notifyWithDoneTask', function(hello){
        _this.notifying(JSON.parse(hello.body));
        _this.showMessageUserProfile(JSON.parse(hello.body));
      });
   });
}
recievedNotification:boolean=false;
audio=new Audio('../../assets/audio/notification.wav')
notifying(message:{name:string, activitiesDoneList:Array<any>}){
  if(this.userName.displayName!=message.name){
    this.recievedNotification=true;
    this.audio.play();
  }
}
notifyOthersWihYourTaskDone(){
  sessionStorage.removeItem('doneTask');
      this.doneTaskActivities=null;
      this.matSnackBar.open(`You have successfully informed others with your done task`, '', {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['blue-snackbar']
    });
    this.stompClient.send("/ws/doneTask", {}, "Hello");
    this.updated=false;
}
emittedData(data){
  this.ngOnInit();
}
doneUpdatedList:{name:string, activitiesDoneList:Array<any>};
showMessageUserProfile(message:{name:string, activitiesDoneList:Array<any>}){
  this.doneUpdatedList=message;
}
seenNotification:boolean=false;
showNotification(){
  this.seenNotification=true;
  this.matDialog.open(ShowNotificationComponent, {
    width      : '90%',
    height     : '320px',
    minWidth : '300px',
    maxWidth: '500px',
    hasBackdrop: true,
    data       : this.doneUpdatedList,
    panelClass: ['dialogBoxNotification']
  });
  this.recievedNotification=false;
}
showPlan(){
  this.matDialog.open(CustomizedPlanComponent, {
    width      : '70%',
    height     : '80vh',
    hasBackdrop: true,
    maxHeight  : '700px',
    data       : this.userDetails.plan,
    panelClass: ['dialogBoxPlan']
  });
}
// getScoreAccordingToColour(color:string){
//   if(color==='yellow'){
//     return Math.floor(Math.random() * (25 - 0 + 1) + 0);
//   } else if(color==='orange'){
//     return Math.floor(Math.random() * (50 - 25 + 1) + 25);
//   } else if(color==='violet'){
//     return Math.floor(Math.random() * (75 - 50 + 1) + 50);
//   } else if(color==='brown'){
//     return Math.floor(Math.random() * (90 - 75 + 1) + 75);
//   } else {
//     return Math.floor(Math.random() * (100 - 90 + 1) + 90);
//   }
// }
  openListFollowers(){
    this.matDialog.open(ListComponent, {
      width      : '70%',
      height     : '80vh',
      hasBackdrop: true,
      maxHeight  : '700px',
      data       : {users: this.followers, userType: 'followers', email:this.userDetails.email},
      panelClass: ['dialogBoxPlan']
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  openListFollowing(){
    this.matDialog.open(ListComponent, {
      width      : '70%',
      height     : '80vh',
      hasBackdrop: true,
      maxHeight  : '700px',
      data       : {users: this.following, userType: 'following', email:this.userDetails.email},
      panelClass: ['dialogBoxPlan']
    }).afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  sessionStorage.setItem('to do', JSON.stringify(this.todo));
  sessionStorage.setItem('done', JSON.stringify(this.done));
  }
  showProfile(){
    this.router.navigate(['userProfile']);
    // window.location.reload();
  }
  addWater(){
    if(this.waterIntake<100){
      this.waterIntake+=10;
      this.waterGlass++;
      sessionStorage.setItem('waterIntake', JSON.stringify(this.waterIntake));
      sessionStorage.setItem('waterGlass', JSON.stringify(this.waterGlass));
    }
  }
  minusWater(){
    if(this.waterIntake>0){
      this.waterIntake-=10;
      this.waterGlass--;
      sessionStorage.setItem('waterIntake', JSON.stringify(this.waterIntake));
      sessionStorage.setItem('waterGlass', JSON.stringify(this.waterGlass));
    }
  }
  addSleep(){
    if(this.sleep<100){
      this.sleep+=12.5;
      this.hourSleep++;
      sessionStorage.setItem('sleep', JSON.stringify(this.sleep));
      sessionStorage.setItem('hourSleep', JSON.stringify(this.hourSleep));
    }
  }
  minusSleep(){
    if(this.sleep>0){
      this.sleep-=12.5;
      this.hourSleep--;
      sessionStorage.setItem('sleep', JSON.stringify(this.sleep));
      sessionStorage.setItem('hourSleep', JSON.stringify(this.hourSleep));
    }
  }
  lowestIndex=0;
  greatestIndex=2;
  viewMore(){
    this.lowestIndex+=2;
    this.greatestIndex+=2;
  }
  viewPrev(){
    this.lowestIndex-=2;
    this.greatestIndex-=2;
  }
  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
