import AppLayout from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">My Favorites</h1>
        </div>
        <Card className="flex flex-col items-center justify-center text-center min-h-[50vh] bg-muted/50">
            <Heart className="w-20 h-20 text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-semibold">No favorites yet</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
                Click the heart icon on any product to save it here.
            </p>
        </Card>
      </div>
    </AppLayout>
  );
}
