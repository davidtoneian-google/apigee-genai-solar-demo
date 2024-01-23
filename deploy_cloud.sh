NAME=solar-service
PROJECT=apigee-test38
REGION=europe-west1
AI_REGION=us-central1
API_PATH=

# Create artifact registry, if needed
gcloud artifacts repositories create docker-registry --repository-format=docker \
--location="$REGION" --description="Docker registry"    

# Submit build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_LOCATION="$REGION",_REPOSITORY="docker-registry",_IMAGE="$NAME" .

# Deploy to Cloud Run
gcloud run deploy $NAME --image "$REGION-docker.pkg.dev/$PROJECT/docker-registry/$NAME" \
    --platform managed --region $REGION --allow-unauthenticated \
    --set-env-vars PROJECT="$PROJECT",AI_REGION="$AI_REGION",API_PATH="$API_PATH"