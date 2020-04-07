interface IResourceEvent {
    /**
     * Name of the event.
     * - changed : the resource has been changed
     * - deleted : the resource has been deleted
     */
    name: string;

    /**
     * uri of affected resource.
     */
    uri: string;
}