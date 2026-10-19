import { useEffect, useState } from "react";
import "./App.css";

const questionBank = {
  Technical: [
    { q: "Which language is used to structure a web page?", options: ["CSS", "HTML", "Python", "SQL"], answer: 1, explanation: "HTML defines the structure of web pages." },
    { q: "Which data structure follows FIFO?", options: ["Stack", "Tree", "Queue", "Graph"], answer: 2, explanation: "A queue follows First In, First Out." },
    { q: "Which keyword declares a block-scoped variable in JavaScript?", options: ["var only", "let", "print", "define"], answer: 1, explanation: "let declares a block-scoped variable." },
    { q: "What does CSS stand for?", options: ["Computer Style System", "Creative Style Syntax", "Cascading Style Sheets", "Colorful Style Sheets"], answer: 2, explanation: "CSS means Cascading Style Sheets." },
    { q: "Which SQL command retrieves data?", options: ["GET", "SELECT", "OPEN", "FETCH ALL"], answer: 1, explanation: "SELECT retrieves data from database tables." },
    { q: "Which symbol is commonly used for comments in Python?", options: ["//", "#", "<!--", "**"], answer: 1, explanation: "Python uses # for a single-line comment." },
    { q: "Which of these is not a programming language?", options: ["Java", "Python", "HTML", "C++"], answer: 2, explanation: "HTML is a markup language." },
    { q: "What is the main purpose of a function?", options: ["Store images", "Reuse a block of code", "Delete a computer", "Create a network"], answer: 1, explanation: "Functions organize reusable code." },
    { q: "Which component library is used by this project?", options: ["React", "Flask", "Django", "Laravel"], answer: 0, explanation: "This frontend is built with React." },
    { q: "What does API stand for?", options: ["Application Programming Interface", "Advanced Program Internet", "Applied Process Integration", "Application Page Index"], answer: 0, explanation: "An API allows software components to communicate." }
  ],
  HR: [
    { q: "What is the best way to answer 'Tell me about yourself'?", options: ["Talk only about hobbies", "Give a concise professional introduction", "Read your entire resume", "Avoid answering"], answer: 1, explanation: "Give a brief introduction covering education, skills and goals." },
    { q: "What should you do if you do not know an answer?", options: ["Make up facts", "Stay silent", "Be honest and explain your approach", "Blame the interviewer"], answer: 2, explanation: "Honesty and a willingness to learn are valuable." },
    { q: "What does teamwork mean?", options: ["Working against others", "Collaborating toward a shared goal", "Doing everything alone", "Avoiding communication"], answer: 1, explanation: "Teamwork involves cooperation and communication." },
    { q: "How should you handle constructive feedback?", options: ["Ignore it", "Argue immediately", "Listen and identify improvements", "Leave the team"], answer: 2, explanation: "Use constructive feedback to improve your work." },
    { q: "What is a good response to a workplace disagreement?", options: ["Discuss it respectfully", "Spread rumours", "Avoid all communication", "Insult the person"], answer: 0, explanation: "Respectful discussion helps resolve disagreements." },
    { q: "Why should you research a company before an interview?", options: ["To avoid questions", "To understand its work and role", "To memorise random facts", "It is unnecessary"], answer: 1, explanation: "Research helps you explain why the role interests you." },
    { q: "Which is a useful example of a strength?", options: ["Never listening", "Refusing to learn", "Consistent problem-solving", "Avoiding responsibility"], answer: 2, explanation: "A useful strength should be relevant and supported by examples." },
    { q: "How should you describe a weakness?", options: ["Claim to have none", "Mention one and explain how you improve", "Blame others", "Change the topic"], answer: 1, explanation: "Show self-awareness and practical improvement." },
    { q: "What should you do when a task has a tight deadline?", options: ["Plan priorities and communicate risks", "Ignore the deadline", "Wait until the last minute", "Hide any problems"], answer: 0, explanation: "Prioritisation and communication help manage deadlines." },
    { q: "What should you do at the end of an interview?", options: ["Leave without speaking", "Ask relevant questions and thank the interviewer", "Demand an offer", "Criticise the process"], answer: 1, explanation: "Professional closing questions show interest and courtesy." }
  ],
  Aptitude: [
    { q: "What is 15% of 200?", options: ["15", "20", "30", "45"], answer: 2, explanation: "15/100 × 200 = 30." },
    { q: "Find the next number: 2, 4, 8, 16, __", options: ["18", "24", "30", "32"], answer: 3, explanation: "Each number is multiplied by 2." },
    { q: "A pen costs ₹10. What is the cost of 6 pens?", options: ["₹16", "₹40", "₹60", "₹100"], answer: 2, explanation: "6 × 10 = ₹60." },
    { q: "What is the average of 4, 6 and 8?", options: ["5", "6", "7", "8"], answer: 1, explanation: "(4 + 6 + 8) / 3 = 6." },
    { q: "If a car travels 60 km in 2 hours, what is its average speed?", options: ["20 km/h", "30 km/h", "60 km/h", "120 km/h"], answer: 1, explanation: "Speed = distance / time = 60 / 2 = 30 km/h." },
    { q: "Which number is prime?", options: ["9", "15", "17", "21"], answer: 2, explanation: "17 is divisible only by 1 and 17." },
    { q: "A shirt marked ₹500 has a 10% discount. What is the sale price?", options: ["₹400", "₹450", "₹490", "₹550"], answer: 1, explanation: "10% of ₹500 is ₹50, so the price is ₹450." },
    { q: "Complete the series: 5, 10, 15, 20, __", options: ["22", "24", "25", "30"], answer: 2, explanation: "The sequence increases by 5." },
    { q: "If 3 workers finish a task in 6 days, how many worker-days is the task?", options: ["9", "18", "3", "6"], answer: 1, explanation: "3 × 6 = 18 worker-days." },
    { q: "A person faces north and turns right. Which direction are they facing?", options: ["West", "South", "East", "North"], answer: 2, explanation: "A right turn from north points east." }
  ]
};

