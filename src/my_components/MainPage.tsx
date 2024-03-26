export default function MainPage({ fullName }: { fullName: string }) {
  return (
    <main className="px-6">
      <p>Welcome {fullName}</p>
      <div>
        <p>Your Todo's</p>
      </div>
    </main>
  );
}
