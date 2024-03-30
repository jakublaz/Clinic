# EGUI Lab

During the lab, you need to design and implement the application by performing 3 tasks (stages of program development):  

* Task 1 MVC - 20 points
* Task 2 MVC - REST api - 20 Points
* Task 3 React - 20 Points

You need to create a separate branch for each task and place the code for that stage/task in it. Each stage builds on the previous solution. The deadlines for submitting the tasks will be specified in the laboratory regulations.

Please use the following branch names **(code in other branches will not be checked)**:
* 1-mvc
* 2-restapi
* 3-react

Tutorial: [Get started with ASP.NET Core MVC](https://learn.microsoft.com/en-us/aspnet/core/tutorials/first-mvc-app/start-mvc?view=aspnetcore-6.0&tabs=visual-studio)

## Task topic

Write a program to operate the clinic.

### Task 1 - MVC

List of doctors - each doctor has one specialty from the permanent list of specialties (home, ENT, dermatologist, ophthalmologist, neurologist, orthopedist, pediatrician).
A doctor's account is set up by the manager.
The doctor logs with a password.

Patient logs with password
The patient registers in the system (creates an account), but records with doctors and views appointments after the account is activated by the manager.
Schedule for each subsequent week: doctor, day, start, end, e.g.: Smith, 2023-11-08 8.00 12.00. Multiple visits can take place within a single entry in the schedule.
The schedule is entered/modified by the manager (who also has additional option: copy previous week).
Patients can sign up/unsubscribe from appointments - each visit lasts 15 minutes. The patient is looking for a doctor by specialty.
During the visit, the doctor writes a description (any text) to the visit.

### Task 2 - MVC Rest API
modify application to provide CRUD for patients, visits, schedules

### Task 3 - Frontend in REACT
write REACT appliaction same as MVC using React
Final solution should use Rest API from Task 2 andbe served (as static files) from the same server. 

