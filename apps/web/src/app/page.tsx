export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
          JP App
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Website + Android App + Backend — all in one place.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
          >
            Learn More
          </a>
        </div>
      </div>
    </main>
  );
}
