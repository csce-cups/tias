import java.sql.*;
import java.util.HashMap;
import java.util.Properties;

import db.Person;
import db.Preference;
import db.Qualification;
import db.Section;
import db.Availability;
import db.Course;

public class Driver {
    static Connection conn;

    static HashMap<Integer, Person> people;
    static HashMap<Integer, Course> courses;
    static HashMap<Integer, Section> sections;

    public static void main(String[] args) {
        // https://jdbc.postgresql.org/documentation/head/index.html
        String url = "jdbc:postgresql://localhost/test"; // TODO: Set values in Parameter Store
        Properties props = new Properties();
        props.setProperty("user","username"); // TODO: Set values in Parameter Store
        props.setProperty("password","secret"); // TODO: Set values in Parameter Store
        props.setProperty("ssl","true"); // TODO: Set values in Parameter Store
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
            getTypeMapping();
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
        ResultSet rs = st.executeQuery("SELECT course_id, department, course_number, course_name FROM courses");
        while (rs.next())
        {
            courses.put(rs.getInt("course_id"), new Course(rs.getString("department"), rs.getString("course_number"), rs.getString("course_name")));
        }
        rs.close();
        st.close();
    }

    static String constructPeopleQuery(int numPeople) {
        StringBuilder sb = new StringBuilder()
            .append("SELECT")
            .append("person.person_id, person.first_name, person.last_name, person.peer_teacher, person.teaching_assistant, person.administrator, person.professor,")
            .append("person_availability.weekday, person_availability.start_time, person_availability.end_time,")
            .append("section_assignment_preference.section_id, section_assignment_preference.preference,")
            .append("qualification.course_id, qualification.grade")
            .append("FROM person")
            .append("WHERE person.person_id IN (");
        for (int i = 0; i < numPeople - 1; ++i) {
            sb.append("?,");
        }
        sb.append("?)")
            .append("LEFT OUTER JOIN person_availability")
            .append("WHERE person.person_id = person_availability.person_id")
            .append("LEFT OUTER JOIN section_assignment_preference")
            .append("WHERE person.person_id = section_assignment_preference.person_id")
            .append("LEFT OUTER JOIN qualification")
            .append("WHERE person.person_id = qualification.person_id");
        return sb.toString();
    }

    static void getPeople(String[] peopleIds) throws SQLException {
        PreparedStatement st = conn.prepareStatement(constructPeopleQuery(peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setString(i + 1, peopleIds[0]);
        }

        ResultSet rs = st.executeQuery();

        while (rs.next())
        {
            Person added = people.putIfAbsent(rs.getInt("person_id"), new Person(rs.getString("first_name"), rs.getString("last_name"), rs.getBoolean("peer_teacher"), rs.getBoolean("teaching_assistant"), rs.getBoolean("administrator"), rs.getBoolean("professor")));

            added.addAvailability(new Availability(rs.getString("weekday"), rs.getTime("start_time"), rs.getTime("end_time")));

            added.addPreference(new Preference(rs.getInt("section_id"), rs.getString("preference")));

            added.addQualification(new Qualification(rs.getInt("course_id"), (Character) rs.getObject("grade")));
        }

        rs.close();
        st.close();
    }

    static void getSections() throws SQLException {
        // TODO
    }
}