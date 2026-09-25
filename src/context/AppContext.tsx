"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { InstitutionRole, NotificationAlert, SurplusItem } from "@/lib/types";
import { INITIAL_NOTIFICATIONS, SURPLUS_ITEMS } from "@/lib/mockData";

export interface DonorHotel {
  id: string;
  name: string;
  location: string;
  totalPoints: number;
  totalDonations: number;
  avgRating: number;
  totalRatings: number;
  lastDonation: string;
  specialBadges: string[];
  streak: number;
  fssaiVerified: boolean;
}

export interface FeedbackEntry {
  id: string;
  hotelId: string;
  hotelName: string;
  date: string;
  foodQuality: number;
  packaging: number;
  timeliness: number;
  quantity: number;
  overallRating: number;
  comment: string;
  pointsAwarded: number;
}

export type DonorTier = "Platinum" | "Gold" | "Silver" | "Bronze";

export function getDonorTier(points: number): DonorTier {
  if (points >= 5000) return "Platinum";
  if (points >= 2000) return "Gold";
  if (points >= 500) return "Silver";
  return "Bronze";
}

const INITIAL_HOTELS: DonorHotel[] = [
  {
    id: "h-1",
    name: "The Oberoi New Delhi",
    location: "Dr. Zakir Hussain Marg",
    totalPoints: 6840,
    totalDonations: 147,
    avgRating: 4.8,
    totalRatings: 89,
    lastDonation: "Today, 1:30 PM",
    specialBadges: ["Consistent Donor", "Top Quality", "Cold Chain Certified"],
    streak: 34,
    fssaiVerified: true,
  },
  {
    id: "h-2",
    name: "IIT Delhi Central Mess",
    location: "Hauz Khas, New Delhi",
    totalPoints: 4250,
    totalDonations: 210,
    avgRating: 4.5,
    totalRatings: 156,
    lastDonation: "Today, 12:00 PM",
    specialBadges: ["Bulk Contributor", "Consistent Donor", "Zero Waste Champion"],
    streak: 52,
    fssaiVerified: true,
  },
  {
    id: "h-3",
    name: "Bikanervala Central Kitchen",
    location: "Okhla Phase III",
    totalPoints: 3180,
    totalDonations: 98,
    avgRating: 4.3,
    totalRatings: 64,
    lastDonation: "Yesterday, 5:00 PM",
    specialBadges: ["Festival Support", "Rapid Response"],
    streak: 18,
    fssaiVerified: true,
  },
  {
    id: "h-4",
    name: "AIIMS Staff Cafeteria",
    location: "Ansari Nagar, New Delhi",
    totalPoints: 1850,
    totalDonations: 65,
    avgRating: 4.1,
    totalRatings: 42,
    lastDonation: "Sep 23, 3:30 PM",
    specialBadges: ["Weekend Hero"],
    streak: 8,
    fssaiVerified: true,
  },
  {
    id: "h-5",
    name: "Rajdhani Thali House",
    location: "Connaught Place",
    totalPoints: 920,
    totalDonations: 34,
    avgRating: 3.9,
    totalRatings: 22,
    lastDonation: "Sep 22, 6:00 PM",
    specialBadges: ["Rapid Response"],
    streak: 5,
    fssaiVerified: false,
  },
  {
    id: "h-6",
    name: "Street Food Collective — Chandni Chowk",
    location: "Chandni Chowk, Old Delhi",
    totalPoints: 380,
    totalDonations: 12,
    avgRating: 3.7,
    totalRatings: 8,
    lastDonation: "Sep 20, 4:15 PM",
    specialBadges: [],
    streak: 3,
    fssaiVerified: false,
  },
];

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: "fb-1",
    hotelId: "h-1",
    hotelName: "The Oberoi New Delhi",
    date: "Sep 24, 2026",
    foodQuality: 5,
    packaging: 5,
    timeliness: 4,
    quantity: 5,
    overallRating: 4.8,
    comment: "Excellent quality food, well-packaged in insulated containers. Arrived fresh and warm.",
    pointsAwarded: 85,
  },
  {
    id: "fb-2",
    hotelId: "h-2",
    hotelName: "IIT Delhi Central Mess",
    date: "Sep 24, 2026",
    foodQuality: 4,
    packaging: 4,
    timeliness: 5,
    quantity: 5,
    overallRating: 4.5,
    comment: "Large quantity, always on time. Good basic food that feeds many people.",
    pointsAwarded: 70,
  },
  {
    id: "fb-3",
    hotelId: "h-3",
    hotelName: "Bikanervala Central Kitchen",
    date: "Sep 23, 2026",
    foodQuality: 5,
    packaging: 3,
    timeliness: 4,
    quantity: 4,
    overallRating: 4.0,
    comment: "Great food quality. Packaging could be improved — some containers leaked during transport.",
    pointsAwarded: 55,
  },
];

