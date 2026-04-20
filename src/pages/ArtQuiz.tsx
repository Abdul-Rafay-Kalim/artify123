import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const questions = [
  {
    question: "What kind of environment inspires you the most?",
    options: ["Nature & Landscapes", "Urban & Architecture", "Outer Space & Cosmos", "Interior & Still Life"],
  },
  {
    question: "Which color palette speaks to you?",
    options: ["Warm tones (reds, oranges, yellows)", "Cool tones (blues, greens, purples)", "Monochrome (black & white)", "Vibrant & Multicolored"],
  },
  {
    question: "What mood do you want your art to evoke?",
    options: ["Calm & Peaceful", "Bold & Energetic", "Mysterious & Thought-provoking", "Joyful & Playful"],
  },
  {
    question: "Which art style catches your eye?",
    options: ["Realistic & Photographic", "Abstract & Experimental", "Impressionist & Painterly", "Minimalist & Geometric"],
  },
  {
    question: "Where would you display this art?",
    options: ["Living room", "Bedroom", "Office or workspace", "Gallery wall or hallway"],
  },
];

type GenreResult = {
  genre: string;
  description: string;
  recommendations: string[];
};

const genreMap: Record<string, GenreResult> = {
  "Nature & Landscapes": {
    genre: "Landscape & Nature Art",
    description: "You're drawn to the beauty of the natural world. Expansive vistas, serene forests, and dramatic skies speak to your soul.",
    recommendations: ["Watercolor landscapes", "Plein air oil paintings", "Nature photography prints"],
  },
  "Abstract & Experimental": {
    genre: "Abstract & Contemporary",
    description: "You appreciate art that challenges perception and pushes boundaries. Form, color, and texture matter more than representation.",
    recommendations: ["Abstract expressionism", "Mixed media collages", "Geometric abstractions"],
  },
  "Calm & Peaceful": {
    genre: "Meditative & Zen Art",
    description: "You seek tranquility and mindfulness through art. Soft tones and flowing compositions help you find inner peace.",
    recommendations: ["Minimalist ink wash", "Soft pastel abstracts", "Zen-inspired photography"],
  },
  default: {
    genre: "Eclectic & Modern",
    description: "You have diverse taste that spans multiple genres. You appreciate both classic techniques and contemporary expression.",
    recommendations: ["Contemporary mixed media", "Modern figurative art", "Digital art prints"],
  },
};

const optionBadge = ["A", "B", "C", "D"];

const ArtQuiz = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
    }
  };

  const getResult = (): GenreResult => {
    const key = answers[0] || answers[3] || answers[2] || "default";
    return genreMap[key] || genreMap.default;
  };

  const result = getResult();
  const progress = ((currentQ + 1) / questions.length) * 100;
  const answeredCount = answers.filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="relative flex-1 overflow-hidden pt-24 pb-16">
        <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />

        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          {!showResults ? (
            <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <aside className="h-fit rounded-3xl border border-foreground/10 bg-white/70 p-6 shadow-[0_25px_60px_-45px_rgba(0,0,0,0.4)] backdrop-blur lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70">
                  <Sparkles className="h-4 w-4" />
                  AI Quiz Journey
                </div>
                <h2 className="mt-5 font-serif text-3xl leading-tight">Find Your Signature Art Taste</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Answer a few short questions and get a personalized style direction with curated recommendations.
                </p>

                <div className="mt-6 rounded-2xl border border-foreground/10 bg-white p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Answered</span>
                    <span className="font-semibold">{answeredCount}/{questions.length}</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-foreground transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {questions.map((q, idx) => (
                    <div key={q.question} className={`rounded-xl border px-3 py-2 text-xs ${idx === currentQ ? "border-foreground bg-foreground text-background" : "border-foreground/10 bg-white text-foreground/70"}`}>
                      Q{idx + 1}: {answers[idx] ? "Answered" : "Pending"}
                    </div>
                  ))}
                </div>
              </aside>

              <section className="rounded-3xl border border-foreground/10 bg-white/85 p-6 shadow-[0_25px_60px_-45px_rgba(0,0,0,0.45)] backdrop-blur md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Question {currentQ + 1} of {questions.length}
                  </p>
                  <button
                    onClick={() => (currentQ > 0 ? setCurrentQ(currentQ - 1) : navigate("/"))}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-4 py-1.5 text-xs text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                </div>

                <h2 className="mt-3 text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  {questions[currentQ].question}
                </h2>

                <div className="mt-8 space-y-3">
                  {questions[currentQ].options.map((option, idx) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`group flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                        answers[currentQ] === option
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/15 bg-white hover:border-foreground/40"
                      }`}
                    >
                      <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${answers[currentQ] === option ? "bg-white/20 text-white" : "bg-secondary text-foreground/70"}`}>
                        {optionBadge[idx]}
                      </span>
                      <span>{option}</span>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQ]}
                  className="mt-8 h-12 rounded-full px-8"
                >
                  {currentQ < questions.length - 1 ? "Next Question" : "Reveal My Style"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </section>
            </div>
          ) : (
            <div className="animate-fade-in rounded-3xl border border-foreground/10 bg-white/85 p-8 text-center shadow-[0_30px_70px_-45px_rgba(0,0,0,0.55)] backdrop-blur md:p-12">
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background">
                <Wand2 className="h-6 w-6" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">Your Curator Result</p>
              <h2 className="mt-3 text-4xl md:text-6xl font-serif font-bold text-foreground">
                {result.genre}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground leading-7">{result.description}</p>

              <div className="mx-auto mt-8 grid max-w-3xl gap-4 md:grid-cols-3">
                {result.recommendations.map((rec) => (
                  <div key={rec} className="rounded-2xl border border-foreground/10 bg-white p-5 text-left">
                    <CheckCircle2 className="h-5 w-5 text-foreground" />
                    <p className="mt-3 text-sm font-medium text-foreground">{rec}</p>
                  </div>
                ))}
              </div>

              <Button
                className="mt-10 h-12 rounded-full px-8"
                onClick={() => navigate("/ai-curator")}
              >
                Chat with AI Curator
              </Button>

              <div className="mt-6 flex flex-wrap gap-4 justify-center">
                <Button variant="outline" className="rounded-full" onClick={() => { setShowResults(false); setCurrentQ(0); setAnswers([]); }}>
                  Retake Quiz
                </Button>
                <Button className="rounded-full" onClick={() => navigate("/explore")}>
                  Explore Matching Art
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArtQuiz;
