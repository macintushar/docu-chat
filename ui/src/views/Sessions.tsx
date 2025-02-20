import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

import { getSessions } from "@/services";

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export default function Sessions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: getSessions,
  });

  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center space-y-8">
      <Header
        title="Sessions"
        subtitle="Previous conversations started by you. Click on one to pick up where you left off."
        cta={
          <Button onClick={() => navigate({ to: "/" })}>
            <PlusIcon />
            New Session
          </Button>
        }
      />
      <div>
        {data && data.sessions.length > 0 ? (
          data.sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>{session.name}</CardHeader>
              <CardFooter>Open</CardFooter>
            </Card>
          ))
        ) : (
          <div>No sessions found</div>
        )}
      </div>
    </div>
  );
}
