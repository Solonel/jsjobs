import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
@Injectable()
export class JobService {

  BASE_URL = 'http://localhost:4201/'


  jobs = [];
  jobsSubject = new Subject();
  searchResultSubject = new Subject();

  constructor(private http: Http, private authService: AuthService) { }

  getJobs() {
    return this.http.get(this.BASE_URL + 'api/jobs')
      .map(res => res.json())
  }

  addJob(jobData, token) {
    jobData.id = Date.now();

    const requestOptions = this.authService.addAuthorizationHeader(token);

    return this.http.post(this.BASE_URL + 'api/jobs', jobData, requestOptions)
      .map(res => {
        this.jobsSubject.next(jobData);
      });
  }

  getJob(id) {
    console.log(this.BASE_URL + `api/jobs/${id}`)
    return this.http.get(this.BASE_URL + `api/jobs/${id}`)
      .map(res => res.json())
  }

  getJobByUserEmail(email, token) {

    const requestOptions = this.authService.addAuthorizationHeader(token);

    return this.http.get(this.BASE_URL + `api/jobs/${email}`, requestOptions)
      .map(res => res.json())
  }

  searchJob(criteria) {
    return this.http.get(`${this.BASE_URL}api/search/${criteria.term}/${criteria.place}`)
      .map(res => res.json())
      .do(res => this.searchResultSubject.next(res));
  }

}
