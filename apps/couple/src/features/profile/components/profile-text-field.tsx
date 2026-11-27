import type { Control, FieldPath } from "react-hook-form";
import { DatePicker } from "@mongkolka/ui/date-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@mongkolka/ui/form";
import { Input } from "@mongkolka/ui/input";
import type { ProfileFormValues } from "../lib/profile-form";

interface ProfileTextFieldProps {
  control: Control<ProfileFormValues>;
  name: FieldPath<ProfileFormValues>;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
}

export function ProfileTextField({ control, name, label, type, placeholder, hint }: ProfileTextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "date" ? (
              <DatePicker value={field.value} onChange={field.onChange} />
            ) : (
              <Input type={type} placeholder={placeholder} {...field} value={field.value ?? ""} />
            )}
          </FormControl>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
