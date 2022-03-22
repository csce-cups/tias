import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.PriorityQueue;
import java.util.Properties;

import db.Availability;
import db.Course;
import db.Meeting;
import db.Person;
import db.Preference;
import db.Qualification;
import db.Section;

public class Driver {
    static Connection conn;

    static HashMap<Integer, Person> people;
    static HashMap<Integer, Course> courses;
    static HashMap<Integer, Section> sections;
    static HashMap<Integer /* section id */, ArrayList<Integer> /* person id */> schedule;

    public static void main(String[] args) {
        // https://jdbc.postgresql.org/documentation/head/index.html
        String url = "jdbc:postgresql://localhost/test"; // TODO: Set values in Parameter Store
        Properties props = new Properties();
        props.setProperty("user","username"); // TODO: Set values in Parameter Store
        props.setProperty("password","secret"); // TODO: Set values in Parameter Store
        try {
            conn = DriverManager.getConnection(url, props);
        } catch (Exception e) {
            System.err.println("Unable to connect to the Database:\n\t" + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }

        people = new HashMap<Integer, Person>();
        courses = new HashMap<Integer, Course>();
        sections = new HashMap<Integer, Section>();

        try {
            getCourses();
            courses.forEach((key, value) -> {
                System.out.println(key + "\t" + value);
            });
            // TODO: Get list of Person IDs programmatically
            // getPeople(new int[]{3, 5});
            getPeople();
            people.forEach((key, value) -> {
                System.out.println(key + "\t" + value);
            });
            getSections();
            sections.forEach((key, value) -> {
                System.out.println(key + "\t" + value);
            });

            schedulePeopleToSections();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void getTypeMapping() throws SQLException {
        var rs = conn.getMetaData().getTypeInfo();
        while (rs.next())
            System.out.println(rs.getString("TYPE_NAME") + "\t" + JDBCType.valueOf(rs.getInt("DATA_TYPE")).getName());
    }

    static void getCourses() throws SQLException {
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM course");
        while (rs.next())
        {
            courses.put(rs.getInt("course_id"), new Course(rs.getString("department"), rs.getString("course_number"), rs.getString("course_name")));
        }
        rs.close();
        st.close();
    }

    static String constructPersonQuery(String table, int numPeople) {
        StringBuilder sb = new StringBuilder()
            .append("SELECT *")
            .append("FROM ")
            .append(table)
            .append(' ')
            .append("WHERE person_id IN (");
            for (int i = 0; i < numPeople - 1; ++i) {
                sb.append("?, ");
            }
            sb.append("?)");
            return sb.toString();
    }

    static void getPeople(int[] peopleIds) throws SQLException {
        System.out.println(constructPersonQuery("person", peopleIds.length));
        PreparedStatement st = conn.prepareStatement(constructPersonQuery("person", peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        ResultSet rs = st.executeQuery();

        while (rs.next())
        {
            people.put(rs.getInt("person_id"), new Person(rs.getInt("person_id"), rs.getString("email"), rs.getString("first_name"), rs.getString("last_name"), rs.getInt("desired_number_assignments"), rs.getBoolean("peer_teacher"), rs.getBoolean("teaching_assistant"), rs.getBoolean("administrator"), rs.getBoolean("professor")));
        }

        rs.close();
        st.close();

        st = conn.prepareStatement(constructPersonQuery("person_availability", peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        rs = st.executeQuery();

        while (rs.next())
        {
            people.get(rs.getInt("person_id")).addAvailability(new Availability(rs.getString("weekday"), rs.getTime("start_time"), rs.getTime("end_time")));
        }

        rs.close();
        st.close();

        st = conn.prepareStatement(constructPersonQuery("section_assignment_preference", peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        rs = st.executeQuery();

        while (rs.next())
        {
            people.get(rs.getInt("person_id")).addPreference(new Preference(rs.getInt("section_id"), rs.getString("preference")));
        }

        rs.close();
        st.close();

        st = conn.prepareStatement(constructPersonQuery("qualification", peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        rs = st.executeQuery();

        while (rs.next())
        {
            String grade = rs.getString("grade");
            people.get(rs.getInt("person_id")).addQualification(new Qualification(rs.getInt("course_id"), grade != null ? grade.charAt(0) : null));
        }

        rs.close();
        st.close();
    }

    static String constructPersonQuery(String table) {
        StringBuilder sb = new StringBuilder()
            .append("SELECT *")
            .append("FROM ")
            .append(table);
            return sb.toString();
    }

    static void getPeople() throws SQLException {
        System.out.println(constructPersonQuery("person"));
        Statement st = conn.createStatement();

        ResultSet rs = st.executeQuery(constructPersonQuery("person"));

        while (rs.next())
        {
            people.put(rs.getInt("person_id"), new Person(rs.getInt("person_id"), rs.getString("email"), rs.getString("first_name"), rs.getString("last_name"), rs.getInt("desired_number_assignments"), rs.getBoolean("peer_teacher"), rs.getBoolean("teaching_assistant"), rs.getBoolean("administrator"), rs.getBoolean("professor")));
        }

        rs.close();
        st.close();

        st = conn.createStatement();

        rs = st.executeQuery(constructPersonQuery("person_availability"));

        while (rs.next())
        {
            people.get(rs.getInt("person_id")).addAvailability(new Availability(rs.getString("weekday"), rs.getTime("start_time"), rs.getTime("end_time")));
        }

        rs.close();
        st.close();

        st = conn.createStatement();

        rs = st.executeQuery(constructPersonQuery("section_assignment_preference"));

        while (rs.next())
        {
            people.get(rs.getInt("person_id")).addPreference(new Preference(rs.getInt("section_id"), rs.getString("preference")));
        }

        rs.close();
        st.close();

        st = conn.createStatement();

        rs = st.executeQuery(constructPersonQuery("qualification"));

        while (rs.next())
        {
            String grade = rs.getString("grade");
            people.get(rs.getInt("person_id")).addQualification(new Qualification(rs.getInt("course_id"), grade != null ? grade.charAt(0) : null));
        }

        rs.close();
        st.close();
    }

    static void getSections() throws SQLException {
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM course_section");
        while (rs.next())
        {
            sections.put(rs.getInt("section_id"), new Section(rs.getInt("course_id"), rs.getString("section_number"), rs.getInt("capacity_peer_teachers"), rs.getInt("capacity_teaching_assistants")));
        }
        rs.close();
        st.close();

        st = conn.createStatement();
        rs = st.executeQuery("SELECT * FROM section_meeting");
        while (rs.next())
        {
            sections.get(rs.getInt("section_id")).addMeeting(new Meeting(rs.getString("weekday"), rs.getTime("start_time"), rs.getTime("end_time"), rs.getString("place"), rs.getString("meeting_type")));
        }
        rs.close();
        st.close();
    }

    static void schedulePeopleToSections() {
        people.forEach((person_id, person) -> {
            person.computeAvailabilityScore(sections);
        });

        PriorityQueue<Person> queue = new PriorityQueue<>(people.values());

        while (!queue.isEmpty()) {
            Person frontPerson = queue.remove();

            HashSet<Integer> notPreferredSections = new HashSet<>();
            notPreferredSections.addAll(sections.keySet());

            // Schedule what you prefer or marked indifferent
            for (Preference preference : frontPerson.getPreferences()) {
                if (frontPerson.getCurrentAssignments() >= frontPerson.getDesiredNumberAssignments()) break;
                notPreferredSections.remove(preference.getSectionId());
                if (preference.isPreferable()) {
                    Section section = sections.get(preference.getSectionId());
                    if (section.getAssignedPTs() < section.getCapacityPTs()) {
                        section.addAssignedPTs();
                        frontPerson.addCurrentAssignment();
                        schedule.putIfAbsent(preference.getSectionId(), new ArrayList<>());
                        schedule.get(preference.getSectionId()).add(frontPerson.getPersonId());
                    }
                }
            }

            // Schedule what you didn't mark at all
            if (frontPerson.getCurrentAssignments() < frontPerson.getDesiredNumberAssignments()) {
                for (int sectionId : notPreferredSections) {
                    if (frontPerson.getCurrentAssignments() >= frontPerson.getDesiredNumberAssignments()) break;
                    Section section = sections.get(sectionId);
                    if (section.getAssignedPTs() < section.getCapacityPTs()) {
                        section.addAssignedPTs();
                        frontPerson.addCurrentAssignment();
                        schedule.putIfAbsent(sectionId, new ArrayList<>());
                        schedule.get(sectionId).add(frontPerson.getPersonId());
                    }
                }
            }

            // Schedule what you marked as not preferred
            for (Preference preference : frontPerson.getPreferences()) {
                if (frontPerson.getCurrentAssignments() >= frontPerson.getDesiredNumberAssignments() || preference.getPreference() == Preference.DBPreference.CANT_DO) break;
                if (preference.isPreferable()) continue;
                Section section = sections.get(preference.getSectionId());
                if (section.getAssignedPTs() < section.getCapacityPTs()) {
                    section.addAssignedPTs();
                    frontPerson.addCurrentAssignment();
                    schedule.putIfAbsent(preference.getSectionId(), new ArrayList<>());
                    schedule.get(preference.getSectionId()).add(frontPerson.getPersonId());
                }
            }

            // At this stage you are either satisfied or you cannot be fully satisfied because there aren't enough available, qualified labs that you can do that fulfill the number of desired labs. This is an extremely unlikely occurrence.
        }
    }
}