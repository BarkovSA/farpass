/**
 * Terminal UI primitives — drop-in replacements for DaisyUI components
 * when a terminal style is active.
 *
 * Every primitive reads the current theme from useTerminalTheme().
 * When theme is null (style='off'), they fall back to rendering
 * standard DaisyUI markup.
 */

export { default as TerminalShell } from './TerminalShell';
export { default as TerminalCard } from './TerminalCard';
export { default as TerminalInput } from './TerminalInput';
export { default as TerminalButton } from './TerminalButton';
export { default as TerminalSelect } from './TerminalSelect';
export { default as TerminalCheckbox } from './TerminalCheckbox';
export { default as TerminalLabel } from './TerminalLabel';
