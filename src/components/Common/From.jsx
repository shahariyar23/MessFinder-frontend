import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

const CommonFrom = ({
  fromControls,
  fromData,
  setFromData,
  onSubmit,
  buttonText = "Submit",
  isButtonDisable = false,
  className = "",
  gridCols = "1",
}) => {
  const [open, setOpen] = useState(false);

  const renderInputBycomponentType = (getComponetType) => {
    let element = null;
    const value = fromData[getComponetType.name];
    const IconComponent = getComponetType.icon || getComponetType.icone;

    switch (getComponetType.componentType) {
      case "input":
        element = (
          <div className="relative">
            {IconComponent && (
              <IconComponent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            )}
            <Input
              name={getComponetType.name}
              placeholder={getComponetType.placeholder}
              type={getComponetType.type}
              id={getComponetType.name}
              value={value || ""}
              onChange={(e) =>
                setFromData({
                  ...fromData,
                  [getComponetType.name]: e.target.value,
                })
              }
              className={cn(
                IconComponent && "pl-10",
                "w-full transition-colors focus:border-primary"
              )}
            />
          </div>
        );
        break;

      case "date":
        element = (
          <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="nav"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {value ? (
                    new Date(value).toLocaleDateString()
                  ) : (
                    <span>{getComponetType.placeholder || "Select date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value) : undefined}
                  onSelect={(date) => {
                    setFromData({
                      ...fromData,
                      [getComponetType.name]: date
                        ? date.toISOString().split("T")[0]
                        : "",
                    });
                    setOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        );
        break;

      case "checkbox":
        element = (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={getComponetType.name}
              checked={!!value}
              onCheckedChange={(checked) =>
                setFromData({
                  ...fromData,
                  [getComponetType.name]: checked,
                })
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={getComponetType.name}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer hover:text-primary transition-colors"
            >
              {getComponetType.label}
            </Label>
          </div>
        );
        break;

      case "select":
        element = (
          <div className="relative">
            {IconComponent && (
              <IconComponent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            )}
            <Select
              onValueChange={(selectedValue) =>
                setFromData({
                  ...fromData,
                  [getComponetType.name]: selectedValue,
                })
              }
              value={value || ""}
            >
              <SelectTrigger
                className={cn(
                  "w-full transition-colors focus:border-primary",
                  IconComponent && "pl-10"
                )}
              >
                <SelectValue placeholder={getComponetType.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {getComponetType.options?.map((optionItem) => (
                  <SelectItem
                    key={optionItem.id || optionItem.value}
                    value={optionItem.id || optionItem.value}
                  >
                    {optionItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        break;

      case "textarea":
        element = (
          <div className="relative">
            {IconComponent && (
              <IconComponent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            )}
            <Textarea
              name={getComponetType.name}
              placeholder={getComponetType.placeholder}
              id={getComponetType.name}
              value={value || ""}
              onChange={(e) =>
                setFromData({
                  ...fromData,
                  [getComponetType.name]: e.target.value,
                })
              }
              className={cn(
                IconComponent && "pl-10",
                "min-h-[100px] resize-y transition-colors focus:border-primary"
              )}
            />
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={getComponetType.name}
            placeholder={getComponetType.placeholder}
            type={getComponetType.type || "text"}
            id={getComponetType.name}
            value={value || ""}
            onChange={(e) =>
              setFromData({
                ...fromData,
                [getComponetType.name]: e.target.value,
              })
            }
            className="transition-colors focus:border-primary"
          />
        );
        break;
    }
    return element;
  };

  // Determine grid columns based on screen size
  const getGridCols = () => {
    switch (gridCols) {
      case "1":
        return "grid-cols-1";
      case "2":
        return "grid-cols-1 md:grid-cols-2";
      case "3":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  return (
    <form onSubmit={onSubmit} className={className}>
      <div
        className={cn(
          "grid gap-4 md:gap-6",
          getGridCols(),
          fromControls.some(control => control.componentType === "checkbox") && 
            "!grid-cols-1" // Force single column for forms with checkboxes
        )}
      >
        {fromControls.map((controlItem) => (
          <div
            key={controlItem.name}
            className={cn(
              "space-y-2",
              controlItem.componentType === "checkbox" && "flex items-center space-x-2"
            )}
          >
            {controlItem.componentType !== "checkbox" && controlItem.componentType !== "date" && (
              <Label 
                htmlFor={controlItem.name} 
                className="text-sm font-medium text-foreground"
              >
                {controlItem.label}
                {controlItem.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            {renderInputBycomponentType(controlItem)}
          </div>
        ))}
      </div>
      
      <Button
        disabled={isButtonDisable}
        type="submit"
        variant="nav"
        className={cn(
          "w-full mt-6 md:mt-8",
          "transition-all duration-200",
          "hover:shadow-md active:scale-95",
          isButtonDisable && "opacity-50 cursor-not-allowed"
        )}
        size="lg"
      >
        {typeof buttonText === "string" ? (
          <span className="flex items-center justify-center gap-2">
            {buttonText}
          </span>
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

export default CommonFrom;