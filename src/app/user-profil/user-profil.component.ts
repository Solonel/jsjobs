import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { JobService } from '../services/job.service';

@Component({
  selector: 'solonel-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css']
})
export class UserProfilComponent implements OnInit {
  jbbToken
  decodedToken = null;
  isAdmin = false;
  email = "";
  jobs = [];
  jobsTitle = "";
  constructor(private authService: AuthService, private jobService: JobService) { }

  ngOnInit() {
    if (this.authService.userIsLoggedIn()) {
      this.jbbToken = JSON.parse(localStorage.getItem('jbb-data'));
      this.decodedToken = this.authService.decodeToken(this.jbbToken.token);
      this.email = this.decodedToken.email;
      console.log(this.email);
      if (this.decodedToken && this.decodedToken.role === "admin") {
        this.isAdmin = true;
      }
      if(this.isAdmin) {
        this.loadAllJobs();
      } else {
        this.loadJobs(this.email);
      }
      
    }
  }

  loadJobs(email){
    this.jobService.getJobByUserEmail(email, this.jbbToken.token).subscribe(
      data => {
        this.displayJobs(data.jobs)},
      error => {console.error(error)}
    )
  }

  loadAllJobs(){
    this.jobService.getJobs().subscribe(
      data => {this.displayJobs(data)},
      error => {console.error(error)}
    )
  }

  displayJobs(data) {
    console.log("data",data);
    this.jobs = data;
    switch(this.jobs.length) {
      case 0 : 
      this.jobsTitle = "No Jobs !";
      return;
      case 1 :
      this.jobsTitle = "One job";
      return;
      default : 
      this.jobsTitle = `${this.jobs.length} Jobs`;

    }
    

  }

}
