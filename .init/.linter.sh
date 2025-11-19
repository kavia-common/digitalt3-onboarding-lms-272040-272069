#!/bin/bash
cd /home/kavia/workspace/code-generation/digitalt3-onboarding-lms-272040-272069/frontend_lms_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

