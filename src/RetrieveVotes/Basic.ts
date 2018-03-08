import { firestore } from 'firebase-admin';
import {BasicVote} from "../enums/basicVote.enum";
const db = firestore();

export const RetrieveBasicVotes = (election: string, ballot: string): Promise<BasicVote[]> => {
    const electorateData = db.collection('election/' + election + '/electorate');
    return electorateData.get()
        .then(electorate => {
            const votes = electorate.docs
                .map(voter => voter.data())
                .filter(voter => voter.locked)
                .filter(voter => voter.votes[ballot] !== undefined)
                .map(voter => voter.votes[ballot].votes)
                .map(vote => {
                   switch (vote) {
                    case 1:
                        return BasicVote.Against;

                    case 2:
                        return BasicVote.Abstain;

                    case 3:
                        return BasicVote.For;

                    default:
                        return BasicVote.Abstain;
                    }
                });
            return Promise.resolve(votes);
        });
};