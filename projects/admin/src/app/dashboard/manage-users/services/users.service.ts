import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { BehaviorSubject } from 'rxjs';
export interface ChangeStatus{
  id : string,
  status : string
}




@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userData=new BehaviorSubject({});

  constructor(private http:HttpClient) { }


  getAllUsers(filter : any){
    let params = new HttpParams;
    if(filter){
     

    Object.entries(filter).forEach(([key,value]:any)=>{
      if(value){
        params = params.append(key,value);
      }
    })
    }
    
    return this.http.get(environment.baseApi.replace('tasks', 'auth') + '/users',{params});
  }

  deleteUser(id : any){
    return this.http.delete(environment.baseApi.replace('tasks', 'auth') + '/user/'+id);
  }

  changeStatus(model : ChangeStatus){
    return this.http.put(environment.baseApi.replace('tasks', 'auth') + '/user-status',model);
  }

  getUserData(filtration?:any){
    

    this.getAllUsers(filtration).subscribe((res :any)=>{
      this.userData.next({
        total : res.totalItems,
        data :res.users
      })
    })
  }
}
