pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo 'Testing Student Feedback Portal...'
                bat 'if exist index.html (echo HTML file found) else (exit /b 1)'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-feedback .'
            }
        }

        stage('Deploy Docker Container') {
            steps {
                bat 'docker stop student-feedback-app || exit /b 0'
                bat 'docker rm student-feedback-app || exit /b 0'
                bat 'docker run -d -p 8080:80 --name student-feedback-app student-feedback'
            }
        }

    }
}