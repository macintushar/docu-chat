import { ArrowUpFromLineIcon, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { uploadDocument } from "@/services";

type UploadFileButtonProps = {
  refetchDocuments: () => void;
};

export default function UploadFileButton({
  refetchDocuments,
}: UploadFileButtonProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (files) {
      const res = await uploadDocument(files);
      if (res.message) {
        toast.success(res.message);
        setOpenUploadDialog(false);
        refetchDocuments();
      } else {
        toast.error("An error occurred while uploading the document.");
      }
    } else {
      toast.error("Please select a file to upload.");
    }
  }

  return (
    <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
      <DialogTrigger asChild>
        <Button>
          <div className="flex gap-2 items-center">
            <ArrowUpFromLineIcon />
            Upload Document
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-zinc-900 dark:text-zinc-50">
        <DialogHeader>
          <DialogTitle className="font-pop">Upload Document(s)</DialogTitle>
          <DialogDescription>
            Add one or more documents to the knowledge base as context for the
            LLM.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="file" className="sr-only">
              File
            </Label>
            <Input
              id="file"
              type="file"
              className="w-full"
              accept=".md, .txt, .json"
              onChange={(e) => setFiles(e.target.files)}
              multiple
              required
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              files ? handleUpload(files) : toast.error("Please select a file")
            }
            type="submit"
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
