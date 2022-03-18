import java.sql.*;
import java.util.HashMap;
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

    public static void main(String[] args) {
        // https://jdbc.postgresql.org/documentation/head/index.html
        String url = "jdbc:postgresql://tias-db-instance.crx9tdpnvcfm.us-east-1.rds.amazonaws.com/tias_db"; // TODO: Set values in Parameter Store
        Properties props = new Properties();
        props.setProperty("user","cupsaws"); // TODO: Set values in Parameter Store
        props.setProperty("password","bemyguestputmypasswordtothetest1423!"); // TODO: Set values in Parameter Store
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
            getPeople(new int[]{3, 5});
            people.forEach((key, value) -> {
                System.out.println(key + "\t" + value);
            });
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
            people.put(rs.getInt("person_id"), new Person(rs.getString("first_name"), rs.getString("last_name"), rs.getBoolean("peer_teacher"), rs.getBoolean("teaching_assistant"), rs.getBoolean("administrator"), rs.getBoolean("professor")));
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
}