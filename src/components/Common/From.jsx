import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

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
          <div className="relative w-full">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
            <DatePicker
              selected={value ? new Date(value) : null}
              onChange={(date) => {
                setFromData({
                  ...fromData,
                  [getComponetType.name]: date
                    ? date.toISOString().split("T")[0]
                    : "",
                });
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText={getComponetType.placeholder || "Select date"}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 w-full"
              )}
              minDate={new Date()}
              isClearable
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={15}
              wrapperClassName="w-full"
            />
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
          fromControls.some(
            (control) => control.componentType === "checkbox"
          ) && "!grid-cols-1"
        )}
      >
        {fromControls.map((controlItem) => (
          <div
            key={controlItem.name}
            className={cn(
              "space-y-2",
              controlItem.componentType === "checkbox" &&
                "flex items-center space-x-2"
            )}
          >
            {controlItem.componentType !== "checkbox" && (
              <Label
                htmlFor={controlItem.name}
                className="text-sm font-medium text-foreground"
              >
                {controlItem.label}
                {controlItem.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
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
