#!/bin/bash
set -e

PROJECT_ID="waypoint-all-client-reporting"
REGION="us-central1"
SERVICE_ACCOUNT="replit-test-deploy@${PROJECT_ID}.iam.gserviceaccount.com"
LOGS_BUCKET="${PROJECT_ID}-cloudbuild-logs"
DATASET_PROD="activation_prod"

echo "=== Setting project ==="
gcloud config set project $PROJECT_ID

echo ""
echo "=== Enabling required APIs ==="
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com

echo ""
echo "=== Creating Cloud Storage bucket for build logs ==="
gsutil ls -b gs://${LOGS_BUCKET} 2>/dev/null || gsutil mb -l $REGION gs://${LOGS_BUCKET}

echo ""
echo "=== Granting service account permissions ==="
declare -a ROLES=(
  "roles/cloudbuild.builds.editor"
  "roles/run.admin"
  "roles/iam.serviceAccountUser"
  "roles/bigquery.dataEditor"
  "roles/bigquery.jobUser"
  "roles/storage.admin"
  "roles/viewer"
)

for ROLE in "${ROLES[@]}"; do
  echo "  Granting $ROLE..."
  gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT}" \
    --role="$ROLE" \
    --quiet
done

echo ""
echo "=== Granting service account access to logs bucket ==="
gsutil iam ch serviceAccount:${SERVICE_ACCOUNT}:objectAdmin gs://${LOGS_BUCKET}

echo ""
echo "=== Creating production BigQuery dataset ==="
bq --location=$REGION mk --dataset --exists ${PROJECT_ID}:${DATASET_PROD} || true

echo ""
echo "========================================="
echo "  Setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Go to Cloud Build > Triggers"
echo "2. Edit your trigger"
echo "3. The logs bucket '${LOGS_BUCKET}' is ready"
echo "4. Run the trigger to deploy"
echo ""
