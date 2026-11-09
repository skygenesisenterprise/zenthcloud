import { type ReactElement } from "react";
import { type PropsBase, type PropsSingle, type PropsSingleRequired, type PropsMulti, type PropsMultiRequired, type PropsRange, type PropsRangeRequired } from "react-day-picker";
/** Base props shared across all DatePicker modes */
type BaseProps = Omit<PropsBase, "classNames"> & {
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
    /** Custom class names for internal elements */
    classNames?: PropsBase["classNames"];
};
/** Single date selection (optional) */
type SingleProps = BaseProps & Omit<PropsSingle, "onSelect" | "classNames"> & {
    onChange?: PropsSingle["onSelect"];
};
/** Single date selection (required) */
type SingleRequiredProps = BaseProps & Omit<PropsSingleRequired, "onSelect" | "classNames"> & {
    onChange?: PropsSingleRequired["onSelect"];
};
/** Multiple date selection (optional) */
type MultipleProps = BaseProps & Omit<PropsMulti, "onSelect" | "classNames"> & {
    onChange?: PropsMulti["onSelect"];
};
/** Multiple date selection (required) */
type MultipleRequiredProps = BaseProps & Omit<PropsMultiRequired, "onSelect" | "classNames"> & {
    onChange?: PropsMultiRequired["onSelect"];
};
/** Date range selection (optional) */
type RangeProps = BaseProps & Omit<PropsRange, "onSelect" | "classNames"> & {
    onChange?: PropsRange["onSelect"];
};
/** Date range selection (required) */
type RangeRequiredProps = BaseProps & Omit<PropsRangeRequired, "onSelect" | "classNames"> & {
    onChange?: PropsRangeRequired["onSelect"];
};
/**
 * DatePicker props - discriminated union based on `mode`.
 * Uses `onChange` instead of `onSelect` for Kumo consistency.
 * Full type inference is preserved via the discriminated union.
 */
export type DatePickerProps = SingleProps | SingleRequiredProps | MultipleProps | MultipleRequiredProps | RangeProps | RangeRequiredProps;
/**
 * DatePicker — a date selection calendar.
 *
 * Built on [react-day-picker](https://daypicker.dev) with Kumo styling.
 * Supports three selection modes: single, multiple, and range.
 * Outside-month dates are hidden by default in multi-month views to avoid duplicates.
 * Set `showOutsideDays` to override this behavior.
 *
 * DatePicker has no internal padding, so it fits a Popover or a page layout
 * without overrides. The container sets the spacing, e.g.
 * `<Popover.Content className="p-3">`, or `className="p-3"` on its own.
 *
 * @example
 * ```tsx
 * // Single date selection
 * const [date, setDate] = useState<Date>();
 * <DatePicker mode="single" selected={date} onChange={setDate} />
 *
 * // Multiple date selection
 * const [dates, setDates] = useState<Date[]>([]);
 * <DatePicker mode="multiple" selected={dates} onChange={setDates} max={5} />
 *
 * // Date range selection
 * const [range, setRange] = useState<DateRange>();
 * <DatePicker mode="range" selected={range} onChange={setRange} numberOfMonths={2} />
 * ```
 */
export declare function DatePicker({ className, classNames, onChange, ...props }: DatePickerProps): ReactElement;
export declare namespace DatePicker {
    var displayName: string;
}
export {};
