
import React from "react";
import {
  Activity,
  CheckCircle2,
  Info,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import "./ModelEvaluation.css";

const metrics = [
  {
    label: "Model Accuracy",
    value: "80.08%",
    description: "Correct validation predictions",
    icon: Target,
    color: "blue",
  },
  {
    label: "Placed Recall",
    value: "75.14%",
    description: "402 of 535 placed students",
    icon: TrendingUp,
    color: "green",
  },
  {
    label: "Not Placed Recall",
    value: "83.65%",
    description: "619 of 740 not-placed students",
    icon: Activity,
    color: "purple",
  },
  {
    label: "Validation Samples",
    value: "1,275",
    description: "Records evaluated",
    icon: Users,
    color: "orange",
  },
];

const confusionMatrix = [
  {
    actual: "Not Placed",
    notPlaced: 619,
    placed: 121,
  },
  {
    actual: "Placed",
    notPlaced: 133,
    placed: 402,
  },
];

const classMetrics = [
  {
    name: "Not Placed",
    precision: 82,
    recall: 83.65,
    f1: 83,
    support: 740,
  },
  {
    name: "Placed",
    precision: 77,
    recall: 75.14,
    f1: 76,
    support: 535,
  },
];

function ModelEvaluation() {
  return (
    <section className="evaluation-section">
      <div className="evaluation-heading">
        <div>
          <span className="evaluation-eyebrow">
            MODEL PERFORMANCE
          </span>

          <h2>Model Evaluation &amp; Insights</h2>

          <p>
            Explore the performance of the trained Gradient Boosting
            model on a separate validation dataset.
          </p>
        </div>

        <span className="evaluation-model-tag">
          <Activity size={15} />
          Gradient Boosting
        </span>
      </div>

      <div className="evaluation-metrics">
        {metrics.map(({ label, value, description, icon: Icon, color }) => (
          <article className="evaluation-card" key={label}>
            <div className={`evaluation-icon ${color}`}>
              <Icon size={21} />
            </div>

            <p className="evaluation-card-label">{label}</p>
            <h3>{value}</h3>
            <span className="evaluation-card-description">
              {description}
            </span>
          </article>
        ))}
      </div>

      <div className="evaluation-content">
        <article className="evaluation-panel">
          <div className="evaluation-panel-heading">
            <div>
              <h3>Confusion Matrix</h3>
              <p>
                Actual placement status compared with model predictions.
              </p>
            </div>
          </div>

          <div className="evaluation-matrix-wrap">
            <p className="evaluation-axis-label">
              Predicted placement status
            </p>

            <table className="evaluation-matrix">
              <thead>
                <tr>
                  <th>Actual status</th>
                  <th>Not Placed</th>
                  <th>Placed</th>
                </tr>
              </thead>

              <tbody>
                {confusionMatrix.map((row) => (
                  <tr key={row.actual}>
                    <th scope="row">{row.actual}</th>

                    <td className="matrix-correct">
                      {row.notPlaced}
                    </td>

                    <td className="matrix-other">
                      {row.placed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="evaluation-legend">
            <span>
              <i className="evaluation-legend-dot correct-dot" />
              Correct classifications
            </span>

            <span>
              <i className="evaluation-legend-dot other-dot" />
              Other classifications
            </span>
          </div>

          <div className="evaluation-matrix-explanation">
            <strong>How to read this matrix</strong>
            <p>
              The diagonal values, 619 and 402, are correct predictions.
              The values 121 and 133 are incorrect predictions.
            </p>
          </div>
        </article>

        <article className="evaluation-panel">
          <div className="evaluation-panel-heading">
            <div>
              <h3>Class-wise Performance</h3>
              <p>Precision, recall, and F1-score by class.</p>
            </div>
          </div>

          <div className="evaluation-class-list">
            {classMetrics.map((item) => (
              <div className="evaluation-class-card" key={item.name}>
                <div className="evaluation-class-heading">
                  <strong>{item.name}</strong>
                  <span>{item.support} actual records</span>
                </div>

                <div className="evaluation-score-row">
                  <div>
                    <span>Precision</span>
                    <strong>{item.precision}%</strong>
                  </div>

                  <div>
                    <span>Recall</span>
                    <strong>{item.recall.toFixed(2)}%</strong>
                  </div>

                  <div>
                    <span>F1-score</span>
                    <strong>{item.f1}%</strong>
                  </div>
                </div>

                <div className="evaluation-progress-track">
                  <div
                    className="evaluation-progress-fill"
                    style={{ width: `${item.recall}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="evaluation-insight-note">
            <Info size={19} />
            <p>
              Recall indicates the proportion of actual students in a
              class that the model correctly identifies. Displayed
              precision and F1 values are rounded from your evaluation
              report.
            </p>
          </div>
        </article>
      </div>

      <div className="evaluation-summary">
        <div className="evaluation-summary-icon">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <h3>What do these results mean?</h3>
          <p>
            The model correctly classified 1,021 out of 1,275 validation
            records. Its recall is higher for the Not Placed class than
            for the Placed class, so some actual placed students are
            still incorrectly classified. The model can support
            placement preparation, but it cannot guarantee hiring.
          </p>
        </div>
      </div>

      <p className="evaluation-disclaimer">
        Evaluation results are based on the current validation dataset.
        They may differ on new student data. These are model-level
        metrics, not the probability or confidence of an individual
        student's prediction.
      </p>
    </section>
  );
}

export default ModelEvaluation;