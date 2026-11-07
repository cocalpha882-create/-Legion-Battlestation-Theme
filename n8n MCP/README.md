# n8n MCP Working Folder

This folder (`n8n MCP`) is configured to connect directly to your local **n8n** instance via the Model Context Protocol (MCP).

## Configuration (`.mcp.json`)
The folder includes a local `.mcp.json` file configured with the n8n HTTP MCP endpoint:
- **URL**: `http://localhost:5678/mcp-server/http`

## How to use
When you open Claude Code or point your tools to this directory (`C:\Users\LENOVO\OneDrive\Pictures\Documents\Claude Tools\n8n MCP`), Claude Code will automatically detect the local `.mcp.json` file and establish an MCP connection to your running n8n instance, giving you access to all n8n MCP tools (workflows, agents, data tables, executions, etc.).
