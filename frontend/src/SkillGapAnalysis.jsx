
import React from "react";
import {
  Target,
  CheckCircle2,
  TrendingUp,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  BrainCircuit,
  Award,
  MessageCircle,
  ClipboardCheck,
} from "lucide-react";
import "./SkillGapAnalysis.css";

const skillDefinitions = [
  {
    key: "CGPA",
    label: "Academic Performance",
    target: 7.5,
    max: 10,
    unit: "/ 10",
    icon: GraduationCap,
    recommendation:
      "Revise core computer engineering subjects and strengthen concepts related to your target roles.",
    format: (value) => `${value} / 10`,
  },
  {
    key: "AptitudeTestScore",
    label: "Aptitude",
    target: 70,
    max: 100,
    unit: "%",
    icon: BrainCircuit,
    recommendation:
      "Practise quantitative aptitude, logical reasoning, and timed placement questions regularly.",
    format: (value) => `${value}%`,
  },
  {
    key: "SoftSkillsRating",
    label: "Soft Skills",
    target: 4,
    max: 5,
    unit: "/ 5",
    icon: MessageCircle,
    recommendation:
      "Practise communication, teamwork, and explaining technical ideas through mock interviews.",
    format: (value) => `${value} / 5`,
  },
  {
    key: "Internships",
    label: "Internship Experience",
    target: 2,
    max: 4,
    unit: " internships",
    icon: BriefcaseBusiness,
    recommendation:
      "Look for relevant internships, practical training, or real-world development experience.",
    format: (value) =>
      `${value} ${Number(value) === 1 ? "internship" : "internships"}`,
  },
  {
    key: "Projects",
    label: "Practical Projects",
    target: 3,
    max: 5,
    unit: " projects",
    icon: Target,
    recommendation:
      "Build and document projects with clear objectives, working features, and a well-maintained GitHub repository.",
    format: (value) =>
      `${value} ${Number(value) === 1 ? "project" : "projects"}`,
  },
  {
    key: "Workshops/Certifications",
    label: "Certifications",
    target: 2,
    max: 4,
    unit: " certifications",
    icon: Award,
    recommendation:
      "Complete relevant courses or workshops and apply what you learn in practical projects.",
    format: (value) =>
      `${value} ${Number(value) === 1 ? "certification" : "certifications"}`,
  },
  {
    key: "SSC_Marks",
    label: "SSC Marks",
    target: 70,
    max: 100,
    unit: "%",
    icon: BookOpen,
    recommendation:
      "Review the academic eligibility criteria of the companies you plan to apply to.",
    format: (value) => `${value}%`,
  },
  {
    key: "HSC_Marks",
    label: "HSC Marks",
    target: 70,
    max: 100,
    unit: "%",
    icon: BookOpen,
    recommendation:
      "Check company-specific academic cutoffs and keep your academic records ready.",
    format: (value) => `${value}%`,
  },
];

