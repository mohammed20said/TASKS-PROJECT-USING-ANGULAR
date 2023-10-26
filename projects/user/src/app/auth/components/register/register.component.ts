import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private fb : FormBuilder,private service : LoginService,private router : Router,private toastr : ToastrService) { }

  registerForm! : FormGroup;

  ngOnInit(): void {

    this.createForm();
  }

  createForm(){
    this.registerForm = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      username : ['',Validators.required],
      password : ['',Validators.required],
      confirmPassword : ['',Validators.required],
      role : ['user'],
    },{validators : this.checkPassword})
  }

  createAccount(){
    const modele : any = {
      email : this.registerForm.value['email'],
      username : this.registerForm.value['username'],
      password : this.registerForm.value['password'],
      role : this.registerForm.value['role'],
    }

    this.service.createUser(modele).subscribe((res:any)=>{
      this.router.navigate(['/auth/login']);
      this.toastr.success('Account created successfuly');
    })
  }

  checkPassword:ValidatorFn = (group:AbstractControl) : ValidationErrors | null =>{
    let password = group.get("password")?.value;
    let confirmPassword = group.get("confirmPassword")?.value;

    return password===confirmPassword ? null : {notSame:true};
  }


}
