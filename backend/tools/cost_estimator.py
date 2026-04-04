import os
import pandas as pd
from flask import request, jsonify
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor

# Input fields (case descriptors)
INPUT_FIELDS = [
    "case_type",
    "jurisdiction",
    "location",
    "complexity",
    "duration_months",
    "lawyer_level",
]

# Target fields to predict
TARGET_FIELDS = [
    "legal_fees",
    "court_fees",
    "filing_admin_fees",
    "miscellaneous_fees",
]

CSV_PATH = os.path.join(os.path.dirname(__file__), "resource", "ml_resource", "cost_estimation_dataset.csv")


def predict_cost(input_data: dict) -> dict:
    """
    Train a MultiOutput RandomForestRegressor on the dataset and predict
    legal_fees, court_fees, filing_admin_fees, miscellaneous_fees.
    total_cost is calculated as the sum of the predicted fees.
    """
    df = pd.read_csv(CSV_PATH)

    # Build a single-row DataFrame from the user input (only input columns)
    input_df = pd.DataFrame([input_data])

    # Combine training + input row so get_dummies produces consistent columns
    combined = pd.concat([df, input_df], ignore_index=True)
    combined = pd.get_dummies(combined, columns=["case_type", "jurisdiction", "location", "complexity", "lawyer_level"], drop_first=True)

    # Separate back into training data and the prediction row
    train_df = combined.iloc[:-1]
    pred_row = combined.iloc[[-1]]

    X_train = train_df.drop(TARGET_FIELDS, axis=1)
    y_train = train_df[TARGET_FIELDS]

    pred_row = pred_row.drop(TARGET_FIELDS, axis=1)

    model = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=300, random_state=42)
    )
    model.fit(X_train, y_train)

    predictions = model.predict(pred_row)[0]

    result = {col: round(float(val), 2) for col, val in zip(TARGET_FIELDS, predictions)}
    result["total_cost"] = round(sum(result.values()), 2)
    return result


def cost_estimator_route():
    """
    POST /api/cost_estimator
    Expects JSON body with keys:
        case_type, jurisdiction, location, complexity,
        duration_months, lawyer_level
    Returns JSON with predicted:
        legal_fees, court_fees, filing_admin_fees,
        miscellaneous_fees, total_cost
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Request body is required"}), 400

        # Validate required fields
        missing = [f for f in INPUT_FIELDS if f not in data]
        if missing:
            return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

        # Build input dict with proper types
        input_data = {
            "case_type": data["case_type"],
            "jurisdiction": data["jurisdiction"],
            "location": data["location"],
            "complexity": data["complexity"],
            "duration_months": int(data["duration_months"]),
            "lawyer_level": data["lawyer_level"],
            # Placeholders for target columns (needed for consistent get_dummies, dropped before prediction)
            "legal_fees": 0,
            "court_fees": 0,
            "filing_admin_fees": 0,
            "miscellaneous_fees": 0,
            "total_cost": 0,
        }

        predictions = predict_cost(input_data)

        return jsonify(predictions), 200

    except ValueError as e:
        return jsonify({"error": f"Invalid input value: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500