package db;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;

import db.Preference.DBPreference;

public class Person implements Comparable<Person> {
    int personId;

    String email, firstName, lastName;
    float desiredNumberAssignments;
    boolean peerTeacher, teachingAssistant, administrator, professor;
    HashMap<Integer, Preference> preferences;
    HashSet<Integer> viableSections;
    HashMap<Integer, Section> assignedSections;

    float availabilityScore;
    float hoursAssigned;

    public Person(int personId, String email, String firstName, String lastName, float desiredNumberAssignments, boolean peerTeacher, boolean teachingAssistant,
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
        this.preferences = new HashMap<Integer, Preference>();
        this.viableSections = new HashSet<Integer>();
        this.assignedSections = new HashMap<Integer, Section>();

        availabilityScore = 0.f;
        hoursAssigned = 0.f;
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

    public float getDesiredNumberAssignments() {
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

    public Collection<Preference> getPreferences() {
        return preferences.values();
    }

    public void addPreference(Preference preference) {
        preferences.put(preference.getSectionId(), preference);
    }

    public HashSet<Integer> getViableSections() {
        return viableSections;
    }

    public void addViableSection(Integer sectionId) {
        viableSections.add(sectionId);
    }

    public ArrayList<Preference> getSortedPreferences() {
        ArrayList<Preference> sortedPreferences = new ArrayList<>();
        sortedPreferences.addAll(getPreferences());
        Collections.sort(sortedPreferences, Collections.reverseOrder());
        return sortedPreferences;
    }

    public int getNumberCurrentlyAssigned() {
        return assignedSections.size();
    }

    public float getHoursAssigned() {
        return hoursAssigned;
    }
    
    public void addCurrentAssignment(Section section) {
        hoursAssigned += section.getHours();
        assignedSections.put(section.getSectionId(), section);
    }

    boolean getPreferenceEquals(int sectionId, DBPreference target) {
        Preference preference = preferences.getOrDefault(sectionId, null);
        if (preference != null) {
            return preference.getPreference() == target;
        }
        return false;
    }

    public boolean isGoodSection(int sectionId) {
        return !getPreferenceEquals(sectionId, DBPreference.CANT_DO);
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
            if (preference != null && preference.getPreference() != DBPreference.INDIFFERENT) {
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
        availabilityScore = viableSections.size() - computePreferenceDelta() / 1000.f; // Favor students that mark more preferences
    }

    @Override
    public String toString() {
        return "Person [administrator=" + administrator + ", assignedSections=" + assignedSections
                + ", availabilityScore=" + availabilityScore + ", desiredNumberAssignments=" + desiredNumberAssignments
                + ", email=" + email + ", firstName=" + firstName + ", lastName=" + lastName + ", peerTeacher="
                + peerTeacher + ", personId=" + personId + ", preferences=" + preferences + ", professor=" + professor
                + ", teachingAssistant=" + teachingAssistant + ", viableSections=" + viableSections + "]";
    }

    @Override
    public int compareTo(Person other) {
        return availabilityScore < other.availabilityScore ? -1 : other.availabilityScore < availabilityScore ? 1 : 0;
    }

    static boolean timeContains(Time outer_start, Time outer_end, Time inner_start, Time inner_end) {
        return outer_start.before(inner_start) && outer_end.after(inner_end);
    }
}
