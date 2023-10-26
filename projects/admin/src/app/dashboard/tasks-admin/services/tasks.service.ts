import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../../../auth/context/DTOs';
import { createTask } from '../context/DTOs';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http:HttpClient) { }
  
  getAllTasks(filtration : any){
    let params = new HttpParams;

    Object.entries(filtration).forEach(([key,value]:any)=>{
      if(value){
        params = params.append(key,value);
      }
    })
    return this.http.get(environment.baseApi + '/all-tasks',{params});
  }

  createTask(model:any){
    return this.http.post(environment.baseApi + '/add-task',model);
  }

  deleteTask(id:any){
    return this.http.delete(environment.baseApi + '/delete-task/'+ id);
  }

  editTask(model:any,id:any){
    return this.http.put(environment.baseApi + '/edit-task/' + id,model);
  }
  
  
  


}
