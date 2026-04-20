export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen px-6 py-10">

      {/* HERO */}
      <section className="mb-24">
        <h1 className="text-5xl font-bold mb-4">Vineet Shah</h1>
        <p className="text-lg text-gray-400 max-w-xl">
          I build AI-powered systems that actually work.
        </p>
      </section>

      {/* ABOUT */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold mb-4">About</h2>
        <p className="text-gray-400 max-w-xl">
          I don’t just write code. I build systems using AI-first workflows.
          From automation assistants to real-time safety systems,
          I focus on shipping fast and solving real problems.
        </p>
      </section>

      {/* PROJECTS */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>

        {/* Jarvis */}
        <div className="mb-10 p-6 border border-gray-800 rounded-xl hover:border-gray-600 transition">
          <h3 className="text-xl font-semibold mb-2">Jarvis AI Assistant</h3>
          <p className="text-gray-400 mb-3">
            AI assistant inspired by Tony Stark. Controls PC, automates tasks,
            sends WhatsApp messages, and integrates multiple AI tools.
          </p>

          <ul className="text-gray-400 list-disc ml-5 mb-4">
            <li>System control (apps, browser, music)</li>
            <li>WhatsApp automation</li>
            <li>Multi-AI routing</li>
            <li>Code & image generation</li>
          </ul>

          <a href="#" className="text-blue-400 hover:underline">
            View Demo
          </a>
        </div>

        {/* Fire System */}
        <div className="p-6 border border-gray-800 rounded-xl hover:border-gray-600 transition">
          <h3 className="text-xl font-semibold mb-2">Smart AI Fire Evacuation System</h3>
          <p className="text-gray-400 mb-3">
            Real-time system using CCTV feeds to detect fire, analyze crowd congestion,
            and guide people to the nearest safe exit.
          </p>

          <ul className="text-gray-400 list-disc ml-5">
            <li>Fire & smoke detection</li>
            <li>Crowd density analysis</li>
            <li>Congestion detection</li>
            <li>Smart evacuation routing</li>
          </ul>
        </div>
      </section>

      {/* BUILD PROCESS */}
      <section className="mb-24">
        <h2 className="text-2xl font-semibold mb-4">How I Build</h2>
        <p className="text-gray-400">
          Idea → Prompt → AI → Build → Iterate → Ship
        </p>
      </section>

      {/* CONTACT */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p className="text-gray-400">Email: vineetshah701@gmail.com</p>
        <p className="text-gray-400">Phone: +91 9764422413</p>
        <p className="text-gray-400">
          LinkedIn: https://www.linkedin.com/in/vineet-shah-70263721a/
        </p>
      </section>

    </main>
  );
}