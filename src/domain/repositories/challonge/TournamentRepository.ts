import { ChallongeRepositoryBase } from "./base/ChallongeRepositoryBase";
import { Tournament } from "../../entities/challonge/tournament/Tournament";
import type { TournamentState, TournamentType } from "../../entities/challonge/tournament/Types";

export class ChallongeTournamentRepository extends ChallongeRepositoryBase {
  constructor(apiKey: string) {
    super(apiKey)
  }

  retrieve = async (tournamentId: string, parameters?: TournamentRetrieveParam): Promise<Tournament> => {
    const result = await this.fetch<Tournament>(`tournaments/${tournamentId}`, parameters, {
      method: "GET",
    });
    return Tournament.fromJson(result);
  };

  list = async (parameters?: TournamentListParam): Promise<Tournament[]> => {
    const result = await this.fetch<unknown[]>("tournaments", parameters, {
      method: "GET",
    });
    return result.map((e) => Tournament.fromJson(e));
  };

  create = async (parameters?: TournamentCreateParam): Promise<Tournament> => {
    const result = await this.fetch<unknown>("tournaments", parameters, {
      method: "POST",
    });

    return Tournament.fromJson(result);
  };

  delete = async (tournamentId: string): Promise<Tournament> => {
    const result = await this.fetch<unknown>(`tournaments/${tournamentId}`, undefined, {
      method: "DELETE",
    });

    return Tournament.fromJson(result);
  };
}


export type TournamentListParam = {
  state?: TournamentState;
  type?: TournamentType;
  created_after?: string;
  created_before?: string;
  subdomain?: string;
};

export type TournamentRetrieveParam = {
  include_participants: "0" | "1";
  include_matches: "0" | "1";
};

export type TournamentCreateParam = {
  "tournament[name]": string;
  "tournament[tournament_type]": TournamentType;
};
