# Grok prompt provenance

`grok.txt` adapts the public Grok Build base template from xAI:

- Repository: https://github.com/xai-org/grok-build
- Revision: `2bdd1d6a6369de0e8c68132ea4539e9abd9e14a8`
- Source: https://github.com/xai-org/grok-build/blob/2bdd1d6a6369de0e8c68132ea4539e9abd9e14a8/crates/codegen/xai-grok-agent/templates/prompt.md
- Retrieved: 2026-10-09 UTC
- License: Apache-2.0; a copy is in `grok.LICENSE`.

The dangerous-actions, work-policy, communication, and formatting sections retain the upstream behavior and wording where applicable. This is an Apexo adaptation of that public template, not a claim that Apexo runs the Grok Build harness or reproduces every prompt used by the released service.

Changes from upstream:

- Identify the application as Apexo and support terminal, web, and desktop interfaces. Apexo injects environment, repository instructions, skills, MCP instructions, and tool schemas separately.
- Remove Grok-specific template variables, user-query wrappers, memory paths, scratch-directory assumptions, background-monitor capabilities, and TUI documentation paths that Apexo does not provide.
- Adapt optional task-tool and browser-verification instructions to tools actually available in the session.
- Add source inspection guidance: inspect implementation after using docs/manifests for orientation, support conclusions with source references, and deepen repeated shallow answers without imposing artificial duration or tool-count limits.
- Clarify that side questions preserve unfinished work unless the user changes the task; include Apexo's repository and verification workflow.

Grok models use this prompt through `SystemPrompt.provider`; explicit agent prompt overrides retain their existing precedence. Other model families retain their own prompts.
