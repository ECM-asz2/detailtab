/**
 * public api of the shell.
 */
declare class Dapi {

    /**
     * Navigate to resource identified by href. The following values for href have a special meaning:
     * - 'dapi_blank' replace the current main resource with an empty resource. That is show a blank page.
     * @param href absolute or relative (cf. https://developers.whatwg.org/urls.html#base-urls) URI of target resource or 'dapi_blank'
     * @returns {} 
     */
    navigate(href: string): void;

    /**
     * Opens a global dialog with content referenced by href.
     *  @param {string} href absolute or relative (cf. https://developers.whatwg.org/urls.html#base-urls) URI of dialog content
     *  @param {number} height of the dialog (see also absoluteValues)
     *  @param {number} width of the dialog (see also absoluteValues)
     *  @param {boolean} [absoluteValues] set true if values for height and width are to be interpreted as absolute values, namely in pixel and not in percent
     */
    openDialog(href: string, height: number, width: number, absoluteValues?: boolean): void;

    /**
     * Closes the global dialog when it is open, otherwise nothing will happen.
     */
    closeDialog(): void;

    /**
     * Downloads the referenced file.
     * @param href absolute or relative (cf. https://developers.whatwg.org/urls.html#base-urls) download URI
     * @returns {} 
     */
    download(href: string): void;

    /**
     * Replace the state of the resource.
     * @param replaceUri
     * @returns {} 
     */
    replaceState(replaceUri: string): void;

    /**
     * Publishes actions and resources which are available in the current context/state of this resource.
     * Note: The URIs inside the contextActions elements can be absolute or relative to document base uri (cf. https://developers.whatwg.org/urls.html#base-urls)
     * @param contextActions Array of IContextAction
     * @returns {} 
     */
    setContextActions(contextActions: IContextAction[]): void;

    /**
     * Dispatch an event to all registered listeners.
     * @param event 
     * @returns {} 
     */
    dispatchResourceEvent(event: IResourceEvent): void;

    /**
     * Listen to events of type eventName
     * @param eventName 
     * @param callback 
     * @returns {} 
     */
    addResourceEventListener(eventName: string, callback: (event: IResourceEvent) => void): void;

    /**
     * Activates single resource mode.
     * In single resource mode the shell displays only one resource which gets the maximum amount of space.
     */
    activateSingleResourceMode(): void;

    /**
     * Deactivates single resource mode.
     * In single resource mode the shell displays only one resource which gets the maximum amount of space.
     */
    deactivateSingleResourceMode(): void;

    /**
     * Returns true if this resource is current main resource.
     * @returns {}
     */
    isMainResource(): boolean;

    /**
     * Publishes the title of this resource to the shell.
     * @param title 
     * @returns {} 
     */
    publishTitle(title: string): void;

    /**
     * Publishes the location of this resource to the shell.
     * @param uri current location of this resource 
     * @returns {} 
     */
    publishLocation(uri: string): void;

    /**
     *
     * @param callback will be called if resource should be closed or refreshed
     * @deprecated please use setClosable(isClosable: boolean): void; and setInterruptNavigationCallback(callback: (finishNavigation: () => void) => void): void; instead
     */
    setInterruptCloseCallback(callback: () => boolean): void;

    /**
     * If resource must not be close set call it with false.
     * Note: To interrupt the navigation it is necessary to register an interruptNavigationCallback.
     * Please use setInterruptNavigationCallback(callback: (finishNavigation: () => void) => void): void
     * NOT setInterruptCloseCallback(callback: () => boolean): void
     * @param isClosable 
     */
    setClosable(isClosable: boolean): void;
    
    /**
     * The registered callback will be invoked if resource is not closable. The initial navigation could be finish by invoking the 'finishNavigation' callback.
     * Note: To finish the navigation isClosable must be true. Call window.dapi.setClosable(true);
     * @param callback
     */
    setInterruptNavigationCallback(callback: (finishNavigation: () => void) => void): void;

    /**
     * Closes the mainresource if it is called from the mainresource
     */
    closeResourceIfMainResource(): void;

