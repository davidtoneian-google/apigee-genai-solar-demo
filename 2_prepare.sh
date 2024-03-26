echo "Setting project to $PROJECT"
gcloud config set project $PROJECT

echo "Enabling services"
gcloud services enable aiplatform.googleapis.com

gcloud iam service-accounts create zipservice \
  --description="Service account to manage zip resources" \
  --display-name="Zip Service"