import { Slot } from "./Slot";
import { PlayedCard, isLaneCorrupted } from "@/game/store";
import { TerritoryId } from "@/game/cards";

interface TerritoryMeta {
  id: TerritoryId;
  name: string;
  icon: string;
  color: string;
}

interface Props {
  territories: TerritoryMeta[];
  board: Record<TerritoryId, PlayedCard[]>;
  selected: string | null;
  impacts: Record<string, number>;
  onPlay: (territory: TerritoryId) => void;
}

export function BattleRow({ territories, board, selected, impacts, onPlay }: Props) {
  return (
    <div className="flex-1 flex gap-2 px-2 min-h-0 pb-1">
      {territories.map((t) => (
        <Slot
          key={t.id}
          id={t.id}
          name={t.name}
          icon={t.icon}
          color={t.color}
          cards={board[t.id]}
          canPlay={selected !== null}
          isImpacted={!!impacts[t.id]}
          isCorrupted={isLaneCorrupted(board[t.id])}
          onDrop={() => onPlay(t.id)}
        />
      ))}
    </div>
  );
}
