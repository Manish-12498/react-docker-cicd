
pipeline {

    agent {
        label 'agent'
    }

    triggers {
        githubPush()
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
    }

    environment {
        IMAGE     = 'textutils'
        CONTAINER = 'textutils'
        HOST_PORT = '80'
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm

                sh '''
                    echo "Repository checkout successful"
                    git log -1 --oneline
                '''
            }
        }

        stage('Validate Environment') {
            steps {
                sh '''
                    set -eu
                    docker --version
                    docker info >/dev/null
                    curl --version
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    set -eu

                    docker build --pull \
                      --label "org.opencontainers.image.revision=${GIT_COMMIT}" \
                      -t ${IMAGE}:${BUILD_NUMBER} \
                      -t ${IMAGE}:latest .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu

                    # Get previous container image
                    PREVIOUS_IMAGE=$(docker inspect \
                      --format='{{.Config.Image}}' \
                      ${CONTAINER} 2>/dev/null || true)

                    # Save rollback information
                    printf '%s\\n' "$PREVIOUS_IMAGE" > .previous-image
                    touch .deployment-started

                    # Remove old container
                    docker rm -f ${CONTAINER} 2>/dev/null || true

                    # Start new container
                    docker run -d \
                      --name ${CONTAINER} \
                      --restart unless-stopped \
                      --label "managed-by=jenkins" \
                      -p ${HOST_PORT}:80 \
                      ${IMAGE}:${BUILD_NUMBER}

                '''
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    set -eu

                    echo "Testing application..."

                    curl \
                      --retry 10 \
                      --retry-delay 2 \
                      --retry-connrefused \
                      --connect-timeout 3 \
                      --max-time 10 \
                      -fsS \
                      http://127.0.0.1:${HOST_PORT}/ \
                      -o /dev/null

                    echo "Application is responding successfully"
                '''
            }
        }
    }

    post {

        success {
            echo 'Deployment successful!'
            echo 'TextUtils is running on port 80.'

            sh '''
                rm -f .previous-image .deployment-started
            '''
        }

        failure {
            echo 'Pipeline failed. Attempting rollback...'

            sh '''
                set +e

                if [ -f .deployment-started ]; then

                    PREVIOUS_IMAGE=$(cat .previous-image 2>/dev/null)

                    # Remove failed deployment
                    docker rm -f ${CONTAINER} 2>/dev/null

                    if [ -n "$PREVIOUS_IMAGE" ]; then

                        echo "Restoring previous image: $PREVIOUS_IMAGE"

                        docker run -d \
                          --name ${CONTAINER} \
                          --restart unless-stopped \
                          -p ${HOST_PORT}:80 \
                          "$PREVIOUS_IMAGE"

                        if [ $? -eq 0 ]; then
                            echo "Rollback successful"
                        else
                            echo "Rollback failed. Manual recovery required."
                        fi

                    else
                        echo "No previous container available for rollback."
                    fi
                fi

                docker logs --tail 100 ${CONTAINER} 2>/dev/null
                    || true

                rm -f .previous-image .deployment-started
            '''
        }
    }
}
