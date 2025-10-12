import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar"

import { ChevronDownIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";


const CommonFrom = ({
  fromControls,
  fromData,
  setFromData,
  onSubmit,
  buttonText,
  isButtonDisable,
}) => {
  const [open, setOpen] = useState(false);
  const renderInputBycomponentType = (getComponetType) => {
    let element = null;
    const value = fromData[getComponetType.name];

    switch (getComponetType.componentType) {
      case "input":
        element = (
          <Input
            name={getComponetType.name}
            placeholder={getComponetType.placeholder}
            type={getComponetType.type}
            id={getComponetType.name}
            value={value}
            onChange={(e) =>
              setFromData({
                ...fromData,
                [getComponetType.name]: e.target.value,
              })
            }
          />
        );
        break;
      

case "date":
  element = (
    <div className="flex flex-col gap-3">
      <Label htmlFor={getComponetType.name} className="px-1">
        {/* {getComponetType.label} */}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={getComponetType.name}
            className="w-full justify-between font-normal text-left"
          >
            {value
              ? new Date(value).toLocaleDateString()
              : getComponetType.placeholder || "Select date"}
            <ChevronDownIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            captionLayout="dropdown"
            onSelect={date => {
              setFromData({
                ...fromData,
                [getComponetType.name]: date ? date.toISOString().split('T')[0] : ""
              });
              setOpen(false); // clean, react way to close
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
  break;



      case "checkbox":
        element = (
          <div className="flex items-center gap-3 mb-2">
            <Checkbox
              id={getComponetType.name}
              checked={!!value}
              onCheckedChange={checked =>
                setFromData({
                  ...fromData,
                  [getComponetType.name]: checked,
                })
              }
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white transition-colors"
            />
            <Label
              htmlFor={getComponetType.name}
              className="text-base text-[#0d171b] cursor-pointer hover:text-blue-700 transition-colors"
            >
              {getComponetType.label}
            </Label>
          </div>
        );
        break;


      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFromData({
                ...fromData,
                [getComponetType.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getComponetType.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getComponetType.options && getComponetType.options.length > 0
                ? getComponetType.options.map((optionItem) => (
                  <SelectItem key={optionItem.id} value={optionItem.label}>
                    {optionItem.label}
                  </SelectItem>
                ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={getComponetType.name}
            placeholder={getComponetType.placeholder}
            id={getComponetType.id}
            value={value}
            onChange={(e) =>
              setFromData({
                ...fromData,
                [getComponetType.name]: e.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={getComponetType.name}
            placeholder={getComponetType.placeholder}
            type={getComponetType.type}
            id={getComponetType.name}
            value={value}
            onChange={(e) =>
              setFromData({
                ...fromData,
                [getComponetType.name]: e.target.value,
              })
            }
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 mx-1">
        {fromControls.map((controlItem) => (
          <div key={controlItem.name} className="grid w-full gap-1.5">
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputBycomponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isButtonDisable} type="submit" className="mt-4 w-full" variant="nav">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonFrom;
