import type { GameHintParticipant } from "./Participant";

/**
 * GameHint の csv ファイルを、オブジェクトに変更
 */
export class GameHintCsv {
  constructor(protected file: File, protected text: string) {
    this.list = this.#generateEntities(text);
  }
  list: GameHintParticipant[];

  static fromFile = async(file: File) => {
    const text = await file.text();

    return new GameHintCsv(file, text)
  }

  #generateEntities = (text: string): GameHintParticipant[] => {
    const allRows = text.split("\n");
    const keys = this.#splitSpecificRow(allRows, 0);
    const rows = allRows.slice();
    console.log("keys",keys)
    rows.splice(0, 1);

    const list: GameHintParticipant[] = [];

    for (let i = 0; i < rows.length; i++) {
      const values = this.#splitSpecificRow(rows, i);
      let obj: Record<string, unknown> = {};
      keys.forEach((key, index) => {
        obj = {
          ...obj,
          [key]: values[index],
        };
      });
      list.push({...obj} as GameHintParticipant);
    }

    return list;
  };

  #splitSpecificRow = (target: string[], targetIndex: number): string[] => {
    return (
      target[targetIndex]
        // HACK: GameHint の CSV にしかr使えない、限定的な分け方。
        // NOTE: 金額に , が入っているせいで、単純な split(",") では分けられない。
        // eslint-disable-next-line prettier/prettier
        .split(",\"")
        .map((e) => {
          // eslint-disable-next-line prettier/prettier
          return e.replaceAll("\"", "");
        })
    );
  };

}
