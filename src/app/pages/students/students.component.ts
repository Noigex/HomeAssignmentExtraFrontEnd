import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Student } from 'src/app/models/Student.model';
import { StudentsService } from 'src/app/services/students.service';
import { ToastService } from 'src/app/services/toast.service';

export interface deleteResponse {
  data: {
    deletedCoursesAmount: number;
    deletedStudent: Student;
  };
}

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent  {
  constructor(
    private studentsService: StudentsService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}

  
  loading2: boolean = false;
  loading1: boolean = false;
  studentDialog: boolean = false;
  students: Student[] = [];
  student!: Student;
  submitted: boolean = false;
  isUpdate: boolean = false;
  yearFilter!: Date | undefined;
  studentId!: number | undefined;


  getStudents() {
    if (this.yearFilter) {
      const date = new Date(this.yearFilter);
      const year = date.getFullYear();
      this.loading1 = true;
      this.studentsService.getStudents(year).subscribe({
        next: (response) => {
          this.students = [...response];
          this.loading1 = false;
          this.toastService.showSucess(
            'Fetched students successfully with year filter'
          );
        },
        error: (err) => {
          this.loading1 = false;
          this.toastService.showError('Failed to fetch students');
        },
      });
    } else {
      this.loading1 = true;
      this.studentsService.getStudents().subscribe({
        next: (response) => {
          this.students = [...response];
          this.loading1 = false;
          this.toastService.showSucess('Fetched students successfully');
        },
        error: (err) => {
          this.loading1 = false;
          this.toastService.showError('Failed to fetch students');
        },
      });
    }
  }

  getSpecificStudent() {
    if (!this.studentId) {
      this.toastService.showError('You must fill the id input to search by id');
      return;
    }

    this.loading2 = true;
    this.studentsService.getSpecificStudent(this.studentId).subscribe({
      next: (response) => {
        this.students = [response];
        this.loading2 = false;
        this.toastService.showSucess('Fetched a student by id');
      },
      error: (err) => {
        this.loading2 = false;
        this.toastService.showError('Failed to fetch a student by id');
      },
    });
  }

  openNewStudent() {
    this.submitted = false;
    this.isUpdate = false;
    this.student = {
      ...this.student,
      first_name: '',
      last_name: '',
      address: '',
    };
    this.submitted = false;
    this.studentDialog = true;
  }

  openEditStudent(student: Student) {
    this.submitted = false;
    this.student = {
      ...student,
    };
    this.studentDialog = true;
    this.isUpdate = true;
  }

  deleteStudent(student: Student) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${student.first_name}" ? `,
      header: 'Delete Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentsService.deleteStudent(student).subscribe({
          next: (response) => {
            const index = this.students.findIndex((student) => {
              return (
                student.student_id === response.data.deletedStudent.student_id
              );
            });
            this.students.splice(index, 1);
            this.toastService.showSucess('Student deleted successfully');
          },
          error: (err) => {
            this.toastService.showError('Failed to delete');
          },
        });
      },
    });
  }

  createStudent() {
    this.submitted = true;
    if (
      this.student.first_name === '' ||
      !this.student.last_name ||
      this.student.address === ''
    ) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    this.confirmationService.confirm({
      message:
        'Are you sure you want to create the student ' +
        this.student.first_name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentsService.createStudent(this.student).subscribe({
          next: (response) => {
            this.students.push({ ...response, _count: { courses: 0 } });
            this.toastService.showSucess('Student created successfully');
            this.studentDialog = false;
          },
          error: (err) => {
            this.toastService.showError('Failed to create a student');
          },
        });
      },
    });
  }

  updateStudent() {
    this.submitted = true;

    this.confirmationService.confirm({
      message:
        'Are you sure you want to update the student ' +
        this.student.first_name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentsService.updateStudent(this.student).subscribe({
          next: (response) => {
            const updatedStudents = this.students.map((student) => {
              if (student.student_id === response.student_id) {
                return { ...student, ...response };
              } else {
                return student;
              }
            });
            this.students = [...updatedStudents];
            this.toastService.showSucess('Student updated successfully');
            this.studentDialog = false;
          },
          error: (err) => {
            this.toastService.showError('Failed to update a student');
          },
        });
      },
    });
  }

  hideDialog() {
    this.studentDialog = false;
    this.submitted = false;
  }

}
