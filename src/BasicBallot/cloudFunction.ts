/**
 * @author Aaron Osher <aaron@aaronosher.io>
 * @copyright 2018. All Rights Reserved
 */

// External Imports
import { https, Request, Response } from 'firebase-functions';
import { RetrieveDocument } from '../RetrieveDocument/RetrieveDocument';
import {RetrieveBasicVotes} from "../RetrieveVotes/Basic";
import {CalculateBasicResult} from "../CalculateResult/Basic";
import {basicBallotModel} from "../models/basicBallot.model";
import {BallotType} from "../enums/ballotType.enum";
import {Cors} from "../Cors/cors";

export const BasicBallot = https.onRequest((req: Request, res: Response) => {
    Cors(req, res, data => data);
    res.header('Access-Control-Allow-Origin', '*');
    // Validate Request Data
    if (req.method !== 'GET') { res.status(400).send('Request must be GET'); }
    const election_id: string = req.query.election || res.status(400).json({error: "No election specified."});
    const ballot_id: string = req.query.ballot || res.status(400).json({error: "No ballot specified."});

    // Create Firebase Path
    const firebasePath = 'election/' + election_id + '/ballots/' + ballot_id;
    const document = RetrieveDocument<any>(firebasePath);
    const votes = RetrieveBasicVotes(election_id, ballot_id);

    Promise.all([document, votes])
        .then(data => {
            let doc: basicBallotModel;
            doc = {
                id: data[0].id,
                name: data[0].name,
                type: (data[0].type === 1) ? BallotType.Basic : BallotType.NoAbstain,
                votes: data[1]
            };
            res.json({result: CalculateBasicResult(data[1]), document: doc});
        })
        .catch(error => res.status(500).json(error));
});