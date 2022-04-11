package db;

import java.sql.Time;

public class Unavailability {
    String weekday;
    Time startTime, endTime;
    
    public Unavailability(String weekday, Time startTime, Time endTime) {
        this.weekday = weekday;
        this.startTime = startTime;
        this.endTime = endTime;
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

    @Override
    public String toString() {
        return "Availability [endTime=" + endTime + ", startTime=" + startTime + ", weekday=" + weekday + "]";
    }
}
