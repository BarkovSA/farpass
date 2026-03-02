// Package banner содержит ASCII-логотип FARTECH для отображения при старте
// CLI-утилиты и сервера.
//
// Использование:
//
//	banner.Print(os.Stdout)        // просто вывод
//	banner.PrintColored(os.Stdout) // с ANSI-цветами (синий + белый)
//
// Цвет отключается автоматически, если stdout не является TTY,
// или если установлена переменная окружения NO_COLOR=1.
package banner

import (
	"fmt"
	"io"
	"os"
)

// логотип сгенерирован в стиле "block" (Unicode Box-Drawing + Full Block)
// FARTECH = FAR (удалённо) + TECH (техподдержка) / Технический отдел Farpost
const logo = `
  ███████╗ █████╗ ██████╗ ████████╗███████╗ ██████╗██╗  ██╗
  ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║  ██║
  █████╗  ███████║██████╔╝   ██║   █████╗  ██║     ███████║
  ██╔══╝  ██╔══██║██╔══██╗   ██║   ██╔══╝  ██║     ██╔══██║
  ██║     ██║  ██║██║  ██║   ██║   ███████╗╚██████╗██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝
`

const tagline = `  Технический отдел Фарпост ·
  remote access  ·  TECH support
`

const separator = `  ──────────────────────────────────────────────────────────`

// ANSI colour codes
const (
	ansiBlue  = "\033[34m"
	ansiCyan  = "\033[36m"
	ansiBold  = "\033[1m"
	ansiReset = "\033[0m"
)

// isTTY возвращает true, если w это os.Stdout и он подключён к терминалу.
func isTTY(w io.Writer) bool {
	if w != os.Stdout {
		return false
	}
	if os.Getenv("NO_COLOR") != "" {
		return false
	}
	fi, err := os.Stdout.Stat()
	if err != nil {
		return false
	}
	return (fi.Mode() & os.ModeCharDevice) != 0
}

// Print выводит логотип в w без цветов.
func Print(w io.Writer) {
	fmt.Fprint(w, logo)
	fmt.Fprintln(w, separator)
	fmt.Fprint(w, tagline)
	fmt.Fprintln(w)
}

// PrintColored выводит логотип с ANSI-цветами (если w — TTY).
// В пайпе или при NO_COLOR=1 автоматически переключается на Print.
func PrintColored(w io.Writer) {
	if !isTTY(w) {
		Print(w)
		return
	}
	fmt.Fprintf(w, "%s%s%s%s", ansiBold, ansiCyan, logo, ansiReset)
	fmt.Fprintf(w, "%s%s%s\n", ansiBlue, separator, ansiReset)
	fmt.Fprintf(w, "%s%s%s\n", ansiBold, tagline, ansiReset)
}
