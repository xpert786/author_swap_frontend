import React from "react";

const PlaceholderPage = ({ title }) => (
    <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-20 flex flex-col items-center justify-center text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <p className="text-lg font-medium">This page is coming soon!</p>
            <p className="text-sm">We're working hard to bring you the {title} tools.</p>
        </div>
    </div>
);

export const NewsletterSlot = () => <PlaceholderPage title="Newsletter Slot" />;
export const SwapManagement = () => <PlaceholderPage title="Swap Management" />;
export const Analytics = () => <PlaceholderPage title="Subscriber & Analytics" />;
export const Reputation = () => <PlaceholderPage title="Author Reputation" />;
