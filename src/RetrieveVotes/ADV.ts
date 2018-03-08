import { firestore } from 'firebase-admin';
import {advVoteModel} from "../models/advVote.model";
const db = firestore();

export const RetrieveADVVotes = (election: string, ballot: string): Promise<advVoteModel[]> => {
    const electorateData = db.collection('election/' + election + '/electorate');
    return electorateData.get()
        .then(electorate => {
           const votes = electorate.docs
               .map(voter => voter.data())
               .filter(voter => voter.locked)
               .filter(voter => voter.votes[ballot] !== undefined)
               .map(voter => voter.votes[ballot].votes)
               .map(vote => {
                   const ret = {};
                   for(const key in vote){
                       ret[vote[key]] = key;
                   }
                   return ret;
               });
           return Promise.resolve(votes);
        });
};