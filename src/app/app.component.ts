import { Component, OnInit } from '@angular/core';
//import {MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";

export class WorkSession{
	start: Date;
	end: Date;
	task: string;
	seconds : number;
	description: string = "";
	showingDetail: boolean = false;
}

export class TaskReport{
	task: string;
	seconds: number;
	// TODO : percentage
	descriptions: string[] = Array();
}

/**
* A Dialog used to save descripion of work

@Component({
	selector: 'dialog-save-desc',
	template: `
		<form ngForm >
			<input type="text" name="description"
			[(ngModel)]="desc" 
			placeholder="enter what you just did" />
			<button (click)="save()">SAVE</button>
		</form>
	`
})
export class SaveDescriptionComponent{
	
	desc: string = "";
	constructor(
 		private dialogRef: MatDialogRef<SaveDescriptionComponent>
		){};
	save(){
		this.dialogRef.close(this.desc);
	}
	
	
}

*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
	workHistory : WorkSession[] = Array();
	currentWorkSession : WorkSession;
	working : boolean = false;
	formattedTime: number = 0;
	timer : any;
	combinedMinutes: number = 0;
	currentTask: string;
	taskReports: TaskReport[];


	constructor(
		//private dialog: MatDialog
		)
	{
		this.currentWorkSession = new WorkSession();
		this.currentTask = "";
		this.currentWorkSession.description = "";

	}


	  //openDialog() : MatDialogRef<SaveDescriptionComponent> {

	        //let  dialogConfig = new MatDialogConfig();

	        //dialogConfig.disableClose = true;
	        //dialogConfig.autoFocus = true;

	        //return this.dialog.open(SaveDescriptionComponent, dialogConfig);
	//}

	ngOnInit(){
		


		if(localStorage.getItem("workHistory")){
			this.workHistory = new Array();
			let localWorkHistory = JSON.parse(localStorage.getItem("workHistory"));
			for(let i = 0; i < localWorkHistory.length; i++){
				let s : WorkSession  = new WorkSession();
				let localItem : Object = localWorkHistory[i];
				s.description = localItem['description'];
				s.end = localItem['end'];
				s.start = localItem['start'];
				s.seconds = localItem['seconds'];
				s.task = localItem['task'];
				this.workHistory = this.workHistory.concat(s);
			}
		}

		if(localStorage.getItem("currentWorkSession")){
			let localCurrentWorkSession = localStorage.getItem("currentWorkSession");
			localCurrentWorkSession = JSON.parse(localCurrentWorkSession);
			let s = this.currentWorkSession;
			s.description = localCurrentWorkSession['description'];
			s.end = localCurrentWorkSession['end'];
			s.start = localCurrentWorkSession['start'];
			s.seconds = localCurrentWorkSession['seconds'];
			s.task = localCurrentWorkSession['task'];

			// TODO : update the current minutes
			// since the minutes is not saved until 
			// the task is ended.
			// In the case of a refresh and a task is ongoing
			// we will need to calc the now - start
			console.log("S DOT START", s.start);
			if(typeof s.start  === "string"){
				s.start = new Date(s.start);
			}
			if(s.start instanceof Date){
				
				if(s.start.getTime() < new Date().getTime()){
					// if there was an ongoing task
					// restart it heret
					console.log("starting timer detected a started timer in the past");
					this.startTimer();

					let millis =
					new Date().getTime() - this.currentWorkSession.start.getTime();
					this.formattedTime = this.millisToSeconds(millis);


				}
				else{
					console.log("not starting timer");	
					console.log(new Date().getTime());			}
			}
			else{
				console.log("s.start not a Date: ", typeof s.start);
			}

		}


		// starts a timer that checks every 10 seconds
		// to calculate any necessary UI updates
		setInterval(()=>{
			this.calculateTotal();
		}, 10000);

		setInterval(()=>{
				this.getReports();
			}, 60000 );

	}

	toggleWorking(){
		if(this.working ){
			this.endTimer();
		}
		else{
			this.startTimer();
		}
	}

	/**
	* Starts timer for current work session
	* and updates flags / defaults
	*/
	startTimer(){

		this.working = true;
		this.currentWorkSession.start = new Date();
		this.getTimer();

	}

	/*
	* Ends timer for curr work session and resets defaul
	* ts and instantiates the next working session,
	* also adds to history  
	*/
	endTimer(){

		
		//this.currentWorkSession.description = desc;
		this.working = false;		
		this.currentWorkSession.end = new Date();
		this.calculateWorkSessionMinutes();

		this.workHistory = this.workHistory.concat(this.currentWorkSession);
		this.currentTask = this.currentWorkSession.task;
		this.currentWorkSession = new WorkSession();
		this.currentWorkSession.task = this.currentTask;
		this.timer = null;
		this.formattedTime = 0;

		this.getReports();

		/*
		let desc = confirm("Enter your work description");
		if(desc){
			//this.currentWorkSession.description = desc;
			
			this.openDialog().afterClosed().subscribe((desc: string)=>{
			
			});
			
		*/
	
	}


	/*
	* converts millis to seconds
	*/
	millisToSeconds(millis: number): number {
		console.log("millis: " + millis);
		let seconds : number = millis / 1000 ;
		//console.log("s: " + seconds);
		//let minutes = seconds / 60;
		//console.log("m: "  + minutes);
		return seconds;
	}

	/**
	* Calculates total minutes (across all sessions )
	* when you are working
	*/
	calculateTotal(){
		
		if(!this.working){
			return;
		}

		this.combinedMinutes = 0;
		let combinedMillis = 0;
		this.workHistory.forEach((item : WorkSession) => {
			let millis = item.end.getTime() - item.start.getTime();
			combinedMillis += millis;

		});

		if(this.currentWorkSession.start){
			
			// add the current sessions time
				combinedMillis += new Date().getTime() - this.currentWorkSession.start.getTime();
			
		}

		this.combinedMinutes = (combinedMillis / 1000) / 60;

	}

	/**
	* sets the minutes after timer is stopped
	* so the total can be saved in the history
	*/
	calculateWorkSessionMinutes(){
		if(this.currentWorkSession.start != undefined
			&& 
			this.currentWorkSession.end != undefined
			){
			let currWorkSessionMillis = 
			this.currentWorkSession.end.getTime()
			 - this.currentWorkSession.start.getTime();

			 console.log("calc session min: " + currWorkSessionMillis);

			this.currentWorkSession.seconds = this.millisToSeconds(currWorkSessionMillis);
			console.log("to secs: " + this.currentWorkSession.seconds);

		}
	}

	/**
	* Starts the timer
	* for the current working session
	*/
	getTimer(){

		this.timer = setInterval(()=>{ 

			if(this.currentWorkSession.start != undefined){
				let millis =
				new Date().getTime() - this.currentWorkSession.start.getTime();
				this.formattedTime = this.millisToSeconds(millis);
			}

			localStorage.setItem("currentWorkSession", JSON.stringify(this.currentWorkSession));
			

		 }, 1000);

	}


	/**
	 * Groups task names to total minutes 
	*/
	getReports(){

		let reports : TaskReport[] = new Array<TaskReport>();

		for(let i = 0; i < this.workHistory.length ; i++){
				
				let session = this.workHistory[i];
				let existingReports : TaskReport[] = reports.filter(rep => rep.task == session.task);
				if(existingReports.length != 0){
					// has one
					existingReports[0].seconds += session.seconds;
					existingReports[0].descriptions = existingReports[0].descriptions.concat(session.description);
				}else{
					let firstReport : TaskReport = new TaskReport();
					firstReport.seconds = session.seconds;
					firstReport.task = session.task;
					firstReport.descriptions = firstReport.descriptions.concat(session.description);
					reports = reports.concat(firstReport); 
				}
			}		

		this.taskReports = reports;
		localStorage.setItem("workHistory", JSON.stringify(this.workHistory));
	}


	clearWorkHistory(){

		this.workHistory = new Array<WorkSession>();
		localStorage.removeItem("workHistory");
	}

	deleteWorkSession(workSession: WorkSession){

		this.workHistory = this.workHistory.filter(session => session.start !== workSession.start);
		this.getReports();
	}

	toggleWorkItem(workSession: WorkSession){

		workSession.showingDetail = !workSession.showingDetail;
	}

}

