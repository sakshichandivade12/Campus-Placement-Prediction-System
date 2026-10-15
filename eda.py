
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Load your actual dataset
DATA_PATH = Path("dataset/train.csv")
OUTPUT_DIR = Path("eda_graphs")
OUTPUT_DIR.mkdir(exist_ok=True)

df = pd.read_csv(DATA_PATH)

sns.set_theme(style="whitegrid")

print("\n--- Dataset Overview ---")
print("Dataset shape:", df.shape)
print("\nColumn names:")
print(df.columns.tolist())

print("\n--- Missing Values ---")
print(df.isnull().sum())

print("\n--- Statistical Summary ---")
print(df.describe(include="all"))


# Save all six graphs without opening separate windows

# 1. Placement status distribution
plt.figure(figsize=(7, 5))
sns.countplot(data=df, x="PlacementStatus")
plt.title("Distribution of Student Placement Status")
plt.xlabel("Placement Status")
plt.ylabel("Number of Students")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "1_placement_distribution.png", dpi=300)
plt.close()

# 2. CGPA distribution
plt.figure(figsize=(7, 5))
sns.histplot(data=df, x="CGPA", bins=15, kde=True)
plt.title("Distribution of Student CGPA")
plt.xlabel("CGPA")
plt.ylabel("Number of Students")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "2_cgpa_distribution.png", dpi=300)
plt.close()

# 3. Aptitude score distribution
plt.figure(figsize=(7, 5))
sns.histplot(data=df, x="AptitudeTestScore", bins=15, kde=True)
plt.title("Distribution of Aptitude Test Scores")
plt.xlabel("Aptitude Test Score")
plt.ylabel("Number of Students")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "3_aptitude_distribution.png", dpi=300)
plt.close()

# 4. CGPA by placement status
plt.figure(figsize=(7, 5))
sns.boxplot(data=df, x="PlacementStatus", y="CGPA")
plt.title("CGPA by Placement Status")
plt.xlabel("Placement Status")
plt.ylabel("CGPA")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "4_cgpa_boxplot.png", dpi=300)
plt.close()

# 5. Correlation heatmap
numeric_df = df.select_dtypes(include="number")
plt.figure(figsize=(10, 7))
sns.heatmap(numeric_df.corr(), annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Heatmap of Numerical Features")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "5_correlation_heatmap.png", dpi=300)
plt.close()

# 6. Internship experience vs placement status
plt.figure(figsize=(8, 5))
sns.countplot(data=df, x="Internships", hue="PlacementStatus")
plt.title("Internship Experience vs Placement Status")
plt.xlabel("Number of Internships")
plt.ylabel("Number of Students")
plt.tight_layout()
plt.savefig(OUTPUT_DIR / "6_internships_vs_placement.png", dpi=300)
plt.close()

print("All six graphs saved successfully!")
print("Folder:", OUTPUT_DIR.resolve())