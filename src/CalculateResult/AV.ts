import {advVoteModel} from "../models/advVote.model";
import {candidateModel} from "../models/candidate.model";
import {AVResultModel} from "../models/AVResult.model";

const find_vote_to_talley = (vote: advVoteModel, candidates: string[]): string | false => {
    let counter = 1;
    while (counter <= Object.keys(vote).length) {
        if (vote[counter] === undefined) { // Check if vote has been cast for current level
            return false;
        } else if (candidates.includes(vote[counter])) { // Check if vote at level is a valid candidate
            return vote[counter];
        } else { // Go to next level
            counter ++;
        }
    }
    return false;
};

const calculate_round = (votes: advVoteModel[], candidates: string[]): {passed: boolean, candidate: string} => {

    const tally = {};

    // Create tally
    for (const candidate of candidates) {
        tally[candidate] = 0;
    }

    // Loop through votes
    for (const vote of votes) {
        const vote_result = find_vote_to_talley(vote, candidates);
        if (vote_result !== false) {
            tally[vote_result] ++;
        }
    }

    console.log('tally', tally);
    const threshold = votes.length / 2;
    console.log('threshold', threshold);


    const arr = Object.keys(tally).map(key => tally[key]);
    const min = Math.min.apply( null, arr );
    const max = Math.max.apply( null, arr );

    console.log('min %s ; max%s', min, max);

    if (max >= threshold) {
        //    Passed
        const elected = Object.keys(tally).reduce((a, b) => tally[a] > tally[b] ? a : b);
        return {
            passed: true,
            candidate: elected
        };
    } else {
        const eliminated = Object.keys(tally).reduce((a, b) => tally[a] < tally[b] ? a : b);
        return {
            passed: false,
            candidate: eliminated,
        };
    }
};

export const CalculateAVResult = (votes: advVoteModel[], candidates: candidateModel[]): AVResultModel => {
    const result = {
        elected: undefined,
        log: []
    };

    let candidates_to_use = candidates.map(candidate => candidate.id);
    let round_result = {passed: false, candidate: undefined};

    do {
        round_result = calculate_round(votes, candidates_to_use);
        console.log(round_result);
        if (round_result.passed === false) {
            const candidate_reference = candidates.filter(candidate => candidate.id === round_result.candidate)[0];
            result.log.push(candidate_reference.name + ' was eliminated.');
            candidates_to_use = candidates_to_use.filter(candidate => candidate !== round_result.candidate);
        } else if (round_result.passed === true) {
            const candidate_reference = candidates.filter(candidate => candidate.id === round_result.candidate)[0];
            result.log.push(candidate_reference.name + ' was elected.');
            result.elected = candidate_reference;
        } else {
            result.log.push('Unknown error occurred and no result was determined.');
        }

    } while (round_result.passed === false);

    return result;
};