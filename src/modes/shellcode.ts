import undent from 'outdent'

// NOTES
// * is safely re-entrant (and idempotent)
// * we `eval` for BASH/ZSH because otherwise parsing fails for POSIX `sh`
// * we add `~/.local/bin` to `PATH` because we eg `npm i -g` is configured to install there
// * `command_not_found_handler` cannot change the global environment hence we write a file

// TODO
// * maybe impl `$XDG_BIN_HOME`
//   ref https://gitlab.freedesktop.org/xdg/xdg-specs/-/issues/14
// * remove the files we create for command not found handler once any prompt appears
// * need to use a proper tmp location perhaps

export default function() {
  const teal = (x: string) => `\\033[38;5;86m${x}\\033[0m`
  const dim = (x: string) => `\\e[2m${x}\\e[0m`
  const prefix = '${TEA_DIR:-$HOME/.tea}/.local'
  const sh = '${SHELL:-/bin/sh}'

  return undent`
    tea() {
      case "$1" in
      install)
        if [ $# -gt 1 ]; then
          command tea "$@"
        elif type _tea_install >/dev/null 2>&1; then
          _tea_install
        else
          echo "tea: nothing to install" >&2
          return 1
        fi;;
      unload)
        if type _tea_reset >/dev/null 2>&1; then
          _tea_reset
        fi
        unset -f _tea_chpwd_hook _tea_should_deactivate_devenv tea t command_not_found_handler tea@latest _tea_commit _tea_dev_off >/dev/null 2>&1
        echo "tea: shellcode unloaded" >&2;;
      "")
        if [ -f "${prefix}/tmp/shellcode/x.$$" ]; then
          eval "$(${sh} "${prefix}/tmp/shellcode/u.$$" --hush)"
          ${sh} "${prefix}/tmp/shellcode/x.$$"
          rm "${prefix}/tmp/shellcode/"?.$$
        else
          echo "tea: nothing to run" >&2
        fi;;
      *)
        for arg in "$@"; do
          case $arg in
          --*)
            command tea "$@"
            return;;
          -*);;
          +*);;
          *)
            command tea "$@"
            return;;
          esac
        done
        if type _tea_reset >/dev/null 2>&1; then
          _tea_reset
        fi
        eval "$(command tea --internal.use "$@")";;
      esac
    }

    t() {
      case $1 in
      "")
        tea;;
      unload|install)
        echo 'use \`tea\`' >&2
        return 1;;
      *)
        command tea -- "$@"
      esac
    }

    dev() {
      if [ "$1" = 'off' ]; then
        _tea_dev_off
      elif type _tea_dev_off >/dev/null 2>&1; then
        echo 'dev: environment already active' >&2
        return 1
      else
        if type _tea_reset >/dev/null 2>&1; then
          _tea_reset
        fi
        eval "$(command tea --internal.activate "$PWD" "$@")"
      fi
    }

    command_not_found_handler() {
      if [ "$1" = tea ]; then
        echo 'fatal: \`tea\` not in PATH' >&2
        return 1
      elif command tea --silent --provider "$1"; then
        echo -e '${dim('^^ type `')}tea${dim('` to run that')}' >&2

        d="${prefix}/tmp/shellcode"
        mkdir -p "$d"
        echo "echo -e \\"${teal('tea')} +$1 ${dim('&&')} $@ \\" >&2" > "$d/u.$$"
        echo "exec tea --internal.use +\\"$1\\"" >> "$d/u.$$"
        echo -n "exec " > "$d/x.$$"
        for arg in "$@"; do
          printf "%q " "$arg" >> "$d/x.$$"
        done
      else
        echo "cmd not found: $1" >&2
        return 127
      fi
    }

    _tea_chpwd_hook() {
      if _tea_should_deactivate_devenv >/dev/null 2>&1; then
        _tea_dev_off --shy
      fi
      if ! type _tea_dev_off >/dev/null 2>&1; then
        dir="$PWD"
        while [ "$dir" != "/" ]; do
          if [ -f "${prefix}/var/devenv/$dir/xyz.tea.activated" ]; then
            if type _tea_reset >/dev/null 2>&1; then
              _tea_reset
            fi
            eval "$(command tea --internal.activate "$dir")"
            break
          fi
          dir="$(dirname "$dir")"
        done
      fi
    }

    if [ -n "$ZSH_VERSION" ] && [ $(emulate) = zsh ]; then
      eval 'typeset -ag chpwd_functions

            if [[ -z "\${chpwd_functions[(r)_tea_chpwd_hook]+1}" ]]; then
              chpwd_functions=( _tea_chpwd_hook \${chpwd_functions[@]} )
            fi

            if [ "$TERM_PROGRAM" != Apple_Terminal ]; then
              _tea_chpwd_hook
            fi

            _tea() {
              local words
              words=($(tea --shell-completion $1))
              reply=($words)
            }
            compctl -K _tea tea'
    elif [ -n "$BASH_VERSION" ] && [ "$POSIXLY_CORRECT" != y ] ; then
      eval 'cd() {
              builtin cd "$@" || return
              _tea_chpwd_hook
            }

            _tea_chpwd_hook'
    else
      POSIXLY_CORRECT=y
      echo "tea: warning: unsupported shell" >&2
    fi

    if [ "$POSIXLY_CORRECT" != y ]; then
      eval 'tea@latest() {
              command tea tea@latest "$@"
            }'
      if [[ "$PATH" != *"$HOME/.local/bin"* ]]; then
        export PATH="$HOME/.local/bin:$PATH"
      fi
    fi
    `
}