interface AppContextType {
  currentRole: InstitutionRole;
  setCurrentRole: (role: InstitutionRole) => void;
  notifications: NotificationAlert[];
  unreadCount: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  surplusList: SurplusItem[];
  requestNgoPickup: (surplusId: string, ngoName: string) => void;
  isBatchPrioritized: boolean;
  prioritizeBatch: () => void;
  isTechnicianAssigned: boolean;
  assignTechnician: () => void;
  managerOverride: { meals: number; reason: string } | null;
  saveManagerOverride: (meals: number, reason: string) => void;
  acceptedPickups: string[];
  acceptNgoPickup: (itemId: string) => void;
  isApiInspectorOpen: boolean;
  setIsApiInspectorOpen: (open: boolean) => void;
  // Donor feedback & points
  donorHotels: DonorHotel[];
  donorFeedback: FeedbackEntry[];
  rankedHotels: DonorHotel[];
  submitDonorFeedback: (hotelId: string, ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number }, comment: string) => number;
  getHotelRank: (hotelId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<InstitutionRole>("KITCHEN_MANAGER");
  const [notifications, setNotifications] = useState<NotificationAlert[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [surplusList, setSurplusList] = useState<SurplusItem[]>(SURPLUS_ITEMS);
  const [isBatchPrioritized, setIsBatchPrioritized] = useState(false);
  const [isTechnicianAssigned, setIsTechnicianAssigned] = useState(false);
  const [managerOverride, setManagerOverride] = useState<{ meals: number; reason: string } | null>(null);
  const [acceptedPickups, setAcceptedPickups] = useState<string[]>([]);
  const [isApiInspectorOpen, setIsApiInspectorOpen] = useState(false);
  const [donorHotels, setDonorHotels] = useState<DonorHotel[]>(INITIAL_HOTELS);
  const [donorFeedback, setDonorFeedback] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const requestNgoPickup = (surplusId: string, ngoName: string) => {
    setSurplusList((prev) =>
      prev.map((item) =>
        item.id === surplusId
          ? {
              ...item,
              matchedNgo: ngoName,
              status: "SAFE",
            }
          : item
      )
    );

    // Add notification
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Redistribution Pickup Dispatched",
      message: `Pickup scheduled with ${ngoName} for ${
        surplusList.find((s) => s.id === surplusId)?.item || "Surplus"
      }. Driver dispatched.`,
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const prioritizeBatch = () => {
    setIsBatchPrioritized(true);
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Batch TOM-2024-0234 Prioritized",
      message: "Batch moved to Front of Line for Ketchup Processing Unit 2. Production rerouted to salvage 2,800 kg.",
      time: "Just now",
      severity: "success",
      category: "Factory",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const assignTechnician = () => {
    setIsTechnicianAssigned(true);
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Technician Dispatched for PM-03",
      message: "Work Order #WO-891 assigned to Rajesh Kumar. Abrasive drum & blade alignment scheduled at 3:00 PM shift change.",
      time: "Just now",
      severity: "info",
      category: "IoT",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const saveManagerOverride = (meals: number, reason: string) => {
    setManagerOverride({ meals, reason });
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Prediction Human Override Applied",
      message: `Manager adjusted tomorrow's target to ${meals} meals (Reason: ${reason}). Model feedback recorded for continuous learning.`,
      time: "Just now",
      severity: "info",
      category: "Kitchen",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const acceptNgoPickup = (itemId: string) => {
    setAcceptedPickups((prev) => [...prev, itemId]);
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: "Pickup Confirmed by NGO",
      message: "Your volunteer driver assigned. Verification OTP generated. Thank you for preventing waste!",
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Calculate points from ratings
  const calculatePoints = (ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number }) => {
    const total = ratings.foodQuality + ratings.packaging + ratings.timeliness + ratings.quantity;
    const avg = total / 4;
    if (avg >= 4.5) return 85;
    if (avg >= 4.0) return 70;
    if (avg >= 3.5) return 55;
    if (avg >= 3.0) return 40;
    if (avg >= 2.0) return 25;
    return 10;
  };

  const submitDonorFeedback = (
    hotelId: string,
    ratings: { foodQuality: number; packaging: number; timeliness: number; quantity: number },
    comment: string
  ): number => {
    const points = calculatePoints(ratings);
    const avg = (ratings.foodQuality + ratings.packaging + ratings.timeliness + ratings.quantity) / 4;
    const hotel = donorHotels.find((h) => h.id === hotelId);
    if (!hotel) return 0;

    // Update hotel points and rating
    setDonorHotels((prev) =>
      prev.map((h) => {
        if (h.id !== hotelId) return h;
        const newTotalRatings = h.totalRatings + 1;
        const newAvgRating = Math.round(((h.avgRating * h.totalRatings + avg) / newTotalRatings) * 10) / 10;
        return {
          ...h,
          totalPoints: h.totalPoints + points,
          totalRatings: newTotalRatings,
          avgRating: newAvgRating,
          lastDonation: "Just now",
        };
      })
    );

    // Add feedback entry
    const newFeedback: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      hotelId,
      hotelName: hotel.name,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      foodQuality: ratings.foodQuality,
      packaging: ratings.packaging,
      timeliness: ratings.timeliness,
      quantity: ratings.quantity,
      overallRating: Math.round(avg * 10) / 10,
      comment,
      pointsAwarded: points,
    };
    setDonorFeedback((prev) => [newFeedback, ...prev]);

    // Add notification
    const newNotif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      title: `+${points} Points Awarded to ${hotel.name}`,
      message: `NGO feedback submitted: ${avg.toFixed(1)}/5 avg rating. ${points} points added to donor leaderboard.`,
      time: "Just now",
      severity: "success",
      category: "Redistribution",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return points;
  };

  // Sorted by points (descending) for ranking
  const rankedHotels = useMemo(
    () => [...donorHotels].sort((a, b) => b.totalPoints - a.totalPoints),
    [donorHotels]
  );

  const getHotelRank = (hotelId: string): number => {
    const idx = rankedHotels.findIndex((h) => h.id === hotelId);
    return idx >= 0 ? idx + 1 : -1;
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        notifications,
        unreadCount,
        isNotificationOpen,
        setIsNotificationOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        isOnboardingOpen,
        setIsOnboardingOpen,
        surplusList,
        requestNgoPickup,
        isBatchPrioritized,
        prioritizeBatch,
        isTechnicianAssigned,
        assignTechnician,
        managerOverride,
        saveManagerOverride,
        acceptedPickups,
        acceptNgoPickup,
        isApiInspectorOpen,
        setIsApiInspectorOpen,
        donorHotels,
        donorFeedback,
        rankedHotels,
        submitDonorFeedback,
        getHotelRank,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
