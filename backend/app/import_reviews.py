import pandas as pd
from pathlib import Path

from .database import reviews_collection


# ==========================================
# CSV PATH
# ==========================================

CSV_PATH = (
    Path(__file__).resolve().parents[2]
    / "ml"
    / "data"
    / "raw"
    / "reviews.csv"
)


# ==========================================
# LOAD CSV
# ==========================================

print(f"Loading CSV from:\n{CSV_PATH}")

df = pd.read_csv(CSV_PATH)

print(f"Loaded {len(df)} reviews")


# ==========================================
# CLEAN MISSING VALUES
# ==========================================

# Convert the DataFrame to object dtype first.
# This allows missing values to become real Python None values.
df = df.astype(object)

# Replace NaN / NaT / pd.NA with None
df = df.where(pd.notna(df), None)


# ==========================================
# VERIFY CLEANING
# ==========================================

print("\nChecking for remaining NaN values...")

nan_count = 0

for column in df.columns:
    count = df[column].apply(
        lambda value: isinstance(value, float) and pd.isna(value)
    ).sum()

    if count > 0:
        print(f"{column}: {count} NaN values")
        nan_count += count

if nan_count == 0:
    print("No NaN values found!")


# ==========================================
# CONVERT DATA
# ==========================================

records = df.to_dict(orient="records")


# ==========================================
# IMPORT INTO MONGODB
# ==========================================

if records:

    # IMPORTANT:
    # Delete the previous import so we don't create duplicates
    reviews_collection.delete_many({})

    print("Existing reviews deleted.")

    result = reviews_collection.insert_many(records)

    print(
        f"Successfully imported "
        f"{len(result.inserted_ids)} reviews!"
    )

else:

    print("CSV contains no records.")