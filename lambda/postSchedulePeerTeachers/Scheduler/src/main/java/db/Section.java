package db;

import java.util.ArrayList;

public class Section implements Comparable<Section> {
    int sectionId;

    int courseId;
    String sectionNumber;
    int capacityPTs;
    int capacityTAs;
    ArrayList<Meeting> meetings;

    int currentPTs;
    int currentTAs;

    String courseNumber;
    
    public Section(int sectionId, int courseId, String sectionNumber, int capacityPTs, int capacityTAs) {
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.sectionNumber = sectionNumber;
        this.capacityPTs = capacityPTs;
        this.capacityTAs = capacityTAs;

        meetings = new ArrayList<>();
        currentPTs = 0;
        currentTAs = 0;
    }

    public int getSectionId() {
        return sectionId;
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseNumber(String courseNumber) {
        this.courseNumber = courseNumber;
    }

    public String getSectionNumber() {
        return sectionNumber;
    }

    public int getCapacityPTs() {
        return capacityPTs;
    }

    public int getCapacityTAs() {
        return capacityTAs;
    }

    public int getAssignedPTs() {
        return currentPTs;
    }

    public void addAssignedPTs() {
        ++currentPTs;
    }

    public int getAssignedTAs() {
        return currentTAs;
    }

    public void addAssignedTAs() {
        ++currentTAs;
    }

    public ArrayList<Meeting> getMeetings() {
        return meetings;
    }

    public void addMeeting(Meeting meeting) {
        meetings.add(meeting);
    }

    @Override
    public String toString() {
        return "Section [capacityPTs=" + capacityPTs + ", capacityTAs=" + capacityTAs + ", courseId=" + courseId
                + ", courseNumber=" + courseNumber + ", currentPTs=" + currentPTs + ", currentTAs=" + currentTAs
                + ", meetings=" + meetings + ", sectionId=" + sectionId + ", sectionNumber=" + sectionNumber + "]";
    }

    @Override
    public int compareTo(Section o) {
        return courseNumber.compareTo(o.courseNumber);
    }
}
