package db;

import java.util.ArrayList;
import java.util.Collections;

public class Person {
    String firstName, lastName;
    boolean peerTeacher, teachingAssistant, administrator, professor;
    ArrayList<Availability> availabilities;
    ArrayList<Preference> preferences;
    ArrayList<Qualification> qualifications;

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

    @Override
    public String toString() {
        return "Person [administrator=" + administrator + ", availabilities=" + availabilities + ", firstName="
                + firstName + ", lastName=" + lastName + ", peerTeacher=" + peerTeacher + ", preferences=" + preferences
                + ", professor=" + professor + ", qualifications=" + qualifications + ", teachingAssistant="
                + teachingAssistant + "]";
    }
}
