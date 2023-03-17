include .env
export
GCP_PROJECT=$$GCP_PROJECT_ID
SERVICE_NAME=$$GCP_SERVICE_NAME
REGION="europe-west1"
IMAGE_NAME=gcr.io/$(GCP_PROJECT)/$(SERVICE_NAME):latest

run:
	docker build -t $(SERVICE_NAME) .
	docker run -p 127.0.0.1:8080:8080 $(SERVICE_NAME)

run-dev:
	docker build -t $(SERVICE_NAME) .
	docker run -p 127.0.0.1:3333:8080 $(SERVICE_NAME)

deploy:
	echo "Create Docker image via 'Cloud Build' ..."
	gcloud builds submit  \
	--tag $(IMAGE_NAME) \
	--project $(GCP_PROJECT)

	gcloud container images add-tag $(IMAGE_NAME) $(IMAGE_NAME) --quiet

	echo "Deploying Cloud Run Service '$(SERVICE_NAME)' to '$(GCP_PROJECT)' in '$(REGION)'"
	gcloud run deploy $(SERVICE_NAME) \
	--image $(IMAGE_NAME) \
	--project $(GCP_PROJECT) \
	--platform managed \
	--region $(REGION) \
	--allow-unauthenticated
