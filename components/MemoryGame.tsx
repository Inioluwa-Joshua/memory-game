"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const generateDeck = () => {
  const memoryCards = [
    "dwarf",
    "orc-connector",
    "elf",
    "orcish-ai-nextjs-framework",
    "orcishcity",
    "orcishlogo",
    "orcishmage",
    "textualgames",
  ];

  const deck = [...memoryCards, ...memoryCards];
  return deck.sort(() => Math.random() - 0.5);
};

interface MemoryGameProps {
  userId: string;
  userData: { username: string };
}

export default function MemoryGame({ userId, userData }: MemoryGameProps) {
  const [cards, setCards] = useState<string[]>(generateDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [moves, setMoves] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  console.log(userData);

  const saveGameStart = async () => {
    await fetch(`/api/game/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        username: userData.username,
        gameType: "memory-game",
        startTime: new Date().toISOString(),
      }),
    });
  };

  const saveGameResult = async (endTime: string) => {
    const timeTaken = completionTime || 60 - timeLeft;
    await fetch(`/api/game/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        username: userData.username,
        moves,
        endTime,
        timeTaken,
      }),
    });
  };

  useEffect(() => {
    const checkForMatch = () => {
      const [first, second] = flipped;

      if (cards[first] === cards[second]) {
        setSolved([...solved, ...flipped]);
      }
      setFlipped([]);
    };

    if (flipped.length === 2) {
      setTimeout(() => {
        checkForMatch();
      }, 1000);
      setMoves((prevMoves) => prevMoves + 1);
    }
  }, [cards, flipped, solved]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            endGame();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStarted, timeLeft]);

  const handleClick = (index: number) => {
    if (!flipped.includes(index) && flipped.length < 2) {
      setFlipped([...flipped, index]);
    }
  };

  const startGame = async () => {
    setShowWelcomeModal(false);
    setGameStarted(true);
    await saveGameStart();
  };

  const endGame = async () => {
    setShowResultModal(true);
    setGameStarted(false);
    const endTime = new Date().toISOString();
    if (completionTime === null) setCompletionTime(60 - timeLeft);
    await saveGameResult(endTime);
  };

  useEffect(() => {
    if (solved.length === cards.length && gameStarted) {
      setCompletionTime(60 - timeLeft);
      endGame();
    }
  }, [solved, cards, gameStarted, timeLeft]);

  return (
    <div className="text-center">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md w-80">
            <h2 className="text-lg font-bold  text-black">
              Welcome, {userData.username}!
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Rules: Flip the cards to find all matching pairs. You have 60
              seconds to complete the game. Good luck!
            </p>
            <button
              onClick={startGame}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Start Game
            </button>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-5 rounded-md w-80">
            <h2 className="text-lg font-bold text-black">
              {solved.length === cards.length ? "You Won! 🎉" : "Time's Up! 😢"}
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              Moves: {moves}
              <br />
              {solved.length === cards.length && completionTime !== null ? (
                <>Completion Time: {completionTime} seconds</>
              ) : (
                <>Time Left: {timeLeft} seconds</>
              )}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold">Memory Game</h1>
      <p className="mt-2 text-gray-500">Time Left: {timeLeft} seconds</p>
      <p className="mt-2 text-gray-500">Moves: {moves}</p>
      <div className="grid grid-cols-4 md:grid-cols-4 gap-5 mt-5">
        {cards.map((card, index) => (
          <div
            className={`flex justify-center text-4xl font-bold text-black items-center w-20 h-20 md:w-28 md:h-28 bg-slate-200 transform cursor-pointer transition-transform duration-300 ${
              flipped.includes(index) || solved.includes(index)
                ? "rotate-180"
                : ""
            }`}
            key={index}
            onClick={() => handleClick(index)}
          >
            {flipped.includes(index) || solved.includes(index) ? (
              <Image
                className="rotate-180"
                src={`/memory-cards/${card}.webp`}
                fill
                alt="Memory Card"
              />
            ) : (
              "?"
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
