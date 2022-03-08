package db;

public class Qualification {
    private int courseId;
    private char grade;

    public Qualification(int courseId, char grade) {
        this.courseId = courseId;
        this.grade = grade;
    }

    public int getCourseId() {
        return courseId;
    }

    public char getGrade() {
        return grade;
    }

    @Override
    public String toString() {
        return "Qualification [courseId=" + courseId + ", grade=" + grade + "]";
    }
}
