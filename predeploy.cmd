@echo off

:: copy models
xcopy "./assets/models" "./dist/assets/models" /c /y

:: copy css
xcopy "./css" "./dist/css" /c /y