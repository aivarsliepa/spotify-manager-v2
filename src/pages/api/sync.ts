import { type NextApiRequest, type NextApiResponse } from "next";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { synchronizeWithSpotify } from "../../server/spotify-service";

const sync = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user?.id) {
    return res.status(401).send("Unauthorized");
  }

  await synchronizeWithSpotify(session.user.id);

  res.send({
    message: "Synced",
  });
};

export default sync;
