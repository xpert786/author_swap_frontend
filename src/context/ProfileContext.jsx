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
                return null;
            }

            // Only set global loading for initial fetch
            if (!profile) setLoading(true);
            
            // Fetch both profile and subscription data
            const [{ data: profileData }, { data: subData }] = await Promise.all([
                getProfile(),
                getSubscriberVerification().catch((err) => {
                    console.error("Subscription API error:", err);
                    return { data: null };
                })
            ]);
            
            const fetchedProfile = Array.isArray(profileData) ? profileData[0] : profileData;
            setProfile(fetchedProfile);
            // The subscription is directly in subData.subscription, not nested further
            const subscriptionData = subData?.subscription || null;
            setSubscription(subscriptionData);
            
            // Update localStorage with subscription status
            if (subscriptionData?.is_active === true) {
                localStorage.setItem("has_subscription", "true");
                localStorage.setItem("subscription_expiry", 
                    subscriptionData.active_until || subscriptionData.renew_date || ""
                );
            } else {
                // Ensure localStorage is updated if subscription is not active
                localStorage.removeItem("has_subscription");
                localStorage.removeItem("subscription_expiry");
            }
            
            return { profile: fetchedProfile, subscription: subscriptionData };
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            return null;
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
