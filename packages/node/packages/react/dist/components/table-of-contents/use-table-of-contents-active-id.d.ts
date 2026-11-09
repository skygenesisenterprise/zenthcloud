export interface UseTableOfContentsActiveIdOptions {
    /**
     * The ids of the section anchor elements to track, in document order.
     * Elements are resolved via `document.getElementById` on the client, so ids
     * that aren't in the DOM yet are simply ignored until they appear on a
     * subsequent change to `ids`.
     */
    ids: string[];
    /**
     * Distance in px from the top of the viewport (or `root`) to the scrollspy
     * activation line — typically the fixed header height, so the topmost
     * section actually in view is the one highlighted.
     *
     * @default 0
     */
    offset?: number;
    /**
     * The scroll container to track. Defaults to the viewport.
     *
     * @default null
     */
    root?: Element | null;
    /**
     * When enabled, the section named by `location.hash` is selected on mount
     * and on `hashchange`, so deep links highlight the right section.
     *
     * @default true
     */
    trackHash?: boolean;
}
export interface UseTableOfContentsActiveIdResult {
    /** The id of the section currently considered active, or `null`. */
    activeId: string | null;
    /**
     * Force a section active (e.g. from a ToC item's `onClick`), temporarily
     * pausing scrollspy so the chosen section sticks even when it's too short
     * to reach the activation line. Scrollspy resumes once scrolling settles.
     */
    selectSection: (id: string) => void;
}
/**
 * Table-of-contents scroll tracking.
 *
 * Derives the currently-active section from scroll position via an
 * `IntersectionObserver` (the topmost tracked section in view wins), and
 * exposes a `selectSection` action that pins a section on click — held until
 * scrolling settles, so short sections stay highlighted after a jump.
 * Hash deep-links are handled automatically unless `trackHash` is disabled.
 *
 * The `TableOfContents` component itself is purely presentational — pair this
 * hook with it to drive the `active` prop of each item.
 *
 * All DOM work happens in effects, so the hook is SSR-safe (`activeId` is
 * `null` on the server).
 *
 * @example
 * ```tsx
 * const { activeId, selectSection } = useTableOfContentsActiveId({
 *   ids: headings.map((h) => h.slug),
 *   offset: HEADER_HEIGHT,
 * });
 *
 * <TableOfContents.Item
 *   href="#intro"
 *   active={activeId === "intro"}
 *   onClick={() => selectSection("intro")}
 * >
 *   Introduction
 * </TableOfContents.Item>
 * ```
 */
export declare function useTableOfContentsActiveId({ ids, offset, root, trackHash, }: UseTableOfContentsActiveIdOptions): UseTableOfContentsActiveIdResult;
