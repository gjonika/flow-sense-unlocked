
import { UtilityCard } from "@/components/UtilityCard";

interface UtilityCardData {
  title: string;
  value: string;
  change: string;
  type: "increase" | "decrease" | "neutral";
  color: string;
}

interface UtilityCardsSectionProps {
  utilityCards: UtilityCardData[];
}

export function UtilityCardsSection({ utilityCards }: UtilityCardsSectionProps) {
  if (!utilityCards || utilityCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {utilityCards.map((card, index) => (
        <UtilityCard
          key={`${card.title}-${index}`}
          title={card.title}
          value={card.value}
          change={card.change}
          type={card.type}
          color={card.color}
        />
      ))}
    </div>
  );
}
