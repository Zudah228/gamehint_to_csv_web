import { isChallongeValidationError } from "./error/ChallongeValidationError";
import type { parameters } from "./Types";
import type { Participant } from "../../entities/challonge/participant/Participant";
import { Tournament } from "../../entities/challonge/tournament/Tournament";
import type { TournamentState, TournamentType } from "../../entities/challonge/tournament/Types";
import { AppError } from "../../exception/AppError";
/**
 * Challonge API のトーナメント
 */
export class ChallongeTournamentRepository {
  constructor(private readonly apiKey: string) {}

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

  addParticipant = async (tournamentId: string, parameters?: ParticipantCreateParam): Promise<Participant> => {
    const result = await this.fetch<Participant>(`tournaments/${tournamentId}/participants`, parameters, {
      method: "POST",
    });

    return result;
  };

  protected fetch = async <T>(route: string, parameters?: parameters, options?: RequestInit): Promise<T> => {
    try {
      const url = `https://api.challonge.com/v1/${route}.json?api_key=${this.apiKey}${this.#toUrl(parameters)}`;

      console.info(`request url: ${url}`);

      const res = await fetch(url, {
        ...options,
      }).catch((res) => {
        console.info(res);
      });

      console.info(res);

      switch (res?.status) {
        case 200:
          return (await res.json()) as T;
        case 401:
          throw new AppError({
            name: "challonge",
            message: "Unauthorized (Invalid API key or insufficient permissions)",
          });
        case 404:
          throw new AppError({
            name: "challonge",
            message: "Object not found within your account scope",
          });
        case 406:
          throw new AppError({
            name: "challonge",
            message: "Requested format is not supported - request JSON or XML only",
          });
        case 422:
          throw await this.#validationError(res);
        case 500:
          throw new AppError({
            name: "challonge",
            message: "Something went wrong on our end. If you continually receive this, please contact us.",
          });
      }
      throw new AppError({
        name: "challonge",
        message: "unhandled error",
      });
    } catch (e) {
      throw new AppError({ name: "challonge", message: `${e}` });
    }
  };

  #validationError = async (res: Response): Promise<AppError> => {
    const error = await res.json();
    if (!isChallongeValidationError(error)) {
      return new AppError({
        name: "challonge",
        message: "422 のバリデーションエラーの型が違います。",
      });
    }
    return new AppError({
      name: "challonge",
      message: error.errors.toString(),
    });
  };

  #toUrl = (parameters?: parameters): string => {
    if (parameters === undefined) return "";
    return Object.keys(parameters).reduce<string>((previousValue, currentKey) => {
      return previousValue + "&" + currentKey + "=" + parameters[currentKey];
    }, "");
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

export type ParticipantCreateParam = {
  "participant[name]"?: string;
  "participant[challonge_username]"?: string;
  "participant[email]"?: string;
  "participant[seed]"?: string;
  "participant[misc]"?: string;
};
