import { config } from 'firebase-functions';
import { initializeApp } from  'firebase-admin';

// Initialize Freebase admin
initializeApp(config().firebase);

export { BasicBallot } from './BasicBallot/cloudFunction';
export { AVBallot } from './AVBallot/cloudFunction';
export { UpdateMembers } from './UpdateMembers/cloudFunction';
