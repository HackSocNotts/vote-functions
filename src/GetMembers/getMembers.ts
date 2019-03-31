import { firestore } from 'firebase-admin';
import { memberSettingsModel } from '../models/memberSettingsModel';
const db = firestore();


export default (): Promise<memberSettingsModel> => {
    const docPath = 'settings/members';

    return db.doc(docPath).get()
        .then(doc => doc.data() as memberSettingsModel);
}