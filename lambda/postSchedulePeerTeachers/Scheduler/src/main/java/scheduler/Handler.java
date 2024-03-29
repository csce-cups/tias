package scheduler;

import java.sql.*;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

import software.amazon.awssdk.services.ssm.SsmClient;
import software.amazon.awssdk.services.ssm.model.GetParameterRequest;
import software.amazon.awssdk.services.ssm.model.GetParameterResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.postgresql.util.PGInterval;

import java.lang.StringBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Properties;
import java.util.Queue;
import java.util.stream.Collectors;

import db.Course;
import db.Meeting;
import db.Person;
import db.Preference;
import db.Section;

// https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html
public class Handler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    static Connection conn;

    static HashMap<Integer, Person> people;
    static HashMap<Integer, Course> courses;
    static HashMap<Integer, Section> sections;
    static HashMap<Integer /* section id */, ArrayList<Integer> /* person id */> schedule;
    static ArrayList<Integer> unscheduled;

    private static final Gson gson = new GsonBuilder().create();

    // https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/java-basic/src/main/java/example/Handler.java
    @SuppressWarnings("unchecked")
    @Override
    public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent event, final Context context)
    {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        String origin = event.getHeaders().getOrDefault("origin", null);
        if (origin == null) {
            event.getHeaders().getOrDefault("Origin", null);
        }
        if (origin == null) {
            event.getHeaders().getOrDefault("ORIGIN", null);
        }
        if (origin != null && (origin.equals("https://www.csce-scheduler.com") || origin.equals("http://localhost:3000"))) {
            headers.put("Access-Control-Allow-Origin", origin);
        }

        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent()
                .withHeaders(headers);

        GetParameterRequest parameterRequest = GetParameterRequest.builder()
                .name("/tias/prod/db-password")
                .withDecryption(true)
                .build();
        String dbpassword = null;
        try (SsmClient ssmclient = SsmClient.create()) {
            GetParameterResponse parameterResult = ssmclient.getParameter(parameterRequest);
            dbpassword = parameterResult.parameter().value();
        }

        HashMap<String, ArrayList<Double>> eventBody = gson.fromJson(event.getBody(), HashMap.class);

        try {
            generateSchedule(eventBody.get("peerTeachers").stream().mapToInt(Double::intValue).toArray(), dbpassword);
        } catch (Exception e) {
            e.printStackTrace();
            return response
                .withStatusCode(500)
                .withBody("{ \"message\": \"Scheduler Encountered an Error. Please check the logs in AWS or contact an Administrator.\" }");
        }

        return response
            .withStatusCode(200)
            .withBody(String.format("{ \"scheduled\": %s, \"unscheduled\": %s }", gson.toJson(schedule), gson.toJson(unscheduled)));
    }

    public static void generateSchedule(int[] peopleIds, String dbpassword) throws SQLException {
        // https://jdbc.postgresql.org/documentation/head/index.html
        String url = String.format("jdbc:postgresql://%s/%s", System.getenv("DB_ENDPOINT"), System.getenv("DB_NAME"));
        Properties props = new Properties();
        props.setProperty("user", System.getenv("DB_USERNAME"));
        props.setProperty("password", dbpassword);
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
        schedule = new HashMap<Integer, ArrayList<Integer>>();
        unscheduled = new ArrayList<Integer>();

        getCourses();
        getSections();
        for (Section section : sections.values()) {
            section.setCourseNumber(courses.get(section.getCourseId()).getCourseNumber());
        }
        getPeople(peopleIds);
        getViability(peopleIds);

        schedulePeopleToSections();
    }

    static String constructPersonQuery(int numPeople) {
        StringBuilder sb = new StringBuilder().append("SELECT * FROM \"Viability\" WHERE person_id IN (");
        for (int i = 0; i < numPeople - 1; ++i) {
            sb.append("?, ");
        }
        sb.append("?)");
        return sb.toString();
    }

    static void getViability(int[] peopleIds) throws SQLException {
        PreparedStatement st = conn.prepareStatement(constructPersonQuery(peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        ResultSet rs = st.executeQuery();

        while (rs.next())
        {
            Person person = people.get(rs.getInt("person_id"));

            person.addViableSection(rs.getInt("section_id"));

            String preference = rs.getString("preference");
            if (preference != null) {
                person.addPreference(new Preference(rs.getInt("section_id"), preference, rs.getString("course_number")));
            }
        }

        rs.close();
        st.close();
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
        PreparedStatement st = conn.prepareStatement(constructPersonQuery("person", peopleIds.length));

        for (int i = 0; i < peopleIds.length; ++i) {
            st.setInt(i + 1, peopleIds[i]);
        }

        ResultSet rs = st.executeQuery();

        while (rs.next())
        {
            people.put(rs.getInt("person_id"), new Person(rs.getInt("person_id"), rs.getString("email"), rs.getString("first_name"), rs.getString("last_name"), rs.getFloat("desired_number_assignments"), rs.getBoolean("peer_teacher"), rs.getBoolean("teaching_assistant"), rs.getBoolean("administrator"), rs.getBoolean("professor")));
        }

        rs.close();
        st.close();
    }

    static void getSections() throws SQLException {
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM course_section");
        HashSet<Integer> onlineCourses = new HashSet<>();
        while (rs.next())
        {
            sections.put(rs.getInt("section_id"), new Section(rs.getInt("section_id"), rs.getInt("course_id"), rs.getString("section_number"), rs.getInt("capacity_peer_teachers"), rs.getInt("capacity_teaching_assistants")));
            onlineCourses.add(rs.getInt("section_id"));
        }
        rs.close();
        st.close();

        st = conn.createStatement();
        rs = st.executeQuery("SELECT *, (end_time - start_time) AS duration FROM section_meeting WHERE meeting_type='Laboratory'");
        while (rs.next())
        {
            sections.get(rs.getInt("section_id")).addMeeting(new Meeting(rs.getString("weekday"), rs.getTime("start_time"), rs.getTime("end_time"), rs.getString("place"), rs.getString("meeting_type"), (PGInterval)rs.getObject("duration")));
            onlineCourses.remove(rs.getInt("section_id"));
        }
        rs.close();
        st.close();

        for (int sectionId : onlineCourses) {
            sections.remove(sectionId);
        }
    }

    static void addIfPossible(Person person, Section section) {
        if (section.getAssignedPTs() < section.getCapacityPTs() && person.getHoursAssigned() + section.getHours() <= person.getDesiredNumberAssignments()) {
            boolean alreadyAssigned = false;
            for (Meeting meeting : section.getMeetings()) {
                if (person.alreadyAssigned(meeting.getWeekday(), meeting.getStartTime(), meeting.getEndTime())) {
                    alreadyAssigned = true;
                }
            }
            if (!alreadyAssigned) {
                section.addAssignedPTs();
                person.addCurrentAssignment(section);
                schedule.putIfAbsent(section.getSectionId(), new ArrayList<>());
                schedule.get(section.getSectionId()).add(person.getPersonId());
            }
        }
    }

    static void addLeftovers(Person person, Queue<Section> leftovers) {
        for (Section section : leftovers) {
            if (person.getHoursAssigned() >= person.getDesiredNumberAssignments()) break;
            addIfPossible(person, section);
        }
        leftovers.clear();
    }

    static void schedulePeopleToSections() {
        people.forEach((person_id, person) -> {
            person.computeAvailabilityScore(sections);
        });

        PriorityQueue<Person> queue = new PriorityQueue<>(people.values());

        while (!queue.isEmpty()) {
            Person frontPerson = queue.remove();

            HashSet<Integer> possibleSections = new HashSet<>();
            possibleSections.addAll(
                frontPerson.getViableSections().stream()
                    .filter(sectionId ->  frontPerson.isGoodSection(sectionId))
                    .collect(Collectors.toSet())
            );

            LinkedList<Integer> badSections = new LinkedList<>();

            LinkedList<Section> leftovers = new LinkedList<>(); // nonempty preferred sections

            // Schedule what you prefer or marked indifferent
            for (Preference preference : frontPerson.getSortedPreferences()) {
                if (frontPerson.getHoursAssigned() >= frontPerson.getDesiredNumberAssignments()) break;
                if (!possibleSections.contains(preference.getSectionId())) continue;
                if (preference.isPreferable()) {
                    Section section = sections.get(preference.getSectionId());
                    if (section.getAssignedPTs() > 0) {
                        leftovers.add(section);
                    } else {
                        addIfPossible(frontPerson, section);
                    }
                } else {
                    badSections.add(preference.getSectionId());
                }
                possibleSections.remove(preference.getSectionId());
            }

            addLeftovers(frontPerson, leftovers);

            LinkedList<Integer> nullPreferenceSections = new LinkedList<>();
            nullPreferenceSections.addAll(possibleSections);
            nullPreferenceSections.sort(Collections.reverseOrder());

            // Schedule what you didn't mark at all -- user never sets any preferences
            if (frontPerson.getHoursAssigned() < frontPerson.getDesiredNumberAssignments()) {
                for (int sectionId : nullPreferenceSections) {
                    if (frontPerson.getHoursAssigned() >= frontPerson.getDesiredNumberAssignments()) break;
                    Section section = sections.get(sectionId);
                    if (section.getAssignedPTs() > 0) {
                        leftovers.add(section);
                    } else {
                        addIfPossible(frontPerson, section);
                    }
                }
            }

            addLeftovers(frontPerson, leftovers);

            // Schedule what you marked as not preferred
            if (frontPerson.getHoursAssigned() < frontPerson.getDesiredNumberAssignments()) {
                for (int sectionId : badSections) {
                    if (frontPerson.getHoursAssigned() >= frontPerson.getDesiredNumberAssignments()) break;
                    Section section = sections.get(sectionId);
                    if (section.getAssignedPTs() > 0) {
                        leftovers.add(section);
                    } else {
                        addIfPossible(frontPerson, section);
                    }
                }
            }
            
            addLeftovers(frontPerson, leftovers);

            if (frontPerson.getNumberCurrentlyAssigned() == 0) {
                unscheduled.add(frontPerson.getPersonId());
            }

            // At this stage you are either satisfied or you cannot be fully satisfied because there aren't enough available, qualified labs that you can do that fulfill the number of desired labs. This is an extremely unlikely occurrence.
        }
    }
}