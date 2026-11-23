pipeline {
  agent { label 'agent' }

  environment {
    IMAGE     = 'textutils'
    CONTAINER = 'textutils'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build image') {
      steps { sh 'docker build -t ${IMAGE}:${BUILD_NUMBER} -t ${IMAGE}:latest .' }
    }
    stage('Deploy') {
      steps {
        sh '''
          docker rm -f ${CONTAINER} || true
          docker run -d --name ${CONTAINER} --restart unless-stopped -p 80:80 ${IMAGE}:latest
        '''
      }
    }
    stage('Smoke test') {
      steps { sh 'sleep 3 && curl -fsS http://localhost/ >/dev/null' }
    }
  }

  post {
    always  { sh 'docker image prune -f || true' }
    success { echo 'Deployed to http://3.7.71.235' }
  }
}