pipeline {
    agent any

    environment {
        ACR_NAME = 'myprojectreg'
        ACR_LOGIN_SERVER = 'myprojectreg.azurecr.io'
        ACR_CREDENTIALS = credentials('acr_credentials')
        KUBECONFIG_PATH = 'C:\\Users\\maxie\\AppData\\Local\\Jenkins\\.jenkins\\jobs\\simple-node-app-pipeline\\.kube\\config'
        DOCKER_IMAGE_NAME = 'simple-node-app'
        DOCKER_IMAGE_TAG = 'latest'
        AKS_RESOURCE_GROUP = 'myproject'
        AKS_CLUSTER_NAME = 'projectcluster'
        DATADOG_API_KEY = credentials('datadog-api-key')
        AZURE_CLIENT_ID = credentials('azure-client-id')  // Service Principal ID
        AZURE_CLIENT_SECRET = credentials('azure-client-secret')  // Service Principal Secret
        AZURE_TENANT_ID = credentials('azure-tenant-id')  // Azure Tenant ID
        AZURE_SUBSCRIPTION_ID = 'your-subscription-id'  // Your Azure Subscription ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Node.js App') {
            steps {
                echo 'Building Node.js app...'
                bat 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
            }
        }

        stage('Push Docker Image to ACR') {
            steps {
                echo 'Pushing Docker image to ACR...'
                bat "docker login ${ACR_LOGIN_SERVER} -u ${ACR_NAME} -p ${ACR_CREDENTIALS_PSW}"
                bat "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                bat "docker push ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }

        stage('Deploy to AKS') {
            steps {
                echo 'Deploying Docker image to AKS...'
                bat "kubectl apply -f k8s/deployment.yaml --kubeconfig=${KUBECONFIG_PATH}"
            }
        }

        stage('Setup Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat """
                helm repo add datadog https://helm.datadoghq.com
                helm repo update
                helm list --namespace default | findstr datadog-agent || helm install datadog-agent --set datadog.apiKey=${DATADOG_API_KEY} --set datadog.logs.enabled=true datadog/datadog
                """
            }
        }

        stage('Setup Azure Monitor') {
            steps {
                echo 'Setting up Azure Monitor...'
                bat """
                az login --service-principal -u ${AZURE_CLIENT_ID} -p ${AZURE_CLIENT_SECRET} --tenant ${AZURE_TENANT_ID}
                az monitor metrics alert create --name "HighCPUAlert" --resource-group ${AKS_RESOURCE_GROUP} --scopes /subscriptions/${AZURE_SUBSCRIPTION_ID}/resourceGroups/${AKS_RESOURCE_GROUP}/providers/Microsoft.ContainerService/managedClusters/${AKS_CLUSTER_NAME} --condition "avg Percentage CPU > 75" --window-size 5m --evaluation-frequency 1m --action email/maxiecletus@gmail.com
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
