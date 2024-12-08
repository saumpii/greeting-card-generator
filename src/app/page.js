import GreetingCardGenerator from '@/components/greeting-card/card-preview';

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Greeting Card Generator</h1>
        <GreetingCardGenerator />
      </div>
    </main>
  );
}