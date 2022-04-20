package db;

public class Preference implements Comparable<Preference> {
    public enum DBPreference { CANT_DO, PREFER_NOT_TO_DO, INDIFFERENT, PREFER_TO_DO }

    int sectionId;
    DBPreference preference;
    String courseNumber;

    public Preference(int sectionId, String preference, String courseNumber) {
        this.sectionId = sectionId;
        if (preference.equals("Can't Do")) {
            this.preference = DBPreference.CANT_DO;
        } else if (preference.equals("Prefer Not To Do")) {
            this.preference = DBPreference.PREFER_NOT_TO_DO;
        } else if (preference.equals("Indifferent")) {
            this.preference = DBPreference.INDIFFERENT;
        } else if (preference.equals("Prefer To Do")) {
            this.preference = DBPreference.PREFER_TO_DO;
        }
        this.courseNumber = courseNumber;
    }

    public int getSectionId() {
        return sectionId;
    }
    
    public DBPreference getPreference() {
        return preference;
    }

    public boolean isPreferable() {
        return preference.compareTo(DBPreference.PREFER_NOT_TO_DO) > 0;
    }
    
    @Override
    public String toString() {
        return "Preference [preference=" + preference + ", sectionId=" + sectionId + "]";
    }

    @Override
    public int compareTo(Preference o) {
        if (preference != o.preference) {
            return preference.ordinal() - o.preference.ordinal();
        }
        return courseNumber.compareTo(o.courseNumber);
    }
}
