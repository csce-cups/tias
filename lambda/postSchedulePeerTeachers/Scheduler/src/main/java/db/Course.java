package db;

public class Course {
    String department;
    String courseNumber;
    String courseName;
    
    public Course(String department, String courseNumber, String courseName) {
        this.department = department;
        this.courseNumber = courseNumber;
        this.courseName = courseName;
    }

    public String getDepartment() {
        return department;
    }

    public String getCourseNumber() {
        return courseNumber;
    }

    public String getCourseName() {
        return courseName;
    }

    @Override
    public String toString() {
        return "Course [courseName=" + courseName + ", courseNumber=" + courseNumber + ", department=" + department
                + "]";
    }
}
