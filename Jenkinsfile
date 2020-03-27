pipeline {
  agent any 
    stages {
      stage('init') {
        steps {
          echo 'init stage'
          setEnvironments()
        }
      }
      stage('build') {
        steps {
          script {
            def msg = "Building: $env.APP_NAME_TAG by $env.COMMIT_AUTHOR, commit message: \"$env.COMMIT_MSG\""
            telegramSend(message: msg)
            build_and_push(docker_image_tag)
          }

        }
      }
      stage('deploy') {
        steps{
          script {
            sshagent(credentials : ['JCI_SSH_KEY']) {
              def msg = "Deploying: $env.APP_NAME_TAG to $env.DOCKER_CRED_ID, commit message: \"$env.COMMIT_MSG\""
              telegramSend(message: msg)
              commandStringChangeTag = "sudo -u deploy /home/deploy/emirex-preprod/config/environments/preprod/baseapp-tag.sh ${env.IMAGE_TAG}"
              sh "ssh -o StrictHostKeyChecking=no Jenkins@35.205.47.217 /bin/bash -c '\"${commandStringChangeTag}\"'"
              commandStringDeployAwait = "sudo -u deploy /home/deploy/emirex-preprod/config/environments/preprod/check-deployment.sh frontend"
              sh "ssh -o StrictHostKeyChecking=no Jenkins@35.205.47.217 /bin/bash -c '\"${commandStringDeployAwait}\"'"
              def msg2 = "Deployed: $env.APP_NAME_TAG to $env.DOCKER_CRED_ID, commit message: \"$env.COMMIT_MSG\""
              telegramSend(message: msg2)
            }
          }
        }
      }
    }
}

def setEnvironments() {
  env.DOCKER_REGISTRY = 'https://eu.gcr.io'
  env.DOCKER_REGISTRY_LOCATION = 'eu.gcr.io'
  env.DOCKER_CRED_ID = 'emirex-preprod'
  env.BRANCH_NAME = env.GIT_BRANCH.toLowerCase().replaceAll('/','-') - ~/^origin-/
  env.GIT_REPO = scm.userRemoteConfigs[0].url
  env.CONFIG_REPO = 'git@gitlab.com:emirex-exchange/emirex-exchange-core-components/server-configs/preprod-cfg.git'
  env.APP_NAME = (GIT_REPO =~ /.+\/(.+?).git$/)[0][1]
  env.SHORT_COMMIT = "${GIT_COMMIT[0..7]}"
  env.COMMIT_AUTHOR = sh(
    script: "git --no-pager show -s --format='%ae'",
    returnStdout: true
  ).trim()
  env.COMMIT_MSG = sh(
    script: "git show -s $GIT_COMMIT --format='format:%s'",
    returnStdout: true
  ).trim()
  env.IMAGE_TAG = env.BRANCH_NAME + '-' + env.SHORT_COMMIT
  env.DOCKER_IMAGE_TAG = env.DOCKER_REGISTRY_LOCATION + '/' + env.DOCKER_CRED_ID + '/' + env.APP_NAME + ':' + env.BRANCH_NAME + '-' + env.SHORT_COMMIT
  env.APP_NAME_TAG = env.DOCKER_CRED_ID + '/' + env.APP_NAME + ':' + env.BRANCH_NAME + '-' + env.SHORT_COMMIT
  env.BUILD_ARGS= '--no-cache --build-arg REACT_APP_BUILD_VERSION=Enterprise --build-arg NPM_AUTH_TOKEN=af4fa371-449d-4628-a926-e12885610fba --build-arg BUILD_DOMAIN=emirex.com'
}

def build_and_push(docker_image_tag) {
  def image = docker.build("${env.DOCKER_IMAGE_TAG}", "${env.BUILD_ARGS} .")
  try {
    docker.withRegistry("${env.DOCKER_REGISTRY}", 'gcr:emirex-preprod-gcr') {
      image.push()
    }
  }
  finally {
    sh "docker rmi ${env.DOCKER_IMAGE_TAG}"
  }
}
