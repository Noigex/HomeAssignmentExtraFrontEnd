import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/Student.model';
import { deleteResponse } from '../pages/students/students.component';
import { baseUrl } from '../api/url';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private url = baseUrl;

  constructor(private http: HttpClient) {}

  getStudents(year?: number): Observable<Student[]> {
    if (year) {
      return this.http.get<Student[]>(`${this.url}/students`, {
        params: new HttpParams().set('year', year),
      });
    } else {
      return this.http.get<Student[]>(`${this.url}/students`);
    }
  }

  getSpecificStudent(studentId: number) {
    return this.http.get<Student>(`${this.url}/students/${studentId}`)
  }

  createStudent(newStudent: Student): Observable<Student> {
    return this.http.post<Student>(`${this.url}/students`, newStudent);
  }

  updateStudent(updatedStudent: Student) {
    return this.http.put<Student>(
      `${this.url}/students/${updatedStudent.student_id}`,
      updatedStudent
    );
  }

  deleteStudent(student: Student) {
    return this.http.delete<deleteResponse>(
      `${this.url}/students/${student.student_id}`
    );
  }
}