function getNumericValue(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isYes(value) {
  return (
    value === true ||
    String(value).trim().toLowerCase() === "yes" ||
    String(value).trim().toLowerCase() === "true" ||
    String(value).trim().toLowerCase() === "1"
  );
}

function getSkillStatus(value, target) {
  return value >= target ? "On track" : "Needs focus";
}

export default function SkillGapAnalysis({ student = {} }) {
  const skills = skillDefinitions
    .map((definition) => {
      const value = getNumericValue(student[definition.key]);

      if (value === null) return null;

      const safeValue = Math.max(0, Math.min(value, definition.max));
      const progress = Math.min(
        100,
        Math.round((safeValue / definition.target) * 100)
      );

      return {
        ...definition,
        value: safeValue,
        progress,
        status: getSkillStatus(safeValue, definition.target),
      };
    })
    .filter(Boolean);

  const practicalSkills = [
    {
      key: "PlacementTraining",
      label: "Placement Training",
      present: isYes(student.PlacementTraining),
      icon: ClipboardCheck,
      recommendation:
        "Attend placement preparation sessions and practise aptitude and technical interview questions.",
    },
    {
      key: "ExtracurricularActivities",
      label: "Extracurricular Activities",
      present: isYes(student.ExtracurricularActivities),
      icon: MessageCircle,
      recommendation:
        "Consider team activities, technical clubs, volunteering, or presentations to develop collaboration and communication.",
    },
  ];

  const focusCount =
    skills.filter((skill) => skill.value < skill.target).length +
    practicalSkills.filter((item) => !item.present).length;

  const strengthCount =
    skills.filter((skill) => skill.value >= skill.target).length +
    practicalSkills.filter((item) => item.present).length;

  if (skills.length === 0) {
    return (
      <section className="skill-gap-section">
        <div className="skill-gap-empty">
          <Target size={26} />
          <h3>Skill Gap Analysis</h3>
          <p>
            Enter your student details to see areas that are on track and areas
            you may want to improve.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="skill-gap-section">
      <div className="skill-gap-heading">
        <div className="skill-gap-heading-icon">
          <Target size={23} />
        </div>

        <div>
          <h2>Skill Gap Analysis</h2>
          <p>
            Understand your current profile and identify practical next steps.
          </p>
        </div>
      </div>

      <div className="skill-gap-summary">
        <div className="skill-gap-summary-card">
          <span className="skill-gap-summary-icon focus-icon">
            <TrendingUp size={20} />
          </span>
          <div>
            <strong>{focusCount}</strong>
            <span>Areas to focus on</span>
          </div>
        </div>

        <div className="skill-gap-summary-card">
          <span className="skill-gap-summary-icon strength-icon">
            <CheckCircle2 size={20} />
          </span>
          <div>
            <strong>{strengthCount}</strong>
            <span>Areas on track</span>
          </div>
        </div>
      </div>

      <div className="skill-gap-grid">
        {skills.map((skill) => {
          const Icon = skill.icon;
          const needsFocus = skill.status === "Needs focus";

          return (
            <article className="skill-gap-card" key={skill.key}>
              <div className="skill-gap-card-top">
                <span className="skill-gap-card-icon">
                  <Icon size={20} />
                </span>

                <span
                  className={`skill-gap-status ${
                    needsFocus ? "status-focus" : "status-good"
                  }`}
                >
                  {skill.status}
                </span>
              </div>

              <h3>{skill.label}</h3>

              <div className="skill-gap-values">
                <strong>{skill.format(skill.value)}</strong>
                <span>
                  Target: {skill.format(skill.target)}
                </span>
              </div>

              <div
                className="skill-gap-track"
                role="progressbar"
                aria-label={`${skill.label} progress toward reference target`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.min(skill.progress, 100)}
              >
                <div
                  className={`skill-gap-fill ${
                    needsFocus ? "fill-focus" : "fill-good"
                  }`}
                  style={{
                    width: `${Math.min(skill.progress, 100)}%`,
                  }}
                />
              </div>

              <p className="skill-gap-recommendation">
                {needsFocus
                  ? skill.recommendation
                  : "Keep strengthening this area and maintain your progress."}
              </p>
            </article>
          );
        })}

        {practicalSkills.map((item) => {
          const Icon = item.icon;

          return (
            <article className="skill-gap-card" key={item.key}>
              <div className="skill-gap-card-top">
                <span className="skill-gap-card-icon">
                  <Icon size={20} />
                </span>

                <span
                  className={`skill-gap-status ${
                    item.present ? "status-good" : "status-focus"
                  }`}
                >
                  {item.present ? "On track" : "Needs focus"}
                </span>
              </div>

              <h3>{item.label}</h3>

              <div className="skill-gap-values">
                <strong>{item.present ? "Yes" : "No"}</strong>
                <span>Profile response</span>
              </div>

              <div className="skill-gap-track">
                <div
                  className={`skill-gap-fill ${
                    item.present ? "fill-good" : "fill-focus"
                  }`}
                  style={{ width: item.present ? "100%" : "20%" }}
                />
              </div>

              <p className="skill-gap-recommendation">
                {item.present
                  ? "Continue participating and make sure you can explain what you learned."
                  : item.recommendation}
              </p>
            </article>
          );
        })}
      </div>

      <p className="skill-gap-disclaimer">
        <strong>Note:</strong> These are reference targets for self-improvement,
        not official company eligibility criteria or predictions from the
        placement model. Company requirements vary. The progress bars compare
        your entered values with these reference targets.
      </p>
    </section>
  );
}