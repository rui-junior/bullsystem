import * as firebaseAdmin from "firebase-admin";
import { private_key, project_id, client_email } from "./bullsystem-a5fcc-firebase-adminsdk-dnpo7-c74e7c3e9b.json"


if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey: private_key,
      clientEmail: client_email,
      projectId: project_id,
    }),
    databaseURL: `https://${project_id}.firebaseio.com`,
  });
}

export { firebaseAdmin };
