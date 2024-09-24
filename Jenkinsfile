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
        AZURE_SUBSCRIPTION_ID = 'd2493857-17f6-4bb6-9aa9-2a524537d677'
        ACTION_GROUP_ID = '/subscriptions/d2493857-17f6-4bb6-9aa9-2a524537d677/resourceGroups/myproject/providers/microsoft.insights/actionGroups/MyActionGroup'
        SONAR_PROJECT_KEY = 'simple-node-app'  // SonarQube project key
        SONARQUBE_CREDENTIALS = credentials('sonar-token')  // SonarQube token stored in Jenkins credentials
        SONAR_HOST_URL = 'http://localhost:9006' // SonarQube server URL
        SONAR_SCANNER_PATH = 'C:\\sonar-scanner\\bin\\sonar-scanner.bat'  // Full path to sonar-scanner.bat .
    }

    stages {
        stage('Build') {
            steps {
                echo 'Building Node.js app...'
                bat 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                bat 'npm test' // Run Jest tests
            }
        }

        stage('Code Quality Analysis with SonarQube') {
            steps {
                echo 'Running SonarQube analysis...'
                withSonarQubeEnv('sonartest') {  // Wrap SonarQube steps with SonarQube environment
                    bat """
                    ${SONAR_SCANNER_PATH} ^
                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                        -Dsonar.sources=. ^
                        -Dsonar.host.url=${SONAR_HOST_URL} ^
                        -Dsonar.token=${SONARQUBE_CREDENTIALS}
                    """
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
                bat "kubectl apply -f k8s/deployment.yaml --kubeconfig=${KUBECONFIG_PATH}"
            }
        }

        stage('Datadog Monitoring') {
            steps {
                echo 'Setting up Datadog monitoring...'
                bat """
                helm repo add datadog https://helm.datadoghq.com
                helm repo update
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
            script {
                echo 'SonarQube quality gate evaluation...'
                timeout(time: 1, unit: 'MINUTES') {
                    def qg = waitForQualityGate()
                    if (qg.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                    }
                }
            }
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
