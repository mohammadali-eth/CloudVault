export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Cookie Policy
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          We use essential cookies to ensure the basic functionality of Cloud Vault and to enhance your experience. No intrusive tracking is used.
        </p>
        <div className="pt-8">
          <a href="/" className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
