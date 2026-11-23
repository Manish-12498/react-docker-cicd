
pipeline {
    agent {
        label 'agent'
    }

    environment {
        IMAGE     = 'textutils'
        CONTAINER = 'textutils'
        PORT      = '80'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                    -t ${IMAGE}:${BUILD_NUMBER} \
                    -t ${IMAGE}:latest .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu

                    # Save previous image ID for rollback
                    OLD_IMAGE=$(docker inspect \
                      --format='{{.Image}}' ${CONTAINER} 2>/dev/null || true)

                    # Remove previous container
                    docker rm -f ${CONTAINER} 2>/dev/null || true

                    # Start new container
                    docker run -d \
                      --name ${CONTAINER} \
                      --restart unless-stopped \
                      -p ${PORT}:80 \
                      ${IMAGE}:${BUILD_NUMBER}

                    # Save rollback information
                    echo "$OLD_IMAGE" > .previous-image
                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    sleep 5
                    curl --retry 5 \
                         --retry-delay 2 \
                         --retry-connrefused \
                         -fsS http://localhost/
                '''
            }
        }
    }

    post {
        success {
            echo 'TextUtils deployment successful!'
            echo 'Application: http://3.7.71.235'
        }

        failure {
            echo 'Deployment failed. Check container logs.'
            sh '''
                docker logs --tail 100 ${CONTAINER} || true
            '''
        }

        always {
            sh '''
                docker image prune -f || true
            '''
        }
    }
}
