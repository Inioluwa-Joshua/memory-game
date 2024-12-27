"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const InvalidUser = () => {
  const [countdown, setCountdown] = useState(5); // Countdown in seconds
  const [reason, setReason] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Parse query parameters manually
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      setReason(searchParams.get("reason"));
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer); // Clear interval when countdown reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/"); // Redirect to the main site
    }, 5000); // Redirect after 5 seconds

    return () => {
      clearInterval(timer); // Clean up interval
      clearTimeout(redirectTimer); // Clean up timeout
    };
  }, [router]);

  const getReasonMessage = () => {
    switch (reason) {
      case "missing_user_id":
        return "User ID is missing. Please ensure you access the game from the correct link.";
      case "user_not_found":
        return "The player account was not found. Please register on the main website to access the game.";
      case "server_error":
        return "There was an issue validating your account. Please try again later.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p className="mb-4">{getReasonMessage()}</p>
        {countdown > 0 ? (
          <p>Redirecting to the main site in {countdown} seconds...</p>
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default InvalidUser;
