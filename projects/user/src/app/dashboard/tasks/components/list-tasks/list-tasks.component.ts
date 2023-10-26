import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
page : any = 1;
userData : any;
selectedStatus = "In-Progress";
totalItems : any ;
changePage(event: any) {
  this.page=event
  this.getAllTasks();
}
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadLineDate','status', 'actions'];
  dataSource:any = [];
  tasksFilter!:FormGroup
  users:any = [
    {name:"Moahmed" , id:1},
    {name:"Ali" , id:2},
    {name:"Ahmed" , id:3},
    {name:"Zain" , id:4},
  ]

  status:any = [
    {name:"Complete" , id:1},
    {name:"In-Progress" , id:2},
  ]
  constructor(public dialog: MatDialog ,private fb:FormBuilder,private service : TasksService,private toastr : ToastrService) { }

  ngOnInit(): void {
    this.createform()
    this.getUserData();
    this.getAllTasks();
  }

  createform() {
    this.tasksFilter = this.fb.group({
      title:[''],
      userId:[''],
      fromDate:[''],
      toDate:['']
    })
  }

  getUserData(){
    let token = JSON.stringify(localStorage.getItem("token"));
    this.userData = JSON.parse(window.atob(token.split('.')[1]));
    console.log(this.userData);
  }

  getAllTasks() {
    let params = {
      page : this.page,
      limit : 10 ,
      status : this.selectedStatus
    }
    this.service.getUserTasks(this.userData.userId,params).subscribe((res : any)=>{
      this.dataSource = res.tasks;
      this.totalItems = res.totalItems;
    })
  }

  complete(item : any){
    let model ={
      id : item._id
    }

    this.service.completeTask(model).subscribe((data : any)=>{
      this.getAllTasks();
      this.toastr.success('Task completed successfuly','Success');
    })
  }
}
