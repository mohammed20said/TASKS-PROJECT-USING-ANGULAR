import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  

  constructor(private fb:FormBuilder,private service : LoginService,private toaster : ToastrService,private router:Router) { }
  loginForm!:FormGroup;
  ngOnInit(): void {

    this.createForm();
  }

  createForm(){
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(3),Validators.maxLength(20)]],
      role : ['admin'] 
    })
  }


  login(){
    if(this.loginForm.value['role']!=='admin') this.loginForm.value['role']='admin'

    this.service.login(this.loginForm.value).subscribe((res:any)=>{

      localStorage.setItem("token",res.token);
      this.toaster.success('Success','Login Success');
      this.router.navigate(['/tasks'])

    },error =>{
      this.loginForm.reset();
    })
  
  
  
  }


}
