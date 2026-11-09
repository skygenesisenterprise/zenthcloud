import { type HTMLAttributes, type ReactNode } from "react";
/**
 * ButtonGroup has no visual variants — it's a horizontal layout wrapper. The
 * required exports are kept for the Kumo variant standard.
 */
export declare const KUMO_BUTTON_GROUP_VARIANTS: {};
export declare const KUMO_BUTTON_GROUP_DEFAULT_VARIANTS: {};
/** Base classes shared by every ButtonGroup. */
export declare const KUMO_BUTTON_GROUP_STYLING: {
    readonly baseClasses: string;
};
export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "role"> {
    /** Additional CSS classes merged via `cn()`. Use kumo semantic tokens only. */
    className?: string;
    /**
     * The tightly-coupled controls to join. Typically two `Button`s: a primary
     * action and a dropdown trigger (a "split button").
     */
    children?: ReactNode;
}
/**
 * Joins a small set of tightly-coupled buttons into a single control — most
 * commonly a **split button**: a primary action next to a dropdown trigger for
 * related, secondary actions.
 *
 * Children keep their own variant, size, and shape — ButtonGroup only handles
 * the layout: it flattens the inner corners and overlaps borders so the buttons
 * share one seam. Renders `role="group"` so assistive technology treats the
 * buttons as a related set (pair it with an `aria-label`).
 *
 * For grouping multiple *independent* buttons or inputs (e.g. a formatting bar
 * or a page-level set of actions), use `Toolbar` instead — it provides the
 * correct roaming-focus keyboard semantics for a toolbar.
 *
 * @example Split button
 * ```tsx
 * <ButtonGroup aria-label="Deploy">
 *   <Button variant="primary">Deploy</Button>
 *   <DropdownMenu>
 *     <DropdownMenu.Trigger
 *       render={
 *         <Button variant="primary" shape="square" aria-label="More deploy options">
 *           <CaretDownIcon />
 *         </Button>
 *       }
 *     />
 *     <DropdownMenu.Content>
 *       <DropdownMenu.Item>Deploy to staging</DropdownMenu.Item>
 *     </DropdownMenu.Content>
 *   </DropdownMenu>
 * </ButtonGroup>
 * ```
 */
export declare const ButtonGroup: import("react").ForwardRefExoticComponent<ButtonGroupProps & import("react").RefAttributes<HTMLDivElement>>;