    /**
     * The registered callback will be invoked after the resource has been displayed or hidden.
     * @param callback
     */
    setResourceVisibilityChangedCallback(callback: (isResourceVisible: boolean) => void): void;
}

declare interface IDapiProxy {

    /**
     * This activates the bypass option of the dapi proxy, which then forwards all incoming requests directly to the
     * parent dapi. Overwritten functions are excluded.
     * @returns {}
     */
    enableBypass(): void;

    /**
     * This deactivates the bypass option of the dapi proxy. Only navigate(), download() and isMainResource() are
     * forwarded directly to the parent dapi. All other functions must be implemented by the user and overwrite those
     * of the dapi proxy.
     * @returns {}
     */
    disableBypass(): void;

    /**
     * By default, the request is forwarded to parent dapi. It can be changed by overwriting the function.
     *
     * Navigate to resource identified by href. The following values for href have a special meaning:
     * - 'dapi_blank' replace the current main resource with an empty resource. That is show a blank page.
     * @param href absolute or relative (cf. https://developers.whatwg.org/urls.html#base-urls) URI of target resource
     * or 'dapi_blank'
     * @returns {}
     */
    navigate(href: string): void;

    /**
     * By default, the request is forwarded to parent dapi. It can be changed by overwriting the function.
     *
     * Downloads the referenced file.
     * @param href absolute or relative (cf. https://developers.whatwg.org/urls.html#base-urls) download URI
     * @returns {}
     */
    download(href: string): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Replace the state of the resource.
     * @param replaceUri
     * @returns {}
     */
    replaceState(replaceUri: string): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Publishes actions and resources which are available in the current context/state of this resource.
     * Note: The URIs inside the contextActions elements can be absolute or relative to document base uri (cf. https://developers.whatwg.org/urls.html#base-urls)
     * @param contextActions Array of IContextAction
     * @returns {}
     */
    setContextActions(contextActions: IContextAction[]): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Dispatch an event to all registered listeners.
     * @param event
     * @returns {}
     */
    dispatchResourceEvent(event: IResourceEvent): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Listen to events of type eventName
     * @param eventName
     * @param callback
     * @returns {}
     */
    addResourceEventListener(eventName: string, callback: (event: IResourceEvent) => void): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Activates single resource mode.
     * In single resource mode the shell displays only one resource which gets the maximum amount of space.
     */
    activateSingleResourceMode(): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Deactivates single resource mode.
     * In single resource mode the shell displays only one resource which gets the maximum amount of space.
     */
    deactivateSingleResourceMode(): void;

    /**
     * By default, the request is forwarded to parent dapi. It can be changed by overwriting the function.
     * @returns {}
     */
    isMainResource(): boolean;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Publishes the title of this resource to the shell.
     * @param title
     * @returns {}
     */
    publishTitle(title: string): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Publishes the location of this resource to the shell.
     * @param uri current location of this resource
     * @returns {}
     */
    publishLocation(uri: string): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * If resource must not be close set call it with false.
     * Note: To interrupt the navigation it is necessary to register an interruptNavigationCallback.
     * Please use setInterruptNavigationCallback(callback: (finishNavigation: () => void) => void): void
     * NOT setInterruptCloseCallback(callback: () => boolean): void
     * @param isClosable
     */
    setClosable(isClosable: boolean): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * The registered callback will be invoked if resource is not closable. The initial navigation could be finish by invoking the 'finishNavigation' callback.
     * Note: To finish the navigation isClosable must be true. Call window.dapi.setClosable(true);
     * @param callback
     */
    setInterruptNavigationCallback(callback: (finishNavigation: () => void) => void): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * Closes the mainresource if it is called from the mainresource
     */
    closeResourceIfMainResource(): void;

    /**
     * The requests will not be forwarded to the parent dapi. This can be changed by overwriting the function.
     *
     * The registered callback will be invoked after the resource has been displayed or hidden.
     * @param callback
     */
    setResourceVisibilityChangedCallback(callback: (isResourceVisible: boolean) => void): void;
}