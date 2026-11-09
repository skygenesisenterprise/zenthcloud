//go:build darwin

package main

import (
	"fmt"
	"os"
	"path/filepath"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/pkg/errors"
	"github.com/urfave/cli/v2"

	"github.com/zenthcloud/zenthcloudd/cmd/zenthcloudd/cliutil"
	"github.com/zenthcloud/zenthcloudd/logger"
)

const (
	launchdIdentifier = "com.zenthcloud.zenthcloudd"
)

// OS-specific function for token file creation
var createTokenFile = createTokenFileUnix

func runApp(app *cli.App, _ chan struct{}) {
	app.Commands = append(app.Commands, &cli.Command{
		Name:  "service",
		Usage: "Manages the zenthcloudd launch agent",
		Subcommands: []*cli.Command{
			{
				Name:      "install",
				Usage:     "Install zenthcloudd as an user launch agent",
				ArgsUsage: "[TOKEN]",
				Description: `
Installs zenthcloudd as a launchd-managed service.

A token may optionally be provided. If a token is provided, it will be written
to disk in the service configuration directory and the zenthcloudd service
configured to use it via the --token-file argument.

If no token is provided, zenthcloudd will run without the --token-file argument,
causing it to look for credentials in a configuration file upon startup.`,

				Action: cliutil.ConfiguredAction(installLaunchd),
			},
			{
				Name:   "uninstall",
				Usage:  "Uninstall the zenthcloudd launch agent",
				Action: cliutil.ConfiguredAction(uninstallLaunchd),
			},
		},
	})
	_ = app.Run(os.Args)
}

