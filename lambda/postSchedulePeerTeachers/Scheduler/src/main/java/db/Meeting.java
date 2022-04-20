package db;

import java.sql.Time;
import java.lang.Math;

import org.postgresql.util.PGInterval;

public class Meeting {
    String weekday;
    Time startTime, endTime;
    String place;
    String meetingType;

    PGInterval duration;
    
    public Meeting(String weekday, Time startTime, Time endTime, String place, String meetingType, PGInterval duration) {
        this.weekday = weekday;
        this.startTime = startTime;
        this.endTime = endTime;
        this.place = place;
        this.meetingType = meetingType;
        this.duration = duration;
    }

    public String getWeekday() {
        return weekday;
    }

    public Time getStartTime() {
        return startTime;
    }

    public Time getEndTime() {
        return endTime;
    }

    public String getPlace() {
        return place;
    }

    public String getMeetingType() {
        return meetingType;
    }

    private static float roundHours(float hours, float interval_hours) {
        return interval_hours * (float)Math.ceil(hours / interval_hours);
    }

    public float getHours() {
        return roundHours(duration.getHours() + duration.getMinutes() / 60f, 0.25f);
    }

    @Override
    public String toString() {
        return "Meeting [endTime=" + endTime + ", meetingType=" + meetingType + ", place=" + place + ", startTime="
                + startTime + ", weekday=" + weekday + "]";
    }
}
