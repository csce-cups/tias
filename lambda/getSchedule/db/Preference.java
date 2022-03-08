package db;

public class Preference {
    int sectionId;
    String preference;

    public Preference(int sectionId, String preference) {
        this.sectionId = sectionId;
        this.preference = preference;
    }

    public int getSectionId() {
        return sectionId;
    }
    
    public String getPreference() {
        return preference;
    }
    
    @Override
    public String toString() {
        return "Preference [preference=" + preference + ", sectionId=" + sectionId + "]";
    }
}
