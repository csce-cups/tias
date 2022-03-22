package db;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

public class Person implements Comparable<Person> {
    int personId;

    String email, firstName, lastName;
    int desiredNumberAssignments;
    boolean peerTeacher, teachingAssistant, administrator, professor;
    ArrayList<Availability> availabilities;
    ArrayList<Preference> preferences;
    ArrayList<Qualification> qualifications;

    ArrayList<Integer> availableSections;
    float availabilityScore;

    int currentAssignments;

    public Person(int personId, String email, String firstName, String lastName, int desiredNumberAssignments, boolean peerTeacher, boolean teachingAssistant,
            boolean administrator, boolean professor) {
        this.personId = personId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.desiredNumberAssignments = desiredNumberAssignments;
        this.peerTeacher = peerTeacher;
        this.teachingAssistant = teachingAssistant;
        this.administrator = administrator;
        this.professor = professor;
        this.availabilities = new ArrayList<Availability>();
        this.preferences = new ArrayList<Preference>();
        this.qualifications = new ArrayList<Qualification>();

        availableSections = new ArrayList<>();
        availabilityScore = 0.f;
        currentAssignments = 0;
    }

    public int getPersonId() {
        return personId;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getDesiredNumberAssignments() {
        return desiredNumberAssignments;
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
        Collections.sort(preferences, Collections.reverseOrder());
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

    public ArrayList<Integer> getAvailabileSections() {
        return (ArrayList<Integer>) Collections.unmodifiableList(availableSections);
    }

    static boolean gradeQualifies(char grade) {
        switch (grade) {
            case 'A': return true;
            default: return false;
        }
    }

    public int getCurrentAssignments() {
        return currentAssignments;
    }
    
    public int addCurrentAssignment() {
        return currentAssignments;
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
    public void computeAvailabilityScore(HashMap<Integer, Section> sections) {
        // This is because we use a Java Lambda and Java does not support Closures
        final Integer[] data = new Integer[2];
        data[0] = 0; // Number Qualified
        data[1] = 0; // Number Available
        sections.forEach((sectionId, section) -> {
            char grade = '\0';
            for (Qualification qualification : qualifications) {
                if (section.getCourseId() == qualification.getCourseId()) {
                    grade = qualification.getGrade();
                }
            }
            if (!gradeQualifies(grade)) return;
            data[0]++;
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
                availableSections.add(sectionId);
                data[1]++;
            }
        });
        // availabilityScore = (float)data[1]; // Simple
        // availabilityScore = (float)data[1] / data[0]; // Normalized
        availabilityScore = (float)data[1] / data[0] - preferences.size() / 1000.f; // Favor students that mark more preferences
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
