#!/bin/bash
MAGENTA=$(tput setaf 5)
NORMAL=$(tput sgr0)
LIME_YELLOW=$(tput setaf 190)
#get opts
NPMINSTALL='null'
COMPILE='all'
while getopts c:n: option
do
case "${option}"
in
n) NPMINSTALL=${OPTARG};;
c) COMPILE=${OPTARG};;
esac
done
# Script to hopefully download and deploy changes automatically
cd /home/ubuntu/Kwee
printf "\n%40s\n" "${MAGENTA}Ignoring SPA/package-lock.json"
git checkout -- SPA/package-lock.json
git checkout -- apirest/package-lock.json
printf "\n%40s\n" "${MAGENTA}Getting changes from GitHub repo.${NORMAL}"
printf "\n"
sudo git pull origin master
printf "%40s\n" "${MAGENTA}Changes downloaded from GitHub!${NORMAL}"
printf "\n\n"
cd SPA
if [[ $NPMINSTALL = "angular" ]] || [[ $NPMINSTALL = "all" ]]
then
    printf "%40s\n" "${MAGENTA}Looking for new SPA dependencies.${NORMAL}"
    sudo npm i
    sudo npm i --save typescript@">=3.1.1 and <3.3.0"
fi
if [[ $COMPILE = "angular" ]] || [[ $COMPILE = "all" ]]
then
    printf "%40s\n" "${MAGENTA}Compiling the Angular project!${NORMAL}"
    printf "\n"
    sudo ng build --prod
    sudo cp -r dist/SPA/* /var/www/kwee.ovh/html
    printf "%40s\n" "${MAGENTA}Front end deployed correctly!${NORMAL}"
    printf "\n\n"
fi
printf "${MAGENTA}Reloading API${NORMAL}"
printf "\n"
cd ../apirest
if [[ $NPMINSTALL == "api" ]] || [[ $NPMINSTALL == "all" ]]
then
    printf "%40s\n" "${MAGENTA} Looking for new api dependencies.${NORMAL}"
    sudo npm install
fi
if [[ $COMPILE = "api" ]] || [[ $COMPILE = 'all' ]]
then
    sudo pm2 reload app
    sudo pm2 status
    printf "\n\n"
fi
printf "%40s\n" "${LIME_YELLOW}Deployment completed (hopefully) successfully!${NORMAL}"
