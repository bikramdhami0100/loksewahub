import { FileQuestion } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title || t("common.noData")}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
