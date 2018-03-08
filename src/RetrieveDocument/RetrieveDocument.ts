import { firestore } from 'firebase-admin';
const db = firestore();

export const RetrieveDocument = (documentPath: string) => {
    const document: firestore.DocumentReference = db.doc(documentPath);
    return document.get()
        .then(data => Promise.resolve(data.data()));
};