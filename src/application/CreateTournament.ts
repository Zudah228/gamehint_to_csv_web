import { AppError } from "../domain/exception/AppError";
import { ChallongeParticipantRepository } from "../domain/repositories/challonge/ParticipantRepository";
import { ChallongeTournamentRepository, type TournamentCreateParam } from "../domain/repositories/challonge/TournamentRepository";

export function getNewCreateTournament(challongeApiKey: string): CreateTournament {
  return new CreateTournament(new ChallongeParticipantRepository(challongeApiKey), new ChallongeTournamentRepository(challongeApiKey));
}

export class CreateTournament {
  constructor(
    private readonly challongeParticipantRepository: ChallongeParticipantRepository,
    private readonly challongeTournamentRepository: ChallongeTournamentRepository,
  ) {}

  call = async ({
    participantNames,
    tournamentName,
    onMessageChanged,
  }: {
    participantNames: string[],
    tournamentName: string,
    onMessageChanged: (message: string) => void,
  }): Promise<string> => {
    try {

      // Challonge のトーナメントの作成
      const createParam: TournamentCreateParam = {
        "tournament[tournament_type]": "double elimination",
        "tournament[name]": tournamentName,
      };

      onMessageChanged("トーナメントを作成しています")

      const createResult = await this.challongeTournamentRepository.create(createParam);
      const createTournamentId = createResult.id.toString();

      // Challonge のトーナメントに参加者の追加
      onMessageChanged("作成したトーナメントに参加者を追加しています")

      for await (const name of participantNames) {
        await this.challongeParticipantRepository.create(createTournamentId, {
          "participant[name]": name,
        });
      }

      return createResult.url
    } catch (e) {
      console.error(e)
      throw AppError.exception()
    }
  };
}
