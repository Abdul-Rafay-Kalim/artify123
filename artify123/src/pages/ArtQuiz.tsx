import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl">
          {!showResults ? (
            <>
              <button
                onClick={() => (currentQ > 0 ? setCurrentQ(currentQ - 1) : navigate("/"))}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              {/* Progress */}
              <div className="w-full h-1 bg-secondary rounded-full mb-8">
                <div
                  className="h-full bg-foreground rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                Question {currentQ + 1} of {questions.length}
              </p>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {questions[currentQ].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQ].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full text-left px-6 py-4 rounded-xl border transition-colors ${
                      answers[currentQ] === option
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={!answers[currentQ]}
                className="mt-8 rounded-full px-8"
              >
                {currentQ < questions.length - 1 ? "Next" : "See Results"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Your Art Style
              </h2>
              <p className="text-xl font-serif italic text-foreground mb-2">{result.genre}</p>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{result.description}</p>

              <div className="bg-secondary rounded-2xl p-8 text-left mb-8">
                <h3 className="font-medium text-foreground mb-4">We recommend exploring:</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec) => (
                    <li key={rec} className="flex items-center gap-2 text-foreground">
                      <span className="w-1.5 h-1.5 bg-foreground rounded-full" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" className="rounded-full" onClick={() => { setShowResults(false); setCurrentQ(0); setAnswers([]); }}>
                  Retake Quiz
                </Button>
                <Button className="rounded-full" onClick={() => navigate("/ai-curator")}>
                  Chat with AI Curator
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
