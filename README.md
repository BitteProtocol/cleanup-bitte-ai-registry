# cleanup-bitte-agents

This project is designed to clean up documents in Firestore collections that have specific domain suffixes.

## Functionality

The script performs the following actions:
- Connects to a Firestore database using service account credentials
- Fetches documents from specified collections
- Identifies documents with IDs or data containing '.loca.lt' or '.ngrok-free.app'
- Deletes these documents in batches of 10

## Implementation Details

The main functionality is implemented in the `fetchAndDeleteDocumentsByNameSuffix` function:
- It takes parameters for the collection name, suffix to match, and whether to delete or just fetch
- It uses batched writes for efficient deletion of multiple documents
- It processes documents in batches of 10 to avoid overwhelming the database
- It provides detailed logging of the process, including the number of documents processed and deleted

The `main` function orchestrates the cleanup process:
- It calls `fetchAndDeleteDocumentsByNameSuffix` for each collection and suffix combination
- Collections processed: 'ai-assistants', 'ai-plugins', 'ai-tools'
- Suffixes targeted: '.loca.lt', '.ngrok-free.app'

## Setup

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
