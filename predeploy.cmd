@echo off

:: copy all assets
xcopy "./assets" "./dist/assets" /c /y
xcopy "./assets/models" "./dist/assets/models" /c /y

:: copy css
xcopy "./css" "./dist/css" /c /y