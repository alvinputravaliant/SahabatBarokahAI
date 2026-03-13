import React from "react";
import ReactMarkdown from "react-markdown";
import { useHistory, useDeleteHistory } from "@/hooks/use-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History as HistoryIcon, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { data: history, isLoading } = useHistory();
  const deleteMutation = useDeleteHistory();
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <HistoryIcon className="text-primary w-8 h-8" />
          Riwayat Generasi
        </h1>
        <p className="text-muted-foreground mt-2">Arsip hasil analisa AI yang pernah Anda buat.</p>
      </div>

      {!history?.length ? (
        <Card className="bg-accent/30 border-dashed">
          <CardContent className="p-12 text-center text-muted-foreground">
            Belum ada riwayat.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:border-primary/50">
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer bg-card hover:bg-accent/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="gold" className="w-32 justify-center">{item.tool}</Badge>
                    <div className="hidden sm:block text-sm text-muted-foreground truncate max-w-md">
                      {JSON.stringify(item.input).replace(/[{""}]/g, ' ').slice(0, 50)}...
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        if(confirm('Yakin ingin menghapus riwayat ini?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {isExpanded && (
                  <CardContent className="p-6 border-t border-border/50 bg-accent/10">
                    <div className="mb-4 p-4 rounded-xl bg-background/50 border border-border">
                      <h4 className="text-sm font-bold text-primary mb-2">Input Parameter:</h4>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(item.input, null, 2)}
                      </pre>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown>{item.result}</ReactMarkdown>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