const languages = ["C", "C++", "Java", "Python", "JavaScript", "SQL"];

const subjects = {
  Technical: languages,
  HR: ["Common HR Questions", "Behavioural Interview", "Workplace Scenarios", "Communication Skills"],
  Aptitude: ["Numerical Ability", "Logical Reasoning", "Verbal Ability", "Mixed Aptitude"]
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => readStorage("mockmate-demo-user", null));
  const [accounts, setAccounts] = useState(() => readStorage("mockmate-demo-accounts", []));
  const [results, setResults] = useState(() => readStorage("mockmate-demo-results", []));
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [category, setCategory] = useState("Technical");
  const [language, setLanguage] = useState("Python");
  const [subject, setSubject] = useState("Python");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testType, setTestType] = useState("MCQ");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(600);
  const [review, setReview] = useState(false);
  const [writing, setWriting] = useState("");
  const [lastResult, setLastResult] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("mockmate-demo-accounts", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("mockmate-demo-results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    if (user) localStorage.setItem("mockmate-demo-user", JSON.stringify(user));
    else localStorage.removeItem("mockmate-demo-user");
  }, [user]);

  useEffect(() => {
    if (page !== "test" || testType !== "MCQ" || review) return;
    const timer = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [page, testType, review]);

  useEffect(() => {
    if (page === "test" && testType === "MCQ" && seconds === 0 && !review) {
      finishTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, page, testType, review]);

  const filteredResults = results.filter((r) => r.email === user?.email);
  const activeQuestion = questions[current];
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  function go(next) {
    setPage(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseCategory(value) {
    setCategory(value);
    const firstSubject = subjects[value][0];
    setSubject(firstSubject);
    if (value === "Technical") setLanguage("Python");
    go("setup-subject");
  }

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setAuthError("");
  }

  function handleAuth(e) {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setAuthError("Please enter your email and password.");
      return;
    }

    if (authMode === "register") {
      if (!form.name.trim()) {
        setAuthError("Please enter your full name.");
        return;
      }
      if (form.password.length < 6) {
        setAuthError("Use at least 6 characters for your demo password.");
        return;
      }
      if (accounts.some((a) => a.email === email)) {
        setAuthError("An account with this email already exists. Please log in.");
        return;
      }

      const newUser = { name: form.name.trim(), email };
      setAccounts([...accounts, { ...newUser, password: form.password }]);
      setUser(newUser);
      setForm({ name: "", email: "", password: "" });
      go("dashboard");
      return;
    }

    const account = accounts.find((a) => a.email === email && a.password === form.password);
    if (!account) {
      setAuthError("Demo account not found. Register first, then log in.");
      return;
    }

    setUser({ name: account.name, email: account.email });
    setForm({ name: "", email: "", password: "" });
    go("dashboard");
  }

  function logout() {
    setUser(null);
    setLastResult(null);
    go("home");
  }

  function startTest() {
    const bank = questionBank[category] || questionBank.Technical;
    const shuffled = [...bank].sort(() => Math.random() - 0.5);

    setQuestions(shuffled.slice(0, 10));
    setAnswers({});
    setCurrent(0);
    setSeconds(600);
    setReview(false);
    setWriting("");
    setLastResult(null);
    go("test");
  }

  function finishTest() {
    if (review || questions.length === 0) return;

    const finalScore = questions.reduce(
      (total, q, i) => total + (answers[i] === q.answer ? 1 : 0),
      0
    );

    const result = {
      id: makeId(),
      email: user?.email || "",
      category,
      language: category === "Technical" ? language : "",
      subject,
      difficulty,
      testType,
      score: testType === "MCQ" ? finalScore : null,
      total: testType === "MCQ" ? questions.length : 1,
      writing,
      date: new Date().toISOString()
    };

    setResults((old) => [result, ...old]);
    setLastResult(result);
    setReview(true);
    go("result");
  }

  function formatDate(value) {
    return new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  function resetToSetup() {
    setReview(false);
    go("setup-type");
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="navbar">
        <button
          className="brand"
          onClick={() => go(user ? "dashboard" : "home")}
          aria-label="MockMate home"
        >
          <span className="brand-mark">M</span>
          <span>Mock<span className="brand-accent">Mate</span><small>INTERVIEW PRACTICE</small></span>
        </button>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className={mobileMenu ? "nav-links nav-open" : "nav-links"}>
          {user ? (
            <>
              <button className={page === "dashboard" ? "nav-link active" : "nav-link"} onClick={() => go("dashboard")}>Dashboard</button>
              <button className={page === "results" ? "nav-link active" : "nav-link"} onClick={() => go("results")}>My Results</button>
              <div className="nav-user">
                <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span>{user.name.split(" ")[0]}</span>
              </div>
              <button className="button button-outline button-small" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => go("home")}>Home</button>
              <button className="nav-link" onClick={() => go("home")}>Features</button>
              <button className="button button-outline button-small" onClick={() => { setAuthMode("login"); go("auth"); }}>Log in</button>
              <button className="button button-primary button-small" onClick={() => { setAuthMode("register"); go("auth"); }}>Get started <span>↗</span></button>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        {page === "home" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="status-dot" /> YOUR NEXT OPPORTUNITY STARTS HERE</div>
                <h1>Practice today.<br /><span>Perform confidently</span><br />tomorrow.</h1>
                <p className="hero-description">Build interview confidence with realistic practice sessions, thoughtful feedback, and a clear view of your progress.</p>
                <div className="hero-actions">
                  <button className="button button-primary button-large" onClick={() => { setAuthMode("register"); go("auth"); }}>Start practising <span>→</span></button>
                  <button className="button button-ghost button-large" onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}>Explore features ↓</button>
                </div>
                <div className="hero-proof">
                  <div className="mini-avatars"><span>A</span><span>R</span><span>S</span></div>
                  <p><strong>One step at a time.</strong><br />Practice at your own pace.</p>
                </div>
              </div>

              <div className="hero-visual">
                <div className="visual-glow" />
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="floating-tag tag-top"><span className="tag-icon">✦</span><span><strong>Confidence grows</strong><small>With every practice</small></span></div>
                <div className="interview-card">
                  <div className="card-topline"><span className="live-indicator" /> MOCK INTERVIEW <span className="card-menu">•••</span></div>
                  <div className="interviewer"><div className="interviewer-avatar">M</div><div><strong>Your practice room</strong><small>Ready when you are</small></div><span className="online-pill">Ready</span></div>
                  <div className="preview-question"><span className="question-label">SAMPLE QUESTION · 01</span><h3>Tell me about a challenge you solved.</h3><p>Take your time. Think clearly. Answer confidently.</p></div>
                  <div className="preview-progress"><div className="progress-label"><span>Practice progress</span><strong>01 / 10</strong></div><div className="progress-track"><div style={{ width: "10%" }} /></div></div>
                  <div className="preview-bottom"><span>◷ 10 min session</span><span>✦ Personal growth</span></div>
                </div>
                <div className="floating-tag tag-bottom"><span className="score-ring">✓</span><span><strong>Your progress,</strong><small>one question at a time</small></span></div>
                <div className="spark spark-one">✳</div><div className="spark spark-two">✦</div>
              </div>
            </section>

            <section className="features-section" id="features">
              <div className="section-heading"><span className="eyebrow">MADE FOR YOUR NEXT STEP</span><h2>Practice with <span>purpose.</span></h2><p>Everything you need to feel more prepared before the real interview.</p></div>
              <div className="feature-grid">
                <Feature icon="⌘" number="01" title="Technical interviews" text="Practice programming concepts and technical fundamentals." />
                <Feature icon="◎" number="02" title="HR interviews" text="Build clear answers for common workplace questions." />
                <Feature icon="▤" number="03" title="Aptitude practice" text="Sharpen numerical and logical reasoning skills." />
              </div>
            </section>
          </>
        )}

        {page === "auth" && (
          <section className="auth-layout">
            <div className="auth-aside">
              <span className="eyebrow">YOUR PRACTICE JOURNEY</span>
              <h1>Small steps.<br /><span>Big confidence.</span></h1>
              <p>Build your skills in a comfortable practice space. Every attempt is an opportunity to learn.</p>
              <div className="auth-benefit"><span>✓</span> Practice at your own pace</div>
              <div className="auth-benefit"><span>✓</span> Track your previous attempts</div>
              <div className="auth-benefit"><span>✓</span> Explore different interview types</div>
            </div>

            <div className="auth-card">
              <div className="auth-card-mark">M</div>
              <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p>{authMode === "login" ? "Continue your interview preparation." : "Start building your interview confidence."}</p>
              <form onSubmit={handleAuth}>
                {authMode === "register" && <label>Full name<input name="name" value={form.name} onChange={updateForm} placeholder="Enter your full name" autoComplete="name" required /></label>}
                <label>Email address<input name="email" type="email" value={form.email} onChange={updateForm} placeholder="you@example.com" autoComplete="email" required /></label>
                <label>Password<input name="password" type="password" value={form.password} onChange={updateForm} placeholder="At least 6 characters" autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={6} required /></label>
                {authError && <p className="form-error">{authError}</p>}
                <button className="button button-primary button-full button-large" type="submit">{authMode === "login" ? "Log in to MockMate →" : "Create account →"}</button>
              </form>
              <p className="auth-switch">{authMode === "login" ? "New to MockMate?" : "Already have an account?"} <button onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthError(""); }}>{authMode === "login" ? "Create an account" : "Log in"}</button></p>
              <div className="demo-note">Demo mode: account data stays in this browser. Do not use a real password.</div>
            </div>
          </section>
        )}

        {page === "dashboard" && user && (
          <section className="dashboard-page">
            <div className="dashboard-welcome">
              <div><span className="eyebrow">YOUR PERSONAL PRACTICE SPACE</span><h1>Welcome back, <span>{user.name.split(" ")[0]}.</span></h1><p>Every practice session brings you one step closer to your goals.</p></div>
              <button className="button button-primary" onClick={() => go("setup-type")}>＋ New interview</button>
            </div>

            <div className="stats-grid">
              <Stat icon="▣" label="Total attempts" value={filteredResults.length} detail="Your practice history" />
              <Stat icon="◎" label="Average score" value={filteredResults.filter(r => r.score !== null).length ? `${Math.round(filteredResults.filter(r => r.score !== null).reduce((s, r) => s + (r.score / r.total) * 100, 0) / filteredResults.filter(r => r.score !== null).length)}%` : "—"} detail="Across MCQ tests" />
              <Stat icon="✦" label="Categories tried" value={new Set(filteredResults.map(r => r.category)).size} detail="Keep exploring" />
            </div>

            <div className="section-heading dashboard-heading"><span className="eyebrow">CHOOSE YOUR PATH</span><h2>What would you like to <span>practice?</span></h2><p>Select a category to set up your next session.</p></div>
            <div className="category-grid">
              <Category icon="⌘" title="Technical" tag="FOR DEVELOPERS" text="Programming concepts, languages, and technical fundamentals." count="10 questions" onClick={() => chooseCategory("Technical")} />
              <Category icon="◎" title="HR Interview" tag="FOR YOUR NEXT ROLE" text="Communication, teamwork, strengths, and workplace scenarios." count="10 questions" onClick={() => chooseCategory("HR")} />
              <Category icon="▤" title="Aptitude" tag="LOGIC & NUMBERS" text="Practice percentages, sequences, averages, and reasoning." count="10 questions" onClick={() => chooseCategory("Aptitude")} />
            </div>

            <div className="recent-section">
              <div className="section-row"><div><span className="eyebrow">KEEP MOVING FORWARD</span><h2>Recent attempts</h2></div><button className="text-button" onClick={() => go("results")}>View all →</button></div>
              {filteredResults.length ? <div className="recent-list">{filteredResults.slice(0, 3).map(r => <ResultRow key={r.id} result={r} formatDate={formatDate} />)}</div> : <EmptyState title="Your journey starts here" text="Complete your first practice test and your results will appear here." action="Start your first test" onClick={() => go("setup-type")} />}
            </div>
          </section>
        )}

        {page === "setup-type" && user && (
          <SetupPage
            step="01"
            title="Choose your interview type"
            description="Select the kind of interview you want to practise."
            onBack={() => go("dashboard")}
            backLabel="← Back to dashboard"
          >
            <div className="choice-grid three">
              {["Technical", "HR", "Aptitude"].map(c => (
                <button key={c} className={category === c ? "choice-card selected" : "choice-card"} onClick={() => setCategory(c)}>
                  <span className="choice-icon">{c === "Technical" ? "⌘" : c === "HR" ? "◎" : "▤"}</span>
                  <strong>{c === "HR" ? "HR Interview" : c}</strong>
                  <small>{c === "Technical" ? "Core concepts & coding" : c === "HR" ? "Communication & behaviour" : "Logic & numbers"}</small>
                </button>
              ))}
            </div>
            <div className="setup-summary">
              <div><strong>Step 1 of 4</strong><p>Selected: {category === "HR" ? "HR Interview" : category}</p></div>
              <button className="button button-primary button-large" onClick={() => { setSubject(subjects[category][0]); go("setup-subject"); }}>Next: Choose subject →</button>
            </div>
          </SetupPage>
        )}

        {page === "setup-subject" && user && (
          <SetupPage
            step="02"
            title={category === "Technical" ? "Choose a language" : category === "HR" ? "Choose an HR topic" : "Choose an aptitude topic"}
            description={category === "Technical" ? "Select the programming language you want to practise." : category === "HR" ? "Choose the HR area you want to focus on." : "Select the aptitude area you want to work on."}
            onBack={() => go("setup-type")}
            backLabel="← Back to interview type"
          >
            <div className="language-grid subject-grid">
              {subjects[category].map(item => (
                <button
                  key={item}
                  className={(category === "Technical" ? language === item : subject === item) ? "language-chip selected" : "language-chip"}
                  onClick={() => {
                    setSubject(item);
                    if (category === "Technical") setLanguage(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="setup-summary">
              <div><strong>Step 2 of 4</strong><p>Selected: {category === "Technical" ? language : subject}</p></div>
              <button className="button button-primary button-large" onClick={() => go("setup-difficulty")}>Next: Difficulty →</button>
            </div>
          </SetupPage>
        )}

        {page === "setup-difficulty" && user && (
          <SetupPage
            step="03"
            title="Choose your difficulty"
            description="Pick the level that matches your current preparation."
            onBack={() => go("setup-subject")}
            backLabel="← Back to subject"
          >
            <div className="difficulty-grid">
              {["Easy", "Medium", "Hard"].map(d => (
                <button key={d} className={difficulty === d ? `difficulty-card selected ${d.toLowerCase()}` : "difficulty-card"} onClick={() => setDifficulty(d)}>
                  <span>{d === "Easy" ? "◉" : d === "Medium" ? "◈" : "✦"}</span>
                  <strong>{d}</strong>
                  <small>{d === "Easy" ? "Build foundations" : d === "Medium" ? "Challenge yourself" : "Push your limits"}</small>
                </button>
              ))}
            </div>
            <div className="setup-summary">
              <div><strong>Step 3 of 4</strong><p>{category === "Technical" ? language : subject} · {difficulty}</p></div>
              <button className="button button-primary button-large" onClick={() => go("setup-format")}>Next: Test format →</button>
            </div>
          </SetupPage>
        )}

        {page === "setup-format" && user && (
          <SetupPage
            step="04"
            title="Choose your test format"
            description="Select how you want to demonstrate your knowledge."
            onBack={() => go("setup-difficulty")}
            backLabel="← Back to difficulty"
          >
            <div className="format-grid">
              <button className={testType === "MCQ" ? "format-card selected" : "format-card"} onClick={() => setTestType("MCQ")}>
                <span>☷</span><strong>Multiple choice</strong><small>10 questions · 10 minutes</small>
              </button>
              <button className={testType === "Writing" ? "format-card selected" : "format-card"} onClick={() => setTestType("Writing")}>
                <span>✎</span><strong>Writing test</strong><small>Write and save your answer</small>
              </button>
            </div>
            <div className="setup-summary">
              <div>
                <strong>Your session</strong>
                <p>{category === "Technical" ? `${language} · ` : ""}{category === "Technical" ? "" : `${subject} · `}{difficulty} · {testType === "MCQ" ? "10 questions" : "Writing test"}</p>
              </div>
              <button className="button button-primary button-large" onClick={startTest}>Start interview →</button>
            </div>
          </SetupPage>
        )}

        {page === "test" && user && (
          <section className="test-page">
            <div className="test-top">
              <button className="back-button" onClick={() => { if (window.confirm("Exit this test? Your current answers will not be saved.")) go("setup-type"); }}>← Exit test</button>
              <span className="test-category">{category === "Technical" ? language + " · " : ""}{category} / {difficulty}</span>
              {testType === "MCQ" && <div className={seconds < 60 ? "timer urgent" : "timer"}>◷ {minutes}:{secs}</div>}
            </div>

            {testType === "MCQ" && activeQuestion && (
              <>
                <div className="test-progress-head">
                  <div><span className="eyebrow">YOUR PRACTICE SESSION</span><h1>Take your <span>time.</span></h1></div>
                  <strong>Question {current + 1} <span>/ {questions.length}</span></strong>
                </div>
                <div className="test-progress-bar"><div style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
                <div className="question-card">
                  <div className="question-card-head"><span className="question-label">QUESTION {String(current + 1).padStart(2, "0")}</span><span className="question-points">1 point</span></div>
                  <h2>{activeQuestion.q}</h2>
                  <div className="options-list">
                    {activeQuestion.options.map((option, i) => (
                      <button key={option} className={answers[current] === i ? "option selected" : "option"} onClick={() => setAnswers({ ...answers, [current]: i })}>
                        <span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{option}</span><span className="option-check">{answers[current] === i ? "✓" : ""}</span>
                      </button>
                    ))}
                  </div>
                  <div className="question-footer">
                    <span>{Object.keys(answers).length} of {questions.length} answered</span>
                    <div>
                      <button className="button button-outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Previous</button>
                      {current < questions.length - 1
                        ? <button className="button button-primary" onClick={() => setCurrent(current + 1)}>Next question →</button>
                        : <button className="button button-primary" onClick={finishTest}>Submit test ✓</button>}
                    </div>
                  </div>
                </div>
                <div className="question-dots">
                  {questions.map((_, i) => <button key={i} className={`${current === i ? "current " : ""}${answers[i] !== undefined ? "answered" : ""}`} onClick={() => setCurrent(i)} aria-label={`Go to question ${i + 1}`}>{i + 1}</button>)}
                </div>
              </>
            )}

            {testType === "Writing" && (
              <div className="question-card writing-card">
                <span className="question-label">WRITING CHALLENGE</span>
                <h2>{category === "HR" ? "Tell us about a challenge you faced and how you handled it." : category === "Aptitude" ? `Explain how you would approach a problem in ${subject} step by step.` : `Explain a concept you know in ${language} and give a practical example.`}</h2>
                <p className="writing-prompt">Structure your answer clearly. Include examples where possible. Your response will be saved with your attempt.</p>
                <label className="writing-label">Your answer<textarea value={writing} onChange={e => setWriting(e.target.value)} placeholder="Start writing your answer here..." rows={10} /></label>
                <div className="writing-footer"><span>{writing.trim() ? writing.trim().split(/\s+/).length : 0} words</span><button className="button button-primary button-large" onClick={finishTest}>Save response ✓</button></div>
              </div>
            )}
          </section>
        )}

        {page === "result" && user && lastResult && (
          <section className="result-page">
            <div className="result-hero"><div className="result-check">✓</div><span className="eyebrow">SESSION COMPLETED</span><h1>Well done, <span>{user.name.split(" ")[0]}!</span></h1><p>Every attempt is progress. Take a moment to review what you learned.</p></div>

            {lastResult.testType === "MCQ" ? (
              <div className="score-card">
                <div className="score-circle" style={{ "--score": `${(lastResult.score / lastResult.total) * 100}%` }}><div><strong>{Math.round((lastResult.score / lastResult.total) * 100)}%</strong><small>YOUR SCORE</small></div></div>
                <div className="score-details">
                  <span className="eyebrow">YOUR PERFORMANCE</span>
                  <h2>{lastResult.score >= 8 ? "Excellent work!" : lastResult.score >= 5 ? "Good progress!" : "Keep practising!"}</h2>
                  <p>You answered <strong>{lastResult.score} out of {lastResult.total}</strong> questions correctly.</p>
                  <div className="score-stat-row"><span>Correct answers</span><strong>{lastResult.score}</strong></div>
                  <div className="score-stat-row"><span>Incorrect or unanswered</span><strong>{lastResult.total - lastResult.score}</strong></div>
                  <div className="score-stat-row"><span>Category</span><strong>{lastResult.category}</strong></div>
                  <div className="score-stat-row"><span>Subject</span><strong>{lastResult.subject || lastResult.language || lastResult.category}</strong></div>
                </div>
              </div>
            ) : (
              <div className="score-card writing-result">
                <span className="writing-result-icon">✎</span>
                <div><span className="eyebrow">WRITING RESPONSE SAVED</span><h2>Your ideas are worth practising.</h2><p>Your response has been saved in this browser. Review it and improve your structure, clarity, and examples.</p><div className="saved-writing">{lastResult.writing || "No written response provided."}</div></div>
              </div>
            )}

            {lastResult.testType === "MCQ" && (
              <div className="review-section">
                <div className="section-row"><div><span className="eyebrow">LEARN FROM EACH ANSWER</span><h2>Answer review</h2></div></div>
                {questions.map((q, i) => (
                  <div className="review-question" key={`${q.q}-${i}`}>
                    <div className="review-q-title"><span className={answers[i] === q.answer ? "review-status correct" : "review-status incorrect"}>{answers[i] === q.answer ? "✓" : "!"}</span><strong>{i + 1}. {q.q}</strong></div>
                    <p className="review-answer">Correct answer: <strong>{q.options[q.answer]}</strong></p>
                    <p className="review-explanation">{q.explanation}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="result-actions">
              <button className="button button-primary button-large" onClick={resetToSetup}>Try another interview →</button>
              <button className="button button-outline button-large" onClick={() => go("results")}>View all results</button>
              <button className="button button-ghost button-large" onClick={() => go("dashboard")}>Dashboard</button>
            </div>
          </section>
        )}

        {page === "results" && user && (
          <section className="dashboard-page results-page">
            <button className="back-button" onClick={() => go("dashboard")}>← Back to dashboard</button>
            <div className="dashboard-welcome"><div><span className="eyebrow">YOUR GROWTH OVER TIME</span><h1>My <span>results.</span></h1><p>Every saved practice attempt, all in one place.</p></div><button className="button button-primary" onClick={() => go("setup-type")}>＋ New interview</button></div>
            <div className="stats-grid">
              <Stat icon="▣" label="Total attempts" value={filteredResults.length} detail="Saved in this browser" />
              <Stat icon="◎" label="MCQ attempts" value={filteredResults.filter(r => r.testType === "MCQ").length} detail="Automatically scored" />
              <Stat icon="✎" label="Writing attempts" value={filteredResults.filter(r => r.testType === "Writing").length} detail="Responses saved" />
            </div>
            {filteredResults.length ? <div className="all-results">{filteredResults.map(r => <ResultRow key={r.id} result={r} formatDate={formatDate} detailed />)}</div> : <EmptyState title="No results yet" text="Complete an interview to see your score and history here." action="Start practising" onClick={() => go("setup-type")} />}
          </section>
        )}
      </main>

      <footer className="footer">
        <button className="footer-brand" onClick={() => go(user ? "dashboard" : "home")}><span className="brand-mark">M</span> MockMate</button>
        <p>Practice today. Perform confidently tomorrow.</p>
        <span>© 2026 MockMate · FSD-2 Project</span>
      </footer>
    </div>
  );
}

function SetupPage({ step, title, description, onBack, backLabel, children }) {
  return (
    <section className="setup-page">
      <button className="back-button" onClick={onBack}>{backLabel}</button>
      <div className="section-heading">
        <span className="eyebrow">INTERVIEW SETUP · STEP {step} OF 4</span>
        <h1>{title.split(" ").slice(0, -1).join(" ")} <span>{title.split(" ").slice(-1).join("")}</span></h1>
        <p>{description}</p>
      </div>
      <div className="setup-card">
        <div className="setup-field">
          <span className="field-number">{step}</span>
          <div className="field-content">{children}</div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, number, title, text }) {
  return <article className="feature-card"><div className="feature-card-top"><span className="feature-icon">{icon}</span><span className="feature-number">{number}</span></div><h3>{title}</h3><p>{text}</p><div className="feature-line" /></article>;
}

function Stat({ icon, label, value, detail }) {
  return <article className="stat-card"><div className="stat-top"><span className="stat-icon">{icon}</span><span className="stat-label">{label}</span></div><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></article>;
}

function Category({ icon, title, tag, text, count, onClick }) {
  return <button className="category-card" onClick={onClick}><div className="category-card-top"><span className="category-icon">{icon}</span><span className="category-arrow">↗</span></div><span className="category-tag">{tag}</span><h3>{title}</h3><p>{text}</p><div className="category-bottom"><span>{count}</span><span>Start practice →</span></div></button>;
}

function ResultRow({ result, formatDate, detailed = false }) {
  return (
    <article className="result-row">
      <div className="result-row-icon">{result.category === "Technical" ? "⌘" : result.category === "HR" ? "◎" : "▤"}</div>
      <div className="result-row-main">
        <strong>{result.category === "HR" ? "HR Interview" : result.category}{result.language ? ` · ${result.language}` : ""}</strong>
        <span>{result.subject && result.category !== "Technical" ? `${result.subject} · ` : ""}{result.difficulty} · {result.testType} · {formatDate(result.date)}</span>
        {detailed && result.testType === "Writing" && <p className="result-writing-preview">{result.writing || "No written response."}</p>}
      </div>
      <div className="result-row-score">
        {result.testType === "MCQ" ? <><strong>{result.score}/{result.total}</strong><span>{Math.round((result.score / result.total) * 100)}%</span></> : <><strong>Saved</strong><span>Writing</span></>}
      </div>
    </article>
  );
}

function EmptyState({ title, text, action, onClick }) {
  return <div className="empty-state"><div className="empty-state-icon">✦</div><h3>{title}</h3><p>{text}</p><button className="button button-primary" onClick={onClick}>{action} →</button></div>;
}
