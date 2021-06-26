@echo off

setlocal

call npm run build
if %errorlevel% neq 0 goto end

rmdir /S /Q dist\nginx 2>nul
xcopy build\nginx dist\nginx\
if %errorlevel% neq 0 goto end

docker build -t 172.30.1.1:5000/myproject/deputyfe:latest -f ./build/Dockerfile ./dist
if %errorlevel% neq 0 goto end

docker push 172.30.1.1:5000/myproject/deputyfe:latest
if %errorlevel% neq 0 goto end

oc delete deployment deputyfe
oc apply -f deployments/minishift/frontend.yaml

goto end

:end
endlocal
exit /b 0
