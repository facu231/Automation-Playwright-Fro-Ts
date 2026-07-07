pipeline {
  agent any

  environment {
    TEST_ENV = 'qa'
    HEADLESS = 'true'
    TRACE = 'true'
    VIDEO = 'true'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'npm install'
      }
    }

    stage('Install browsers') {
      steps {
        bat 'npx playwright install'
      }
    }

    stage('Run tests') {
      steps {
        bat 'npm test'
      }
    }

    stage('Publish reports') {
      steps {
        bat 'npm run report'
        publishHTML([
          allowMissing: true,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'reports/html',
          reportFiles: 'index.html',
          reportName: 'E2E Cucumber Report'
        ])
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'reports/**, screenshots/**, videos/**, traces/**', allowEmptyArchive: true
    }
  }
}
