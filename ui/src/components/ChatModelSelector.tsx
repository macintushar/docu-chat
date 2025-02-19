import { Model } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ChatModelSelectorProps = {
  currentChatModel: Model;
  availableModels: Model[];
  changeModel: (model: Model) => void;
};

export default function ChatModelSelector({
  currentChatModel,
  availableModels,
  changeModel,
}: ChatModelSelectorProps) {
  return (
    <Select
      value={currentChatModel.name}
      onValueChange={(value) =>
        changeModel(availableModels.find((model) => model.name === value)!)
      }
    >
      <SelectTrigger className="w-[200px] truncate">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model.name} value={model.name}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
