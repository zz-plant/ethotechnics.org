#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

RUN_CHECK=1
INSTALL_PLAYWRIGHT=0
AUTO_YES=0
PLAYWRIGHT_INSTALL_MODE="prompt"

usage() {
  cat <<'USAGE'
Usage: ./scripts/codex-setup.sh [options]

Bootstrap a fresh Codex/local environment for this repository.

Options:
  --yes                      Non-interactive mode; accept prompts.
  --skip-check               Skip final `bun run check`.
  --install-playwright       Install Playwright browsers and dependencies.
  --skip-playwright          Skip Playwright installation without prompting.
  --playwright-only-deps     Install Playwright OS deps only (no browser download).
  -h, --help                 Show this help text.
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
  if [[ "${AUTO_YES}" -eq 1 ]] || [[ -n "${CI:-}" ]]; then
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

ensure_nvm_loaded() {
  if declare -F nvm >/dev/null 2>&1; then
    return 0
  fi

  if [[ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    return 0
  fi

  return 1
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
  if [[ ! -f "${REPO_ROOT}/.nvmrc" ]]; then
    return
  fi

  if ! ensure_nvm_loaded; then
    warn "nvm not available in this shell; using current Node runtime."
    return
  fi

  log "Activating Node version from .nvmrc via nvm use."
  nvm use >/dev/null
}

install_playwright_assets() {
  case "${PLAYWRIGHT_INSTALL_MODE}" in
    skip)
      log "Skipping Playwright browser installation."
      ;;
    deps-only)
      log "Installing Playwright OS dependencies only."
      bunx playwright install-deps
      ;;
    full)
      log "Installing Playwright browsers and OS dependencies."
      bunx playwright install --with-deps
      ;;
    prompt)
      if confirm "Install Playwright browsers now?"; then
        log "Installing Playwright browsers and OS dependencies."
        bunx playwright install --with-deps
      else
        log "Skipping Playwright browser installation."
      fi
      ;;
    *)
      die "Unexpected Playwright install mode: ${PLAYWRIGHT_INSTALL_MODE}"
      ;;
  esac
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
        PLAYWRIGHT_INSTALL_MODE="full"
        shift
        ;;
      --skip-playwright)
        PLAYWRIGHT_INSTALL_MODE="skip"
        shift
        ;;
      --playwright-only-deps)
        PLAYWRIGHT_INSTALL_MODE="deps-only"
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

  if [[ "${INSTALL_PLAYWRIGHT}" -eq 1 ]] && [[ "${PLAYWRIGHT_INSTALL_MODE}" != "full" ]]; then
    die "Conflicting Playwright options. Use only one of --install-playwright, --skip-playwright, or --playwright-only-deps."
  fi
}

main() {
  parse_args "$@"

  cd "${REPO_ROOT}"

  log "Bootstrapping environment in ${REPO_ROOT}."

  require_command git "Install Git, then rerun this script."
  maybe_use_nvm
  require_command node "Install Node.js 20.x (recommended: nvm install && nvm use)."
  check_node_major

  require_command bun "Install Bun from https://bun.sh/docs/installation, then rerun this script."
  log "Using Bun $(bun --version)."

  log "Installing dependencies with bun install --frozen-lockfile."
  bun install --frozen-lockfile

  install_playwright_assets

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
