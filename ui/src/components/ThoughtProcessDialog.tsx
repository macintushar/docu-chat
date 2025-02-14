import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";

type ThoughtProcessDialogProps = {
  thoughtProcess: string;
  trigger?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function ThoughtProcessDialog({
  thoughtProcess,
  trigger,
  open,
  setOpen,
}: ThoughtProcessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="text-zinc-900 dark:text-zinc-50">
        <DialogHeader>
          <DialogTitle>Thought Process</DialogTitle>
          <DialogDescription>
            This is what the LLM thought about the question.
          </DialogDescription>
        </DialogHeader>
        <Markdown>{thoughtProcess}</Markdown>
      </DialogContent>
    </Dialog>
  );
}
