pipeline {
    agent any  // Use any available Jenkins agent

    environment {
        ACR_NAME = 'myprojectreg'  // Azure Container Registry (ACR) name
        ACR_LOGIN_SERVER = 'myprojectreg.azurecr.io'  // ACR login server
        ACR_CREDENTIALS = credentials('acr_credentials')  // ACR credentials in Jenkins
        KUBECONFIG_PATH = 'C:\\Users\\maxie\\AppData\\Local\\Jenkins\\.jenkins\\jobs\\simple-node-app-pipeline\\.kube\\config'  // Kubeconfig for AKS access
        DOCKER_IMAGE_NAME = 'simple-node-app'
        DOCKER_IMAGE_TAG = 'latest'
        AKS_RESOURCE_GROUP = 'myproject'
        AKS_CLUSTER_NAME = 'projectcluster'
        DATADOG_API_KEY = credentials('datadog-api-key')  // Datadog API Key
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building Node.js app...'
                bat 'npm install'  // Install dependencies using npm for Windows
            }
        }

        stage('Code Quality Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('SonarQube') {
                    bat 'npm run sonar-scanner'  // Run SonarQube for code quality
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."  // Build Docker image
            }
        }

        stage('Push to ACR') {
            steps {
                echo 'Pushing Docker image to ACR...'
                bat "docker login ${ACR_LOGIN_SERVER} -u ${ACR_CREDENTIALS_USR} -p ${ACR_CREDENTIALS_PSW}"  // Login to ACR
                bat "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"  // Tag image
                bat "docker push ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"  // Push image to ACR
            }
        }

        stage('Deploy to AKS') {
            steps {
                echo 'Deploying Docker image to AKS...'
                bat 'kubectl apply -f k8s/deployment.yaml --kubeconfig=%KUBECONFIG_PATH%'  // Deploy to AKS
            }
        }

        stage('Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat """
                helm upgrade datadog-agent --set datadog.apiKey=${DATADOG_API_KEY} --set datadog.logs.enabled=true datadog/datadog
                """  // Install/upgrade Datadog agent in AKS using Helm
            }
        }

        stage('Azure Monitor') {
            steps {
                echo 'Setting up Azure Monitor...'
                bat """
                az monitor metrics alert create --name "HighCPUAlert" --resource-group ${AKS_RESOURCE_GROUP} --scopes /subscriptions/d2493857-17f6-4bb6-9aa9-2a524537d677/resourceGroups/${AKS_RESOURCE_GROUP}/providers/Microsoft.ContainerService/managedClusters/${AKS_CLUSTER_NAME} --condition "avg Percentage CPU > 75" --window-size 5m --evaluation-frequency 1m --action email/maxiecletus@gmail.com
                """  // Set up Azure Monitor for AKS metrics
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
    }
}
