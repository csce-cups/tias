package db;

public class Qualification {
    private int courseId;
    private boolean qualified;

    public Qualification(int courseId, boolean qualified) {
        this.courseId = courseId;
        this.qualified = qualified;
    }

    public int getCourseId() {
        return courseId;
    }

    public boolean isQualified() {
        return qualified;
    }

    @Override
    public String toString() {
        return "Qualification [courseId=" + courseId + ", qualified=" + qualified + "]";
    }
}
