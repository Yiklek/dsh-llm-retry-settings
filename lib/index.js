// Host half is intentionally empty. Every read and write travels the public
// settings / llm wire faces from the client half (the GUI is loopback), so
// there is no host-side service, RPC, or state to own.
export const name = 'llm-retry-settings'
export function apply(_ctx) {}
