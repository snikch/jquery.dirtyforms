@echo off
GOTO endcommentblock
:: -----------------------------------------------------------------------------------
:: This file will build jquery.dirtyforms and package the distribution using Nuget and NPM.
::
:: Syntax:
::   build[.bat] [<options>]
::
:: Available Options:
::
::   -Version:<Version>
::   -v:<Version> - Version number. Default is empty (which means to use the version from the package.json file).
::					If not supplied, a build and NuGet pack is performed rather than a full release.
::
::   -Debug:<Version>
::   -d:<Version> - Debug Mode. Default is true.
::					If true, the local repository is updated, but push to the remote repository are done with 
::                  the --dry-run switch, so the remote repository is not actually changed.
::
::   All options are case insensitive.
::
::   To escape any of the options, put double quotes around the entire value, like this:
::   "-debug:false"
::
:: -----------------------------------------------------------------------------------
:endcommentblock
setlocal enabledelayedexpansion enableextensions

REM Default values
set version=
set debug=true
IF NOT "%PackageVersion%" == "" (
    set version=%PackageVersion%
	echo PackageVersion: %PackageVersion%
)
IF NOT "%DebugMode%" == ""  (
    set debug=%DebugMode%
	echo DebugMode: %DebugMode%
)

FOR %%a IN (%*) DO (
	FOR /f "useback tokens=*" %%a in ('%%a') do (
		set value=%%~a

		set test=!value:~0,3!
		IF /I !test! EQU -v: (
			set version=!value:~3!
		)

		set test=!value:~0,9!
		IF /I !test! EQU -version: (
			set version=!value:~9!
		)

		set test=!value:~0,3!
		IF /I !test! EQU -d: (
			set debug=!value:~3!
		)

		set test=!value:~0,7!
		IF /I !test! EQU -debug: (
			set debug=!value:~7!
		)
	)
)

call npm install
IF "version" == "" (
	call node_modules\.bin\gulp
) ELSE (
	call node_modules\.bin\gulp release --version=%version% --debug=%debug%
)