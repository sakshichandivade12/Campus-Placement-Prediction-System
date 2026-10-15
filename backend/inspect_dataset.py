
from pathlib import Path
import pandas as pd

DATASET_DIR = Path(__file__).resolve().parent.parent / "dataset"

files = ["train.csv", "validation.csv", "test.csv"]

for filename in files:
    filepath = DATASET_DIR / filename

    print("\n" + "=" * 60)
    print(f"FILE: {filename}")
    print("=" * 60)

    if not filepath.exists():
        print(f"ERROR: File not found: {filepath}")
        continue

    try:
        df = pd.read_csv(filepath)

        print(f"Rows: {df.shape[0]}")
        print(f"Columns: {df.shape[1]}")
        print("\nColumn names:")
        print(df.columns.tolist())

        print("\nFirst 3 rows:")
        print(df.head(3).to_string(index=False))

        print("\nMissing values per column:")
        print(df.isnull().sum().to_string())

    except Exception as error:
        print(f"Could not read file: {error}")