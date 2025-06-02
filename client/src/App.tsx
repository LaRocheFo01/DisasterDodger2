import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import StartAudit from "@/pages/start-audit";
import Payment from "@/pages/payment";
import AuditWizard from "@/pages/audit-wizard";
import Success from "@/pages/success";
import NotFound from "@/pages/not-found";
import { DeepseekAuditTest } from "@/components/deepseek-audit-test";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/start-audit" component={StartAudit} />
      <Route path="/payment/:auditId" component={Payment} />
      <Route path="/audit-wizard/:auditId" component={AuditWizard} />
      <Route path="/success/:auditId" component={Success} />
      <Route path="/deepseek-test" component={() => <div className="min-h-screen bg-gray-50 py-8"><DeepseekAuditTest /></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
