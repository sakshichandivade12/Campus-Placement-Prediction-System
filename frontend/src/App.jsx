
import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  LogOut,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Users,
  AlertCircle,
  BookOpen,
  BriefcaseBusiness,
} from "lucide-react";

import "./App.css";
import "./Prediction.css";
import "./PlacementTips.css";
import "./Auth.css";
import "./UserProfile.css";
import "./Dashboard.css";

import SkillGapAnalysis from "./SkillGapAnalysis";
import ModelEvaluation from "./ModelEvaluation";
import Auth from "./Auth";

const API_URL = "http://127.0.0.1:5000";

/* ---------------- STUDENT DEFAULT VALUES ---------------- */

const initialStudent = {
  CGPA: "8.2",
  Internships: "2",
  Projects: "3",
  "Workshops/Certifications": "4",
  AptitudeTestScore: "78",
  SoftSkillsRating: "4",
  ExtracurricularActivities: "Yes",
  PlacementTraining: "Yes",
  SSC_Marks: "85",
  HSC_Marks: "82",
};

const numericFields = [
  {
    key: "CGPA",
    label: "CGPA (out of 10)",
    min: 0,
    max: 10,
    step: 0.1,
  },
  {
    key: "Internships",
    label: "Number of internships",
    min: 0,
    max: 50,
    step: 1,
  },
  {
    key: "Projects",
    label: "Number of projects",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "Workshops/Certifications",
    label: "Workshops / certifications",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "AptitudeTestScore",
    label: "Aptitude test score (%)",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: "SoftSkillsRating",
    label: "Soft skills rating (1–5)",
    min: 1,
    max: 5,
    step: 1,
  },
  {
    key: "SSC_Marks",
    label: "SSC marks (%)",
    min: 0,
    max: 100,
    step: 0.1,
  },
  {
    key: "HSC_Marks",
    label: "HSC marks (%)",
    min: 0,
    max: 100,
    step: 0.1,
  },
];

const categoricalFields = [
  {
    key: "ExtracurricularActivities",
    label: "Extracurricular activities",
  },
  {
    key: "PlacementTraining",
    label: "Placement training completed",
  },
];

const features = [
  {
    icon: BrainCircuit,
    title: "ML Placement Prediction",
    text: "Estimate your placement outcome using a trained machine learning model.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Understand Your Result",
    text: "Review the predicted outcome and probabilities returned by the model.",
  },
  {
    icon: Target,
    title: "Identify Skill Gaps",
    text: "Get practical suggestions to improve your placement preparation.",
  },
];

/* ---------------- IMPROVEMENT TIPS ---------------- */

function getImprovementTips(student) {
  const tips = [];
  const number = (key) => Number(student[key] || 0);

  if (number("AptitudeTestScore") < 75) {
    tips.push({
      title: "Improve aptitude",
      detail:
        "Practise quantitative aptitude, logical reasoning, and verbal ability. Take timed mock tests and review your mistakes.",
      tag: "Aptitude",
    });
  }

  if (number("Projects") < 3) {
    tips.push({
      title: "Build practical projects",
      detail:
        "Develop a project related to your target role, upload it to GitHub, and prepare to explain your contribution.",
      tag: "Projects",
    });
  }

  if (number("Internships") < 2) {
    tips.push({
      title: "Gain practical experience",
      detail:
        "Explore internships, supervised projects, or relevant work experience. Document the tools you use and what you learn.",
      tag: "Experience",
    });
  }

  if (number("SoftSkillsRating") < 4) {
    tips.push({
      title: "Practise communication",
      detail:
        "Try mock interviews, practise explaining your projects, and prepare examples of teamwork and problem-solving.",
      tag: "Soft skills",
    });
  }

  if (number("CGPA") < 7.5) {
    tips.push({
      title: "Strengthen academics",
      detail:
        "Revise core subjects, solve previous questions, and follow a weekly study plan.",
      tag: "Academics",
    });
  }

  if (number("Workshops/Certifications") < 3) {
    tips.push({
      title: "Develop job-related skills",
      detail:
        "Choose a relevant course or workshop and practise the concepts through hands-on exercises.",
      tag: "Certifications",
    });
  }

  if (student.PlacementTraining === "No") {
    tips.push({
      title: "Complete placement preparation",
      detail:
        "Practise aptitude tests, resume preparation, technical interviews, and HR questions.",
      tag: "Training",
    });
  }

  if (student.ExtracurricularActivities === "No") {
    tips.push({
      title: "Demonstrate teamwork",
      detail:
        "Consider participating in a team project, volunteering activity, club, or hackathon.",
      tag: "Teamwork",
    });
  }

  if (number("SSC_Marks") < 75 || number("HSC_Marks") < 75) {
    tips.push({
      title: "Prepare to discuss your academics",
      detail:
        "Be ready to explain your academic journey honestly and highlight your recent skills and project work.",
      tag: "Academic profile",
    });
  }

  if (tips.length === 0) {
    tips.push(
      {
        title: "Keep learning",
        detail:
          "Continue building relevant projects, practising aptitude, and improving your technical skills.",
        tag: "Progress",
      },
      {
        title: "Prepare for interviews",
        detail:
          "Practise explaining your projects, teamwork, and problem-solving experiences with real examples.",
        tag: "Interview prep",
      }
    );
  }

  return tips.slice(0, 4);
}

