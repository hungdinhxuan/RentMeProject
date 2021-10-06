pipeline {
    agent any

    stages {
        stage('Build and Test project') {
            agent {
                docker {
                    image 'node:16-alpine'
                    reuseNode true
                }
            }
            stages {
                stage('Build') {
                    steps {
                        dir('backend'){
                            sh 'yarn install'
                        }
                    }
                }
                stage('Test') {
                    steps {
                        dir('backend'){
                            sh 'yarn test'
                        }
                    }
                } 
            }
        }
        stage('Deploy'){
            steps {
                // sh 'docker-compose down'
                sh 'docker-compose up -d --build'
                sh 'docker image prune -f'
            }
        }
        
    }
}
