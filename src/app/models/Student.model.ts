export interface Student {
  student_id?: 1;
  first_name: string;
  last_name: string;
  address: string;
  _count?: {
    courses: number;
  };
}
