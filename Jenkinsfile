pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY = 'simple-node-app'
        SONARQUBE_CREDENTIALS = credentials('sonar-token')
        SONAR_HOST_URL = 'http://localhost:9006'  // SonarQube is running locally
        SONAR_SCANNER_PATH = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat'

        ACR_NAME = 'myprojectreg'  // Azure Container Registry (ACR) name
        ACR_LOGIN_SERVER = 'myprojectreg.azurecr.io'  // ACR login server
        ACR_CREDENTIALS = credentials('acr_credentials')  // ACR credentials in Jenkins

        KUBECONFIG_PATH = 'C:\\Users\\maxie\\AppData\\Local\\Jenkins\\.jenkins\\jobs\\simple-node-app-pipeline\\.kube\\config'  // Kubeconfig for AKS access
        DOCKER_IMAGE_NAME = 'simple-node-app'
        DOCKER_IMAGE_TAG = 'latest'

        AKS_RESOURCE_GROUP = 'myproject'
        AKS_CLUSTER_NAME = 'projectcluster'  // Path to kubeconfig file

        DATADOG_API_KEY = credentials('datadog-api-key')  // Datadog API Key

        DATABASE_URL = 'postgresql://blog_app_db_ect7_user:bSQRVsyZ4dcfcTPTDhQzRoofiGTwYLWI@dpg-crpq2ajv2p9s7389vm30-a.singapore-postgres.render.com/blog_app_db_ect7'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building Node.js app...'
                bat 'npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                // Inject environment variables like DATABASE_URL for the test
                withEnv(['DATABASE_URL=postgresql://blog_app_db_ect7_user:bSQRVsyZ4dcfcTPTDhQzRoofiGTwYLWI@dpg-crpq2ajv2p9s7389vm30-a.singapore-postgres.render.com/blog_app_db_ect7']) {
                    bat 'npm test'
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('sonartest') { // Ensure 'sonartest' matches the SonarQube configuration
                    bat """
                    ${SONAR_SCANNER_PATH} ^
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=${SONAR_HOST_URL} ^
                        -Dsonar.login=${SONARQUBE_CREDENTIALS}
                    """
                }
            }
        }
        stage('Check Quality Gate') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
            }
        }
        stage('Push to ACR') {
            steps {
                echo 'Pushing Docker image to ACR...'
                bat "docker login ${ACR_LOGIN_SERVER} -u ${ACR_CREDENTIALS_USR} -p ${ACR_CREDENTIALS_PSW}"
                bat "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                bat "docker push ${ACR_LOGIN_SERVER}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
            }
        }
        stage('Deploy to AKS') {
            steps {
                echo 'Deploying Docker image to AKS...'
                bat 'kubectl apply -f k8s/deployment.yaml --kubeconfig=%KUBECONFIG_PATH%'
            }
        }
        stage('Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat """
                helm upgrade datadog-agent --set datadog.apiKey=${DATADOG_API_KEY} --set datadog.logs.enabled=true datadog/datadog
                """
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Pipeline succeeded.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
