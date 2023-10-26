
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!:FormGroup;

  constructor(private fb : FormBuilder,private service : LoginService,private router : Router,private toastr : ToastrService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required]],
      role : ['user'],
    })
  }

  login(){

    const model : any = {
      email : this.loginForm.value['email'],
      password : this.loginForm.value['password'],
      role : this.loginForm.value['role'],
    }
    this.service.login(model).subscribe((data : any)=>{
      this.router.navigate(['/tasks'])
      localStorage.setItem("token",data.token);
      this.toastr.success('login success')
    })
  }



 
}
