# Claude Skills Configuration

This project is configured with the following Claude skills and remote control capabilities.

## Available Skills

### 1. **Taste Skill** - Anti-Slop Frontend Framework
- **Location**: `/home/user/.claude/skills/taste-skill`
- **Description**: Premium frontend framework for AI agents
- **Access**: `taste` command or `$TASTE_SKILL_PATH`

### 2. **GSAP Skills** - Animation & Motion
- **Location**: `/home/user/.claude/skills/gsap-skills`
- **Description**: GSAP Timeline, Tweens, ScrollTrigger, MotionPath, Flip
- **Access**: `gsap` command or `$GSAP_SKILLS_PATH`

### 3. **Hyperframes** - Video Generation
- **Location**: `/home/user/.claude/skills/hyperframes`
- **Description**: HeyGen video generation and animation framework
- **Access**: `hyperframes` command or `$HYPERFRAMES_PATH`
- **CLI**: `hyperframes` (globally available)

### 4. **Impeccable** - Design Quality & Anti-Patterns
- **Location**: `/home/user/.claude/skills/impeccable`
- **Description**: Design skills, commands, and anti-pattern detection for AI coding
- **Access**: `impeccable` command or `$IMPECCABLE_PATH`
- **npm**: `impeccable@3.2.1` (globally installed)

### 5. **Remotion** - Video Rendering
- **Location**: `/home/user/.claude/skills/remotion`
- **Description**: Programmatic video rendering library
- **Access**: `remotion` command or `$REMOTION_PATH`
- **CLI**: `remotion` (globally available)

### 6. **Stitch Skills** - Google Stitch Integration
- **Location**: `/home/user/.claude/skills/stitch-skills`
- **Description**: Agent skills for Google Stitch following Agent Skills open standard
- **Access**: `stitch` command or `$STITCH_SKILLS_PATH`
- **Compatible with**: Codex, Antigravity, Gemini CLI, Claude Code, Cursor

## Environment Variables

All skills are accessible via environment variables:

```bash
export CLAUDE_SKILLS_DIR="/home/user/.claude/skills"
export GSAP_SKILLS_PATH="$CLAUDE_SKILLS_DIR/gsap-skills"
export HYPERFRAMES_PATH="$CLAUDE_SKILLS_DIR/hyperframes"
export IMPECCABLE_PATH="$CLAUDE_SKILLS_DIR/impeccable"
export REMOTION_PATH="$CLAUDE_SKILLS_DIR/remotion"
export STITCH_SKILLS_PATH="$CLAUDE_SKILLS_DIR/stitch-skills"
export TASTE_SKILL_PATH="$CLAUDE_SKILLS_DIR/taste-skill"
```

## CLI Access

Shortcuts are available in terminal:

```bash
gsap              # Navigate to GSAP skills
hyperframes       # Navigate to Hyperframes
impeccable        # Navigate to Impeccable
remotion          # Navigate to Remotion
stitch            # Navigate to Stitch skills
taste             # Navigate to Taste skill
skills            # List all available skills
list-skills       # Display all skills with details
init-skill <name> # Initialize a skill in current project
```

## Global NPM Packages

The following packages are installed globally and accessible anywhere:

- `hyperframes-monorepo`
- `impeccable@3.2.1`
- `remotion-monorepo`

## Remote Control & Accessibility

### Terminal Access
- All skills are added to `$PATH`
- CLI tools are globally executable
- Custom shell functions available for skill management

### Claude Code Integration
- Skills are discoverable in Claude Code sessions
- Environment variables set automatically
- Aliases and functions available in all terminal sessions

### Cross-Environment Access
- Skills persist across container restarts
- Available in all Claude Code sessions
- Accessible via SSH/remote sessions
- Integrated with system PATH

## Quick Commands

```bash
# List all installed skills
list-skills

# Navigate to a skill
cd $TASTE_SKILL_PATH
cd $HYPERFRAMES_PATH

# Initialize skill in current project
init-skill taste
init-skill impeccable

# Access CLI tools directly
impeccable [command]
remotion [command]
hyperframes [command]
```

## Status

✅ All 6 skills installed globally
✅ Environment variables configured
✅ CLI tools registered and accessible
✅ Shell profiles updated (bash, zsh)
✅ Global npm packages installed
✅ Remote control enabled across all environments

## Installation Details

- **Base Directory**: `/home/user/.claude/skills/`
- **Configuration File**: `~/.claude/skills.env`
- **Total Size**: ~1.8 GB
- **Installation Date**: 2026-07-20

