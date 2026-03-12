import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../apis/profile";
import { getSubscriberVerification } from "../apis/subscription";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            setLoading(true);
            
            // Fetch both profile and subscription data
            const [{ data: profileData }, { data: subData }] = await Promise.all([
                getProfile(),
                getSubscriberVerification().catch((err) => {
                    console.error("Subscription API error:", err);
                    return { data: null };
                })
            ]);
            
            console.log("Profile data:", profileData);
            console.log("Subscription data:", subData);
            
            setProfile(profileData);
            setSubscription(subData?.subscription || null);
            
            // Update localStorage with subscription status
            if (subData?.subscription?.is_active) {
                localStorage.setItem("has_subscription", "true");
                localStorage.setItem("subscription_expiry", 
                    subData.subscription.active_until || subData.subscription.renew_date || ""
                );
            }
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
        subscription,
        setSubscription,
        loading,
        refreshProfile: fetchProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};
