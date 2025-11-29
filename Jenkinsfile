pipeline {
    agent any
    tools {
        nodejs 'nodejs-18'
    }
    environment {
        PATH = "${tool 'nodejs-18'}/bin:${env.PATH}"
    }
    stages {
        stage('TEST_FIRST') {
            steps {
                echo '🔥 TEST STAGE RUNNING!'
                sh '''
                    echo "=== DEBUG INFO ==="
                    pwd
                    ls -la *.js package*
                    which node || echo "❌ NO NODE!"
                    node --version || echo "❌ NODE FAILED"
                    if [ -f test-example.js ]; then
                        echo "🎯 RUNNING TEST!"
                        node test-example.js
                    else
                        echo "❌ NO TEST FILE"
                    fi
                '''
            }
        }

        stage('List Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Docker') {
            steps {
                sh '''
                    export PATH=$PATH:/usr/local/bin
                    docker build -t digdigdigdig/shop:${BUILD_NUMBER} .
                    docker tag digdigdigdig/shop:${BUILD_NUMBER} digdigdigdig/shop:latest
                '''
            }
        }

        stage('Push Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        export PATH=$PATH:/usr/local/bin
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push digdigdigdig/shop:${BUILD_NUMBER}
                        docker push digdigdigdig/shop:latest
                    '''
                }
            }
        }

        stage('Deploy Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG')]) {
                    sh '''
                        export PATH=$PATH:/usr/local/bin

                        if ! command -v kubectl >/dev/null 2>&1; then
                            echo "WARNING: kubectl not found - skipping"
                            exit 0
                        fi

                        echo "Using kubeconfig at: $KUBECONFIG"
                        kubectl get nodes || true
                        kubectl apply -f k8s-deployment.yaml || true
                    '''
                }
            }
        }
    }  // <- closes stages

    post {
        always {
            sh 'docker logout || true'
        }
    }
}  // <- closes pipeline
