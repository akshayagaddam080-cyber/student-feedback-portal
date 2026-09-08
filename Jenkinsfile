pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/akshayagaddam080-cyber/student-feedback-portal.git'
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
                bat '"C:\\Users\\AKSHAYA\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t student-feedback .'
            }
        }

        stage('Deploy Docker Container') {
            steps {
                bat '"C:\\Users\\AKSHAYA\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" rm -f student-feedback-app'
                bat '"C:\\Users\\AKSHAYA\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" run -d -p 8082:80 --name student-feedback-app student-feedback'
            }
        }
    }
}