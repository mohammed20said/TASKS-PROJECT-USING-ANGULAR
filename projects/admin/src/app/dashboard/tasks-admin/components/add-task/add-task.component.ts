import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import { UsersService } from '../../../manage-users/services/users.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  

  constructor(@Inject(MAT_DIALOG_DATA) public data:any , private fb:FormBuilder , public dialog: MatDialogRef<AddTaskComponent> , public matDialog:MatDialog,private service:TasksService,private spinner: NgxSpinnerService,private toaster : ToastrService,private userService : UsersService) { 
    this.getDataFromBehavior();
  }

  users:any = [
  ]
  fileName : string = '';
  newTaskForm! : FormGroup;
  formValues : any;
  
  ngOnInit(): void {
    console.log(this.data);
    this.createForm();
  }

  createForm(){
    this.newTaskForm = this.fb.group({
      title:[this.data?.title || '',[Validators.required]],
      userId:[this.data?.userId._id || '',[Validators.required]],
      image:[this.data?.image || '',[Validators.required]],
      description:[this.data?.description || '',[Validators.required]],
      deadline:[this.data ? new Date(this.data?.deadline.split('-').reverse().join('-')).toISOString() : '',[Validators.required]],
    })

    this.formValues = this.newTaskForm.value;

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


  createTask(){
    

    this.service.createTask(this.prepareFormData()).subscribe((data:any)=>{
      this.dialog.close(true);

      this.toaster.success('Task Created Successfully','Success');
      

    })
  }

  selectImage(event:any){
    this.fileName=event.target.value;

    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
  }

  prepareFormData(){
    let newData= moment(this.newTaskForm.value['deadline']).format('DD-MM-YYYY');  
    let formData=new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key,value]:any)=>{
      if(key == 'deadline'){
        formData.append(key,newData);
      }else{
        formData.append(key,value);
      }
    
    })
    return formData;
  }


  editTask(){

    this.service.editTask(this.prepareFormData(),this.data._id).subscribe((data:any)=>{
      this.dialog.close(true);
      this.toaster.success('Task updated Successfully','Success');
      

    },error=>{
      this.toaster.error(error.error.message,'failed')
    })
  }


  close(){
    let hasChange=false;
    Object.keys(this.formValues).forEach((item)=>{
      
      if(this.formValues[item] !== this.newTaskForm.value[item]){
        hasChange=true;
        
      }
    })

    if(hasChange){
      const dialogRef = this.matDialog.open(ConfirmationComponent,{
        width:'750px',
        disableClose:true

      });
      dialogRef.afterClosed().subscribe(res=>{
        if(res==true){

        }
      });
    }else{
      this.dialog.close();
    }

       
  }
}
