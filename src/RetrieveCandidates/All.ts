import { firestore } from 'firebase-admin';
const db = firestore();

import {candidateModel} from "../models/candidate.model";

export const RetrieveAllCandidate = (election: string): Promise<candidateModel[]> => {
    const documents = db.collection('election/' + election + '/candidates');
    return documents.get()
        .then(candidates => {
           const allCandidates = candidates.docs
               .map(docs => docs.data() as candidateModel);

           return Promise.resolve(allCandidates);
        });
};