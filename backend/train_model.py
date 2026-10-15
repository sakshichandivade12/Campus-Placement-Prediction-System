
from pathlib import Path
import json

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
)
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier


BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "dataset"
ARTIFACT_DIR = Path(__file__).resolve().parent / "artifacts"

TARGET = "PlacementStatus"


def load_dataset(filename):
    path = DATASET_DIR / filename

    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")

    return pd.read_csv(path)


def build_pipeline(X, classifier, scale_numeric=False):
    numeric_columns = X.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = [
        column for column in X.columns
        if column not in numeric_columns
    ]

    numeric_steps = [
        ("imputer", SimpleImputer(strategy="median"))
    ]

    if scale_numeric:
        numeric_steps.append(("scaler", StandardScaler()))

    numeric_pipeline = Pipeline(numeric_steps)

    categorical_pipeline = Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("encoder", OneHotEncoder(handle_unknown="ignore"))
    ])

    preprocessing = ColumnTransformer([
        ("numeric", numeric_pipeline, numeric_columns),
        ("categorical", categorical_pipeline, categorical_columns)
    ])

    return Pipeline([
        ("preprocessing", preprocessing),
        ("classifier", classifier)
    ])


def evaluate(model, X, y, name):
    predictions = model.predict(X)

    metrics = {
        "model": name,
        "accuracy": round(accuracy_score(y, predictions), 4),
        "precision_macro": round(
            precision_score(
                y, predictions, average="macro", zero_division=0
            ), 4
        ),
        "recall_macro": round(
            recall_score(
                y, predictions, average="macro", zero_division=0
            ), 4
        ),
        "f1_macro": round(
            f1_score(
                y, predictions, average="macro", zero_division=0
            ), 4
        )
    }

    print(f"\n{name}")
    print("-" * 45)
    for key, value in metrics.items():
        if key != "model":
            print(f"{key}: {value}")

    return metrics


def main():
    print("Loading placement data...")

    train_df = load_dataset("train.csv")
    validation_df = load_dataset("validation.csv")

    if TARGET not in train_df.columns:
        raise ValueError(f"Missing target column: {TARGET}")

    if TARGET not in validation_df.columns:
        raise ValueError(f"Validation data is missing: {TARGET}")

    if set(train_df[TARGET].dropna().unique()) != set(
        validation_df[TARGET].dropna().unique()
    ):
        raise ValueError(
            "Training and validation target labels do not match."
        )

    train_df = train_df.dropna(subset=[TARGET]).copy()
    validation_df = validation_df.dropna(subset=[TARGET]).copy()

    # Remove duplicate records before training.
    train_df = train_df.drop_duplicates().reset_index(drop=True)

    feature_columns = [
        column for column in train_df.columns
        if column != TARGET
    ]

    if set(feature_columns) != set(
        column for column in validation_df.columns
        if column != TARGET
    ):
        raise ValueError(
            "Training and validation feature columns do not match."
        )

    validation_df = validation_df[feature_columns + [TARGET]]

    X = train_df[feature_columns]
    y = train_df[TARGET].astype(str)

    X_validation = validation_df[feature_columns]
    y_validation = validation_df[TARGET].astype(str)

    print(f"Training records: {len(train_df)}")
    print(f"Validation records: {len(validation_df)}")
    print(f"Features: {feature_columns}")
    print(f"Placement labels: {sorted(y.unique())}")

    # Reserve part of training data for algorithm comparison.
    X_fit, X_check, y_fit, y_check = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    candidates = {
        "Logistic Regression": (
            LogisticRegression(
                max_iter=2000,
                class_weight="balanced",
                random_state=42
            ),
            True
        ),
        "Random Forest": (
            RandomForestClassifier(
                n_estimators=250,
                class_weight="balanced",
                random_state=42,
                n_jobs=-1
            ),
            False
        ),
        "Gradient Boosting": (
            GradientBoostingClassifier(random_state=42),
            False
        )
    }

    results = []
    fitted_models = {}

    print("\nComparing algorithms on the held-out training split...")

    for name, (classifier, scale_numeric) in candidates.items():
        model = build_pipeline(X_fit, classifier, scale_numeric)
        model.fit(X_fit, y_fit)

        metrics = evaluate(model, X_check, y_check, name)
        results.append(metrics)
        fitted_models[name] = model

    results.sort(key=lambda item: item["f1_macro"], reverse=True)
    best_name = results[0]["model"]

    print(f"\nSelected model: {best_name}")
    print("Refitting selected algorithm on all training records...")

    best_classifier, scale_numeric = candidates[best_name]
    final_model = build_pipeline(X, best_classifier, scale_numeric)
    final_model.fit(X, y)

    # Use the supplied structured validation file as an
    # independent evaluation set after algorithm selection.
    final_metrics = evaluate(
        final_model,
        X_validation,
        y_validation,
        f"{best_name} - supplied validation set"
    )

    print("\nValidation classification report:")
    print(classification_report(
        y_validation,
        final_model.predict(X_validation),
        zero_division=0
    ))

    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    model_path = ARTIFACT_DIR / "placement_model.joblib"
    joblib.dump({
        "model": final_model,
        "features": feature_columns,
        "target": TARGET,
        "labels": sorted(y.unique()),
        "model_name": best_name
    }, model_path)

    with open(ARTIFACT_DIR / "evaluation.json", "w") as file:
        json.dump({
            "comparison": results,
            "validation": final_metrics,
            "note": (
                "Metrics are dataset-based estimates, not a guarantee "
                "of real-world placement outcomes."
            )
        }, file, indent=2)

    print(f"\nModel saved to: {model_path}")
    print(f"Evaluation saved to: {ARTIFACT_DIR / 'evaluation.json'}")
    print("\nTraining completed successfully!")


if __name__ == "__main__":
    main()