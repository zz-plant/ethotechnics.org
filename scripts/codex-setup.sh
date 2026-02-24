#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

RUN_CHECK=1
INSTALL_PLAYWRIGHT=0
AUTO_YES=0

usage() {
  cat <<'USAGE'
Usage: ./scripts/codex-setup.sh [options]

Bootstrap a fresh Codex/local environment for this repository.

Options:
  --yes                  Non-interactive mode; accept prompts.
  --skip-check           Skip final `bun run check`.
  --install-playwright   Install Playwright browsers and dependencies.
  -h, --help             Show this help text.
USAGE
}

log() {
  printf '[codex-setup] %s\n' "$*"
}

warn() {
  printf '[codex-setup] WARNING: %s\n' "$*" >&2
}

die() {
  printf '[codex-setup] ERROR: %s\n' "$*" >&2
  exit 1
}

confirm() {
  local prompt="$1"
  if [[ "${AUTO_YES}" -eq 1 ]]; then
    return 0
  fi

  read -r -p "${prompt} [y/N]: " reply
  [[ "${reply}" =~ ^[Yy]$ ]]
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

require_command() {
  local cmd="$1"
  local hint="$2"

  if ! command_exists "${cmd}"; then
    die "Missing required command '${cmd}'. ${hint}"
  fi
}

check_node_major() {
  local node_version node_major
  node_version="$(node -v 2>/dev/null || true)"

  if [[ -z "${node_version}" ]]; then
    die "Node.js is not installed. Install Node 20.x, then rerun this script."
  fi

  node_major="${node_version#v}"
  node_major="${node_major%%.*}"

  if [[ "${node_major}" -lt 20 ]]; then
    die "Node ${node_version} detected. Node 20.x or newer is required."
  fi

  log "Using Node ${node_version}."
}

maybe_use_nvm() {
  if [[ -f "${REPO_ROOT}/.nvmrc" ]] && command_exists nvm; then
    log "Activating Node version from .nvmrc via nvm use."
    # shellcheck disable=SC1090
    nvm use >/dev/null
    return
  fi

  if [[ -f "${REPO_ROOT}/.nvmrc" ]] && [[ -s "${HOME}/.nvm/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "${HOME}/.nvm/nvm.sh"
    if command_exists nvm; then
      log "Loaded nvm from ${HOME}/.nvm and activated .nvmrc version."
      nvm use >/dev/null
      return
    fi
  fi

  warn "nvm not available in this shell; using current Node runtime."
}

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --yes)
        AUTO_YES=1
        shift
        ;;
      --skip-check)
        RUN_CHECK=0
        shift
        ;;
      --install-playwright)
        INSTALL_PLAYWRIGHT=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "Unknown option: $1"
        ;;
    esac
  done
}

main() {
  parse_args "$@"

  cd "${REPO_ROOT}"

  log "Bootstrapping environment in ${REPO_ROOT}."

  maybe_use_nvm
  require_command node "Install Node.js 20.x (recommended: nvm install && nvm use)."
  check_node_major

  require_command bun "Install Bun from https://bun.sh, then rerun this script."
  log "Using Bun $(bun --version)."

  log "Installing dependencies with bun install --frozen-lockfile."
  bun install --frozen-lockfile

  if [[ "${INSTALL_PLAYWRIGHT}" -eq 1 ]]; then
    log "Installing Playwright browsers and OS dependencies."
    bunx playwright install --with-deps
  elif confirm "Install Playwright browsers now?"; then
    log "Installing Playwright browsers and OS dependencies."
    bunx playwright install --with-deps
  else
    log "Skipping Playwright browser installation."
  fi

  if [[ "${RUN_CHECK}" -eq 1 ]]; then
    log "Running full default quality gate: bun run check"
    bun run check
  else
    warn "Skipping bun run check by request (--skip-check)."
  fi

  log "Setup complete."
  log "Next steps: bun dev"
}

main "$@"
