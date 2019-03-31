/**
 * @author Aaron Osher <aaron@aaronosher.io>
 * @copyright 2018. All Rights Reserved
 */

// External Imports
import { https, Request, Response } from 'firebase-functions';
import {Cors} from "../Cors/cors";
import { firestore } from 'firebase-admin';
import { DocumentSnapshot, QuerySnapshot } from '@google-cloud/firestore';
import memberExists from '../GetMembers/memberExists';
import { electorModel } from '../models/elector.model';
const db = firestore();

export const AssignCode = https.onRequest(async (req: Request, res: Response) => {
    Cors(req, res, data => data);
    res.header('Access-Control-Allow-Origin', '*');
    // Validate Request Data
    if (req.method !== 'GET') { res.status(400).send('Request must be GET'); }

    let election_id: string;
    let student_id: number;

    if (!req.query.election) {
        return res.status(400).json({error: "No Election specified."});
    } else {
        election_id = req.query.election;
    }

    if (!req.query.student) {
        return res.status(400).json({error: "No Student ID specified."});
    } else {
        student_id = parseInt(req.query.student, 10);
    }


    // Validate that student exists
    try {
        if (!(await memberExists(student_id))) {
            return res.status(401).json({error: "Student ID is not a member"});
        }
    } catch (err) {
        return res.status(500).json({ error: "Unknown error occured "});
    }


    const studentPath = 'election/' + election_id + '/student/' + student_id;

    let student: DocumentSnapshot;
    
    try {
        student = await db.doc(studentPath).get();
    } catch (err) {
        return res.status(500).json({error: "Uniedentified error occured"});
    }

    console.log("student.data().assigned", !!student.data().assigned);
    // Check if studnet has a code
    if (student.exists && !!student.data().assigned) {
        return res.status(403).json({error: "Student allready assigned code"});
    }

    // Check if any codes are available
    const electorate = db.collection('election/' + election_id + '/electorate');

    let available: QuerySnapshot;

    try {
        available = await electorate
            .where('assigned', '==', false)
            .where('locked', '==', false)
            .get();

    } catch (err) {
        return res.status(500).json({ error: "unidentified error occured "});
    }

    if (!available.size) {
        console.log(available.size);
        return res.status(410).json({ error: "No codes avaialbles "});
    }

    const codeDoc = available.docs[0];
    const code = codeDoc.data() as electorModel;

    try {
        const codeUpdate = codeDoc.ref.update({
            assigned: true,
        });

        const studentUpdate = student.ref.set({
            id: student_id,
            assigned: true,
        });

        await Promise.all([codeUpdate, studentUpdate])
    } catch (err) {
        console.error(err);
    }

    return res.json({ code: code.id });        
});