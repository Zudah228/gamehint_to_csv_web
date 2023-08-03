import { AppError } from "../domain/exception/AppError";
import {
  ChallongeTournamentRepository,
  type TournamentCreateParam,
} from "../domain/repositories/challonge/TournamentRepository";

export function getNewCreateTournament(challongeApiKey: string): CreateTournament {
  return new CreateTournament(new ChallongeTournamentRepository(challongeApiKey));
}

/**
 *
 */
export class CreateTournament {
  constructor(private readonly challongeTournamentRepository: ChallongeTournamentRepository) {}

  call = async ({
    participantNames,
    tournamentName,
    onMessageChanged,
  }: {
    participantNames: string[];
    tournamentName: string;
    onMessageChanged?: (message: string) => void;
  }): Promise<string> => {
    try {
      // Challonge のトーナメントの作成
      const createParam: TournamentCreateParam = {
        "tournament[tournament_type]": "double elimination",
        "tournament[name]": tournamentName,
      };

      onMessageChanged?.("トーナメントを作成しています");

      const createResult = await this.challongeTournamentRepository.create(createParam);
      const createTournamentId = createResult.id.toString();

      // Challonge のトーナメントに参加者の追加
      onMessageChanged?.("作成したトーナメントに参加者を追加しています");

      await Promise.all(
        participantNames.map(async (name) => {
          await this.challongeTournamentRepository.addParticipant(createTournamentId, {
            "participant[name]": name,
          });
        })
      );

      return "https://challonge.com/" + createResult.url;
    } catch (e) {
      console.error(e);
      throw AppError.exception();
    }
  };
}
