import { motion } from "framer-motion";
import { CardFromId } from "@/components/GameCard";
import { cardsById } from "@/game/cards";

interface Props {
  cards: string[];
  selected: string | null;
  playerLucidity: number;
  onSelect: (id: string) => void;
  onDragToPlay?: (id: string) => void;
  onRepress?: (id: string) => void;
  onInfo?: (id: string) => void;
}

export function PlayerHand({ cards, selected, playerLucidity, onSelect, onDragToPlay, onRepress, onInfo }: Props) {
  const n = cards.length;
  if (n === 0) return <div className="h-[130px]" />;

  const cardWidth = 100;
  const overlap = n <= 1 ? 0 : Math.min(45, (cardWidth * n - 320) / (n - 1));
  const totalWidth = cardWidth + (n - 1) * (cardWidth - overlap);

  return (
    <div className="flex justify-center items-end h-[170px] px-2 overflow-visible">
      <div className="relative flex items-end justify-center" style={{ width: totalWidth }}>
        {cards.map((id, i) => {
          const center = (n - 1) / 2;
          const offset = i - center;
          const rotation = offset * -10;
          const yArc = Math.pow(Math.abs(offset), 1.4) * 6;
          const zIdx = Math.round(n - Math.abs(offset));
          const isSelected = selected === id;
          const isAffordable = cardsById[id]?.cost <= playerLucidity;

          return (
            <motion.div
              key={`${id}-${i}`}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: 1,
                x: offset * overlap * 0.7,
                y: isSelected ? -60 : yArc + 4,
                rotate: isSelected ? 0 : rotation,
                scale: isSelected ? 1.25 : 1,
                zIndex: isSelected ? 100 : zIdx,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                mass: 0.7,
              }}
              drag="y"
              dragElastic={0.15}
              dragConstraints={{ top: -150, bottom: 150 }}
              whileDrag={{
                scale: 1.3,
                zIndex: 100,
              }}
              onDragStart={() => {
                if (!isSelected) onSelect(id);
              }}
              onDragEnd={(_, info) => {
                if (isSelected && info.offset.y < -100 && onDragToPlay) {
                  onDragToPlay(id);
                } else if (isSelected && info.offset.y > 100 && onRepress) {
                  onRepress(id);
                }
              }}
              onTap={() => onSelect(id)}
              className="absolute cursor-pointer select-none"
              style={{ left: `${cardWidth / 2 + i * (cardWidth - overlap) - totalWidth / 2}px` }}
            >
              <CardFromId
                id={id}
                size="sm"
                faded={!isAffordable && !isSelected}
                selected={isSelected}
                onInfo={() => onInfo?.(id)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
