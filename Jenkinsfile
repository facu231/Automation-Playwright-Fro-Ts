pipeline {
  agent any

  environment {
    TEST_ENV = 'qa'
    HEADLESS = 'true'
    TRACE = 'true'
    VIDEO = 'true'
    RETRY = '1'
    RETRY_TAG_FILTER = '@flaky'
    CUCUMBER_TAGS = '@smoke and not @wip'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        bat 'corepack enable'
        bat 'pnpm install --frozen-lockfile'
      }
    }

    stage('Validate framework') {
      steps {
        bat 'pnpm run validate'
      }
    }

    stage('Run browser matrix') {
      matrix {
        axes {
          axis {
            name 'BROWSER'
            values 'chromium', 'firefox', 'webkit'
          }
        }
        stages {
          stage('Install browser') {
            steps {
              bat 'pnpm exec playwright install %BROWSER%'
            }
          }

          stage('Run tests') {
            steps {
              bat 'pnpm run test:ci'
            }
          }
        }
      }
    }

    stage('Publish reports') {
      steps {
        bat 'pnpm run report'
        publishHTML([
          allowMissing: true,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'reports/html',
          reportFiles: 'index.html',
          reportName: 'E2E Cucumber Report'
        ])
        publishHTML([
          allowMissing: true,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'reports/allure-report',
          reportFiles: 'index.html',
          reportName: 'E2E Allure Report'
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