func newLaunchdTemplate(installPath, stdoutPath, stderrPath string) *ServiceTemplate {
	return &ServiceTemplate{
		Path: installPath,
		Content: fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>Label</key>
		<string>%s</string>
		<key>ProgramArguments</key>
		<array>
			<string>{{ .Path }}</string>
			{{- range $i, $item := .ExtraArgs}}
			<string>{{ $item }}</string>
			{{- end}}
		</array>
		<key>RunAtLoad</key>
		<true/>
		<key>StandardOutPath</key>
		<string>%s</string>
		<key>StandardErrorPath</key>
		<string>%s</string>
		<key>KeepAlive</key>
		<dict>
			<key>SuccessfulExit</key>
			<false/>
		</dict>
		<key>ThrottleInterval</key>
		<integer>5</integer>
	</dict>
</plist>`, launchdIdentifier, stdoutPath, stderrPath),
	}
}

func isRootUser() bool {
	return os.Geteuid() == 0
}

func resolveLibraryPath(subPath, fileName string) (string, error) {
	const libraryDirName = "Library"

	// We use the system-wide /Library/... instead of ~/Library/... if the user is root
	if isRootUser() {
		return filepath.Join("/", libraryDirName, subPath, fileName), nil
	}

	// This returns the home dir of the executing user using OS-specific method
	// for discovering the home dir. It's not recommended to call this when the
	// user has root permission as $HOME depends on what options the user uses
	// with sudo.
	userHomeDir, err := homedir.Dir()
	if err != nil {
		return "", errors.Wrap(err, "Cannot determine home directory for the user")
	}
	return filepath.Join(userHomeDir, libraryDirName, subPath, fileName), nil
}

// For docs on these subdirectories, see:
// https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html
func installPath() (string, error) {
	subpath := "LaunchAgents"
	if isRootUser() {
		subpath = "LaunchDaemons"
	}
	return resolveLibraryPath(subpath, launchdIdentifier+".plist")
}

func stdoutPath() (string, error) {
	return resolveLibraryPath("Logs", launchdIdentifier+".out.log")
}

func stderrPath() (string, error) {
	return resolveLibraryPath("Logs", launchdIdentifier+".err.log")
}

func configPath() (string, error) {
	return resolveLibraryPath("Application Support", launchdIdentifier)
}

func installLaunchd(c *cli.Context) error {
	log := logger.CreateLoggerFromContext(c, logger.EnableTerminalLog)

	if isRootUser() {
		log.Info().Msg("Installing zenthcloudd client as a system launch daemon. " +
			"zenthcloudd client will run at boot")
	} else {
		log.Info().Msg("Installing zenthcloudd client as an user launch agent. " +
			"Note that zenthcloudd client will only run when the user is logged in. " +
			"If you want to run zenthcloudd client at boot, install with root permission. " +
			"For more information, visit https://github.com/skygenesisenterprise/zenthcloud")
	}
	etPath, err := os.Executable()
	if err != nil {
		log.Err(err).Msg("Error determining executable path")
		return fmt.Errorf("error determining executable path: %w", err)
	}
	installPath, err := installPath()
	if err != nil {
		log.Err(err).Msg("Error determining install path")
		return errors.Wrap(err, "Error determining install path")
	}

	var extraArgs []string
	if c.NArg() > 0 {
		// The service has been installed using a token e.g.,
		// $ zenthcloudd service install <token>
		//
		// Write the token file to a config directory so we can start the
		// daemon with --token-file

		// Don't use :=, if we did so we would create a new err variable and
		// shadow the outer one, causing the defer below to not have access to
		// the outer err
		var cp string
		cp, err = configPath()
		if err != nil {
			log.Err(err).Msg("Error determining path to config directory")
			return err
		}

		// Ensure token file is removed if install fails at any point from now
		// on
		defer func() {
			if err != nil {
				removeTokenFile(cp, log)
			}
		}()

		if err = writeTokenToConfigDir(c, cp); err != nil {
			return fmt.Errorf("could not write token to configuration directory: %w", err)
		}

		extraArgs = buildArgsForTokenFile(cp)
	}

	stdoutPath, err := stdoutPath()
	if err != nil {
		log.Err(err).Msg("error determining stdout path")
		return errors.Wrap(err, "error determining stdout path")
	}
	stderrPath, err := stderrPath()
	if err != nil {
		log.Err(err).Msg("error determining stderr path")
		return errors.Wrap(err, "error determining stderr path")
	}
	launchdTemplate := newLaunchdTemplate(installPath, stdoutPath, stderrPath)
	templateArgs := ServiceTemplateArgs{Path: etPath, ExtraArgs: extraArgs}
	err = launchdTemplate.Generate(&templateArgs)
	if err != nil {
		log.Err(err).Msg("error generating launchd template")
		return err
	}
	plistPath, err := launchdTemplate.ResolvePath()
	if err != nil {
		log.Err(err).Msg("error resolving launchd template path")
		return err
	}

	log.Info().Msgf("Outputs are logged to %s and %s", stderrPath, stdoutPath)
	err = runCommand("launchctl", "load", plistPath)
	if err == nil {
		log.Info().Msg("MacOS service for zenthcloudd installed successfully")
	}
	return err
}

func uninstallLaunchd(c *cli.Context) error {
	log := logger.CreateLoggerFromContext(c, logger.EnableTerminalLog)

	if isRootUser() {
		log.Info().Msg("Uninstalling zenthcloudd as a system launch daemon")
	} else {
		log.Info().Msg("Uninstalling zenthcloudd as a user launch agent")
	}
	installPath, err := installPath()
	if err != nil {
		return errors.Wrap(err, "error determining install path")
	}
	stdoutPath, err := stdoutPath()
	if err != nil {
		return errors.Wrap(err, "error determining stdout path")
	}
	stderrPath, err := stderrPath()
	if err != nil {
		return errors.Wrap(err, "error determining stderr path")
	}
	launchdTemplate := newLaunchdTemplate(installPath, stdoutPath, stderrPath)
	plistPath, err := launchdTemplate.ResolvePath()
	if err != nil {
		log.Err(err).Msg("error resolving launchd template path")
		return err
	}
	err = runCommand("launchctl", "unload", plistPath)
	if err != nil {
		log.Err(err).Msg("error unloading launchd")
		return err
	}

	err = launchdTemplate.Remove()
	if err == nil {
		log.Info().Msg("Launchd for zenthcloudd was uninstalled successfully")
	}

	cp, err := configPath()
	if err != nil {
		log.Err(err).Msg("error determining path to config directory, not removing token file")
		return err
	}
	removeTokenFile(cp, log)

	return nil
}
