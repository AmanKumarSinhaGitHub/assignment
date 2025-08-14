interface QuestionCard {
  id: number;
  title: string;
  description: string;
  route: string;
}

const questions: QuestionCard[] = [
  {
    id: 1,
    title: "Roman Numerals Converter",
    description: "Convert numbers to Roman numerals using JavaScript logic",
    route: "/ques1"
  },
  {
    id: 2,
    title: "Paginated Product List",
    description: "Implement pagination using dummy API without UI libraries",
    route: "/ques2"
  },
  {
    id: 3,
    title: "Debounced Search",
    description: "Build a search bar with debounced API calls",
    route: "/ques3"
  },
  {
    id: 4,
    title: "API Rate Limiting",
    description: "Implement rate limiting in Next.js API routes",
    route: "/ques4"
  },
  {
    id: 5,
    title: "NextAuth Authentication",
    description: "Role-based access control using NextAuth.js",
    route: "/ques5"
  },
  {
    id: 6,
    title: "Infinite Scroll",
    description: "Create infinite scrolling product list",
    route: "/ques6"
  },
  {
    id: 7,
    title: "Custom Toast System",
    description: "Build a reusable toast notification system",
    route: "/ques7"
  },
  {
    id: 8,
    title: "Nested Comments",
    description: "Implement a comment section with nested replies",
    route: "/ques8"
  },
  {
    id: 9,
    title: "Theme Toggle",
    description: "Create light/dark mode toggle with persistence",
    route: "/ques9"
  },
  {
    id: 10,
    title: "File Upload",
    description: "File upload with preview functionality",
    route: "/ques10"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Full Stack Developer Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Click on any card to view the solution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <a
              key={question.id}
              href={question.route}
              className="transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      Question {question.id}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {question.title}
                  </h2>
                  <p className="text-gray-600">
                    {question.description}
                  </p>
                </div>
                <div className="bg-gray-50 px-6 py-3">
                  <div className="text-blue-600 font-medium flex items-center">
                    View Solution
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
