import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const [focusStreak, setFocusStreak] = useState(0);
    const [focusTimer, setFocusTimer] = useState(0);
    const [hoursFocused, setHoursFocused] = useState(0);
    const [goal, setGoal] = useState(0);
    const [peakFocusHours, setPeakFocusHours] = useState([]);

    return (
        <DashboardContext.Provider value={{
            focusStreak,
            setFocusStreak,
            focusTimer,
            setFocusTimer,
            hoursFocused,
            setHoursFocused,
            goal,
            setGoal,
            peakFocusHours,
            setPeakFocusHours
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    return useContext(DashboardContext);
};