import type { Actions, RequestEvent } from "./$types";
import { getNewCreateTournament } from "../../application/CreateTournament";
import { AppError } from "../../domain/exception/AppError";

export const actions = {
  tournament: async (event: RequestEvent) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let challongeApiKey = "";
      let tournamentName = "";
      let participantNames: string[] = [];

      try {
        const data = await event.request.formData();
        challongeApiKey = data.get("challongeApiKey")?.toString() ?? "";
        tournamentName = data.get("tournamentName")?.toString() ?? "";
        const participantNamesJson = data.get("participantNames")?.toString() ?? "";
        participantNames = JSON.parse(participantNamesJson) as string[];
      } catch (_) {
        throw new AppError({
          name: "invalid",
          message: "有効な値ではありません",
          details: { challongeApiKey, tournamentName, participantNames },
        });
      }

      const createTournament = getNewCreateTournament(challongeApiKey);

      const url = await createTournament.call({
        tournamentName,
        participantNames,
      });

      return { url };
    } catch (e) {
      if (e instanceof AppError) {
        return { error: e.message };
      } else {
        return { error: "予期せぬエラーです" };
      }
    }
  },
} satisfies Actions;
