package db;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;

import db.Preference.DBPreference;

public class Person implements Comparable<Person> {
    int personId;

    String email, firstName, lastName;
    int desiredNumberAssignments;
    boolean peerTeacher, teachingAssistant, administrator, professor;
    ArrayList<Unavailability> unavailabilities;
    HashMap<Integer, Preference> preferences;
    HashMap<Integer, Qualification> qualifications;
    HashMap<Integer, Section> assignedSections;

    ArrayList<Integer> availableSections;
    float availabilityScore;

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
        this.unavailabilities = new ArrayList<Unavailability>();
        this.preferences = new HashMap<Integer, Preference>();
        this.qualifications = new HashMap<Integer, Qualification>();
        this.assignedSections = new HashMap<Integer, Section>();

        availableSections = new ArrayList<>();
        availabilityScore = 0.f;
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

    public ArrayList<Unavailability> getUnavailabilities() {
        return (ArrayList<Unavailability>) Collections.unmodifiableList(unavailabilities);
    }

    public void addUnavailability(Unavailability availability) {
        unavailabilities.add(availability);
    }

    public Collection<Preference> getPreferences() {
        return preferences.values();
    }

    public void addPreference(Preference preference) {
        preferences.put(preference.getSectionId(), preference);
    }

    public ArrayList<Preference> getSortedPreferences() {
        ArrayList<Preference> sortedPreferences = new ArrayList<>();
        sortedPreferences.addAll(getPreferences());
        Collections.sort(sortedPreferences, Collections.reverseOrder());
        return sortedPreferences;
    }

    public Collection<Qualification> getQualifications() {
        return qualifications.values();
    }

    public void addQualification(Qualification qualification) {
        qualifications.put(qualification.getCourseId(), qualification);
    }

    public float getAvailabilityScore() {
        return availabilityScore;
    }

    public ArrayList<Integer> getAvailabileSections() {
        return (ArrayList<Integer>) Collections.unmodifiableList(availableSections);
    }

    public int getNumberCurrentlyAssigned() {
        return assignedSections.size();
    }
    
    public void addCurrentAssignment(Section section) {
        assignedSections.put(section.getSectionId(), section);
    }

    boolean isQualified(int courseId) {
        Qualification qualification = qualifications.getOrDefault(courseId, null);
        if (qualification != null) {
            return qualification.isQualified();
        }
        return false;
    }

    boolean isAvailable(ArrayList<Meeting> meetings) {
        for (Meeting meeting : meetings) {
            for (Unavailability unavailability : unavailabilities) {
                if (unavailability.getWeekday().equals(meeting.getWeekday()) && !(unavailability.getEndTime().before(meeting.getStartTime()) || unavailability.getStartTime().after(meeting.getEndTime()))) {
                    return false;
                }
            }
        }
        return true;
    }

    boolean getPreferenceEquals(int sectionId, DBPreference target) {
        Preference preference = preferences.getOrDefault(sectionId, null);
        if (preference != null) {
            return preference.getPreference() == target;
        }
        return false;
    }

    public boolean isGoodSection(int sectionId, Section section) {
        return isQualified(section.getCourseId()) && isAvailable(section.getMeetings()) && !getPreferenceEquals(sectionId, DBPreference.CANT_DO);
    }

    public boolean alreadyAssigned(String weekday, Time start, Time end) {
        for (Section section : assignedSections.values()) {
            for (Meeting meeting : section.getMeetings()) {
                if (weekday.equals(meeting.getWeekday()) && !(meeting.getStartTime().after(end) || meeting.getEndTime().before(start))) {
                    return true;
                }
            }
        }
        return false;
    }

    int computePreferenceDelta() {
        int accumulator = 0;
        for (Preference preference : preferences.values()) {
            if (!preference.getPreference().equals(DBPreference.INDIFFERENT)) {
                ++accumulator;
            }
        }
        return accumulator;
    }

    /**
     * Requires that person has all data.
     * 
     * Assumptions:
     * * Availability are consistent (start always before end)
     * * Sections are consistent
     * * Availability are nonoverlapping (will lead to problems with score)
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
        if (data[0] == 0) {
            data[0] = 1; // Avoid division by zero for unqualified people
        }
        availabilityScore = (float)data[1] / data[0] - computePreferenceDelta() / 1000.f; // Favor students that mark more preferences
    }

    @Override
    public String toString() {
        return "Person [administrator=" + administrator + ", availabilities=" + unavailabilities + ", availabilityScore="
                + availabilityScore + ", availableSections=" + availableSections + ", desiredNumberAssignments="
                + desiredNumberAssignments + ", email=" + email + ", firstName=" + firstName + ", lastName=" + lastName
                + ", peerTeacher=" + peerTeacher + ", personId=" + personId + ", preferences=" + preferences
                + ", professor=" + professor + ", qualifications=" + qualifications + ", sections=" + assignedSections
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
