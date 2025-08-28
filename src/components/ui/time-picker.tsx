import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function TimePicker({ value, onChange, disabled, placeholder = "Select time" }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value ? value.getHours().toString().padStart(2, '0') : '09');
  const [minutes, setMinutes] = useState(value ? value.getMinutes().toString().padStart(2, '0') : '00');

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    if (!onChange) return;
    
    const hoursNum = parseInt(newHours, 10);
    const minutesNum = parseInt(newMinutes, 10);
    
    if (isNaN(hoursNum) || isNaN(minutesNum)) return;
    if (hoursNum < 0 || hoursNum > 23) return;
    if (minutesNum < 0 || minutesNum > 59) return;
    
    const newDate = new Date();
    if (value) {
      newDate.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
    }
    newDate.setHours(hoursNum, minutesNum, 0, 0);
    onChange(newDate);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value;
    setHours(newHours);
    handleTimeChange(newHours, minutes);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value;
    setMinutes(newMinutes);
    handleTimeChange(hours, newMinutes);
  };

  // Generate quick time options
  const quickTimes = [
    { label: "9:00 AM", hours: "09", minutes: "00" },
    { label: "12:00 PM", hours: "12", minutes: "00" },
    { label: "1:00 PM", hours: "13", minutes: "00" },
    { label: "3:00 PM", hours: "15", minutes: "00" },
    { label: "5:00 PM", hours: "17", minutes: "00" },
    { label: "6:00 PM", hours: "18", minutes: "00" },
  ];

  const handleQuickTimeSelect = (quickTime: { hours: string; minutes: string }) => {
    setHours(quickTime.hours);
    setMinutes(quickTime.minutes);
    handleTimeChange(quickTime.hours, quickTime.minutes);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? formatTime(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="text-sm font-medium">Select Time</div>
          
          {/* Time Input */}
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="HH"
              value={hours}
              onChange={handleHoursChange}
              min="0"
              max="23"
              className="w-16 text-center"
            />
            <span className="text-lg font-medium">:</span>
            <Input
              type="number"
              placeholder="MM"
              value={minutes}
              onChange={handleMinutesChange}
              min="0"
              max="59"
              className="w-16 text-center"
            />
          </div>
          
          {/* Quick Times */}
          <div>
            <div className="text-sm font-medium mb-2">Quick Select</div>
            <div className="grid grid-cols-2 gap-2">
              {quickTimes.map((time) => (
                <Button
                  key={time.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickTimeSelect(time)}
                  className="text-xs"
                >
                  {time.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Clear button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange?.(undefined);
              setIsOpen(false);
            }}
            className="w-full text-xs"
          >
            Clear Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}