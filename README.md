# Page Navigator - Intelligent Web Browser Automation

![image](https://github.com/user-attachments/assets/adfbde30-3f83-460b-94e6-3c255136f0ca)


## Description
Page Navigator is a user script built to automate browsing through web pages like a human user. It intelligently scrolls through pages at a randomized pace and extracts links from the current page. The script navigates through pages and tracks the number of pages visited, time spent, and the current link. It's designed to run on any website using the Tampermonkey extension.

### Features:
- **Intelligent Scrolling**: Randomizes scroll positions and times between scroll actions to simulate human-like behavior.
- **Link Extraction**: Extracts all valid links from the page and filters them based on the same domain or relative links.
- **Page Navigation**: Randomly selects a link to navigate to, ensuring the same link is not visited consecutively.
- **State Management**: Tracks the number of pages visited, total time elapsed, and the last opened link.
- **Customizable Scroll Speed**: Choose between fast or slow scrolling, with a control panel to modify settings.
- **Time Tracking**: Displays the time elapsed since the start of the process and the number of pages visited.

## Installation

To use this script, you need to install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/). Once installed, you can add this script by following these steps:

1. Click on the Tampermonkey icon in your browser toolbar.
2. Click "Create a New Script".
3. Delete the default template in the editor and paste the code from `page-navigator.user.js` into the editor.
4. Save the script, and it will automatically run on every page you visit.

## Usage

Once the script is active, it will create a small floating control panel at the top-right corner of your page. Here are the options available:

1. **Start**: Begins the process of automated browsing, starting from the current page.
2. **Stop**: Stops the process and pauses the timer, allowing you to resume later.
3. **Reset**: Resets the state, clearing the visited pages count and elapsed time.
4. **Scroll Speed**: Select between fast and slow scrolling speeds from the dropdown menu.
5. **Elapsed Time & Pages Visited**: Displays the total time spent in the process and the number of pages visited so far.

The script will automatically navigate to the next valid link based on the filters, simulating a real user experience.

## Developer

- **Seyit Ahmet TANRIVER**  
For questions or feedback, feel free to reach out via [WhatsApp](https://wa.me/31637952159).

---

This repository is aimed to provide an easy-to-use automation tool that helps simulate human-like browsing behavior, making it useful for tasks such as crawling or testing websites.
