import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'solonel-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  jbbData = null;
  isAuthenticated = false;
  welcomeMessage = "";
  errorMessage = "";

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.userIsLoggedIn()) {
      this.refreshFlags();
    }
  }

  refreshFlags() {
    this.isAuthenticated = true; this.welcomeMessage = "Bienvenue";
  }

  login(formData) {
    this.authService.login(formData).subscribe(
      data => { this.handleLoginSuccess(data) },
      error => { this.handleLoginFailure(error) }
    )
  }

  handleLoginSuccess(data) {
    if (data.success) {
      this.jbbData = data;
      this.refreshFlags();
      localStorage.setItem('jbb-data', JSON.stringify(data));
    } else {
      this.errorMessage = data.message;
    }
  }
  handleLoginFailure(error) {
    console.error(error);
  }
}
