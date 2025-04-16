# Snak Desktop

Snak Desktop is a desktop application for the Snak project, allowing you to run the Snak application on your local computer.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [1. Clone and Set Up the Snak Server](#1-clone-and-set-up-the-snak-server)
  - [2. Clone and Set Up the Snak Application](#2-clone-and-set-up-the-snak-application)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Snak Desktop combines a backend server and a Tauri-based frontend user interface to offer a complete desktop application experience. This application allows users to access Snak features directly from their computer without needing a web browser.

## Prerequisites

Before starting, make sure you have installed:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) (recommended version: 16.x or newer)
- [pnpm](https://pnpm.io/installation) (package manager)
- Dependencies for [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites)
  - **macOS**: Xcode Command Line Tools
  - **Linux**: various development libraries (see Tauri documentation)

## Installation

Installing Snak Desktop requires setting up two separate repositories: the Snak server and the Snak application.


### 1. Clone and Set Up the Snak Application

Open a new terminal and run the following commands:

```bash
# Clone the application repository
git clone https://github.com/KasarLabs/snak-app.git

# Navigate to the project folder
cd snak-app
```

The Snak Desktop application should now start and connect to the local server you launched in the previous step.


### 2. Clone and Set Up the Snak Server

```bash
# Clone the server repository
git clone https://github.com/KasarLabs/snak.git

# Navigate to the project folder
cd snak

# Switch to the core/desktop-app branch
git switch core/desktop-app

# Install dependencies
pnpm install

### Import your .env
### try to launch using
pnpm run start:server
```

### 3. Run the desktop app
```bash
# Run tauri
sudo pnpm run tauri dev
```




## Usage

Once the application is launched, you can:

- Log in to your Snak account or create a new one
- Access all features of the Snak application
- Enjoy a native experience on your operating system

## Troubleshooting

If you encounter issues during installation or while using Snak Desktop:

- Make sure all prerequisites are properly installed
- Verify that the server is running before launching the application
- Check the server and application logs to identify potential errors
- Make sure you're using the correct branches for each repository

## Contributing

Contributions to the Snak Desktop project are welcome! To contribute:

1. Fork the repositories
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[Insert license information here]

---

Developed by [KasarLabs](https://github.com/KasarLabs)