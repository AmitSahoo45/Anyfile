import { LandingContent } from './components';

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <LandingContent />
      </main>
      <footer className="flex items-center justify-center gap-6 py-4">
        {/* footer content */}
      </footer>
    </>
  );
}
