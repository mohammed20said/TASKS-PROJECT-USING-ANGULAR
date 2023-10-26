import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http:HttpClient) { }


  createUser(modele : any){
    return this.http.post(environment.baseApi.replace('tasks','auth') + '/createAccount',modele);
  }

  login(model : any){
    return this.http.post(environment.baseApi.replace('tasks','auth') + '/login',model);

  }
}



