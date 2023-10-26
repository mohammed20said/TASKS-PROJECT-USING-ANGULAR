import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { UsersService } from '../../../manage-users/services/users.service';
export interface PeriodicElement {
  title: string;
  user: string;
  deadline: string;
  status: string;
}


@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadline','status', 'actions'];
  dataSource:any = [];
  tasksFilter!:FormGroup
  page:any=1;
  total:any;
  filtration : any ={
    page : this.page,
    limit : 6

  };
  timeOutId : any;
  
  users:any = [
  ]

  status:any = [
    {name:"Complete"},
    {name:"	In-Progress"},
  ]

  
  constructor(private service : TasksService,public dialog: MatDialog,private spinner : NgxSpinnerService,private toaster : ToastrService,private userService : UsersService) {
    this.getDataFromBehavior();
   }

  ngOnInit(): void {
    this.getUsers();
    this.getAllTasks();
  }

  getUsers(){
    this.userService.getUserData();
  }

  getDataFromBehavior(){
    this.userService.userData.subscribe((res:any)=>{
      this.users = this.userMapping(res.data)
    })
  }

  userMapping(data :any[]){
    let newArray 
    if (data && data.length > 0) {
        newArray = data.map(item =>{
        return {
          name : item.username,
          id : item._id
        }
      })
    }
    

    return newArray
  }

  

  getAllTasks() {

    this.service.getAllTasks(this.filtration).subscribe((data:any)=>{
      
      this.dataSource=this.mappingTasks(data.tasks);
      this.total=data.totalItems
    })
  }


  mappingTasks(data:any[]){
    let newTaks = data.map(item =>{

      return {
        ...item,
        user : item.userId.username
      }
    })

    return newTaks;
  }

  addTask(){
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width:'750px',
      disableClose:true
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllTasks();
      }
    });
  }


  deleteTask(id:any){
    this.service.deleteTask(id).subscribe(data=>{
      this.getAllTasks();
      this.toaster.success("Task deleted successfuly","Sucess");
    })
  }

  editTask(element:any){
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width:'750px',
      data:element,
      disableClose:true

    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllTasks();
      }
    });
  }

  search(event : any){
    this.page=1;
    this.filtration['page'] = 1;
    this.filtration['keyword']=event.value;
    clearTimeout(this.timeOutId);
    this.timeOutId =setTimeout(()=>{
      this.getAllTasks();

    },2000)
    
  }

  selectUser(event : any){
    this.page=1;
    this.filtration['page'] = 1;
    this.filtration['userId']=event.value;
    this.getAllTasks();
  }

  selectStatus(event : any){
    this.page=1;
    this.filtration['page'] = 1;
    this.filtration['status']=event.value.trim();
    this.getAllTasks();
  }

  selectData(event:any,type:string){
    this.page=1;
    this.filtration['page'] = 1;
    this.filtration[type]=moment(event.value).format('DD-MM-YYYY')
    if (type=='toDate' && this.filtration['toDate']!== 'Invalid date'){
      this.getAllTasks();
    }
  }

  changePage(event:any){
    this.page=event;
    this.filtration['page'] = event;
    this.getAllTasks();
  }
   
  
}
