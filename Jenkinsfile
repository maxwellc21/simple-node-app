pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY = 'simple-node-app'
        SONARQUBE_CREDENTIALS = credentials('sonar-token')
        SONAR_HOST_URL = 'http://localhost:9006'
        SONAR_SCANNER_PATH = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat'  // Full path to sonar-scanner.bat
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
                bat 'npm test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('sonartest') { // This uses the SonarQube server configuration 'sonartest'
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
                // Allow the pipeline to proceed even if the quality gate fails
                waitForQualityGate abortPipeline: false
            }
        }
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build -t simple-node-app:latest .'
            }
        }
        stage('Push Docker Image to ACR') {
            steps {
                echo 'Pushing Docker image to ACR...'
                bat 'docker login myprojectreg.azurecr.io -u myprojectreg -p ******'
                bat 'docker tag simple-node-app:latest myprojectreg.azurecr.io/simple-node-app:latest'
                bat 'docker push myprojectreg.azurecr.io/simple-node-app:latest'
            }
        }
        stage('Deploy to AKS') {
            steps {
                echo 'Deploying Docker image to AKS...'
                bat 'kubectl apply -f k8s/deployment.yaml --kubeconfig=C:/Users/maxie/AppData/Local/Jenkins/.jenkins/jobs/simple-node-app-pipeline/.kube/config'
            }
        }
        stage('Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat 'helm upgrade datadog-agent --set datadog.apiKey=****** --set datadog.logs.enabled=true datadog/datadog'
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
