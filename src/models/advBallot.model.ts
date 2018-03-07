import {candidateModel} from "./candidate.model";
import {advVoteModel} from "./advVote.model";
import {BallotType} from "../enums/ballotType.enum";

export interface advBallotModel {
    id: string;
    type: BallotType.SingleSeat | BallotType.MultiSeat;
    name: string;
    candidates: candidateModel[];
    votes: advVoteModel[];
}