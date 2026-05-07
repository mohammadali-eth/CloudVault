export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          By using Cloud Vault, you agree to our terms of service. We are committed to providing a reliable and secure file management experience.
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
