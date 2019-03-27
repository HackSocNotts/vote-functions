/**
 * @author Aaron Osher <aaron@aaronosher.io>
 * @copyright 2018. All Rights Reserved
 */

// External Imports
import { https, Request, Response } from 'firebase-functions';
import { RetrieveDocument } from '../RetrieveDocument/RetrieveDocument';
import {Cors} from "../Cors/cors";
import { memberSettingsModel } from '../models/memberSettingsModel';
import { firestore } from 'firebase-admin';
import { memberModel } from '../models/member.model';

const db = firestore();

export const UpdateMembers = https.onRequest(async (req: Request, res: Response) => {
    Cors(req, res, data => data);
    res.header('Access-Control-Allow-Origin', '*');

    // Validate request type
    if (req.method !== 'POST') { res.status(400).send('Request must be POST'); }
    
    // Retrieve Member Settings
    const firebasePath = 'settings/members';

    try {
      const { webhookSecret: secret } = await RetrieveDocument<memberSettingsModel>(firebasePath);

      if (req.headers.authorization !== `Bearer ${secret}`) {
        return res.status(401).json({error: "Unauthorised invalid secret"});
      }

      // Validate Request Data
      if (!!!req.body.members) {
        return res.status(400).json({error: "Members not specified."});
      } else if (!Array.isArray(req.body.members)) {
        return res.status(400).json({error: "Members is not valid."});
      }
      const members: number[] = req.body.members.map((member: memberModel) => member.id).filter((id: number) => !!id);

      await db.doc(firebasePath)
        .update({
          members
        });

      return res.status(201).send();
      
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: "Unknwon Server Error Occured."});
    }
   
});