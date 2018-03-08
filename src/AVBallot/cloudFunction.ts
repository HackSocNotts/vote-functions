/**
 * @author Aaron Osher <aaron@aaronosher.io>
 * @copyright 2018. All Rights Reserved
 */

// External Imports
import { https, Request, Response } from 'firebase-functions';
import { RetrieveDocument } from '../RetrieveDocument/RetrieveDocument';
import {RetrieveADVVotes} from "../RetrieveVotes/ADV";
import {RetrieveAllCandidate} from "../RetrieveCandidates/All";
import {CalculateAVResult} from "../CalculateResult/AV";

export const AVBallot = https.onRequest((req: Request, res: Response) => {
    // Validate Request Data
    if (req.method !== 'GET') { res.status(400).send('Request must be GET'); }
    const election_id: string = req.query.election || res.status(400).json({error: "No election specified."});
    const ballot_id: string = req.query.ballot || res.status(400).json({error: "No ballot specified."});

    // Create Firebase Path
    const firebasePath = 'election/' + election_id + '/ballots/' + ballot_id;
    console.log(firebasePath);
    const document = RetrieveDocument(firebasePath);
    const votes = RetrieveADVVotes(election_id, ballot_id);
    const candidates = RetrieveAllCandidate(election_id);

    Promise.all([document, votes, candidates])
        .then(data => {
            const Ballot = data[0];
            const Votes = data[1];
            const Candidates = data[2].filter(candidate => Ballot.candidates.includes(candidate.id));
            try {
                const Result = CalculateAVResult(Votes, Candidates);
                res.json({
                    result: Result,
                    ballot: {
                        id: Ballot.id,
                        type: Ballot.type,
                        name: Ballot.name,
                        candidates: Candidates,
                        votes: Votes
                    }
                });
            } catch (e) {
                console.error(e);
                res.status(500).json(e);
            }


        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error);
        });
});