import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Course } from '../models/Course.model';
import { baseUrl } from '../api/url';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private url = baseUrl;

  constructor(private http: HttpClient) {}


  getCourses()  {
      return this.http.get<Course[]>(`${this.url}/courses`);
  }

  getSpecificCourse(course_name: string) {
    return this.http.get<Course>(`${this.url}/courses/${course_name}`)
  }

  createCourse(newCourse: Course) {
    return this.http.post<Course>(`${this.url}/courses`, newCourse);
  }

  updateCourse(updatedCourse: Course, course: Course) {
    return this.http.put<Course>(
      `${this.url}/courses/${course.course_name}`,
      updatedCourse
    );
  }

  deleteCourse(course: Course) {
    return this.http.delete<Course>(
      `${this.url}/courses/${course.course_name}`
    );
  }
}
