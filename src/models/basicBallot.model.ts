import {BallotType} from "../enums/ballotType.enum";
import {BasicVote} from "../enums/basicVote.enum";

export interface basicBallotModel {
    id: string;
    type: BallotType.Basic | BallotType.NoAbstain;
    name: string;
    votes: BasicVote[];
}