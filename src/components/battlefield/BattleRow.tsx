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
  impacts: boolean[];
  onPlay: (territory: TerritoryId) => void;
  onInfo?: (id: string) => void;
}

export function BattleRow({ territories, board, selected, impacts, onPlay, onInfo }: Props) {
  return (
    <div className="flex-1 flex gap-2 px-2 min-h-0 pb-1">
      {territories.map((t, i) => (
        <Slot
          key={t.id}
          id={t.id}
          name={t.name}
          icon={t.icon}
          color={t.color}
          cards={board[t.id]}
          canPlay={selected !== null}
          isImpacted={impacts[i]}
          isCorrupted={isLaneCorrupted(board[t.id])}
          onDrop={() => onPlay(t.id)}
          onInfo={onInfo}
        />
      ))}
    </div>
  );
}
