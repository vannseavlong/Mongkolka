"use client";

import { Main } from "@mongkolka/ui/layout/main";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mongkolka/ui/tabs";
import { RequestList } from "./components/request-list";
import { TABS } from "./lib/assist-rules";

export function AssistRequests() {
  return (
    <Main>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Help requests</h1>
        <p className="text-muted-foreground">Couples asking Mongkolka to help with their site.</p>
      </div>
      <Tabs defaultValue="pending" className="max-w-3xl gap-4">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <RequestList tab={tab.id} empty={tab.empty} />
          </TabsContent>
        ))}
      </Tabs>
    </Main>
  );
}
