package db;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import db.Preference.DBPreference;

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
        return preferences;
    }

    public void addPreference(Preference preference) {
        preferences.add(preference);
    }

    public void sortPreferences() {
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

    public int getCurrentAssignments() {
        return currentAssignments;
    }
    
    public void addCurrentAssignment() {
        currentAssignments++;
    }

    boolean isQualified(int courseId) {
        for (Qualification qualification : qualifications) {
            if (courseId == qualification.getCourseId()) {
                return qualification.isQualified();
            }
        }
        return false;
    }

    boolean isAvailable(ArrayList<Meeting> meetings) {
        for (Meeting meeting : meetings) {
            boolean quit = true;
            for (Availability availability : availabilities) {
                if (availability.getWeekday().equals(meeting.getWeekday()) && timeContains(availability.startTime, availability.endTime, meeting.startTime, meeting.endTime)) {
                    quit = false;
                }
            }
            if (quit) {
                return false;
            }
        }

        return true;
    }

    boolean getPreferenceEquals(int sectionId, DBPreference target) {
        for (Preference preference : preferences) {
            if (preference.getSectionId() == sectionId) {
                return preference.getPreference() == target;
            }
        }
        return false;
    }

    public boolean isGoodSection(int sectionId, Section section) {
        return isQualified(section.getCourseId()) && isAvailable(section.getMeetings()) && !getPreferenceEquals(sectionId, DBPreference.CANT_DO);
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
            if (!isQualified(section.getCourseId())) return;
            data[0]++;
            if (isAvailable(section.getMeetings())) {
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
        return "Person [administrator=" + administrator + ", availabilities=" + availabilities
                + ", desiredNumberAssignments=" + desiredNumberAssignments + ", email=" + email + ", firstName="
                + firstName + ", lastName=" + lastName + ", peerTeacher=" + peerTeacher + ", personId=" + personId
                + ", preferences=" + preferences + ", professor=" + professor + ", qualifications=" + qualifications
                + ", teachingAssistant=" + teachingAssistant + "]";
    }

    @Override
    public int compareTo(Person other) {
        return availabilityScore < other.availabilityScore ? 1 : other.availabilityScore < availabilityScore ? -1 : 0;
    }

    static boolean timeContains(Time outer_start, Time outer_end, Time inner_start, Time inner_end) {
        return outer_start.before(inner_start) && outer_end.after(inner_end);
    }
}
