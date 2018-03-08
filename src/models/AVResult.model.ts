import {candidateModel} from "./candidate.model";

export interface AVResultModel {
    elected: candidateModel;
    log: any[];
}