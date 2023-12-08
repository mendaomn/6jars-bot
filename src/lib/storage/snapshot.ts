export interface Snapshot<T> {
    /**
     * When the snapshot was taken
     */
    timestamp: number // Date.now()

    /**
     * unique id provided by fauna
     * as a Ref object
     */
    // ref: q.Ref

    /**
     * Ref of the last document the
     * snapshot includes. This is 
     * useful to replay following events
     * starting from the snapshot.
     * 
     * @example
     * const ref = q.Ref(
     *    q.Collection('movements'),
     *    lastDocumentInSnapshotRef
     * )
     */
    lastDocumentInSnapshotRef: string

    /**
     * Actual state data captured in the snapshot.
     * For instance the computed value of jars 
     */
    state: T
}

