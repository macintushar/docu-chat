import { DataTable } from "@/components/DataTable";
import Header from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UploadFileButton from "@/components/UploadFileButton";
import { deleteDocument, downloadDocument, uploadDocument } from "@/services";
import { KnowledgeDocument } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownToLineIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { default as dayjs } from "dayjs";

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
    <Button variant={variant} onClick={onClick} size="icon">
      {icon}
    </Button>
  );
}

const FILE_TYPES = [
  {
    value: "text/markdown",
    label: "Markdown",
    miniText: "MD",
  },
  {
    value: "text/plain",
    label: "Plain Text",
    miniText: "TXT",
  },
  {
    value: "application/json",
    label: "JSON",
    miniText: "JSON",
  },
];

function formatFileType(fileType: string) {
  const type = FILE_TYPES.find((type) => fileType.includes(type.value));
  if (!type) {
    return "Unknown";
  }
  return type ? type.label : "Unknown";
}

export default function Knowledge() {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/v1/rag/documents");
      return res.json();
    },
  });

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
      header: "Uploaded On",
      accessorKey: "created_at",
      cell: ({ cell }) => {
        const createdAt = dayjs(cell.getValue() as string).format(
          "MMMM D, YYYY [at] h:mm A",
        );
        return <div>{createdAt}</div>;
      },
    },
    {
      header: "File Type",
      accessorKey: "file_type",
      cell: ({ cell }) => {
        return (
          <div>
            <Badge variant="secondary">
              {formatFileType(cell.getValue() as string)}
            </Badge>
          </div>
        );
      },
    },
    {
      header: () => {
        return (
          <div className="flex justify-end">
            <div className="w-16">Actions</div>
          </div>
        );
      },
      accessorKey: "file_id",
      cell: ({ row }) => {
        const handleDownload = async () => {
          try {
            const file = await handleDocumentDownload(row.original.file_id);
            const url = URL.createObjectURL(
              new Blob([file], { type: row.original.file_type }),
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
          const res = await deleteDocument(row.original.file_id);
          if (res.message) {
            toast.success(res.message);
            refetch();
          } else {
            toast.error("Error deleting file");
          }
        };

        return (
          <div className="flex items-center gap-2 justify-end">
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
        cta={<UploadFileButton refetchDocuments={refetch} />}
      />
      <div className="w-2/3">
        <DataTable columns={columns} data={data as KnowledgeDocument[]} />
      </div>
    </div>
  );
}
