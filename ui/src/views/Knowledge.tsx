import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { downloadDocument, uploadDocument } from "@/services";
import { KnowledgeDocument } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  TrashIcon,
} from "lucide-react";
import { toast } from "sonner";

function ActionButton({
  icon,
  onClick,
  variant = "secondary",
}: {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "secondary" | "destructive";
}) {
  return (
    <Button variant={variant} onClick={onClick}>
      {icon}
    </Button>
  );
}

export default function Knowledge() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/v1/rag/documents");
      return res.json();
    },
  });

  const handleDocumentUpload = async (file: File) => {
    const res = await uploadDocument(file);
    return res;
  };

  const handleDocumentDownload = async (fileId: string) => {
    const res = await downloadDocument(fileId);
    return res;
  };

  const columns: ColumnDef<KnowledgeDocument>[] = [
    {
      header: "File Name",
      accessorKey: "filename",
    },
    {
      header: "File Type",
      accessorKey: "file_type",
    },
    {
      header: "Actions",
      accessorKey: "file_id",
      cell: ({ row }) => {
        const handleDownload = async () => {
          try {
            const file = await handleDocumentDownload(row.original.file_id);
            const url = URL.createObjectURL(
              new Blob([file], { type: row.original.file_type })
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = row.original.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success(`Downloaded File: ${row.original.filename}`);
          } catch (error) {
            console.error(error);
            toast.error("Error Downloading File");
          }
        };

        const handleDelete = async () => {
          // const res = await deleteDocument(row.original.file_id);
          // return res;

          console.log("Deleting file", row.original.file_id);
        };

        return (
          <div className="flex items-center gap-2">
            <ActionButton
              icon={<ArrowDownToLineIcon />}
              onClick={handleDownload}
              variant="secondary"
            />
            <ActionButton
              icon={<TrashIcon />}
              onClick={handleDelete}
              variant="destructive"
            />
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center space-y-8">
      <Header
        title="Knowledge"
        subtitle="Documents available for context for the LLM."
        cta={
          <Button>
            <div className="flex gap-2 items-center">
              <ArrowUpFromLineIcon />
              Upload Document
            </div>
          </Button>
        }
      />
      <div className="w-2/3">
        <DataTable columns={columns} data={data as KnowledgeDocument[]} />
      </div>
    </div>
  );
}
