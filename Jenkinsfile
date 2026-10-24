
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/akshayagaddam080-cyber/student-feedback-portal.git'
            }
        }

        stage('Test Files') {
            steps {
                bat 'if exist index.html (echo Home page found) else (exit /b 1)'
                bat 'if exist submit.html (echo Submit page found) else (exit /b 1)'
                bat 'if exist feedback.html (echo Feedback page found) else (exit /b 1)'
                bat 'if exist analytics.html (echo Analytics page found) else (exit /b 1)'
                bat 'if exist about.html (echo About page found) else (exit /b 1)'
                bat 'if exist thank-you.html (echo Thank You page found) else (exit /b 1)'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t student-feedback .'
            }
        }

        stage('Deploy Docker Container') {
            steps {
                bat 'docker rm -f student-feedback-app || exit /b 0'
                bat 'docker run -d -p 8082:80 --name student-feedback-app student-feedback'
            }
        }
    }
}

