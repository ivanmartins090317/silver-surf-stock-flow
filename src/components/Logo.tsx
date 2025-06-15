
import { Waves } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-4">
      <Waves className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-foreground">Silver Surf</h1>
    </div>
  );
}
