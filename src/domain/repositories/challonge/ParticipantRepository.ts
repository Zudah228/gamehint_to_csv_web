import type { Participant } from "../../entities/challonge/participant/Participant";
import { ChallongeRepositoryBase } from "./base/ChallongeRepositoryBase";

export class ChallongeParticipantRepository extends ChallongeRepositoryBase {
  constructor(apiKey: string) {
    super(apiKey)
  }
  
  create = async (tournamentId: string, parameters?: ParticipantCreateParam): Promise<Participant> => {
    const result = await super.fetch<Participant>(`tournaments/${tournamentId}/participants`, parameters, {
      method: "POST",
    });

    return result;
  };
}

// TODO: 中身の実装
export type ParticipantCreateParam = {
  "participant[name]"?: string;
  "participant[challonge_username]"?: string;
  "participant[email]"?: string;
  "participant[seed]"?: string;
  "participant[misc]"?: string;
};
