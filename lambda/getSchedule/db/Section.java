package db;

import java.util.ArrayList;
import java.util.Collections;

public class Section {
    int sectionId; // We store this because it makes life easier for Person.computeAvailability

    int courseId;
    String sectionNumber;
    int capacityPTs;
    int capacityTAs;
    ArrayList<Meeting> meetings;
    
    public Section(int sectionId, int courseId, String sectionNumber, int capacityPTs, int capacityTAs) {
        this.sectionId = sectionId;
        this.courseId = courseId;
        this.sectionNumber = sectionNumber;
        this.capacityPTs = capacityPTs;
        this.capacityTAs = capacityTAs;
    }

    public int getSectionId() {
        return sectionId;
    }

    public int getCourseId() {
        return courseId;
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

    public ArrayList<Meeting> getMeetings() {
        return (ArrayList<Meeting>) Collections.unmodifiableList(meetings);
    }

    public void addMeeting(Meeting meeting) {
        meetings.add(meeting);
    }

    @Override
    public String toString() {
        return "Section [capacityPTs=" + capacityPTs + ", capacityTAs=" + capacityTAs + ", courseId=" + courseId
                + ", meetings=" + meetings + ", sectionNumber=" + sectionNumber + "]";
    }
}
