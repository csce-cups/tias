import java.sql.*;
import java.util.Properties;

class Person {
    private int person_id;

}

class Driver {
    static Connection conn;

    static String constructQuery(String[] peopleIds) {
        StringBuilder sb = new StringBuilder()
            .append("SELECT")
            .append("person.person_id,")
            .append("person_availability.weekday person_availability.start_time, person_availability.end_time") // FIXME: Not joined yet
            .append("FROM mytable")
            .append("WHERE columnfoo IN (");
        for (int i = 0; i < peopleIds.length - 1; ++i) {
            sb.append("?,");
        }
        sb.append("?)");
        // TODO Add JOIN or multiple JOINs
        return sb.toString();
    }

    static void getPeople(String[] peopleIds) throws SQLException {
        PreparedStatement st = conn.prepareStatement(constructQuery(peopleIds));
        for (int i = 0; i < peopleIds.length; ++i) {
            st.setString(i + 1, peopleIds[0]); // Avoid SQL Injection
        }
        ResultSet rs = st.executeQuery();
        // TODO use ResultSet rs
    }

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
}