/* ---------------- LANDING PAGE ---------------- */

function LandingPage({ onLogin, onGetStarted }) {
  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <GraduationCap size={25} />
          </span>
          <span>
            Get<span className="brand-blue">Placed</span>
            <small>YOUR PLACEMENT GUIDE</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>

          <button className="login-link" onClick={onLogin}>
            Log In
          </button>

          <button className="nav-cta" onClick={onGetStarted}>
            Get Started <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="live-dot" />
              YOUR PATH TO PLACEMENT
            </div>

            <h1>
              Your Skills.
              <br />
              Your Future.
              <br />
              <span>Get Placed.</span>
            </h1>

            <p className="hero-text">
              Understand your placement readiness, review your skills, and
              prepare for opportunities with machine learning.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={onGetStarted}>
                Open My Dashboard <ArrowRight size={18} />
              </button>

              <a className="secondary-btn" href="#features">
                Explore Features
              </a>
            </div>

            <div className="hero-note">
              <ShieldCheck size={18} />
              <span>Built for students. Made for growth.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="preview-card">
              <div className="preview-top">
                <div>
                  <span className="preview-label">STUDENT OVERVIEW</span>
                  <h3>Your Progress</h3>
                </div>

                <div className="preview-avatar">
                  <GraduationCap size={22} />
                </div>
              </div>

              <div className="preview-stat">
                <div>
                  <span className="stat-label">Placement Preparation</span>
                  <h2>Know Your Strengths</h2>
                  <p>Use your profile to get started.</p>
                </div>

                <div className="stat-icon">
                  <TrendingUp size={23} />
                </div>
              </div>

              <div className="skill-preview">
                <div className="skill-heading">
                  <span>Placement essentials</span>
                  <span className="skill-tag">GETPLACED</span>
                </div>

                {[
                  ["Academics", 85],
                  ["Aptitude", 75],
                  ["Projects", 80],
                ].map(([name, value]) => (
                  <div className="skill-row" key={name}>
                    <div className="skill-label">
                      <span>{name}</span>
                      <span>{value}%</span>
                    </div>

                    <div className="skill-track">
                      <div
                        className="skill-fill"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}

                <p className="preview-disclaimer">
                  Illustrative preview, not an actual student result.
                </p>
              </div>

              <div className="preview-footer">
                <span>
                  <CheckCircle2 size={16} /> ML-powered insights
                </span>
                <span>GetPlaced</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section-wrap about-section" id="about">
          <div className="section-heading">
            <span className="section-tag">ABOUT GETPLACED</span>
            <h2>
              Prepare for your <span>next opportunity.</span>
            </h2>
            <p>
              GetPlaced uses academic details and job-related skills to estimate
              a student's placement outcome and suggest areas for improvement.
            </p>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-wrap">
            <div className="section-heading">
              <span className="section-tag">WHAT YOU GET</span>
              <h2>
                One place. <span>More clarity.</span>
              </h2>
            </div>

            <div className="feature-grid">
              {features.map(({ icon: Icon, title, text }) => (
                <article className="feature-card" key={title}>
                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{title}</h3>
                  <p>{text}</p>

                  <button className="text-link" onClick={onGetStarted}>
                    Get started <ArrowRight size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-inner">
            <div className="cta-symbol">
              <Target size={30} />
            </div>

            <span className="section-tag">YOUR NEXT STEP STARTS HERE</span>
            <h2>Ready to work on your goals?</h2>

            <p>
              Sign in to view your student dashboard and start your placement
              assessment.
            </p>

            <button className="primary-btn" onClick={onGetStarted}>
              Get Started <ArrowRight size={18} />
            </button>

            <small>
              Predictions support preparation; placement is not guaranteed.
            </small>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <a className="brand footer-brand" href="#home">
            <span className="brand-icon">
              <GraduationCap size={24} />
            </span>
            <span>
              Get<span className="brand-blue">Placed</span>
              <small>YOUR PLACEMENT GUIDE</small>
            </span>
          </a>

          <p>A smarter way to prepare for your next step.</p>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} GetPlaced. Student ML Project.
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({ user, onPredict, onLogout }) {
  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <a className="dashboard-brand" href="#dashboard">
          <span className="dashboard-brand-icon">
            <GraduationCap size={25} />
          </span>

          <span>
            Get<span>Placed</span>
            <small>STUDENT WORKSPACE</small>
          </span>
        </a>

        <div className="dashboard-sidebar-label">WORKSPACE</div>

        <button className="dashboard-nav-item active" type="button">
          <ChartNoAxesCombined size={19} />
          <span>Dashboard</span>
        </button>

        <button
          className="dashboard-nav-item"
          type="button"
          onClick={onPredict}
        >
          <BrainCircuit size={19} />
          <span>Placement Prediction</span>
        </button>

        <div className="dashboard-sidebar-bottom">
          <div className="dashboard-help-card">
            <span className="dashboard-help-icon">
              <Lightbulb size={20} />
            </span>
            <strong>Keep improving</strong>
            <p>Small steps today can prepare you for tomorrow.</p>
          </div>

          <button
            className="dashboard-nav-item dashboard-logout-sidebar"
            onClick={onLogout}
            type="button"
          >
            <LogOut size={19} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-topbar-label">YOUR WORKSPACE</span>
            <p>Campus Placement Prediction System</p>
          </div>

          <div className="dashboard-topbar-user">
            <span className="dashboard-topbar-avatar">
              <UserRound size={20} />
            </span>

            <span>
              <strong>{user?.name || "Student"}</strong>
              <small>Student account</small>
            </span>

            <button
              className="dashboard-mobile-logout"
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="dashboard-welcome">
            <div className="dashboard-welcome-copy">
              <span className="dashboard-eyebrow">
                <span className="dashboard-status-dot" />
                STUDENT DASHBOARD
              </span>

              <h1>Welcome back, {user?.name || "Student"}!</h1>

              <p>
                Ready to take the next step in your placement journey? Assess
                your profile and discover areas where you can improve.
              </p>

              <button
                className="primary-btn dashboard-start-btn"
                onClick={onPredict}
              >
                Start Placement Assessment
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="dashboard-welcome-art">
              <div className="dashboard-art-circle">
                <GraduationCap size={55} />
              </div>
              <span className="dashboard-art-check">
                <CheckCircle2 size={23} />
              </span>
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-title">
              <div>
                <h2>Your placement toolkit</h2>
                <p>Everything you need to begin your assessment.</p>
              </div>
            </div>

            <div className="dashboard-stats">
              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon blue">
                  <BrainCircuit size={23} />
                </span>
                <span className="dashboard-stat-label">Machine learning</span>
                <strong>Trained model</strong>
                <small>Ready to assess your profile</small>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon green">
                  <BriefcaseBusiness size={23} />
                </span>
                <span className="dashboard-stat-label">Career readiness</span>
                <strong>Profile assessment</strong>
                <small>Based on your submitted details</small>
              </article>

              <article className="dashboard-stat-card">
                <span className="dashboard-stat-icon purple">
                  <Lightbulb size={23} />
                </span>
                <span className="dashboard-stat-label">Personal guidance</span>
                <strong>Improvement tips</strong>
                <small>Actionable suggestions for preparation</small>
              </article>
            </div>
          </section>

          <section className="dashboard-assessment-card">
            <div className="dashboard-assessment-icon">
              <ChartNoAxesCombined size={30} />
            </div>

            <div className="dashboard-assessment-copy">
              <span className="dashboard-eyebrow">YOUR NEXT STEP</span>

              <h2>Predict your placement outcome</h2>

              <p>
                Enter your CGPA, internships, projects, aptitude score,
                academic marks, soft skills, and training details. The trained
                machine learning model will estimate your placement outcome.
              </p>

              <button className="primary-btn" onClick={onPredict}>
                Predict My Outcome <ArrowRight size={18} />
              </button>
            </div>

            <div className="dashboard-assessment-decoration">
              <Target size={64} />
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-title">
              <div>
                <h2>What you can evaluate</h2>
                <p>Understand the different parts of your student profile.</p>
              </div>
            </div>

            <div className="dashboard-feature-grid">
              <article className="dashboard-feature-card">
                <span className="dashboard-feature-icon blue">
                  <BookOpen size={23} />
                </span>
                <h3>Academic performance</h3>
                <p>Include your CGPA and SSC/HSC marks in your assessment.</p>
              </article>

              <article className="dashboard-feature-card">
                <span className="dashboard-feature-icon green">
                  <Users size={23} />
                </span>
                <h3>Skills and experience</h3>
                <p>
                  Add internships, projects, certifications, and soft skills.
                </p>
              </article>

              <article className="dashboard-feature-card">
                <span className="dashboard-feature-icon purple">
                  <Target size={23} />
                </span>
                <h3>Preparation guidance</h3>
                <p>
                  Review suggestions to help plan your placement preparation.
                </p>
              </article>
            </div>
          </section>

<section className="dashboard-section dashboard-visualization">
  <div className="dashboard-section-title">
    <div>
      <h2>Visualization Report</h2>
      <p>
        Explore the key performance metrics of your placement prediction
        model.
      </p>
    </div>
  </div>

  <div className="dashboard-visualization-grid">
    <article className="dashboard-visualization-card">
      <span className="dashboard-visualization-label">
        Validation Accuracy
      </span>
      <strong>80.08%</strong>
      <div className="dashboard-progress-track">
        <div
          className="dashboard-progress-fill accuracy-fill"
          style={{ width: "80.08%" }}
        />
      </div>
      <small>Overall correct predictions</small>
    </article>

    <article className="dashboard-visualization-card">
      <span className="dashboard-visualization-label">
        Placed Student Recall
      </span>
      <strong>75.14%</strong>
      <div className="dashboard-progress-track">
        <div
          className="dashboard-progress-fill recall-fill"
          style={{ width: "75.14%" }}
        />
      </div>
      <small>Placed students correctly identified</small>
    </article>

    <article className="dashboard-visualization-card">
      <span className="dashboard-visualization-label">
        Not Placed Recall
      </span>
      <strong>83.65%</strong>
      <div className="dashboard-progress-track">
        <div
          className="dashboard-progress-fill notplaced-fill"
          style={{ width: "83.65%" }}
        />
      </div>
      <small>Not-placed students correctly identified</small>
    </article>
  </div>

  <p className="dashboard-visualization-note">
    These metrics are from the model's validation results, not your
    individual placement probability. Predictions are estimates, not
    guarantees.
  </p>
</section>


          <div className="dashboard-disclaimer">
            <ShieldCheck size={18} />
            <p>
              The prediction is an estimate based on patterns learned from
              training data. It does not guarantee placement or employment.
            </p>
          </div>

          <footer className="dashboard-footer">
            <span>© {new Date().getFullYear()} GetPlaced</span>
            <span>Campus Placement Prediction System</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ---------------- PREDICTION PAGE ---------------- */

function PredictionPage({ user, onBack, onLogout }) {
  const [student, setStudent] = useState({ ...initialStudent });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  const updateStudent = (field, value) => {
    setStudent((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePrediction = async (event) => {
    event.preventDefault();

    setLoading(true);
    setPrediction(null);
    setPredictionError("");

    const payload = {
      ...student,
      CGPA: Number(student.CGPA),
      Internships: Number(student.Internships),
      Projects: Number(student.Projects),
      "Workshops/Certifications": Number(
        student["Workshops/Certifications"]
      ),
      AptitudeTestScore: Number(student.AptitudeTestScore),
      SoftSkillsRating: Number(student.SoftSkillsRating),
      SSC_Marks: Number(student.SSC_Marks),
      HSC_Marks: Number(student.HSC_Marks),
    };

    try {
      const response = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The backend returned an invalid response. Check that the Flask API is running correctly."
        );
      }

      if (!response.ok) {
        const missing = Array.isArray(data.missing_fields)
          ? ` Missing fields: ${data.missing_fields.join(", ")}`
          : "";

        throw new Error((data.error || "Prediction failed.") + missing);
      }

      if (!data.prediction) {
        throw new Error(
          "The API response does not contain a prediction. Check your backend response format."
        );
      }

      setPrediction(data);
    } catch (error) {
      const message = String(error?.message || "");

      setPredictionError(
        message.toLowerCase().includes("failed to fetch") ||
          message.toLowerCase().includes("fetch")
          ? "Cannot connect to Flask. Open the backend folder, start the server with python app.py, and try again."
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPrediction = () => {
    setPrediction(null);
    setPredictionError("");
  };

  return (
    <div className="app prediction-page">
      <header className="dashboard-header">
        <button className="dashboard-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="dashboard-header-actions">
          <span className="prediction-user-name">
            <UserRound size={17} />
            {user?.name || "Student"}
          </span>

          <button className="dashboard-logout" onClick={onLogout}>
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </header>

      <main className="prediction-section" id="prediction">
        <div className="section-wrap">
          <div className="section-heading prediction-page-heading">
            <span className="section-tag">ML PLACEMENT ASSESSMENT</span>

            <h2>
              Discover your <span>placement outlook.</span>
            </h2>

            <p>
              Enter your academic details and skills to get an estimate from
              the trained Gradient Boosting model.
            </p>
          </div>

          <div className="prediction-layout">
            {/* LEFT COLUMN: STUDENT FORM */}

            <form className="prediction-form" onSubmit={handlePrediction}>
              <div className="prediction-form-heading">
                <div className="about-icon">
                  <Activity size={25} />
                </div>

                <div>
                  <h3>Student Profile</h3>
                  <p>Enter accurate details for your assessment.</p>
                </div>
              </div>

              <div className="prediction-fields">
                {numericFields.map((field) => (
                  <label className="prediction-field" key={field.key}>
                    <span>{field.label}</span>

                    <input
                      type="number"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      required
                      value={student[field.key]}
                      onChange={(event) =>
                        updateStudent(field.key, event.target.value)
                      }
                    />
                  </label>
                ))}

                {categoricalFields.map((field) => (
                  <label className="prediction-field" key={field.key}>
                    <span>{field.label}</span>

                    <select
                      required
                      value={student[field.key]}
                      onChange={(event) =>
                        updateStudent(field.key, event.target.value)
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="primary-btn prediction-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="prediction-spinner" size={19} />
                    Analysing Profile...
                  </>
                ) : (
                  <>
                    Predict Placement <ArrowRight size={18} />
                  </>
                )}
              </button>

              {predictionError && (
                <div className="prediction-error" role="alert">
                  <AlertCircle size={19} />
                  <span>{predictionError}</span>
                </div>
              )}
            </form>

            {/* RIGHT COLUMN: PREDICTION RESULT */}

            <aside className="prediction-result">
              <span className="section-tag">YOUR RESULT</span>

              {!prediction && (
                <div className="prediction-empty">
                  <div className="result-icon">
                    <BrainCircuit size={34} />
                  </div>

                  <h3>Your result will appear here</h3>

                  <p>
                    Submit your profile to receive a prediction from the
                    trained machine learning model.
                  </p>

                  <div className="result-feature">
                    <CheckCircle2 size={18} />
                    <span>Model-based placement estimate</span>
                  </div>

                  <div className="result-feature">
                    <CheckCircle2 size={18} />
                    <span>Probabilities for both outcomes</span>
                  </div>
                </div>
              )}

              {prediction && (
                <div className="prediction-output" aria-live="polite">
                  <div
                    className={`result-status ${
                      prediction.prediction === "Placed"
                        ? "result-placed"
                        : "result-not-placed"
                    }`}
                  >
                    <CheckCircle2 size={24} />
                    <span>{prediction.prediction}</span>
                  </div>

                  <h3>
                    {prediction.prediction === "Placed"
                      ? "Positive placement outlook"
                      : "More preparation may help"}
                  </h3>

                  <div className="confidence-card">
                    <span>Model confidence</span>
                    <strong>
                      {Number(prediction.confidence).toFixed(2)}%
                    </strong>
                  </div>

                  <p className="prediction-result-explanation">
                    This is the predicted class for the profile you submitted,
                    not a guarantee of a real placement outcome.
                  </p>

                  <div className="probability-list">
                    {Object.entries(
                      prediction.class_probabilities || {}
                    ).map(([label, value]) => {
                      const percentage = Math.max(
                        0,
                        Math.min(100, Number(value) || 0)
                      );

                      return (
                        <div className="probability-item" key={label}>
                          <div className="probability-label">
                            <span>{label}</span>
                            <strong>{percentage.toFixed(2)}%</strong>
                          </div>

                          <div className="probability-track">
                            <div
                              className="probability-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="model-note">
                    <BrainCircuit size={19} />
                    <span>
                      Powered by {prediction.model || "the trained ML model"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="secondary-btn prediction-reset"
                    onClick={resetPrediction}
                  >
                    Reset Result
                  </button>
                </div>
              )}

              <p className="result-disclaimer">
                Probabilities reflect the model output for these inputs. They
                do not guarantee hiring or placement.
              </p>
            </aside>
          </div>

          {/* FULL-WIDTH SKILL GAP ANALYSIS */}

          {prediction && (
            <div className="prediction-insights">
              <section className="prediction-insight-section">
                <div className="prediction-insight-heading">
                  <span className="prediction-insight-icon">
                    <Target size={22} />
                  </span>

                  <div>
                    <span className="section-tag">PROFILE REVIEW</span>
                    <h2>Skill Gap Analysis</h2>
                    <p>
                      Review the areas of your profile that may need more
                      attention.
                    </p>
                  </div>
                </div>

                <SkillGapAnalysis student={student} />
              </section>

              {/* FULL-WIDTH IMPROVEMENT PLAN */}

              <section
                className="improvement-tips prediction-insight-section"
                aria-labelledby="improvement-tips-title"
              >
                <div className="improvement-tips-heading">
                  <span className="improvement-tips-icon">
                    <Lightbulb size={20} />
                  </span>

                  <div>
                    <span className="section-tag">ACTION PLAN</span>
                    <h2 id="improvement-tips-title">
                      Your Improvement Plan
                    </h2>

                    <p>
                      Practical next steps based on the details you entered.
                    </p>
                  </div>
                </div>

                <div className="improvement-tips-list prediction-tips-grid">
                  {getImprovementTips(student).map((tip) => (
                    <article className="improvement-tip" key={tip.title}>
                      <div className="improvement-tip-top">
                        <h4>{tip.title}</h4>
                        <span>{tip.tag}</span>
                      </div>

                      <p>{tip.detail}</p>
                    </article>
                  ))}
                </div>

                <p className="improvement-tips-note">
                  These suggestions are profile-based guidance, not additional
                  predictions from the ML model.
                </p>
              </section>

              {/* FULL-WIDTH MODEL EVALUATION */}

              <section className="prediction-insight-section model-evaluation-section">
                <div className="prediction-insight-heading">
                  <span className="prediction-insight-icon">
                    <ChartNoAxesCombined size={22} />
                  </span>

                  <div>
                    <span className="section-tag">MODEL PERFORMANCE</span>
                    <h2>Model Evaluation</h2>
                    <p>
                      Validation metrics help describe how the trained model
                      performed on the validation dataset.
                    </p>
                  </div>
                </div>

                <ModelEvaluation />
              </section>
            </div>
          )}

          <div className="prediction-page-footer">
            <ShieldCheck size={17} />
            <span>
              GetPlaced provides estimates for learning and preparation. It
              does not guarantee a placement or job offer.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */

function App() {
  const [view, setView] = useState("landing");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const openAuth = () => {
    setView("auth");
  };

  const handleAuthSuccess = (user) => {
    setLoggedInUser(user);
    setView("dashboard");
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setView("landing");
  };

  if (view === "auth") {
    return (
      <Auth
        onBack={() => setView("landing")}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (view === "dashboard" && loggedInUser) {
    return (
      <Dashboard
        user={loggedInUser}
        onPredict={() => setView("prediction")}
        onLogout={handleLogout}
      />
    );
  }

  if (view === "prediction" && loggedInUser) {
    return (
      <PredictionPage
        key={loggedInUser.id || loggedInUser.email}
        user={loggedInUser}
        onBack={() => setView("dashboard")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LandingPage
      onLogin={openAuth}
      onGetStarted={openAuth}
    />
  );
}

export default App;

