import serviceAccount from "./serviceAccount.json";

import {
    Firestore,
} from "@google-cloud/firestore";

const db = new Firestore({
    projectId: serviceAccount.project_id,
    credentials: {
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key,
    },
    databaseId: "mainnet"
});

// Function to fetch and delete documents by name suffix
async function fetchAndDeleteDocumentsByNameSuffix(collectionName: string, suffix: string, shouldDelete: boolean = false) {
    const collectionRef = db.collection(collectionName);

    try {
        const snapshot = await collectionRef.get();
        if (snapshot.empty) {
            console.log('No documents found.');
            return;
        }

        const matchedDocs: { id: string; }[] = [];
        let batch = db.batch();
        let batchSize = 0;
        let totalProcessed = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if ((data && data.id && (data.id.endsWith(suffix)) || doc.id.endsWith(suffix) || doc.id.includes(suffix))) {
                if (shouldDelete) {
                    batch.delete(doc.ref);
                    batchSize++;

                    // If we've reached 10 operations, commit the batch and start a new one
                    if (batchSize === 10) {
                        await batch.commit();
                        console.log(`Processed batch of ${batchSize} documents.`);
                        batch = db.batch();
                        batchSize = 0;
                        totalProcessed += 10;
                    }
                }
                matchedDocs.push({
                    id: doc.id,
                    ...data
                });
            }
        }

        // Commit any remaining operations
        if (shouldDelete && batchSize > 0) {
            await batch.commit();
            totalProcessed += batchSize;
            console.log(`Processed final batch of ${batchSize} documents.`);
        }

        if (shouldDelete) {
            console.log(`Deleted ${totalProcessed} documents with names ending in ${suffix}`);
        } else {
            console.log('Found documents with names ending in', suffix, ':', matchedDocs);
        }

        return matchedDocs;
    } catch (error) {
        console.error('Error fetching' + (shouldDelete ? ' and deleting' : '') + ' documents: ', error);
    }
}

// Execute the function for each collection and suffix
async function main() {
    try {
        await fetchAndDeleteDocumentsByNameSuffix('ai-assistants', '.loca.lt', true);
        await fetchAndDeleteDocumentsByNameSuffix('ai-assistants', '.ngrok-free.app', true);
        await fetchAndDeleteDocumentsByNameSuffix('ai-plugins', '.ngrok-free.app', true);
        await fetchAndDeleteDocumentsByNameSuffix('ai-plugins', '.loca.lt', true);
        await fetchAndDeleteDocumentsByNameSuffix('ai-tools', '.ngrok-free.app', true);
        await fetchAndDeleteDocumentsByNameSuffix('ai-tools', '.loca.lt', true);
    } catch (error) {
        console.error('Error in main execution:', error);
    }
}

main();
