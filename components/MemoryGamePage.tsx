"use client";

import MemoryGame from "@/components/MemoryGame";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
  userData: { username: string };
}

export default function MemoryGamePage({ userId, userData }: Props) {
  const [canPlay, setCanPlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(`/api/game/status?userId=${userId}`);
        const data = await response.json();

        if (data.hasPlayed) {
          setShowModal(true); // Show modal if the user has already played
        } else {
          setCanPlay(true); // Allow user to play
        }
      } catch (error) {
        console.error("Error checking game status:", error);
      }
    }

    fetchStatus();
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold">Access Denied</h2>
            <p>You have already completed the tournament game.</p>
            <button
              onClick={() => (window.location.href = "http://localhost:3000")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
      {canPlay && <MemoryGame userId={userId} userData={userData} />}
    </main>
  );
}
