import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../apis/profile";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            const { data } = await getProfile();
            setProfile(data);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const value = {
        profile,
        setProfile,
        loading,
        refreshProfile: fetchProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
