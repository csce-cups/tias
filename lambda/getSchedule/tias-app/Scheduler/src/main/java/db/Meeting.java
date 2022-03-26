package db;

import java.sql.Time;

public class Meeting {
    String weekday;
    Time startTime, endTime;
    String place;
    String meetingType;
    
    public Meeting(String weekday, Time startTime, Time endTime, String place, String meetingType) {
        this.weekday = weekday;
        this.startTime = startTime;
        this.endTime = endTime;
        this.place = place;
        this.meetingType = meetingType;
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

    @Override
    public String toString() {
        return "Meeting [endTime=" + endTime + ", meetingType=" + meetingType + ", place=" + place + ", startTime="
                + startTime + ", weekday=" + weekday + "]";
    }
}
