pipeline{
    agent any
    
    stages{
        stage("Build"){
            steps{
                echo "========executing A========"
                echo "branch name"
                echo BRANCH_NAME
            }
            post{ 
                always{
                    echo "========always========"
                }
                success{
                    echo "========A executed successfully========"
                }
                failure{
                    echo "========A execution failed========"
                }
            }
        }
      stage("Deploy") {
        when {
          expression {
            BRANCH_NAME == 'master'
          }
        }
        steps {
          echo "Desploying" 
        }
      }
    }
    post{
        always{
            echo "========always========"
        }
        success{
            echo "========pipeline executed successfully ========"
        }
        failure{
            echo "========pipeline execution failed========"
        }
    }
}
