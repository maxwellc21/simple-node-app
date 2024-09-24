pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY = 'simple-node-app'
        SONARQUBE_CREDENTIALS = credentials('sonar-token') // Make sure 'sonar-token' exists in Jenkins credentials
        SONAR_HOST_URL = 'http://localhost:9006'  // SonarQube is running locally, ensure the port is correct
        SONAR_SCANNER_PATH = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat'  // Full path to sonar-scanner.bat.
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm // Checkout source code from SCM
            }
        }
        stage('Build') {
            steps {
                echo 'Building Node.js app...'
                bat 'npm install' // Run npm install to install dependencies
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test' // Run npm test to execute the test suite
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('sonartest') { // Ensure 'sonartest' matches the SonarQube server configuration in Jenkins
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
                echo 'SonarQube quality gate evaluation...'
                waitForQualityGate abortPipeline: false // Proceed even if the quality gate fails
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build -t simple-node-app:latest .' // Build Docker image
            }
        }
        stage('Push Docker Image to ACR') {
            steps {
                echo 'Pushing Docker image to ACR...'
                bat 'docker login myprojectreg.azurecr.io -u myprojectreg -p ******' // Use Jenkins credentials for secure Docker login
                bat 'docker tag simple-node-app:latest myprojectreg.azurecr.io/simple-node-app:latest' // Tag the image
                bat 'docker push myprojectreg.azurecr.io/simple-node-app:latest' // Push to ACR
            }
        }
        stage('Deploy to AKS') {
            steps {
                echo 'Deploying Docker image to AKS...'
                bat 'kubectl apply -f k8s/deployment.yaml --kubeconfig=C:/Users/maxie/AppData/Local/Jenkins/.jenkins/jobs/simple-node-app-pipeline/.kube/config' // Deploy using kubectl
            }
        }
        stage('Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat 'helm upgrade datadog-agent --set datadog.apiKey=****** --set datadog.logs.enabled=true datadog/datadog' // Install or upgrade Datadog monitoring
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution complete.' // Always log that the pipeline has completed
        }
        success {
            echo 'Pipeline succeeded.' // Log success message if the pipeline finishes successfully
        }
        failure {
            echo 'Pipeline failed.' // Log failure message if the pipeline fails
        }
    }
}
