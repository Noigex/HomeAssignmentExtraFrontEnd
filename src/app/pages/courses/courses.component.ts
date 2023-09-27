import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Course } from 'src/app/models/Course.model';
import { Student } from 'src/app/models/Student.model';
import { CoursesService } from 'src/app/services/courses.service';
import { StudentsService } from 'src/app/services/students.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent implements OnInit {
  constructor(
    private studentsService: StudentsService,
    private coursesService: CoursesService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService
  ) {}
  private ngUnsubscribe = new Subject<void>();

  loading2: boolean = false;
  loading1: boolean = false;
  courseDialog: boolean = false;
  courses: Course[] = [];
  course!: Course;
  submitted: boolean = false;
  isUpdate: boolean = false;
  yearFilter!: Date | undefined;
  courseName!: string | undefined;
  students!: Student[];
  student!: Student;
  prevCourseSnap!: Course;

  ngOnInit(): void {
    this.studentsService
      .getStudents()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.students = [...response];
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getCourses() {
    this.loading1 = true;
    this.coursesService.getCourses().subscribe({
      next: (response) => {
        this.courses = [...response];
        this.loading1 = false;
        this.toastService.showSucess('Fetched courses successfully');
      },
      error: (err) => {
        this.loading1 = false;
        this.toastService.showError('Failed to fetch courses');
      },
    });
  }

  getSpecificCourse() {
    if (!this.courseName) {
      this.toastService.showError(
        'You must fill the course_name input to search by name'
      );
      return;
    }

    this.loading2 = true;
    this.coursesService.getSpecificCourse(this.courseName).subscribe({
      next: (response) => {
        this.courses = [response];
        this.loading2 = false;
        this.toastService.showSucess('Fetched a course by the name provided');
      },
      error: (err) => {
        this.loading2 = false;
        this.toastService.showError(
          'Failed to fetch a course by the name provided'
        );
      },
    });
  }

  openNewCourse() {
    this.submitted = false;
    this.isUpdate = false;
    this.course = {
      ...this.course,
      course_name: '',
      year: 0,
    };
    this.submitted = false;
    this.courseDialog = true;
  }

  openEditCourse(course: Course) {
    this.submitted = false;
    this.course = {
      ...course,
    };
    this.courseDialog = true;
    this.isUpdate = true;
    this.prevCourseSnap = {
      ...course,
    };
  }

  deleteCourse(course: Course) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${course.course_name}" ? `,
      header: 'Delete Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.coursesService.deleteCourse(course).subscribe({
          next: (response) => {
            const index = this.courses.findIndex((course) => {
              return course.course_name === response.course_name;
            });
            this.courses.splice(index, 1);
            this.toastService.showSucess('Course deleted successfully');
          },
          error: (err) => {
            this.toastService.showError('Failed to delete');
          },
        });
      },
    });
  }

  createCourse() {
    this.submitted = true;
    if (!this.course.course_name || !this.course.year) {
      this.toastService.showError('Please fill the required information');
      return;
    }

    if(!this.student) {
      this.toastService.showError('Cant create a course without a student');
      return;
    }

    this.confirmationService.confirm({
      message:
        'Are you sure you want to create the student ' +
        this.course.course_name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const payload = { ...this.course, studentId: this.student.student_id! };
        this.coursesService.createCourse(payload).subscribe({
          next: (response) => {
            this.courses.push({ ...response });
            this.toastService.showSucess('Course created successfully');
            this.courseDialog = false;
          },
          error: (err) => {
            console.log(err);
            this.toastService.showError('Failed to create a course');
          },
        });
      },
    });
  }

  updateCourse() {
    this.submitted = true;

    this.confirmationService.confirm({
      message:
        'Are you sure you want to update the student ' +
        this.course.course_name +
        '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.coursesService
          .updateCourse(this.course, this.prevCourseSnap)
          .subscribe({
            next: (response) => {
              const index = this.courses.findIndex((course) => {
                return this.prevCourseSnap.course_name === course.course_name;
              });
              this.courses.splice(index, 1);
              this.courses = [...this.courses, response];
              this.toastService.showSucess('Course updated successfully');
              this.courseDialog = false;
            },
            error: (err) => {
              this.toastService.showError('Failed to update a course');
            },
          });
      },
    });
  }

  hideDialog() {
    this.courseDialog = false;
    this.submitted = false;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
