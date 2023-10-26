import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeStatus, UsersService } from '../../services/users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'email' ,'tasksAssigned', 'actions'];
  dataSource:any = [];
  timeOutId: any;
  constructor(private service : UsersService,private toastr : ToastrService) {
    this.getDataFromBehavior()
  }

    page = 1;
    totalItems : any ;
    filtration : any ={
      page : this.page,
      limit : 6,
      name : ''
  
    };

  ngOnInit(): void {
    this.getUsers();
  }


  getUsers(){
    this.service.getUserData(this.filtration)
  }

  getDataFromBehavior(){
    this.service.userData.subscribe((res:any)=>{
      this.dataSource = res.data,
      this.totalItems = res.total
    })
  }

  changePage(event : any){
    this.page=event;
    this.getUsers();
  }

  deleteUser(id:any,index : number){

    if(this.dataSource[index].assignedTasks>0){
      this.toastr.error("You can't delete this user until he finish his tasks");
    }else{
      this.service.deleteUser(id).subscribe((data:any)=>{
        this.toastr.success('User deleted successfuly','Success');
        this.page=1
        this.getUsers();
      })
    }
    
  }

  changeUserStatus(status : string , id : string,index : number){
    const model : ChangeStatus = {
      id,
      status
    }

    if(this.dataSource[index].assignedTasks>0){
      this.toastr.error("You can't change this user's statu until he finish his tasks");
    }else{
      this.service.changeStatus(model).subscribe((data:any)=>{
        this.toastr.success('the statu has changed successfuly', 'Success');
        this.page=1

        this.getUsers()
      })
  }
  }

  search(event : any){
    this.page=1;
    this.filtration['page'] = 1;
    this.filtration['name']=event.value;
    clearTimeout(this.timeOutId);
    this.timeOutId =setTimeout(()=>{
      this.getUsers();

    },2000)
    
  }



}
