package db;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;

public class Person implements Comparable<Person> {
    String firstName, lastName;
    boolean peerTeacher, teachingAssistant, administrator, professor;
    ArrayList<Availability> availabilities;
    ArrayList<Preference> preferences;
    ArrayList<Qualification> qualifications;

    ArrayList<Section> availableSections;
    float availabilityScore;

    public Person(String firstName, String lastName, boolean peerTeacher, boolean teachingAssistant,
            boolean administrator, boolean professor) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.peerTeacher = peerTeacher;
        this.teachingAssistant = teachingAssistant;
        this.administrator = administrator;
        this.professor = professor;
        this.availabilities = new ArrayList<Availability>();
        this.preferences = new ArrayList<Preference>();
        this.qualifications = new ArrayList<Qualification>();

        availableSections = new ArrayList<>();
        availabilityScore = 0.f;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public boolean isPeerTeacher() {
        return peerTeacher;
    }

    public boolean isTeachingAssistant() {
        return teachingAssistant;
    }

    public boolean isAdministrator() {
        return administrator;
    }

    public boolean isProfessor() {
        return professor;
    }

    public ArrayList<Availability> getAvailabilities() {
        return (ArrayList<Availability>) Collections.unmodifiableList(availabilities);
    }

    public void addAvailability(Availability availability) {
        availabilities.add(availability);
    }

    public ArrayList<Preference> getPreferences() {
        return (ArrayList<Preference>) Collections.unmodifiableList(preferences);
    }

    public void addPreference(Preference preference) {
        preferences.add(preference);
    }

    public ArrayList<Qualification> getQualifications() {
        return (ArrayList<Qualification>) Collections.unmodifiableList(qualifications);
    }

    public void addQualification(Qualification qualification) {
        qualifications.add(qualification);
    }

    public float getAvailabilityScore() {
        return availabilityScore;
    }

    public ArrayList<Section> getAvailabileSections() {
        return (ArrayList<Section>) Collections.unmodifiableList(availableSections);
    }

    static boolean gradeQualifies(char grade) {
        switch (grade) {
            case 'A': return true;
            default: return false;
        }
    }

    /**
     * Requires that person has all data.
     * 
     * Assumptions:
     * @ Availability are consistent (start always before end)
     * @ Sections are consistent
     * @ Availability are nonoverlapping (will lead to problems with score)
     * 
     * @param sections Iterable collection of sections
     */
    public void computeAvailabilityScore(Collection<Section> sections) {
        int number_available = 0;
        int number_qualified = 0;
        for (Section section : sections) {
            char grade = '\0';
            for (Qualification qualification : qualifications) {
                if (section.getCourseId() == qualification.getCourseId()) {
                    grade = qualification.getGrade();
                }
            }
            if (!gradeQualifies(grade)) continue;
            number_qualified++;
            boolean available = true;
            for (Meeting meeting : section.getMeetings()) {
                if (!meeting.getMeetingType().equals("Laboratory")) continue;
                for (Availability availability : availabilities) {
                    if (!(availability.getWeekday().equals(meeting.getWeekday()) && timeContains(availability.startTime, availability.endTime, meeting.startTime, meeting.endTime))) {
                        available = false;
                    }
                }
            }
            if (available) {
                availableSections.add(section);
                number_available++;
            }
        }
        availabilityScore = (float)number_available / number_qualified;
    }

    @Override
    public String toString() {
        return "Person [administrator=" + administrator + ", availabilities=" + availabilities + ", firstName="
                + firstName + ", lastName=" + lastName + ", peerTeacher=" + peerTeacher + ", preferences=" + preferences
                + ", professor=" + professor + ", qualifications=" + qualifications + ", teachingAssistant="
                + teachingAssistant + "]";
    }

    @Override
    public int compareTo(Person other) {
        return availabilityScore < other.availabilityScore ? 1 : other.availabilityScore < availabilityScore ? -1 : 0;
    }

    static boolean timeContains(Time outer_start, Time outer_end, Time inner_start, Time inner_end) {
        return outer_start.before(inner_start) && outer_end.after(inner_end);
    }
}
