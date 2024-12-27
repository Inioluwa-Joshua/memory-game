import MemoryGamePage from "@/components/MemoryGamePage";

async function getUserData(userId: string) {
  const response = await fetch(`https://gamesbyini.com/api/player/${userId}`);
  if (!response.ok) throw new Error("User not found");

  const data = await response.json();
  const player = data.player
  return player
}

export default async function Home({ params }: { params: { userid: string } }) {
  const { userid } = params;

  try {
    const userData = await getUserData(userid);
    return (
      <main className="">
        <MemoryGamePage userId={userid} userData={userData} />
      </main>
    );
  } catch (error) {
    return <div>User not found. Please check your user ID.</div>;
  }
}
