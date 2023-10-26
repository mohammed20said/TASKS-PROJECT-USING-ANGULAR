import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../services/tasks.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  taskId : any ;
  taskDetails : any;
  
  constructor(private route : ActivatedRoute,private service : TasksService,private toastr : ToastrService,private router : Router) {

  this.route.paramMap.subscribe((res : any)=>{
    this.taskId = res.params['id']
  })

  }
  ngOnInit(): void {
    this.getTaskDetails()
  }

  getTaskDetails(){
    this.service.taskDetails(this.taskId).subscribe((data : any)=>{

      this.taskDetails = data.tasks

    })
  }

  complete(){
    let model ={
      id : this.taskId
    }

    this.service.completeTask(model).subscribe((data : any)=>{
      this.router.navigate(['/tasks']);
      this.toastr.success('Task completed successfuly','Success');
    })
  }



}
