# Meeting Size Nudger (Google Apps Script)

Automatically warns Google Calendar event organizers when too many internal guests are invited to a meeting.

## Features
- Checks for internal invitees from defined domains (e.g. `mediacurrent.com`, `rhythmagency.com`,  `codeandtheory.com`,)
- Sends an email if the number exceeds a defined threshold (default is 4)
- Prevents duplicate warnings per event

## Setup
1. Create a new Apps Script project at [script.google.com](https://script.google.com)
2. Copy `Code.gs` and `appsscript.json` into the project
3. Go to Triggers → Add Trigger → Run `checkRecentEvents` every 10 minutes
4. On first run, authorize the script
