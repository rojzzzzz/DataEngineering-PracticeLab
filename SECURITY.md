# Security

Practice Lab is designed for local, single-user use. A public source repository
does not provide a supported multi-user hosting setup. Optional Python execution
uses a Docker controller with access to the host Docker socket; keep its control
network private and protect its runner token.

API credentials belong only in the current application session. Keep local
progress databases, uploaded banks, backups, `.env` files, Streamlit secrets and
`.python-runner` files out of commits and issue attachments.

To report a vulnerability, check the repository's **Security** tab for a private
reporting option. If none is available, open an issue asking for a private
contact route without including exploit details, credentials or personal data.
For ordinary bugs, use a public issue with a synthetic reproduction.

The frontend overrides the transitive KaTeX dependency to 0.18.2 to address
[GHSA-238p-pmpm-9mq7](https://github.com/advisories/GHSA-238p-pmpm-9mq7).
Keep the override until the upstream dependency chain selects a patched version.
