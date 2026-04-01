# Ollama Integration Guide for VS Code

To configure Visual Studio Code to use your local instance of Ollama, you will need to use a compatible extension like GitHub Copilot Chat, the Continue extension, or the dedicated VSCode Ollama extension. [1, 2, 3, 4, 5]

## Prerequisites

• Ensure Ollama is installed and running on your system. You can verify this by running `ollama serve` in your terminal or by opening `http://localhost:11434` in a web browser.
• Download the desired models (e.g., `qwen3:30b-coder`, `llama2`) using the command `ollama pull <model>` in your terminal. [6, 7, 8]

## Configuration Methods

### Method 1: Using the built-in GitHub Copilot Chat extension
If you have the GitHub Copilot Chat extension installed, you can add Ollama models directly through its interface:

1. Open the Copilot Chat sidebar from the top right corner of the VS Code window.
2. Click the settings gear icon to open the Language Models window.
3. Select Add Models and choose Ollama from the list of providers.
4. Enter the local server address (default is `http://localhost:11434`) and select the desired models to load them into VS Code.
5. Ensure the correct local model is selected in the chat panel's model picker to begin using your Ollama models. [7, 10]

### Method 2: Using the "Continue" extension
The Continue extension is a powerful alternative that supports various local AI models:

1. Install the [Continue extension](https://marketplace.visualstudio.com/items?itemName=continuedev.continue) from the VS Code Marketplace.
2. Open the Continue sidebar in VS Code.
3. Click on the "Select model" dropdown, then choose "Add Chat model".
4. Select Ollama as the provider and choose your desired model.
5. Save the configuration file that opens (usually `.continue/config.json` or similar), and the model will be available for use. [8, 14]

### Method 3: Using the dedicated "VSCode Ollama" extension
A simpler, dedicated extension is also available:

1. Install the [VSCode Ollama extension](https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama) from the VS Code Marketplace.
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P) and type "Ollama: Settings".
3. Configure the server address and default model in the settings. The default server address is `http://localhost:11434`.
4. Use the command "Ollama: Open Chat" to start interacting with your local models. [2, 15]

## Current Workspace Configuration

This workspace is currently configured to use the Continue extension with Qwen3-Coder 30B for coding assistance. The configuration is in `.continue/config.json`.

To switch to a different method or model, follow the appropriate method above.

## References

[1] https://docs.ollama.com/integrations/vscode
[2] https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama
[3] https://x.com/ollama/status/2037289861745623132
[4] https://dev.to/ietxaniz/running-ollama-in-a-container-without-internet-access-1a1m
[5] https://marketplace.visualstudio.com/items?itemName=warm3snow.vscode-ollama
[6] https://dev.to/manjushsh/configuring-ollama-and-continue-vs-code-extension-for-local-coding-assistant-48li
[7] https://dev.to/sushan/how-to-connect-a-local-ai-model-to-vs-code-1g8d
[8] https://keyholesoftware.com/ollama-vs-code-your-guide-to-local-llm-development/
[9] https://www.youtube.com/watch?v=kdBgAvd5sPU
[10] https://docs.ollama.com/integrations/vscode
[11] https://www.2am.tech/blog/integrate-ollama-with-visual-studio-code-for-ai-coding-assistance
[12] https://medium.com/@sagar.ingalagi/run-a-local-llm-in-vs-code-with-continue-dev-your-private-ai-coding-assistant-and-auto-complete-42595b9f2b61
[13] https://medium.com/@allentcm/setup-local-coding-assistant-with-continue-ollama-294e0a152c3b
[14] https://www.youtube.com/watch?v=SbG9cBooRR8
[15] https://marketplace.visualstudio.com/items?itemName=herzcthu.ollama-vscode

*AI can make mistakes, so double-check responses*