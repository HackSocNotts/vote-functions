import { firestore } from 'firebase-admin';
const db = firestore();

export const RetrieveDocument = <T>(documentPath: string): Promise<T> => {
    const document: firestore.DocumentReference = db.doc(documentPath);
    return document.get()
        .then(data => Promise.resolve(data.data() as T));
};